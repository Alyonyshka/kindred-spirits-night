
CREATE POLICY "Authenticated can read voice messages"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'voice-messages');

CREATE POLICY "Users can upload their own voice messages"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voice-messages'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own voice messages"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'voice-messages'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
