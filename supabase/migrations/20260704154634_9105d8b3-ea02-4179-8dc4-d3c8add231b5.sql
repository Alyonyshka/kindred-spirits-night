
-- 1. Role enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Auto-grant admin to specific verified email
CREATE OR REPLACE FUNCTION public.grant_admin_for_verified_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) = 'aly0nyshka19@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_verified_email();

CREATE TRIGGER on_auth_user_confirmed_grant_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_for_verified_email();

-- Backfill: if the admin already exists and is confirmed, grant now
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE lower(email) = 'aly0nyshka19@gmail.com' AND email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Profile status for bans
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- 4. Admin policies
CREATE POLICY "Admins can view all reports"
ON public.reports FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reports"
ON public.reports FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Ban RPC: sets status=banned, deletes active meetings, revokes auth (bans user in auth)
CREATE OR REPLACE FUNCTION public.admin_ban_user(_target_user uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.profiles SET status = 'banned', online = false WHERE user_id = _target_user;

  DELETE FROM public.meetings
   WHERE (requester_id = _target_user OR receiver_id = _target_user)
     AND status IN ('pending', 'confirmed');

  -- Block sign-in by setting banned_until far in the future
  UPDATE auth.users
     SET banned_until = 'infinity'::timestamptz
   WHERE id = _target_user;

  -- Remove active sessions
  DELETE FROM auth.sessions WHERE user_id = _target_user;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_ban_user(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.admin_ban_user(uuid) TO authenticated;
