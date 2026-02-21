
-- Create blocked_users table
CREATE TABLE public.blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL,
  blocked_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);

-- Enable RLS
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their blocks"
ON public.blocked_users FOR SELECT
USING (blocker_id = auth.uid() OR blocked_id = auth.uid());

CREATE POLICY "Users can block others"
ON public.blocked_users FOR INSERT
WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can unblock"
ON public.blocked_users FOR DELETE
USING (blocker_id = auth.uid());

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.blocked_users;

-- Helper function to check if blocked (bidirectional)
CREATE OR REPLACE FUNCTION public.is_blocked(_user1 uuid, _user2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = _user1 AND blocked_id = _user2)
       OR (blocker_id = _user2 AND blocked_id = _user1)
  )
$$;
