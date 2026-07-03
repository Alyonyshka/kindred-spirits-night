
DROP POLICY IF EXISTS "Participants can update meeting" ON public.meetings;
CREATE POLICY "Participants can update meeting"
ON public.meetings
FOR UPDATE
TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = receiver_id)
WITH CHECK (
  (auth.uid() = requester_id OR auth.uid() = receiver_id)
  AND requester_id = (SELECT requester_id FROM public.meetings m WHERE m.id = meetings.id)
  AND receiver_id  = (SELECT receiver_id  FROM public.meetings m WHERE m.id = meetings.id)
);
