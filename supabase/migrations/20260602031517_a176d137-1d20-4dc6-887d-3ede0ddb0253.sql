
-- Restore Data API grants for all public tables (RLS still enforces row-level access)

-- Profiles: readable by any authenticated user (for search), writable by owner
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Messages: auth-only
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

-- Favorites: auth-only
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;

-- Meetings: auth-only
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO authenticated;
GRANT ALL ON public.meetings TO service_role;

-- Events
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

-- Event participants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_participants TO authenticated;
GRANT ALL ON public.event_participants TO service_role;

-- Blocked users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_users TO authenticated;
GRANT ALL ON public.blocked_users TO service_role;

-- User ratings
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_ratings TO authenticated;
GRANT ALL ON public.user_ratings TO service_role;

-- Adventure plans
GRANT SELECT, INSERT, UPDATE, DELETE ON public.adventure_plans TO authenticated;
GRANT ALL ON public.adventure_plans TO service_role;

-- Ensure RPCs are callable by signed-in users
GRANT EXECUTE ON FUNCTION public.confirm_brudershaft(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_blocked(uuid, uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_meeting_participant(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_profile_id() TO authenticated;
