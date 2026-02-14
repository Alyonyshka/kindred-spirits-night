import { Star, Trophy, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { mockUsers } from '@/lib/mockData';

export default function FriendOfWeek() {
  const { language } = useApp();
  const friend = mockUsers.reduce((a, b) => (a.rating > b.rating ? a : b));

  return (
    <div className="glass-panel p-4 amber-border-glow animate-shimmer relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border-2 border-primary avatar-glow">
            <User size={28} className="text-muted-foreground" />
          </div>
          <Trophy size={16} className="absolute -top-1 -right-1 text-primary" />
        </div>
        <div>
          <p className="text-xs text-primary font-semibold uppercase tracking-wider">{t('friendOfWeek', language)}</p>
          <p className="font-bold">{friend.name}, {friend.age}</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={12} className={i <= Math.round(friend.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{friend.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
