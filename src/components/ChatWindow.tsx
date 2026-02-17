import { useState, useRef, useEffect } from 'react';
import { X, Send, User, Image, Video, Mic, MicOff, Smile, Paperclip } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { MockUser } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ChatWindowProps {
  user: MockUser;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
  type?: 'text' | 'photo' | 'video' | 'voice';
  mediaUrl?: string;
  read?: boolean;
}

const EMOJI_LIST = ['😀','😂','🤣','😍','🥳','🍻','🍷','🍺','🥂','🍸','🔥','❤️','👍','🎉','🤝','😎','🌙','✨','💪','🙌'];

export default function ChatWindow({ user, onClose }: ChatWindowProps) {
  const { language } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: `${t('online', language)}! 👋`, fromMe: false, time: '14:00', type: 'text', read: true },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator when user sends a message
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].fromMe) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000 + Math.random() * 2000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const getTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: input.trim(), fromMe: true, time: getTime(), type: 'text', read: false }]);
    setInput('');
    setShowEmoji(false);
    // Simulate read after 1s
    setTimeout(() => {
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, read: true } : m));
    }, 1000);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), text: '📷', fromMe: true, time: getTime(), type: 'photo', mediaUrl: reader.result as string, read: false
      }]);
      toast.success(t('photoSent', language));
    };
    reader.readAsDataURL(file);
    setShowAttach(false);
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), text: '🎬', fromMe: true, time: getTime(), type: 'video', mediaUrl: reader.result as string, read: false
      }]);
      toast.success(t('videoSent', language));
    };
    reader.readAsDataURL(file);
    setShowAttach(false);
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartRef = useRef<number>(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        recordingStartRef.current = Date.now();
        setRecordingTime(0);

        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(Math.floor((Date.now() - recordingStartRef.current) / 1000));
        }, 500);

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
          const duration = Math.max(1, Math.floor((Date.now() - recordingStartRef.current) / 1000));
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          const mins = Math.floor(duration / 60);
          const secs = duration % 60;
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: `🎤 ${mins}:${secs.toString().padStart(2, '0')}`,
            fromMe: true,
            time: getTime(),
            type: 'voice',
            mediaUrl: url,
            read: false,
          }]);
          setRecordingTime(0);
        };

        recorder.start();
        setIsRecording(true);
        toast(t('recording', language));
      } catch {
        toast.error('Микрофон недоступен');
      }
    }
  };

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
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
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User size={20} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{user.name}</h3>
            {isTyping ? (
              <span className="text-xs text-primary animate-pulse">{t('typing', language)}</span>
            ) : (
              <span className={`text-xs ${user.online ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                {t(user.online ? 'online' : 'offline', language)}
              </span>
            )}
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
                {msg.type === 'photo' && msg.mediaUrl && (
                  <img src={msg.mediaUrl} alt="photo" className="rounded-xl max-w-full mb-1" />
                )}
                {msg.type === 'video' && msg.mediaUrl && (
                  <video src={msg.mediaUrl} controls className="rounded-xl max-w-full mb-1" />
                )}
                {msg.type === 'voice' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Mic size={14} />
                    {msg.mediaUrl ? (
                      <audio src={msg.mediaUrl} controls className="h-8 max-w-[180px]" />
                    ) : (
                      <div className="h-1 flex-1 rounded-full bg-primary-foreground/30">
                        <div className="h-full w-2/3 rounded-full bg-primary-foreground/70" />
                      </div>
                    )}
                  </div>
                )}
                <p>{msg.text}</p>
                <span className={`text-[10px] mt-1 block ${msg.fromMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                  {msg.time} {msg.fromMe && (msg.read ? '✓✓' : '✓')}
                </span>
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-panel border border-border rounded-2xl rounded-bl-md px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emoji picker */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-panel-strong border-t border-border/50 overflow-hidden"
            >
              <div className="p-3 flex flex-wrap gap-2">
                {EMOJI_LIST.map(e => (
                  <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform">{e}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachment menu */}
        <AnimatePresence>
          {showAttach && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-panel-strong border-t border-border/50 overflow-hidden"
            >
              <div className="p-3 flex gap-4 justify-center">
                <button onClick={() => photoRef.current?.click()} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary/30">
                    <Image size={18} />
                  </div>
                  <span className="text-[10px]">Фото</span>
                </button>
                <button onClick={() => videoRef.current?.click()} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary/30">
                    <Video size={18} />
                  </div>
                  <span className="text-[10px]">Видео</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden inputs */}
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideo} />

        {/* Input bar */}
        <div className="glass-panel-strong p-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
            >
              <Paperclip size={18} />
            </button>
            <button
              onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
            >
              <Smile size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={t('typeMessage', language)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all"
            />
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${isRecording ? 'text-destructive animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
            >
              {isRecording ? (
                <span className="flex items-center gap-1 text-xs font-mono">
                  <MicOff size={18} />
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </span>
              ) : <Mic size={18} />}
            </button>
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
