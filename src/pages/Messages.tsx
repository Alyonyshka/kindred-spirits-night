import { MessageCircle, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';

const mockChats = [
  { id: '1', name: 'Марина', lastMsg: 'Привет! Давай встретимся сегодня?', time: '14:22', unread: 2, online: true },
  { id: '2', name: 'Андрей', lastMsg: 'Слушай, я нашёл крутой бар 🍸', time: '12:05', unread: 0, online: true },
  { id: '3', name: 'Катерина', lastMsg: 'Принято! До встречи', time: 'вчера', unread: 0, online: false },
];

const mockInvites = [
  { id: '1', name: 'Дмитрий', type: 'meeting' as const },
];

export default function Messages() {
  const { language } = useApp();

  return (
    <div className="space-y-4">
      {/* Meeting invites */}
      {mockInvites.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('proposeMeeting', language)}
          </h3>
          {mockInvites.map(inv => (
            <div key={inv.id} className="glass-panel p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                  <User size={20} className="text-muted-foreground" />
                </div>
                <span className="font-medium text-sm">{inv.name}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  {t('accept', language)}
                </button>
                <button className="px-3 py-1.5 rounded-xl text-xs font-medium border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors">
                  {t('decline', language)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chats */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('navMessages', language)}
        </h3>
        {mockChats.map(chat => (
          <div key={chat.id} className="glass-panel p-4 flex items-center gap-3 card-hover cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-border">
                <User size={24} className="text-muted-foreground" />
              </div>
              {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-card" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{chat.name}</span>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{chat.lastMsg}</p>
            </div>
            {chat.unread > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                {chat.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
