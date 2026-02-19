import { useState, useEffect } from 'react';
import { Search, MessageCircle, Heart, Calendar, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUnreadCount, getNewEventsCount, getNewFavoritesCount } from '@/lib/mockData';

const tabs = [
  { id: 'search', icon: Search, path: '/', labelKey: 'navSearch' },
  { id: 'messages', icon: MessageCircle, path: '/messages', labelKey: 'navMessages' },
  { id: 'favorites', icon: Heart, path: '/favorites', labelKey: 'navFavorites' },
  { id: 'events', icon: Calendar, path: '/events', labelKey: 'navEvents' },
  { id: 'profile', icon: User, path: '/profile', labelKey: 'navProfile' },
];

export default function BottomNav() {
  const { language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [badges, setBadges] = useState({ messages: 0, favorites: 0, events: 0 });

  useEffect(() => {
    setBadges({
      messages: getUnreadCount(),
      favorites: getNewFavoritesCount(),
      events: getNewEventsCount(),
    });
  }, [location.pathname]);

  const activeId = tabs.find(tab => tab.path === location.pathname)?.id || 'search';

  const getBadge = (id: string) => {
    if (id === 'messages') return badges.messages;
    if (id === 'favorites') return badges.favorites;
    if (id === 'events') return badges.events;
    return 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel-strong border-t border-border/50">
      <div className="max-w-5xl mx-auto flex items-center justify-around py-2 px-1">
        {tabs.map(({ id, icon: Icon, path, labelKey }) => {
          const isActive = activeId === id;
          const badge = getBadge(id);
          return (
            <button
              key={id}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 relative ${
                isActive ? 'nav-icon-active' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`relative ${isActive ? 'pulse-active rounded-full' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[9px] font-bold leading-none">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{t(labelKey, language)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
