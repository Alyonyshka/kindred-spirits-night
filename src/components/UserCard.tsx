import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Handshake, Ban, Star, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import type { Profile } from '@/hooks/useAuth';
import { useBlocking } from '@/hooks/useBlocking';
import { useFavorites } from '@/hooks/useFavorites';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ChatWindow from '@/components/ChatWindow';

interface UserCardProps {
  profile: Profile;
}

export default function UserCard({ profile: p }: UserCardProps) {
  const { language, user: currentUser } = useApp();
  const { isBlocked, isBlockedByMe, blockUser, unblockUser } = useBlocking();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [expanded, setExpanded] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [canRate, setCanRate] = useState(false);

  const isFav = isFavorite(p.user_id);
  const fullStars = Math.round(p.rating || 0);

  // Check rating eligibility: favorite + meeting + message
  useEffect(() => {
    if (!currentUser || !expanded) return;
    const check = async () => {
      const [favRes, meetRes, msgRes] = await Promise.all([
        supabase.from('favorites').select('id').eq('user_id', currentUser.id).eq('favorite_user_id', p.user_id).maybeSingle(),
        supabase.from('meetings').select('id').or(`and(requester_id.eq.${currentUser.id},receiver_id.eq.${p.user_id}),and(requester_id.eq.${p.user_id},receiver_id.eq.${currentUser.id})`).limit(1),
        supabase.from('messages').select('id').or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${p.user_id}),and(sender_id.eq.${p.user_id},receiver_id.eq.${currentUser.id})`).limit(1),
      ]);
      const hasFav = !!favRes.data;
      const hasMeeting = (meetRes.data?.length || 0) > 0;
      const hasMsg = (msgRes.data?.length || 0) > 0;
      setCanRate(hasFav && hasMeeting && hasMsg);

      // Load existing rating
      const { data: ratingData } = await supabase
        .from('user_ratings')
        .select('rating')
        .eq('rater_id', currentUser.id)
        .eq('rated_id', p.user_id)
        .maybeSingle();
      if (ratingData) setMyRating(ratingData.rating);
    };
    check();
  }, [currentUser, p.user_id, expanded]);

  const handleRate = async (stars: number) => {
    if (!currentUser || !canRate) return;
    const { data: existing } = await supabase
      .from('user_ratings')
      .select('id')
      .eq('rater_id', currentUser.id)
      .eq('rated_id', p.user_id)
      .maybeSingle();

    if (existing) {
      await supabase.from('user_ratings').update({ rating: stars }).eq('id', existing.id);
    } else {
      await supabase.from('user_ratings').insert({ rater_id: currentUser.id, rated_id: p.user_id, rating: stars });
    }
    setMyRating(stars);
    toast.success(t('rating', language) + ': ' + stars + '/5');
  };

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBlocked(p.user_id)) { toast.error(t('blockedCannotAction', language)); return; }
    await toggleFavorite(p.user_id);
    toast.success(t(isFav ? 'removedFromFavorites' : 'addedToFavorites', language));
  };

  const handleMeeting = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (isBlocked(p.user_id)) { toast.error(t('blockedCannotAction', language)); return; }
    await supabase.from('meetings').insert({ requester_id: currentUser.id, receiver_id: p.user_id });
    toast.success(t('meetingRequestSent', language));
  };

  const handleBlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBlockedByMe(p.user_id)) {
      await unblockUser(p.user_id);
      toast.success(t('userUnblocked', language));
    } else {
      await blockUser(p.user_id);
      toast.success(t('userBlocked', language));
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBlocked(p.user_id)) { toast.error(t('blockedCannotAction', language)); return; }
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
            {p.avatar_url ? (
              <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{p.name}, {p.age}</h3>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.online ? 'bg-emerald-400' : 'bg-muted-foreground/40'}`} />
            </div>
            <p className="text-xs text-muted-foreground truncate">{p.vibe}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {(p.drinks || []).slice(0, 2).map(d => (
            <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium border border-primary/20">
              {t(d, language)}
            </span>
          ))}
          {p.alcohol_level && (
            <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-medium">
              {t(p.alcohol_level, language)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={12} className={i <= fullStars ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">{(p.rating || 0).toFixed(1)}</span>
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
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 avatar-glow mb-3 overflow-hidden">
                  {p.avatar_url ? (
                    <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User size={36} className="text-muted-foreground" />
                  )}
                </div>
                <h2 className="text-lg font-bold">{p.name}, {p.age}</h2>
                <p className="text-sm text-muted-foreground">{t(p.city || '', language)}</p>
                <p className="text-sm text-primary mt-1">{p.vibe}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('aboutMe', language)}</p>
                  <p className="text-sm">{p.about}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('drinks', language)}</p>
                  <div className="flex flex-wrap gap-1">
                    {(p.drinks || []).map(d => (
                      <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                        {t(d, language)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
                  <div className="flex flex-wrap gap-1">
                    {(p.interests || []).map(i => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">
                        {t(i, language)}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Interactive Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={16}
                      className={`transition-colors cursor-pointer ${
                        canRate
                          ? (i <= (hoverRating || myRating || fullStars) ? 'text-primary fill-primary' : 'text-muted-foreground/30')
                          : (i <= fullStars ? 'text-primary/30 fill-primary/30' : 'text-muted-foreground/15')
                      }`}
                      onMouseEnter={() => canRate && setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRate(i)}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{(p.rating || 0).toFixed(1)} ({p.rating_count || 0})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleFav}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                    isFav ? 'bg-primary/15 text-primary border-primary/30' : 'border-border hover:border-primary/30 text-muted-foreground hover:text-primary'
                  }`}>
                  <Heart size={14} className={isFav ? 'fill-primary' : ''} />
                  {t('addToFavorites', language)}
                </button>
                <button onClick={handleMessage}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all">
                  <MessageCircle size={14} />
                  {t('sendMessage', language)}
                </button>
                <button onClick={handleMeeting}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all">
                  <Handshake size={14} />
                  {t('proposeMeeting', language)}
                </button>
                <button onClick={handleBlock}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    isBlockedByMe(p.user_id) ? 'border-destructive/30 text-destructive bg-destructive/10' : 'border-destructive/30 text-muted-foreground hover:text-destructive'
                  }`}>
                  <Ban size={14} />
                  {t(isBlockedByMe(p.user_id) ? 'unblockUser' : 'blockUser', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChat && <ChatWindow user={p} onClose={() => setShowChat(false)} />}
      </AnimatePresence>
    </>
  );
}
