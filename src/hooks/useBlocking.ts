import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

export function useBlocking() {
  const { user } = useApp();
  const [blockedByMe, setBlockedByMe] = useState<string[]>([]);
  const [blockedMe, setBlockedMe] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlocks = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('blocked_users')
      .select('blocker_id, blocked_id')
      .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`);

    if (data) {
      setBlockedByMe(data.filter(b => b.blocker_id === user.id).map(b => b.blocked_id));
      setBlockedMe(data.filter(b => b.blocked_id === user.id).map(b => b.blocker_id));
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchBlocks();

    if (!user) return;
    const channel = supabase
      .channel('blocks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blocked_users' }, () => fetchBlocks())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, fetchBlocks]);

  const isBlocked = useCallback((otherUserId: string): boolean => {
    return blockedByMe.includes(otherUserId) || blockedMe.includes(otherUserId);
  }, [blockedByMe, blockedMe]);

  const isBlockedByMe = useCallback((otherUserId: string): boolean => {
    return blockedByMe.includes(otherUserId);
  }, [blockedByMe]);

  const blockUser = useCallback(async (otherUserId: string) => {
    if (!user) return;
    await supabase.from('blocked_users').insert({ blocker_id: user.id, blocked_id: otherUserId });
  }, [user?.id]);

  const unblockUser = useCallback(async (otherUserId: string) => {
    if (!user) return;
    await supabase.from('blocked_users').delete().eq('blocker_id', user.id).eq('blocked_id', otherUserId);
  }, [user?.id]);

  return { isBlocked, isBlockedByMe, blockUser, unblockUser, blockedByMe, blockedMe, loading };
}
