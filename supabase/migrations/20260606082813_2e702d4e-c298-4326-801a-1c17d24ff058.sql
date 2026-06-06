
-- 1) bug_reports SELECT: only submitter
DROP POLICY IF EXISTS "Authenticated can view bug reports" ON public.bug_reports;
CREATE POLICY "Users can view own bug reports"
  ON public.bug_reports FOR SELECT
  TO authenticated
  USING (user_id IS NOT NULL AND user_id = auth.uid());

-- 2) Extend meetings update trigger to protect brudershaft fields
CREATE OR REPLACE FUNCTION public.restrict_meeting_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF current_setting('app.allow_meeting_sensitive_update', true) = 'on' THEN
    RETURN NEW;
  END IF;
  IF NEW.met_at IS DISTINCT FROM OLD.met_at THEN
    RAISE EXCEPTION 'met_at can only be set via confirm_brudershaft RPC';
  END IF;
  IF NEW.brudershaft_code IS DISTINCT FROM OLD.brudershaft_code
     AND OLD.brudershaft_initiator_id IS NOT NULL
     AND OLD.brudershaft_initiator_id <> auth.uid() THEN
    RAISE EXCEPTION 'Only the brudershaft initiator can change the code';
  END IF;
  IF NEW.brudershaft_initiator_id IS DISTINCT FROM OLD.brudershaft_initiator_id
     AND OLD.brudershaft_initiator_id IS NOT NULL THEN
    RAISE EXCEPTION 'brudershaft_initiator_id is immutable once set';
  END IF;
  IF NEW.brudershaft_initiator_id IS DISTINCT FROM OLD.brudershaft_initiator_id
     AND NEW.brudershaft_initiator_id IS NOT NULL
     AND NEW.brudershaft_initiator_id <> auth.uid() THEN
    RAISE EXCEPTION 'brudershaft_initiator_id must be the current user';
  END IF;
  IF NEW.requester_id IS DISTINCT FROM OLD.requester_id
     OR NEW.receiver_id IS DISTINCT FROM OLD.receiver_id
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Immutable meeting fields cannot be changed';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_restrict_meeting_update ON public.meetings;
CREATE TRIGGER trg_restrict_meeting_update
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.restrict_meeting_update();

-- 3) Messages: receiver trigger to prevent content edits
DROP TRIGGER IF EXISTS trg_restrict_receiver_message_update ON public.messages;
CREATE TRIGGER trg_restrict_receiver_message_update
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.restrict_receiver_message_update();

-- Tighten receiver update policy: only allow setting read = true
DROP POLICY IF EXISTS "Receivers can mark messages read" ON public.messages;
CREATE POLICY "Receivers can mark messages read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid() AND sender_id <> auth.uid())
  WITH CHECK (receiver_id = auth.uid() AND read = true);

-- 4) Revoke public/anon EXECUTE on SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.is_blocked(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_my_profile_id() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_meeting_participant(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.confirm_brudershaft(uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_blocked(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_profile_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_meeting_participant(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_brudershaft(uuid, text) TO authenticated;
