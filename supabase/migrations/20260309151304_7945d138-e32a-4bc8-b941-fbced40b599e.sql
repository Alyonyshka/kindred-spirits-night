
CREATE TABLE public.adventure_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL,
  user2_id uuid NOT NULL,
  plan_text text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user1_id, user2_id)
);

ALTER TABLE public.adventure_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their plans"
ON public.adventure_plans
FOR SELECT
TO authenticated
USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can insert plans"
ON public.adventure_plans
FOR INSERT
TO authenticated
WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());
