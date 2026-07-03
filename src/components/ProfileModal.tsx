import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Handshake, Ban, Star, User, Flag } from 'lucide-react';
import ReportUserModal from '@/components/ReportUserModal';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import type { Profile } from '@/hooks/useAuth';
import { useBlocking } from '@/hooks/useBlocking';
import { useFavorites } from '@/hooks/useFavorites';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onMessage?: (p: Profile) => void;
}

export default function ProfileModal({ profile: p, onClose, onMessage }: ProfileModalProps) {
  const { language, user: currentUser } = useApp();
  const { isBlocked, isBlockedByMe, blockUser, unblockUser } = useBlocking();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [hoverRating, setHoverRating] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [canRate, setCanRate] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const isFav = isFavorite(p.user_id);
  const fullStars = Math.round(p.rating || 0);

  useEffect(() => {
    if (!currentUser) return;
    const check = async () => {
      // Brudershaft-confirmed meeting check (any direction)
      const { data: meet } = await supabase
        .from('meetings')
        .select('id')
        .not('met_at', 'is', null)
        .or(`and(requester_id.eq.${currentUser.id},receiver_id.eq.${p.user_id}),and(requester_id.eq.${p.user_id},receiver_id.eq.${currentUser.id})`)
        .limit(1);
      setCanRate((meet?.length || 0) > 0);

      const { data: ratingData } = await supabase
        .from('user_ratings')
        .select('rating')
        .eq('rater_id', currentUser.id)
        .eq('rated_id', p.user_id)
        .maybeSingle();
      if (ratingData) setMyRating(ratingData.rating);
    };
    check();

    // Realtime: if brudershaft happens while modal is open, unlock stars instantly
    const ch = supabase
      .channel(`profile-meetings-${p.user_id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => check())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [currentUser?.id, p.user_id]);

  const handleRate = async (stars: number) => {
    if (!currentUser || !canRate) return;
    const { data: existing } = await supabase
      .from('user_ratings').select('id')
      .eq('rater_id', currentUser.id).eq('rated_id', p.user_id).maybeSingle();
    if (existing) {
      await supabase.from('user_ratings').update({ rating: stars }).eq('id', existing.id);
    } else {
      await supabase.from('user_ratings').insert({ rater_id: currentUser.id, rated_id: p.user_id, rating: stars });
    }
    setMyRating(stars);
    toast.success(t('rating', language) + ': ' + stars + '/5');
  };

  const handleFav = async () => {
    if (isBlocked(p.user_id)) { toast.error(t('blockedCannotAction', language)); return; }
    await toggleFavorite(p.user_id);
    toast.success(t(isFav ? 'removedFromFavorites' : 'addedToFavorites', language));
  };

  const handleMessage = () => {
    if (isBlocked(p.user_id)) { toast.error(t('blockedCannotAction', language)); return; }
    onMessage?.(p);
    onClose();
  };

  const handleMeeting = async () => {
    if (!currentUser) return;
    if (isBlocked(p.user_id)) { toast.error(t('blockedCannotAction', language)); return; }
    await supabase.from('meetings').insert({ requester_id: currentUser.id, receiver_id: p.user_id });
    toast.success(t('meetingRequestSent', language));
  };

  const handleBlock = async () => {
    if (isBlockedByMe(p.user_id)) {
      await unblockUser(p.user_id);
      toast.success(t('userUnblocked', language));
    } else {
      await blockUser(p.user_id);
      toast.success(t('userBlocked', language));
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative glass-panel-strong p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
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
                <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">{t(d, language)}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
            <div className="flex flex-wrap gap-1">
              {(p.interests || []).map(i => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">{t(i, language)}</span>
              ))}
            </div>
          </div>

          {/* Always-visible rating */}
          <div
            className="flex items-center gap-1"
            title={!canRate ? t('rateAfterMeeting', language) : undefined}
          >
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                size={16}
                className={`transition-colors ${canRate ? 'cursor-pointer' : 'cursor-not-allowed'} ${
                  canRate
                    ? (i <= (hoverRating || myRating || fullStars) ? 'text-primary fill-primary' : 'text-muted-foreground/30')
                    : (i <= fullStars ? 'text-primary/40 fill-primary/40' : 'text-muted-foreground/20')
                }`}
                onMouseEnter={() => canRate && setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => canRate && handleRate(i)}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              {(p.rating || 0).toFixed(1)} ({p.rating_count || 0})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={handleFav}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
              isFav ? 'bg-primary/15 text-primary border-primary/30' : 'border-border hover:border-primary/30 text-muted-foreground hover:text-primary'
            }`}>
            <Heart size={14} className={isFav ? 'fill-primary' : ''} />
            {t(isFav ? 'removedFromFavorites' : 'addToFavorites', language)}
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
          <button onClick={() => setShowReport(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-destructive/30 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all col-span-2">
            <Flag size={14} />
            {t('reportUser', language)}
          </button>
        </div>
      </motion.div>
      <ReportUserModal
        open={showReport}
        reportedUserId={p.user_id}
        reportedUserName={p.name}
        onClose={() => setShowReport(false)}
      />
    </motion.div>
  );
}
