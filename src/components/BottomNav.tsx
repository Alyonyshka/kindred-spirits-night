import { Search, MessageCircle, Heart, Calendar, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { useNavigate, useLocation } from 'react-router-dom';

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

  const activeId = tabs.find(tab => tab.path === location.pathname)?.id || 'search';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel-strong border-t border-border/50">
      <div className="max-w-5xl mx-auto flex items-center justify-around py-2 px-1">
        {tabs.map(({ id, icon: Icon, path, labelKey }) => {
          const isActive = activeId === id;
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
              </div>
              <span className="text-[10px] font-medium">{t(labelKey, language)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
