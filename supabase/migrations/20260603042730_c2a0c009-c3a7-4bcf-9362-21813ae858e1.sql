
-- Allow receiver to mark messages as read
CREATE POLICY "Receivers can mark messages read"
ON public.messages
FOR UPDATE
TO authenticated
USING (receiver_id = auth.uid())
WITH CHECK (receiver_id = auth.uid());

-- Trigger to ensure receiver can only modify the `read` column
CREATE OR REPLACE FUNCTION public.restrict_receiver_message_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the current user is the receiver (and not the sender), only allow `read` to change
  IF auth.uid() = OLD.receiver_id AND auth.uid() <> OLD.sender_id THEN
    IF NEW.content      IS DISTINCT FROM OLD.content
    OR NEW.sender_id    IS DISTINCT FROM OLD.sender_id
    OR NEW.receiver_id  IS DISTINCT FROM OLD.receiver_id
    OR NEW.type         IS DISTINCT FROM OLD.type
    OR NEW.media_url    IS DISTINCT FROM OLD.media_url
    OR NEW.edited       IS DISTINCT FROM OLD.edited
    OR NEW.reply_to_id  IS DISTINCT FROM OLD.reply_to_id
    OR NEW.created_at   IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'Receiver can only update the read status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_restrict_receiver_message_update ON public.messages;
CREATE TRIGGER trg_restrict_receiver_message_update
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.restrict_receiver_message_update();
