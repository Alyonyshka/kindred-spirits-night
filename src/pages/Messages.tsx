import { useState } from 'react';
import { User, Handshake, Ban, MessageCircle, Star } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { mockUsers, MockUser, initialChats, READ_CHATS_KEY } from '@/lib/mockData';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from '@/components/ChatWindow';

const initialInvites = [
  { id: '1', userId: '3', type: 'meeting' as const },
];

const ACCEPTED_INVITES_KEY = 'sobutylnik-accepted-invites';


function loadAcceptedInvites(): string[] {
  try { return JSON.parse(localStorage.getItem(ACCEPTED_INVITES_KEY) || '[]'); } catch { return []; }
}

function loadReadChats(): string[] {
  try { return JSON.parse(localStorage.getItem(READ_CHATS_KEY) || '[]'); } catch { return []; }
}

export default function Messages() {
  const { language } = useApp();
  const [chatUser, setChatUser] = useState<MockUser | null>(null);
  const [invites, setInvites] = useState(() => {
    const accepted = loadAcceptedInvites();
    return initialInvites.filter(i => !accepted.includes(i.id));
  });
  const [chats, setChats] = useState(() => {
    const readIds = loadReadChats();
    return initialChats.map(c => ({ ...c, unread: readIds.includes(c.id) ? 0 : c.unread }));
  });
  const [expandedUser, setExpandedUser] = useState<MockUser | null>(null);

  const getUserById = (userId: string) => mockUsers.find(u => u.id === userId);

  const handleAccept = (inviteId: string) => {
    const accepted = loadAcceptedInvites();
    if (!accepted.includes(inviteId)) {
      localStorage.setItem(ACCEPTED_INVITES_KEY, JSON.stringify([...accepted, inviteId]));
    }
    setInvites(prev => prev.filter(i => i.id !== inviteId));
    toast.success(t('meetingAccepted', language));
  };

  const handleDecline = (inviteId: string) => {
    setInvites(prev => prev.filter(i => i.id !== inviteId));
    toast.success(t('meetingDeclined', language));
  };

  const handleOpenChat = (user: MockUser, chatId: string) => {
    // Mark as read
    const readIds = loadReadChats();
    if (!readIds.includes(chatId)) {
      localStorage.setItem(READ_CHATS_KEY, JSON.stringify([...readIds, chatId]));
    }
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unread: 0 } : c));
    setChatUser(user);
  };

  const handleAvatarClick = (e: React.MouseEvent, user: MockUser) => {
    e.stopPropagation();
    setExpandedUser(user);
  };

  const handleMessageUser = (user: MockUser) => {
    setExpandedUser(null);
    setChatUser(user);
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
                  <div
                    onClick={(e) => user && handleAvatarClick(e, user)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border cursor-pointer hover:border-primary/30 transition-all overflow-hidden"
                  >
                    {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" /> : <User size={20} className="text-muted-foreground" />}
                  </div>
                  <span className="font-medium text-sm">{user?.name || 'User'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(inv.id)} className="px-3 py-1.5 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    {t('accept', language)}
                  </button>
                  <button onClick={() => handleDecline(inv.id)} className="px-3 py-1.5 rounded-xl text-xs font-medium border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors">
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
        {chats.map(chat => {
          const user = getUserById(chat.userId);
          return (
            <div
              key={chat.id}
              onClick={() => user && handleOpenChat(user, chat.id)}
              className="glass-panel p-4 flex items-center gap-3 card-hover cursor-pointer"
            >
              <div className="relative">
                <div
                  onClick={(e) => user && handleAvatarClick(e, user)}
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-border cursor-pointer hover:border-primary/30 transition-all overflow-hidden"
                >
                  {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" /> : <User size={24} className="text-muted-foreground" />}
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

      {/* Profile card modal */}
      <AnimatePresence>
        {expandedUser && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setExpandedUser(null)} />
            <motion.div className="relative glass-panel-strong p-6 w-full max-w-sm" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 avatar-glow mb-3 overflow-hidden">
                  {expandedUser.avatar ? <img src={expandedUser.avatar} alt={expandedUser.name} className="w-full h-full object-cover rounded-full" /> : <User size={36} className="text-muted-foreground" />}
                </div>
                <h2 className="text-lg font-bold">{expandedUser.name}, {expandedUser.age}</h2>
                <p className="text-sm text-muted-foreground">{t(expandedUser.city, language)}</p>
                <p className="text-sm text-primary mt-1">{expandedUser.vibe}</p>
              </div>
              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-muted-foreground mb-1">{t('aboutMe', language)}</p><p className="text-sm">{expandedUser.about}</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">{t('drinks', language)}</p>
                  <div className="flex flex-wrap gap-1">{expandedUser.drinks.map(d => <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">{t(d, language)}</span>)}</div>
                </div>
                <div><p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
                  <div className="flex flex-wrap gap-1">{expandedUser.interests.map(i => <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">{t(i, language)}</span>)}</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= Math.round(expandedUser.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />)}
                  <span className="text-xs text-muted-foreground ml-1">{expandedUser.rating.toFixed(1)} ({expandedUser.ratingCount})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleMessageUser(expandedUser)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all">
                  <MessageCircle size={14} />{t('sendMessage', language)}
                </button>
                <button onClick={() => { toast.success(t('meetingRequestSent', language)); }} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all">
                  <Handshake size={14} />{t('proposeMeeting', language)}
                </button>
                <button onClick={() => { toast.success(t('userBlocked', language)); }} className="col-span-2 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-destructive/30 text-muted-foreground hover:text-destructive transition-all">
                  <Ban size={14} />{t('blockUser', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {chatUser && <ChatWindow user={chatUser} onClose={() => setChatUser(null)} />}
      </AnimatePresence>
    </div>
  );
}
