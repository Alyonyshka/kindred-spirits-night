import { useState } from 'react';
import { Heart, MessageCircle, Handshake, Ban, Star, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { MockUser } from '@/lib/mockData';
import type { Profile } from '@/hooks/useAuth';
import { useBlocking } from '@/hooks/useBlocking';
import { useFavorites } from '@/hooks/useFavorites';
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

// Check if a string is a valid UUID
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

interface UserCardProps {
  user: MockUser;
}

export default function UserCard({ user: userProp }: UserCardProps) {
  const { language, user: currentUser } = useApp();
  const { isBlocked, isBlockedByMe, blockUser, unblockUser } = useBlocking();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [expanded, setExpanded] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const isMockUser = !isValidUUID(userProp.id);
  const fullStars = Math.round(userProp.rating);
  const isFav = !isMockUser && isFavorite(userProp.id);

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMockUser) {
      toast.error('Действие недоступно для демо-профилей');
      return;
    }
    if (isBlocked(userProp.id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    await toggleFavorite(userProp.id);
    toast.success(t(isFav ? 'removedFromFavorites' : 'addedToFavorites', language));
  };

  const handleMeeting = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (isMockUser) {
      toast.error('Действие недоступно для демо-профилей');
      return;
    }
    if (isBlocked(userProp.id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    await supabase.from('meetings').insert({ requester_id: currentUser.id, receiver_id: userProp.id });
    toast.success(t('meetingRequestSent', language));
  };

  const handleBlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMockUser) {
      toast.error('Действие недоступно для демо-профилей');
      return;
    }
    if (isBlockedByMe(userProp.id)) {
      await unblockUser(userProp.id);
      toast.success(t('userUnblocked', language));
    } else {
      await blockUser(userProp.id);
      toast.success(t('userBlocked', language));
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMockUser) {
      toast.error('Действие недоступно для демо-профилей');
      return;
    }
    if (isBlocked(userProp.id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    setExpanded(false);
    setShowChat(true);
  };

  return (
    <>
      <motion.div
        className="glass-panel p-4 card-hover cursor-pointer"
        onClick={() => setExpanded(true)}
        layout
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border-2 border-border overflow-hidden">
            {userProp.avatar ? (
              <img src={userProp.avatar} alt={userProp.name} className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{userProp.name}, {userProp.age}</h3>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${userProp.online ? 'bg-emerald-400' : 'bg-muted-foreground/40'}`} />
            </div>
            <p className="text-xs text-muted-foreground truncate">{userProp.vibe}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {userProp.drinks.slice(0, 2).map(d => (
            <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium border border-primary/20">
              {t(d, language)}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-medium">
            {t(userProp.alcoholLevel, language)}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={12} className={i <= fullStars ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">{userProp.rating.toFixed(1)}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setExpanded(false)} />
            <motion.div
              className="relative glass-panel-strong p-6 w-full max-w-sm"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 avatar-glow mb-3">
                  {userProp.avatar ? (
                    <img src={userProp.avatar} alt={userProp.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User size={36} className="text-muted-foreground" />
                  )}
                </div>
                <h2 className="text-lg font-bold">{userProp.name}, {userProp.age}</h2>
                <p className="text-sm text-muted-foreground">{t(userProp.city, language)}</p>
                <p className="text-sm text-primary mt-1">{userProp.vibe}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('aboutMe', language)}</p>
                  <p className="text-sm">{userProp.about}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('drinks', language)}</p>
                  <div className="flex flex-wrap gap-1">
                    {userProp.drinks.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                        {t(d, language)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
                  <div className="flex flex-wrap gap-1">
                    {userProp.interests.map(i => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">
                        {t(i, language)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} className={i <= fullStars ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{userProp.rating.toFixed(1)} ({userProp.ratingCount})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleFav}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                    isFav ? 'bg-primary/15 text-primary border-primary/30' : 'border-border hover:border-primary/30 text-muted-foreground hover:text-primary'
                  }`}
                >
                  <Heart size={14} className={isFav ? 'fill-primary' : ''} />
                  {t('addToFavorites', language)}
                </button>
                <button
                  onClick={handleMessage}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
                >
                  <MessageCircle size={14} />
                  {t('sendMessage', language)}
                </button>
                <button
                  onClick={handleMeeting}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
                >
                  <Handshake size={14} />
                  {t('proposeMeeting', language)}
                </button>
                <button
                  onClick={handleBlock}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    !isMockUser && isBlockedByMe(userProp.id) ? 'border-destructive/30 text-destructive bg-destructive/10' : 'border-destructive/30 text-muted-foreground hover:text-destructive'
                  }`}
                >
                  <Ban size={14} />
                  {t(!isMockUser && isBlockedByMe(userProp.id) ? 'unblockUser' : 'blockUser', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChat && <ChatWindow user={mockToProfile(userProp)} onClose={() => setShowChat(false)} />}
      </AnimatePresence>
    </>
  );
}
