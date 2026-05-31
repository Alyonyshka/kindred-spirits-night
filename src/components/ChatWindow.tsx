import { useState, useRef, useEffect } from 'react';
import { X, Send, User, Image, Video, Mic, MicOff, Smile, Paperclip, Reply, Edit2, Sparkles, Beer } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import MessageContextMenu from './MessageContextMenu';
import AdventurePlanModal from './AdventurePlanModal';
import ChatEmojiStickers from './ChatEmojiStickers';
import BrudershaftModal from './BrudershaftModal';

interface ChatWindowProps {
  user: Profile;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
  type?: 'text' | 'photo' | 'video' | 'voice' | 'sticker' | 'gif';
  mediaUrl?: string;
  read?: boolean;
  edited?: boolean;
  replyTo?: { text: string; name: string };
  dbId?: string;
}

const EMOJI_LIST = ['😀','😂','🤣','😍','🥳','🍻','🍷','🍺','🥂','🍸','🔥','❤️','👍','🎉','🤝','😎','🌙','✨','💪','🙌'];
type ChatMediaTab = 'none' | 'emoji' | 'attach';

export default function ChatWindow({ user: otherUser, onClose }: ChatWindowProps) {
  const { language, user: currentUser } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showAdventure, setShowAdventure] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [mediaTab, setMediaTab] = useState<ChatMediaTab>('none');
  const [isRecording, setIsRecording] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ msg: ChatMessage; x: number; y: number } | null>(null);
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [forwardMsg, setForwardMsg] = useState<ChatMessage | null>(null);
  const [forwardUsers, setForwardUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // Fetch messages from DB
  const fetchMessages = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUser.user_id}),and(sender_id.eq.${otherUser.user_id},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });

    if (data) {
      // Build a map for reply references
      const msgMap = new Map(data.map(m => [m.id, m]));

      const mapped: ChatMessage[] = data.map(m => {
        const replyMsg = m.reply_to_id ? msgMap.get(m.reply_to_id) : null;
        return {
          id: m.id,
          dbId: m.id,
          text: m.content || '',
          fromMe: m.sender_id === currentUser.id,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: (m.type as ChatMessage['type']) || 'text',
          mediaUrl: m.media_url || undefined,
          read: m.read || false,
          edited: m.edited || false,
          replyTo: replyMsg ? {
            text: replyMsg.content || '',
            name: replyMsg.sender_id === currentUser.id ? t('navProfile', language) : otherUser.name,
          } : undefined,
        };
      });
      setMessages(mapped);
    }
    setLoading(false);

    // Mark received messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', otherUser.user_id)
      .eq('receiver_id', currentUser.id)
      .eq('read', false);
  };

  useEffect(() => {
    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${otherUser.user_id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const msg = payload.new as any;
        if (!msg) { fetchMessages(); return; }
        // Only handle messages in this conversation
        if (
          (msg.sender_id === currentUser?.id && msg.receiver_id === otherUser.user_id) ||
          (msg.sender_id === otherUser.user_id && msg.receiver_id === currentUser?.id)
        ) {
          fetchMessages();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUser?.id, otherUser.user_id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const getTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentUser) return;

    if (editingMsg && editingMsg.dbId) {
      await supabase.from('messages').update({ content: input.trim(), edited: true }).eq('id', editingMsg.dbId);
      setEditingMsg(null);
      setInput('');
      toast.success(t('msgEdited', language));
      return;
    }

    const insertData: any = {
      sender_id: currentUser.id,
      receiver_id: otherUser.user_id,
      content: input.trim(),
      type: 'text',
    };

    if (replyTo?.dbId) {
      insertData.reply_to_id = replyTo.dbId;
    }

    await supabase.from('messages').insert(insertData);

    setInput('');
    setReplyTo(null);
    setShowEmoji(false);
    setMediaTab('none');
  };

  const handleMsgContextMenu = (e: React.MouseEvent | React.TouchEvent, msg: ChatMessage) => {
    e.preventDefault();
    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
    setContextMenu({ msg, x: pos.x, y: pos.y });
  };

  const handleDeleteMsg = async (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (msg?.dbId) {
      await supabase.from('messages').delete().eq('id', msg.dbId);
    }
    toast.success(t('msgDeleted', language));
  };

  const handleEditMsg = (msg: ChatMessage) => {
    setEditingMsg(msg);
    setInput(msg.text);
  };

  const handleReplyMsg = (msg: ChatMessage) => setReplyTo(msg);
  const handleCopyMsg = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text);
    toast.success(t('msgCopied', language));
  };
  const handleForwardMsg = async (msg: ChatMessage) => {
    if (!currentUser) return;
    // Fetch users we've chatted with
    const { data: msgs } = await supabase
      .from('messages')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`);

    if (msgs) {
      const otherIds = [...new Set(msgs.flatMap(m => [m.sender_id, m.receiver_id]).filter(id => id !== currentUser.id && id !== otherUser.user_id))];
      if (otherIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', otherIds);
        setForwardUsers((profiles || []) as Profile[]);
      } else {
        setForwardUsers([]);
      }
    }
    setForwardMsg(msg);
  };

  const doForward = async (targetUserId: string) => {
    if (!currentUser || !forwardMsg) return;
    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: targetUserId,
      content: forwardMsg.text,
      type: forwardMsg.type || 'text',
      media_url: forwardMsg.mediaUrl || '',
    });
    setForwardMsg(null);
    setForwardUsers([]);
    toast.success(t('msgForwarded', language));
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await supabase.from('messages').insert({
        sender_id: currentUser.id,
        receiver_id: otherUser.user_id,
        content: '📷',
        type: 'photo',
        media_url: reader.result as string,
      });
      toast.success(t('photoSent', language));
    };
    reader.readAsDataURL(file);
    setMediaTab('none');
  };

  const handleVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await supabase.from('messages').insert({
        sender_id: currentUser.id,
        receiver_id: otherUser.user_id,
        content: '🎬',
        type: 'video',
        media_url: reader.result as string,
      });
      toast.success(t('videoSent', language));
    };
    reader.readAsDataURL(file);
    setMediaTab('none');
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

        recorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
          const duration = Math.max(1, Math.floor((Date.now() - recordingStartRef.current) / 1000));
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          const mins = Math.floor(duration / 60);
          const secs = duration % 60;

          if (currentUser) {
            await supabase.from('messages').insert({
              sender_id: currentUser.id,
              receiver_id: otherUser.user_id,
              content: `🎤 ${mins}:${secs.toString().padStart(2, '0')}`,
              type: 'voice',
              media_url: url,
            });
          }
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

  const addEmoji = (emoji: string) => setInput(prev => prev + emoji);

  const sendSticker = async (sticker: string) => {
    if (!currentUser) return;
    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: otherUser.user_id,
      content: sticker,
      type: 'sticker',
    });
    setShowEmoji(false);
  };

  const sendGif = async (gifUrl: string) => {
    if (!currentUser) return;
    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: otherUser.user_id,
      content: 'GIF',
      type: 'gif',
      media_url: gifUrl,
    });
    setShowEmoji(false);
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
            {otherUser.avatar_url ? (
              <img src={otherUser.avatar_url} alt={otherUser.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User size={20} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{otherUser.name}</h3>
            <span className={`text-xs ${otherUser.online ? 'text-emerald-400' : 'text-muted-foreground'}`}>
              {t(otherUser.online ? 'online' : 'offline', language)}
            </span>
          </div>
          <button
            onClick={() => setShowAdventure(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors group"
            title={t('adventureGenerator', language)}
          >
            <Sparkles size={20} className="text-primary group-hover:animate-pulse" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--primary) / 0.5))' }} />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {loading ? (
            <p className="text-center text-muted-foreground">{t('loading', language)}</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">{t('noResults', language)}</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  onContextMenu={(e) => handleMsgContextMenu(e, msg)}
                  onTouchStart={(e) => {
                    const timer = setTimeout(() => handleMsgContextMenu(e, msg), 500);
                    const clear = () => { clearTimeout(timer); e.currentTarget.removeEventListener('touchend', clear); };
                    e.currentTarget.addEventListener('touchend', clear);
                  }}
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm cursor-pointer select-none ${
                    msg.fromMe
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'glass-panel border border-border rounded-bl-md'
                  }`}
                >
                  {msg.replyTo && (
                    <div className={`mb-1.5 px-2 py-1 rounded-lg border-l-2 text-[11px] ${
                      msg.fromMe ? 'border-primary-foreground/40 bg-primary-foreground/10' : 'border-primary/40 bg-primary/5'
                    }`}>
                      <span className="font-semibold block">{msg.replyTo.name}</span>
                      <span className="opacity-70 line-clamp-1">{msg.replyTo.text}</span>
                    </div>
                  )}
                  {msg.type === 'photo' && msg.mediaUrl && (
                    <img src={msg.mediaUrl} alt="photo" className="rounded-xl max-w-full mb-1" />
                  )}
                  {msg.type === 'video' && msg.mediaUrl && (
                    <video src={msg.mediaUrl} controls className="rounded-xl max-w-full mb-1" />
                  )}
                  {msg.type === 'gif' && msg.mediaUrl && (
                    <img src={msg.mediaUrl} alt="gif" className="rounded-xl max-w-full mb-1" />
                  )}
                  {msg.type === 'sticker' && (
                    <span className="text-4xl block mb-1">{msg.text}</span>
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
                  {msg.type !== 'sticker' && <p>{msg.text}</p>}
                  <span className={`text-[10px] mt-1 block ${msg.fromMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                    {msg.time} {msg.edited && `· ${t('msgEdited', language)}`} {msg.fromMe && (msg.read ? '✓✓' : '✓')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Emoji/Stickers/GIF picker */}
        <AnimatePresence>
          {showEmoji && (
            <ChatEmojiStickers
              onSelectEmoji={addEmoji}
              onSendSticker={sendSticker}
              onSendGif={sendGif}
            />
          )}
        </AnimatePresence>

        {/* Attachment menu */}
        <AnimatePresence>
          {mediaTab === 'attach' && (
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
                  <span className="text-[10px]">{t('uploadPhoto', language)}</span>
                </button>
                <button onClick={() => videoRef.current?.click()} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary/30">
                    <Video size={18} />
                  </div>
                  <span className="text-[10px]">{t('videoSent', language).split(' ')[0]}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden inputs */}
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideo} />

        {/* Reply/Edit bar */}
        <AnimatePresence>
          {(replyTo || editingMsg) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-panel-strong border-t border-border/50 px-4 py-2 flex items-center gap-2"
            >
              {editingMsg ? <Edit2 size={14} className="text-primary shrink-0" /> : <Reply size={14} className="text-primary shrink-0" />}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-primary font-medium block">
                  {editingMsg ? t('msgEdit', language) : (replyTo!.fromMe ? t('navProfile', language) : otherUser.name)}
                </span>
                <span className="text-xs text-muted-foreground truncate block">
                  {editingMsg ? editingMsg.text : replyTo!.text}
                </span>
              </div>
              <button onClick={() => { setReplyTo(null); setEditingMsg(null); setInput(''); }} className="p-1 hover:bg-accent rounded">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div className="glass-panel-strong p-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setMediaTab(mediaTab === 'attach' ? 'none' : 'attach'); setShowEmoji(false); }}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
            >
              <Paperclip size={18} />
            </button>
            <button
              onClick={() => { setShowEmoji(!showEmoji); setMediaTab('none'); }}
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
              ) : (
                <Mic size={18} />
              )}
            </button>
            <button onClick={sendMessage} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <MessageContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          fromMe={contextMenu.msg.fromMe}
          hasMedia={!!contextMenu.msg.mediaUrl}
          mediaUrl={contextMenu.msg.mediaUrl}
          onClose={() => setContextMenu(null)}
          onDelete={() => { handleDeleteMsg(contextMenu.msg.id); setContextMenu(null); }}
          onEdit={() => { if (contextMenu.msg.fromMe) handleEditMsg(contextMenu.msg); setContextMenu(null); }}
          onReply={() => { handleReplyMsg(contextMenu.msg); setContextMenu(null); }}
          onCopy={() => { handleCopyMsg(contextMenu.msg); setContextMenu(null); }}
          onForward={() => { handleForwardMsg(contextMenu.msg); setContextMenu(null); }}
        />
      )}

      {/* Forward modal */}
      <AnimatePresence>
        {forwardMsg && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => { setForwardMsg(null); setForwardUsers([]); }} />
            <motion.div
              className="relative glass-panel-strong p-5 w-full max-w-sm rounded-2xl border border-border"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-sm font-semibold mb-3">{t('msgForward', language)}</h3>
              <div className="mb-3 px-3 py-2 rounded-xl bg-secondary/30 border border-border text-xs text-muted-foreground truncate">
                {forwardMsg.text}
              </div>
              {forwardUsers.length === 0 ? (
                <p className="text-center text-muted-foreground text-xs py-4">{t('noResults', language)}</p>
              ) : (
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {forwardUsers.map(u => (
                    <button
                      key={u.user_id}
                      onClick={() => doForward(u.user_id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
                        {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover rounded-full" /> : <User size={16} className="text-muted-foreground" />}
                      </div>
                      <span className="text-sm font-medium">{u.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => { setForwardMsg(null); setForwardUsers([]); }}
                className="mt-3 w-full py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('cancel', language)}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Adventure Plan Modal */}
      <AdventurePlanModal
        otherUserId={otherUser.user_id}
        otherUserName={otherUser.name}
        isOpen={showAdventure}
        onClose={() => setShowAdventure(false)}
      />
    </motion.div>
  );
}
