
DROP POLICY IF EXISTS "Authenticated can view participants" ON public.event_participants;
CREATE POLICY "Participants and creators can view participants"
ON public.event_participants FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.creator_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.event_participants ep2 WHERE ep2.event_id = event_participants.event_id AND ep2.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view all ratings" ON public.user_ratings;
CREATE POLICY "Users can view own ratings"
ON public.user_ratings FOR SELECT
TO authenticated
USING (rater_id = auth.uid() OR rated_id = auth.uid());
