import { Heart, User, MessageCircle, Handshake } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { mockUsers } from '@/lib/mockData';

export default function Favorites() {
  const { language } = useApp();
  // Mock: first 3 users are favorites
  const favorites = mockUsers.slice(0, 3);

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
          {favorites.map(user => (
            <div key={user.id} className="glass-panel p-4 card-hover cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/20 group-hover:avatar-glow transition-all duration-300">
                  <User size={28} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{user.name}, {user.age}</h3>
                  <p className="text-xs text-muted-foreground">{user.vibe}</p>
                  <p className="text-xs text-muted-foreground">{t(user.city, language)}</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="p-2 rounded-lg border border-border hover:border-primary/30 hover:text-primary transition-all" title={t('sendMessage', language)}>
                    <MessageCircle size={16} />
                  </button>
                  <button className="p-2 rounded-lg border border-border hover:border-primary/30 hover:text-primary transition-all" title={t('proposeMeeting', language)}>
                    <Handshake size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
