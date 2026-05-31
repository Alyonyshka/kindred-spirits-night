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
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setExpandedUser(null)} />
            <motion.div className="relative glass-panel-strong p-6 w-full max-w-sm" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 avatar-glow mb-3 overflow-hidden">
                  {expandedUser.avatar_url ? <img src={expandedUser.avatar_url} alt={expandedUser.name} className="w-full h-full object-cover rounded-full" /> : <User size={36} className="text-muted-foreground" />}
                </div>
                <h2 className="text-lg font-bold">{expandedUser.name}, {expandedUser.age}</h2>
                <p className="text-sm text-muted-foreground">{t(expandedUser.city, language)}</p>
                <p className="text-sm text-primary mt-1">{expandedUser.vibe}</p>
              </div>
              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-muted-foreground mb-1">{t('aboutMe', language)}</p><p className="text-sm">{expandedUser.about}</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">{t('drinks', language)}</p>
                  <div className="flex flex-wrap gap-1">{(expandedUser.drinks || []).map(d => <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">{t(d, language)}</span>)}</div>
                </div>
                <div><p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
                  <div className="flex flex-wrap gap-1">{(expandedUser.interests || []).map(i => <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">{t(i, language)}</span>)}</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= Math.round(expandedUser.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />)}
                  <span className="text-xs text-muted-foreground ml-1">{expandedUser.rating?.toFixed(1)} ({expandedUser.rating_count})</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleMessage(expandedUser)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"><MessageCircle size={14} />{t('sendMessage', language)}</button>
                <button onClick={() => handleMeeting(expandedUser)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"><Handshake size={14} />{t('proposeMeeting', language)}</button>
                <button onClick={() => handleToggleBlock(expandedUser)} className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${isBlockedByMe(expandedUser.user_id) ? 'border-destructive/30 text-destructive bg-destructive/10' : 'border-destructive/30 text-muted-foreground hover:text-destructive'}`}>
                  <Ban size={14} />{t(isBlockedByMe(expandedUser.user_id) ? 'unblockUser' : 'blockUser', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatUser && <ChatWindow user={chatUser} onClose={() => setChatUser(null)} />}
      </AnimatePresence>
    </div>
  );
}
