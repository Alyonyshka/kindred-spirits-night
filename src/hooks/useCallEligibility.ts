import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

/**
 * Voice call eligibility:
 *  - Both users must have each other in favorites (mutual favorite)
 *  - There must be at least one confirmed meeting between them
 *  - Neither user must be blocked by the other
 */
export function useCallEligibility(otherUserId: string | undefined) {
  const { user } = useApp();
  const [eligible, setEligible] = useState(false);
  const [reason, setReason] = useState<'blocked' | 'no-favorite' | 'no-meeting' | 'ok'>('no-favorite');
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    if (!user || !otherUserId) {
      setEligible(false);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Blocked check
    const { data: blocks } = await supabase
      .from('blocked_users')
      .select('blocker_id, blocked_id')
      .or(
        `and(blocker_id.eq.${user.id},blocked_id.eq.${otherUserId}),and(blocker_id.eq.${otherUserId},blocked_id.eq.${user.id})`
      );
    if (blocks && blocks.length > 0) {
      setEligible(false);
      setReason('blocked');
      setLoading(false);
      return;
    }

    // Mutual favorite
    const { data: favs } = await supabase
      .from('favorites')
      .select('user_id, favorite_user_id')
      .or(
        `and(user_id.eq.${user.id},favorite_user_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},favorite_user_id.eq.${user.id})`
      );
    const iFav = !!favs?.find((f) => f.user_id === user.id && f.favorite_user_id === otherUserId);
    const theyFav = !!favs?.find((f) => f.user_id === otherUserId && f.favorite_user_id === user.id);
    if (!iFav || !theyFav) {
      setEligible(false);
      setReason('no-favorite');
      setLoading(false);
      return;
    }

    // Confirmed meeting
    const { data: meets } = await supabase
      .from('meetings')
      .select('id')
      .eq('status', 'confirmed')
      .or(
        `and(requester_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},receiver_id.eq.${user.id})`
      )
      .limit(1);
    if (!meets || meets.length === 0) {
      setEligible(false);
      setReason('no-meeting');
      setLoading(false);
      return;
    }

    setEligible(true);
    setReason('ok');
    setLoading(false);
  }, [user?.id, otherUserId]);

  useEffect(() => {
    check();
    if (!user || !otherUserId) return;
    const channel = supabase
      .channel(`call-eligibility-${otherUserId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favorites' }, () => check())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => check())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blocked_users' }, () => check())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [check, user?.id, otherUserId]);

  return { eligible, reason, loading, refresh: check };
}
