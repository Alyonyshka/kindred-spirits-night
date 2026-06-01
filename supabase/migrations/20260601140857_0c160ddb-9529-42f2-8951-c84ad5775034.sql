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
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Meeting not found';
  END IF;
  IF auth.uid() IS NULL OR (m.requester_id <> auth.uid() AND m.receiver_id <> auth.uid()) THEN
    RAISE EXCEPTION 'Not a participant';
  END IF;
  IF m.brudershaft_initiator_id IS NULL OR m.brudershaft_initiator_id = auth.uid() THEN
    RAISE EXCEPTION 'Only the other participant can confirm';
  END IF;
  IF m.brudershaft_code IS NULL OR m.brudershaft_code <> _code THEN
    RETURN false;
  END IF;
  UPDATE public.meetings
    SET met_at = now(), status = 'confirmed', brudershaft_code = NULL
    WHERE id = _meeting_id;
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.confirm_brudershaft(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.confirm_brudershaft(uuid, text) TO authenticated;