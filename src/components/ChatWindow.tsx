import { useState, useRef, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { MockUser } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
  user: MockUser;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

export default function ChatWindow({ user, onClose }: ChatWindowProps) {
  const { language } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: `${t('online', language)}! 👋`, fromMe: false, time: '14:00' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: input.trim(), fromMe: true, time }]);
    setInput('');
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div className="relative flex flex-col h-full max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="glass-panel-strong p-4 flex items-center gap-3 border-b border-border/50">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User size={20} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{user.name}</h3>
            <span className={`text-xs ${user.online ? 'text-emerald-400' : 'text-muted-foreground'}`}>
              {t(user.online ? 'online' : 'offline', language)}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.fromMe
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'glass-panel border border-border rounded-bl-md'
              }`}>
                <p>{msg.text}</p>
                <span className={`text-[10px] mt-1 block ${msg.fromMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                  {msg.time} {msg.fromMe && '✓✓'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="glass-panel-strong p-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={t('typeMessage', language)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
