-- Favorites persistence table
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  favorite_user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT favorites_user_pair_unique UNIQUE (user_id, favorite_user_id),
  CONSTRAINT favorites_no_self CHECK (user_id <> favorite_user_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
ON public.favorites
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can add own favorites"
ON public.favorites
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND public.is_blocked(user_id, favorite_user_id) = false
);

CREATE POLICY "Users can remove own favorites"
ON public.favorites
FOR DELETE
USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_favorite_user_id ON public.favorites(favorite_user_id);

-- Enforce block rules on message sending
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages"
ON public.messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND public.is_blocked(sender_id, receiver_id) = false
);

-- Enforce block rules on meeting requests
DROP POLICY IF EXISTS "Users can create meetings" ON public.meetings;
CREATE POLICY "Users can create meetings"
ON public.meetings
FOR INSERT
WITH CHECK (
  requester_id = auth.uid()
  AND public.is_blocked(requester_id, receiver_id) = false
);

-- Realtime for favorites
ALTER PUBLICATION supabase_realtime ADD TABLE public.favorites;