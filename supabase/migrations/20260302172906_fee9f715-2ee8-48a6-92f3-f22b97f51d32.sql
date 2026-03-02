
CREATE TABLE public.user_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id uuid NOT NULL,
  rated_id uuid NOT NULL,
  rating smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rater_id, rated_id)
);

ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all ratings" ON public.user_ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own ratings" ON public.user_ratings FOR INSERT TO authenticated WITH CHECK (rater_id = auth.uid());
CREATE POLICY "Users can update own ratings" ON public.user_ratings FOR UPDATE TO authenticated USING (rater_id = auth.uid());
CREATE POLICY "Users can delete own ratings" ON public.user_ratings FOR DELETE TO authenticated USING (rater_id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_profile_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET rating = COALESCE((SELECT AVG(r.rating)::numeric(3,1) FROM public.user_ratings r WHERE r.rated_id = COALESCE(NEW.rated_id, OLD.rated_id)), 0),
      rating_count = COALESCE((SELECT COUNT(*) FROM public.user_ratings r WHERE r.rated_id = COALESCE(NEW.rated_id, OLD.rated_id)), 0)
  WHERE user_id = COALESCE(NEW.rated_id, OLD.rated_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.user_ratings
FOR EACH ROW EXECUTE FUNCTION public.update_profile_rating();
