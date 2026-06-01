
-- 1) Restrict messages UPDATE to sender only
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;
CREATE POLICY "Senders can update own messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Also tighten INSERT/DELETE/SELECT roles to authenticated (were public)
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK ((sender_id = auth.uid()) AND (is_blocked(sender_id, receiver_id) = false));

DROP POLICY IF EXISTS "Participants can delete messages" ON public.messages;
CREATE POLICY "Participants can delete messages"
ON public.messages
FOR DELETE
TO authenticated
USING ((sender_id = auth.uid()) OR (receiver_id = auth.uid()));

-- 2) Adventure plans: require user1_id = auth.uid() on insert
DROP POLICY IF EXISTS "Users can insert plans" ON public.adventure_plans;
CREATE POLICY "Users can insert plans"
ON public.adventure_plans
FOR INSERT
TO authenticated
WITH CHECK (user1_id = auth.uid());

-- 3) blocked_users: restrict to authenticated
DROP POLICY IF EXISTS "Users can block others" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can unblock" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can view their blocks" ON public.blocked_users;

CREATE POLICY "Users can block others"
ON public.blocked_users
FOR INSERT
TO authenticated
WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can unblock"
ON public.blocked_users
FOR DELETE
TO authenticated
USING (blocker_id = auth.uid());

CREATE POLICY "Users can view their blocks"
ON public.blocked_users
FOR SELECT
TO authenticated
USING ((blocker_id = auth.uid()) OR (blocked_id = auth.uid()));

-- favorites: tighten roles to authenticated as well
DROP POLICY IF EXISTS "Users can add own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can remove own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;

CREATE POLICY "Users can add own favorites"
ON public.favorites
FOR INSERT
TO authenticated
WITH CHECK ((user_id = auth.uid()) AND (is_blocked(user_id, favorite_user_id) = false));

CREATE POLICY "Users can remove own favorites"
ON public.favorites
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can view own favorites"
ON public.favorites
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- meetings INSERT tighten role
DROP POLICY IF EXISTS "Users can create meetings" ON public.meetings;
CREATE POLICY "Users can create meetings"
ON public.meetings
FOR INSERT
TO authenticated
WITH CHECK ((requester_id = auth.uid()) AND (is_blocked(requester_id, receiver_id) = false));

-- 4) Revoke EXECUTE on internal security-definer helpers
REVOKE EXECUTE ON FUNCTION public.is_blocked(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_my_profile_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_meeting_participant(uuid) FROM PUBLIC, anon, authenticated;
