CREATE TABLE public.bug_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    screen_url TEXT NOT NULL DEFAULT ''::text,
    description TEXT NOT NULL DEFAULT ''::text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.bug_reports TO anon;
GRANT SELECT, INSERT ON public.bug_reports TO authenticated;
GRANT ALL ON public.bug_reports TO service_role;

ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bug reports" ON public.bug_reports FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can view bug reports" ON public.bug_reports FOR SELECT TO authenticated USING (true);