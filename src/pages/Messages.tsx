import { useState, useEffect } from 'react';
import { User, Handshake, Ban, MessageCircle, Star, Check, X as XIcon, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBlocking } from '@/hooks/useBlocking';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from '@/components/ChatWindow';
import type { Profile } from '@/hooks/useAuth';

interface Meeting {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  requester_profile?: Profile;
  receiver_profile?: Profile;
}

interface ChatEntry {
  id: string;
  other_user: Profile;
  last_message: string;
  last_time: string;
  unread: number;
  online: boolean;
}

export default function Messages() {
  const { language, user } = useApp();
  const { isBlocked, isBlockedByMe, blockUser, unblockUser } = useBlocking();
  const [chatUser, setChatUser] = useState<Profile | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [chats, setChats] = useState<ChatEntry[]>([]);
  const [expandedUser, setExpandedUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('meetings')
      .select('*')
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .eq('status', 'pending');

    if (!data) return;

    const userIds = [...new Set(data.flatMap(m => [m.requester_id, m.receiver_id]))];
    const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', userIds);

    const enriched = data.map(m => ({
      ...m,
      requester_profile: profiles?.find(p => p.user_id === m.requester_id) as Profile | undefined,
      receiver_profile: profiles?.find(p => p.user_id === m.receiver_id) as Profile | undefined,
    }));

    setMeetings(enriched.filter(m => m.receiver_id === user.id));
  };

  const fetchChats = async () => {
    if (!user) return;

    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!msgs || msgs.length === 0) { setChats([]); return; }

    const chatMap = new Map<string, { last: typeof msgs[0]; unread: number }>();
    for (const msg of msgs) {
      const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!chatMap.has(otherId)) {
        chatMap.set(otherId, { last: msg, unread: 0 });
      }
      if (msg.receiver_id === user.id && !msg.read) {
        chatMap.get(otherId)!.unread++;
      }
    }

    const otherIds = [...chatMap.keys()];
    const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', otherIds);

    const chatEntries: ChatEntry[] = otherIds.map(uid => {
      const entry = chatMap.get(uid)!;
      const profile = profiles?.find(p => p.user_id === uid) as Profile;
      return {
        id: uid,
        other_user: profile || { id: '', user_id: uid, name: 'User', age: 0, avatar_url: '', city: '', drinks: [], alcohol_level: '', interests: [], vibe: '', about: '', online: false, rating: 0, rating_count: 0 },
        last_message: entry.last.content || '',
        last_time: new Date(entry.last.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: entry.unread,
        online: profile?.online || false,
      };
    });

    setChats(chatEntries);
  };

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchMeetings(), fetchChats()]).then(() => setLoading(false));

    const channel = supabase
      .channel('messages-page-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchChats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => fetchMeetings())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const handleAccept = async (meetingId: string) => {
    await supabase.from('meetings').update({ status: 'confirmed' }).eq('id', meetingId);
    toast.success(t('meetingAccepted', language));
  };

  const handleDecline = async (meetingId: string) => {
    await supabase.from('meetings').update({ status: 'declined' }).eq('id', meetingId);
    toast.success(t('meetingDeclined', language));
  };

  const handleOpenChat = async (profile: Profile) => {
    if (isBlocked(profile.user_id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    if (user) {
      await supabase.from('messages').update({ read: true }).eq('sender_id', profile.user_id).eq('receiver_id', user.id).eq('read', false);
    }
    setChatUser(profile);
  };

  const handleDeleteChat = async (e: React.MouseEvent, otherUserId: string) => {
    e.stopPropagation();
    if (!user) return;
    // Delete messages sent by current user to this person
    await supabase.from('messages').delete().eq('sender_id', user.id).eq('receiver_id', otherUserId);
    // Delete messages received from this person (RLS allows sender_id = auth.uid() only, so we need separate approach)
    // Since RLS only allows deleting own sent messages, we delete what we can
    await supabase.from('messages').delete().eq('sender_id', otherUserId).eq('receiver_id', user.id);
    setChats(prev => prev.filter(c => c.id !== otherUserId));
    toast.success(t('deleted', language));
  };

  const handleAvatarClick = (e: React.MouseEvent, profile: Profile) => {
    e.stopPropagation();
    setExpandedUser(profile);
  };

  const handleMessageUser = (profile: Profile) => {
    if (isBlocked(profile.user_id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    setExpandedUser(null);
    setChatUser(profile);
  };

  const handleMeetingRequest = async (profile: Profile) => {
    if (!user) return;
    if (isBlocked(profile.user_id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    await supabase.from('meetings').insert({ requester_id: user.id, receiver_id: profile.user_id });
    toast.success(t('meetingRequestSent', language));
  };

  const handleToggleBlock = async (profile: Profile) => {
    if (isBlockedByMe(profile.user_id)) {
      await unblockUser(profile.user_id);
      toast.success(t('userUnblocked', language));
    } else {
      await blockUser(profile.user_id);
      toast.success(t('userBlocked', language));
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">{t('loading', language)}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Meeting invites */}
      {meetings.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('proposeMeeting', language)}
          </h3>
          {meetings.map(meeting => {
            const profile = meeting.requester_profile;
            return (
              <div key={meeting.id} className="glass-panel p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) => profile && handleAvatarClick(e, profile)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border cursor-pointer hover:border-primary/30 transition-all overflow-hidden"
                  >
                    {profile?.avatar_url ? <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover rounded-full" /> : <User size={20} className="text-muted-foreground" />}
                  </div>
                  <div>
                    <span className="font-medium text-sm">{profile?.name || 'User'}</span>
                    <span className="block text-xs text-muted-foreground">{t('pending', language)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(meeting.id)} className="px-3 py-1.5 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1">
                    <Check size={12} />
                    {t('accept', language)}
                  </button>
                  <button onClick={() => handleDecline(meeting.id)} className="px-3 py-1.5 rounded-xl text-xs font-medium border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors flex items-center gap-1">
                    <XIcon size={12} />
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
        {chats.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-sm">{t('noResults', language)}</p>
        ) : (
          chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => handleOpenChat(chat.other_user)}
              className="glass-panel p-4 flex items-center gap-3 card-hover cursor-pointer"
            >
              <div className="relative">
                <div
                  onClick={(e) => handleAvatarClick(e, chat.other_user)}
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-border cursor-pointer hover:border-primary/30 transition-all overflow-hidden"
                >
                  {chat.other_user.avatar_url ? <img src={chat.other_user.avatar_url} alt={chat.other_user.name} className="w-full h-full object-cover rounded-full" /> : <User size={24} className="text-muted-foreground" />}
                </div>
                {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-card" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{chat.other_user.name}</span>
                  <span className="text-xs text-muted-foreground">{chat.last_time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.last_message}</p>
              </div>
              {chat.unread > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {chat.unread}
                </span>
              )}
              <button
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className="ml-1 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title={t('delete', language)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Profile card modal */}
      <AnimatePresence>
        {expandedUser && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setExpandedUser(null)} />
            <motion.div className="relative glass-panel-strong p-6 w-full max-w-sm" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 avatar-glow mb-3 overflow-hidden">
                  {expandedUser.avatar_url ? <img src={expandedUser.avatar_url} alt={expandedUser.name} className="w-full h-full object-cover rounded-full" /> : <User size={36} className="text-muted-foreground" />}
                </div>
                <h2 className="text-lg font-bold">{expandedUser.name}, {expandedUser.age}</h2>
                <p className="text-sm text-muted-foreground">{t(expandedUser.city, language)}</p>
                <p className="text-sm text-primary mt-1">{expandedUser.vibe}</p>
              </div>
              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-muted-foreground mb-1">{t('aboutMe', language)}</p><p className="text-sm">{expandedUser.about}</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">{t('drinks', language)}</p>
                  <div className="flex flex-wrap gap-1">{(expandedUser.drinks || []).map(d => <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">{t(d, language)}</span>)}</div>
                </div>
                <div><p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
                  <div className="flex flex-wrap gap-1">{(expandedUser.interests || []).map(i => <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">{t(i, language)}</span>)}</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= Math.round(expandedUser.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />)}
                  <span className="text-xs text-muted-foreground ml-1">{expandedUser.rating} ({expandedUser.rating_count})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleMessageUser(expandedUser)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all">
                  <MessageCircle size={14} />{t('sendMessage', language)}
                </button>
                <button onClick={() => handleMeetingRequest(expandedUser)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all">
                  <Handshake size={14} />{t('proposeMeeting', language)}
                </button>
                <button onClick={() => handleToggleBlock(expandedUser)} className={`col-span-2 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${isBlockedByMe(expandedUser.user_id) ? 'border-destructive/30 text-destructive bg-destructive/10' : 'border-destructive/30 text-muted-foreground hover:text-destructive'}`}>
                  <Ban size={14} />{t(isBlockedByMe(expandedUser.user_id) ? 'unblockUser' : 'blockUser', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {chatUser && <ChatWindow user={chatUser} onClose={() => { setChatUser(null); fetchChats(); }} />}
      </AnimatePresence>
    </div>
  );
}
