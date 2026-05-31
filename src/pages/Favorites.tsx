import { useState, useEffect } from 'react';
import { Heart, User, MessageCircle, Handshake } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import type { Profile } from '@/hooks/useAuth';
import { useBlocking } from '@/hooks/useBlocking';
import { useFavorites } from '@/hooks/useFavorites';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ChatWindow from '@/components/ChatWindow';
import ProfileModal from '@/components/ProfileModal';
import SEO from '@/components/SEO';

export default function Favorites() {
  const { language, user } = useApp();
  const { isBlocked, isBlockedByMe, blockUser, unblockUser } = useBlocking();
  const { favoriteUserIds, removeFavorite } = useFavorites();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [expandedUser, setExpandedUser] = useState<Profile | null>(null);
  const [chatUser, setChatUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      if (favoriteUserIds.length === 0) {
        setProfiles([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', favoriteUserIds);
      setProfiles((data || []) as Profile[]);
      setLoading(false);
    };
    loadProfiles();
  }, [favoriteUserIds]);

  const handleMessage = (u: Profile) => {
    if (isBlocked(u.user_id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    setExpandedUser(null);
    setChatUser(u);
  };

  const handleMeeting = async (u: Profile) => {
    if (!user) return;
    if (isBlocked(u.user_id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    await supabase.from('meetings').insert({ requester_id: user.id, receiver_id: u.user_id });
    toast.success(t('meetingRequestSent', language));
  };

  const handleToggleBlock = async (u: Profile) => {
    if (isBlockedByMe(u.user_id)) {
      await unblockUser(u.user_id);
      toast.success(t('userUnblocked', language));
    } else {
      await blockUser(u.user_id);
      toast.success(t('userBlocked', language));
    }
  };

  const handleRemoveFavorite = async (u: Profile) => {
    await removeFavorite(u.user_id);
    toast.success(t('removedFromFavorites', language));
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">{t('loading', language)}</div>;
  }

  return (
    <div className="space-y-4">
      <SEO title="Favorites — Drink Mate" description="Your saved drinking buddies. Quickly message, propose a meetup, or revisit favorite profiles." path="/favorites" />
      <h1 className="text-lg font-bold amber-glow">{t('navFavorites', language)}</h1>
      {profiles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Heart size={32} className="mx-auto mb-2 opacity-30" />
          <p>{t('noResults', language)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map(u => (
            <div key={u.user_id} onClick={() => setExpandedUser(u)} className="glass-panel p-4 card-hover cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/20 group-hover:avatar-glow transition-all duration-300 overflow-hidden">
                  {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover rounded-full" /> : <User size={28} className="text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{u.name}, {u.age}</h3>
                  <p className="text-xs text-muted-foreground">{u.vibe}</p>
                  <p className="text-xs text-muted-foreground">{t(u.city, language)}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={(e) => { e.stopPropagation(); handleMessage(u); }} className="p-2 rounded-lg border border-border hover:border-primary/30 hover:text-primary transition-all" title={t('sendMessage', language)}>
                    <MessageCircle size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleMeeting(u); }} className="p-2 rounded-lg border border-border hover:border-primary/30 hover:text-primary transition-all" title={t('proposeMeeting', language)}>
                    <Handshake size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(u); }} className="p-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all" title={t('removedFromFavorites', language)}>
                    <Heart size={16} className="fill-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {expandedUser && (
          <ProfileModal
            profile={expandedUser}
            onClose={() => setExpandedUser(null)}
            onMessage={(p) => setChatUser(p)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatUser && <ChatWindow user={chatUser} onClose={() => setChatUser(null)} />}
      </AnimatePresence>
    </div>
  );
}
