import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import type { Profile } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from '@/components/ChatWindow';
import ProfileModal from '@/components/ProfileModal';

interface UserCardProps {
  profile: Profile;
}

export default function UserCard({ profile: p }: UserCardProps) {
  const { language } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const fullStars = Math.round(p.rating || 0);

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
          <ProfileModal
            profile={p}
            onClose={() => setExpanded(false)}
            onMessage={() => setShowChat(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChat && <ChatWindow user={p} onClose={() => setShowChat(false)} />}
      </AnimatePresence>
    </>
  );
}
