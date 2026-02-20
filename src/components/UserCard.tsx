import { useState } from 'react';
import { Heart, MessageCircle, Handshake, Ban, Star, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { MockUser } from '@/lib/mockData';
import type { Profile } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ChatWindow from '@/components/ChatWindow';

interface UserCardProps {
  user: MockUser;
}

// Adapter to convert MockUser to Profile for ChatWindow
function mockToProfile(u: MockUser): Profile {
  return {
    id: u.id,
    user_id: u.id,
    name: u.name,
    age: u.age,
    avatar_url: u.avatar,
    city: u.city,
    drinks: u.drinks,
    alcohol_level: u.alcoholLevel,
    interests: u.interests,
    vibe: u.vibe,
    about: u.about,
    online: u.online,
    rating: u.rating,
    rating_count: u.ratingCount,
  };
}

export default function UserCard({ user }: UserCardProps) {
  const { language } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const fullStars = Math.round(user.rating);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
    toast.success(t(isFav ? 'removedFromFavorites' : 'addedToFavorites', language));
  };

  const handleMeeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(t('meetingRequestSent', language));
  };

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBlocked(!isBlocked);
    toast.success(t(isBlocked ? 'userUnblocked' : 'userBlocked', language));
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
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
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{user.name}, {user.age}</h3>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${user.online ? 'bg-emerald-400' : 'bg-muted-foreground/40'}`} />
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.vibe}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {user.drinks.slice(0, 2).map(d => (
            <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium border border-primary/20">
              {t(d, language)}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-medium">
            {t(user.alcoholLevel, language)}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={12} className={i <= fullStars ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">{user.rating.toFixed(1)}</span>
        </div>
      </motion.div>

      {/* Expanded card modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setExpanded(false)} />
            <motion.div
              className="relative glass-panel-strong p-6 w-full max-w-sm"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 avatar-glow mb-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User size={36} className="text-muted-foreground" />
                  )}
                </div>
                <h2 className="text-lg font-bold">{user.name}, {user.age}</h2>
                <p className="text-sm text-muted-foreground">{t(user.city, language)}</p>
                <p className="text-sm text-primary mt-1">{user.vibe}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('aboutMe', language)}</p>
                  <p className="text-sm">{user.about}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('drinks', language)}</p>
                  <div className="flex flex-wrap gap-1">
                    {user.drinks.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                        {t(d, language)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
                  <div className="flex flex-wrap gap-1">
                    {user.interests.map(i => (
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
                  <span className="text-xs text-muted-foreground ml-1">{user.rating.toFixed(1)} ({user.ratingCount})</span>
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
                    isBlocked ? 'border-destructive/30 text-destructive bg-destructive/10' : 'border-destructive/30 text-muted-foreground hover:text-destructive'
                  }`}
                >
                  <Ban size={14} />
                  {t(isBlocked ? 'unblockUser' : 'blockUser', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {showChat && <ChatWindow user={mockToProfile(user)} onClose={() => setShowChat(false)} />}
      </AnimatePresence>
    </>
  );
}
