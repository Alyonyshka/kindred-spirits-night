import { useState, useEffect } from 'react';
import { Heart, User, MessageCircle, Handshake, Ban, Star } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { mockUsers, MockUser, markFavoritesSeen } from '@/lib/mockData';
import type { Profile } from '@/hooks/useAuth';
import { useBlocking } from '@/hooks/useBlocking';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ChatWindow from '@/components/ChatWindow';

function mockToProfile(u: MockUser): Profile {
  return {
    id: u.id, user_id: u.id, name: u.name, age: u.age,
    avatar_url: u.avatar, city: u.city, drinks: u.drinks,
    alcohol_level: u.alcoholLevel, interests: u.interests,
    vibe: u.vibe, about: u.about, online: u.online,
    rating: u.rating, rating_count: u.ratingCount,
  };
}

export default function Favorites() {
  const { language, user } = useApp();
  const { isBlocked, isBlockedByMe, blockUser, unblockUser } = useBlocking();
  const favorites = mockUsers.slice(0, 3);
  const [expandedUser, setExpandedUser] = useState<MockUser | null>(null);
  const [chatUser, setChatUser] = useState<Profile | null>(null);

  useEffect(() => { markFavoritesSeen(); }, []);

  const handleMessage = (u: MockUser) => {
    if (isBlocked(u.id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    setExpandedUser(null);
    setChatUser(mockToProfile(u));
  };

  const handleMeeting = async (u: MockUser) => {
    if (!user) return;
    if (isBlocked(u.id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    await supabase.from('meetings').insert({ requester_id: user.id, receiver_id: u.id });
    toast.success(t('meetingRequestSent', language));
  };

  const handleToggleBlock = async (u: MockUser) => {
    if (isBlockedByMe(u.id)) {
      await unblockUser(u.id);
      toast.success(t('userUnblocked', language));
    } else {
      await blockUser(u.id);
      toast.success(t('userBlocked', language));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold amber-glow">{t('navFavorites', language)}</h2>
      {favorites.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Heart size={32} className="mx-auto mb-2 opacity-30" />
          <p>{t('noResults', language)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map(u => (
            <div key={u.id} onClick={() => setExpandedUser(u)} className="glass-panel p-4 card-hover cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/20 group-hover:avatar-glow transition-all duration-300">
                  {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-full" /> : <User size={28} className="text-muted-foreground" />}
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
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 avatar-glow mb-3">
                  {expandedUser.avatar ? <img src={expandedUser.avatar} alt={expandedUser.name} className="w-full h-full object-cover rounded-full" /> : <User size={36} className="text-muted-foreground" />}
                </div>
                <h2 className="text-lg font-bold">{expandedUser.name}, {expandedUser.age}</h2>
                <p className="text-sm text-muted-foreground">{t(expandedUser.city, language)}</p>
                <p className="text-sm text-primary mt-1">{expandedUser.vibe}</p>
              </div>
              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-muted-foreground mb-1">{t('aboutMe', language)}</p><p className="text-sm">{expandedUser.about}</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">{t('drinks', language)}</p>
                  <div className="flex flex-wrap gap-1">{expandedUser.drinks.map(d => <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">{t(d, language)}</span>)}</div>
                </div>
                <div><p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
                  <div className="flex flex-wrap gap-1">{expandedUser.interests.map(i => <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">{t(i, language)}</span>)}</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= Math.round(expandedUser.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />)}
                  <span className="text-xs text-muted-foreground ml-1">{expandedUser.rating.toFixed(1)} ({expandedUser.ratingCount})</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleMessage(expandedUser)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"><MessageCircle size={14} />{t('sendMessage', language)}</button>
                <button onClick={() => handleMeeting(expandedUser)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"><Handshake size={14} />{t('proposeMeeting', language)}</button>
                <button onClick={() => handleToggleBlock(expandedUser)} className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${isBlockedByMe(expandedUser.id) ? 'border-destructive/30 text-destructive bg-destructive/10' : 'border-destructive/30 text-muted-foreground hover:text-destructive'}`}>
                  <Ban size={14} />{t(isBlockedByMe(expandedUser.id) ? 'unblockUser' : 'blockUser', language)}
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
