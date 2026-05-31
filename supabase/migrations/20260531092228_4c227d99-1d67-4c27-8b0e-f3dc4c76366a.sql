ALTER TABLE public.meetings
  ADD COLUMN IF NOT EXISTS brudershaft_code text,
  ADD COLUMN IF NOT EXISTS brudershaft_initiator_id uuid,
  ADD COLUMN IF NOT EXISTS met_at timestamp with time zone;

CREATE INDEX IF NOT EXISTS idx_meetings_pair ON public.meetings (requester_id, receiver_id);