ALTER TABLE public.messages
  ADD CONSTRAINT messages_media_url_max_length
  CHECK (media_url IS NULL OR length(media_url) <= 8388608);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_avatar_url_max_length
  CHECK (avatar_url IS NULL OR length(avatar_url) <= 2800000);