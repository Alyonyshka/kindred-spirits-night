
-- 1. Prevent self-manipulation of rating fields on profiles
CREATE OR REPLACE FUNCTION public.restrict_profile_rating_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('app.allow_profile_rating_update', true) = 'on' THEN
    RETURN NEW;
  END IF;
  IF NEW.rating IS DISTINCT FROM OLD.rating
     OR NEW.rating_count IS DISTINCT FROM OLD.rating_count THEN
    RAISE EXCEPTION 'rating and rating_count can only be modified via the ratings system';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS restrict_profile_rating_update_trg ON public.profiles;
CREATE TRIGGER restrict_profile_rating_update_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.restrict_profile_rating_update();

-- Allow the existing rating-aggregation trigger to bypass the guard
CREATE OR REPLACE FUNCTION public.update_profile_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('app.allow_profile_rating_update', 'on', true);
  UPDATE public.profiles
  SET rating = COALESCE((SELECT AVG(r.rating)::numeric(3,1) FROM public.user_ratings r WHERE r.rated_id = COALESCE(NEW.rated_id, OLD.rated_id)), 0),
      rating_count = COALESCE((SELECT COUNT(*) FROM public.user_ratings r WHERE r.rated_id = COALESCE(NEW.rated_id, OLD.rated_id)), 0)
  WHERE user_id = COALESCE(NEW.rated_id, OLD.rated_id);
  PERFORM set_config('app.allow_profile_rating_update', 'off', true);
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 2. Revoke EXECUTE on SECURITY DEFINER helpers from anon/public
REVOKE EXECUTE ON FUNCTION public.restrict_profile_rating_update() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_profile_rating() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.restrict_receiver_message_update() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.restrict_meeting_update() FROM PUBLIC, anon;
