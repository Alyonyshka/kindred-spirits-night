import { useState } from 'react';
import { User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { mockUsers, MockUser } from '@/lib/mockData';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import ChatWindow from '@/components/ChatWindow';

const mockChats = [
  { id: '1', userId: '2', lastMsg: 'Привет! Давай встретимся сегодня?', time: '14:22', unread: 2, online: true },
  { id: '2', userId: '7', lastMsg: 'Слушай, я нашёл крутой бар 🍸', time: '12:05', unread: 0, online: true },
  { id: '3', userId: '6', lastMsg: 'Принято! До встречи', time: 'вчера', unread: 0, online: false },
];

const mockInvites = [
  { id: '1', userId: '3', type: 'meeting' as const },
];

export default function Messages() {
  const { language } = useApp();
  const [chatUser, setChatUser] = useState<MockUser | null>(null);
  const [invites, setInvites] = useState(mockInvites);

  const getUserById = (userId: string) => mockUsers.find(u => u.id === userId);

  const handleAccept = (inviteId: string) => {
    setInvites(prev => prev.filter(i => i.id !== inviteId));
    toast.success(t('meetingAccepted', language));
  };

  const handleDecline = (inviteId: string) => {
    setInvites(prev => prev.filter(i => i.id !== inviteId));
    toast.success(t('meetingDeclined', language));
  };

  return (
    <div className="space-y-4">
      {/* Meeting invites */}
      {invites.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('proposeMeeting', language)}
          </h3>
          {invites.map(inv => {
            const user = getUserById(inv.userId);
            return (
              <div key={inv.id} className="glass-panel p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                    <User size={20} className="text-muted-foreground" />
                  </div>
                  <span className="font-medium text-sm">{user?.name || 'User'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(inv.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {t('accept', language)}
                  </button>
                  <button
                    onClick={() => handleDecline(inv.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
                  >
                    {t('decline', language)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chats */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('navMessages', language)}
        </h3>
        {mockChats.map(chat => {
          const user = getUserById(chat.userId);
          return (
            <div
              key={chat.id}
              onClick={() => user && setChatUser(user)}
              className="glass-panel p-4 flex items-center gap-3 card-hover cursor-pointer"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-border">
                  <User size={24} className="text-muted-foreground" />
                </div>
                {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-card" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{user?.name || 'User'}</span>
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
          );
        })}
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {chatUser && <ChatWindow user={chatUser} onClose={() => setChatUser(null)} />}
      </AnimatePresence>
    </div>
  );
}
