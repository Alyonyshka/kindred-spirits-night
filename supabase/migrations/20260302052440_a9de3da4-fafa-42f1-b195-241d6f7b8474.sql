-- Allow receiver to mark messages as read
DROP POLICY IF EXISTS "Sender can update own messages" ON public.messages;
CREATE POLICY "Users can update own messages"
ON public.messages
FOR UPDATE
USING (sender_id = auth.uid() OR receiver_id = auth.uid());