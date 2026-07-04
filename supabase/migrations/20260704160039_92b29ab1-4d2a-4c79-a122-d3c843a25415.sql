
-- 1) Fix meetings UPDATE WITH CHECK self-reference. Trigger restrict_meeting_update
-- already blocks changes to requester_id/receiver_id via OLD comparison, so simplify policy.
DROP POLICY IF EXISTS "Participants can update meeting" ON public.meetings;
CREATE POLICY "Participants can update meeting"
ON public.meetings
FOR UPDATE
TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = receiver_id)
WITH CHECK (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- 2) Tighten broad profiles read: hide banned users from general browse; owners still see themselves.
DROP POLICY IF EXISTS "Anyone authenticated can view profiles" ON public.profiles;
CREATE POLICY "Authenticated can view active profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR COALESCE(status, 'active') <> 'banned'
);

-- 3) Revoke public/anon EXECUTE on SECURITY DEFINER functions that should not be callable unauthenticated.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_ban_user(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.grant_admin_for_verified_email() FROM PUBLIC, anon;
