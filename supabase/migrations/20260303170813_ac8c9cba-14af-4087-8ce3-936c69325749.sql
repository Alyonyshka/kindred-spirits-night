-- Allow message receiver to also delete messages (so users can clear chat history)
DROP POLICY "Sender can delete own messages" ON public.messages;
CREATE POLICY "Participants can delete messages"
ON public.messages
FOR DELETE
USING (sender_id = auth.uid() OR receiver_id = auth.uid());