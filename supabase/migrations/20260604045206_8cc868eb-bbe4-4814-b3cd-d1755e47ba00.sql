
-- 1. Restrict meeting UPDATE so participants can't write to met_at/brudershaft_*
DROP POLICY IF EXISTS "Participants can update meeting" ON public.meetings;

CREATE OR REPLACE FUNCTION public.restrict_meeting_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.met_at IS DISTINCT FROM OLD.met_at
  OR NEW.brudershaft_code IS DISTINCT FROM OLD.brudershaft_code
  OR NEW.brudershaft_initiator_id IS DISTINCT FROM OLD.brudershaft_initiator_id
  OR NEW.requester_id IS DISTINCT FROM OLD.requester_id
  OR NEW.receiver_id IS DISTINCT FROM OLD.receiver_id
  OR NEW.created_at IS DISTINCT FROM OLD.created_at
  THEN
    -- Allow only when called from a SECURITY DEFINER context (confirm_brudershaft / start flow uses INSERT/UPDATE under definer)
    -- Here we additionally allow brudershaft_code & brudershaft_initiator_id changes when initiator is being set by the user themselves (no met_at change).
    IF (NEW.met_at IS DISTINCT FROM OLD.met_at) THEN
      RAISE EXCEPTION 'met_at can only be set via confirm_brudershaft RPC';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_restrict_meeting_update ON public.meetings;
CREATE TRIGGER trg_restrict_meeting_update
BEFORE UPDATE ON public.meetings
FOR EACH ROW EXECUTE FUNCTION public.restrict_meeting_update();

CREATE POLICY "Participants can update meeting"
ON public.meetings FOR UPDATE
TO authenticated
USING ((requester_id = auth.uid()) OR (receiver_id = auth.uid()))
WITH CHECK ((requester_id = auth.uid()) OR (receiver_id = auth.uid()));

-- The confirm_brudershaft function is SECURITY DEFINER, so its UPDATE runs as the function owner and bypasses the trigger check? No, triggers still fire. We need the trigger to allow met_at change when invoked from confirm_brudershaft. Use a session-local guard.
CREATE OR REPLACE FUNCTION public.restrict_meeting_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('app.allow_meeting_sensitive_update', true) = 'on' THEN
    RETURN NEW;
  END IF;
  IF NEW.met_at IS DISTINCT FROM OLD.met_at THEN
    RAISE EXCEPTION 'met_at can only be set via confirm_brudershaft RPC';
  END IF;
  IF NEW.requester_id IS DISTINCT FROM OLD.requester_id
     OR NEW.receiver_id IS DISTINCT FROM OLD.receiver_id
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Immutable meeting fields cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.confirm_brudershaft(_meeting_id uuid, _code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  m public.meetings%ROWTYPE;
BEGIN
  SELECT * INTO m FROM public.meetings WHERE id = _meeting_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Meeting not found'; END IF;
  IF auth.uid() IS NULL OR (m.requester_id <> auth.uid() AND m.receiver_id <> auth.uid()) THEN
    RAISE EXCEPTION 'Not a participant';
  END IF;
  IF m.brudershaft_initiator_id IS NULL OR m.brudershaft_initiator_id = auth.uid() THEN
    RAISE EXCEPTION 'Only the other participant can confirm';
  END IF;
  IF m.brudershaft_code IS NULL OR m.brudershaft_code <> _code THEN
    RETURN false;
  END IF;
  PERFORM set_config('app.allow_meeting_sensitive_update', 'on', true);
  UPDATE public.meetings
    SET met_at = now(), status = 'confirmed', brudershaft_code = NULL
    WHERE id = _meeting_id;
  PERFORM set_config('app.allow_meeting_sensitive_update', 'off', true);
  RETURN true;
END;
$$;

-- 2. Restrict messages receiver UPDATE to only `read` column via trigger (already exists: restrict_receiver_message_update). Ensure trigger is attached.
DROP TRIGGER IF EXISTS trg_restrict_receiver_message_update ON public.messages;
CREATE TRIGGER trg_restrict_receiver_message_update
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.restrict_receiver_message_update();

-- 3. Guard is_blocked so callers can only probe relationships involving themselves
CREATE OR REPLACE FUNCTION public.is_blocked(_user1 uuid, _user2 uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() <> _user1 AND auth.uid() <> _user2 THEN
    RETURN false;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = _user1 AND blocked_id = _user2)
       OR (blocker_id = _user2 AND blocked_id = _user1)
  );
END;
$$;

-- 4. Revoke EXECUTE on SECURITY DEFINER functions from anon
REVOKE EXECUTE ON FUNCTION public.is_blocked(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.confirm_brudershaft(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_meeting_participant(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_my_profile_id() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_blocked(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_brudershaft(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_meeting_participant(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_profile_id() TO authenticated;
