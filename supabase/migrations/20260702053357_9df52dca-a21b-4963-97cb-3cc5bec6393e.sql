
COMMENT ON TRIGGER trg_restrict_meeting_update ON public.meetings IS
  'Canonical guard for immutable meeting fields (met_at, brudershaft_code, brudershaft_initiator_id, requester_id, receiver_id, created_at). RLS policy cannot reference OLD values, so this BEFORE UPDATE trigger is the only enforcement point. Bypassed only inside confirm_brudershaft() via the app.allow_meeting_sensitive_update session flag.';
