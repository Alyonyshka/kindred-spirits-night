import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

export function useFavorites() {
  const { user } = useApp();
  const [favoriteUserIds, setFavoriteUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('favorite_user_id')
      .eq('user_id', user.id);
    if (data) {
      setFavoriteUserIds(data.map(f => f.favorite_user_id));
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchFavorites();

    if (!user) return;
    const channel = supabase
      .channel('favorites-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favorites' }, () => fetchFavorites())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, fetchFavorites]);

  const isFavorite = useCallback((otherUserId: string): boolean => {
    return favoriteUserIds.includes(otherUserId);
  }, [favoriteUserIds]);

  const addFavorite = useCallback(async (otherUserId: string) => {
    if (!user) return;
    await supabase.from('favorites').insert({ user_id: user.id, favorite_user_id: otherUserId });
  }, [user?.id]);

  const removeFavorite = useCallback(async (otherUserId: string) => {
    if (!user) return;
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('favorite_user_id', otherUserId);
  }, [user?.id]);

  const toggleFavorite = useCallback(async (otherUserId: string) => {
    if (isFavorite(otherUserId)) {
      await removeFavorite(otherUserId);
    } else {
      await addFavorite(otherUserId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return { favoriteUserIds, isFavorite, addFavorite, removeFavorite, toggleFavorite, loading };
}
