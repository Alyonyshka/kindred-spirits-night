import { useState, useRef, useEffect } from 'react';
import { User, Calendar, Handshake, Camera, X, MessageCircle, Ban, Star, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t, drinkKeys, alcoholLevelKeys, interestKeys, cityKeys } from '@/lib/i18n';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Profile as ProfileType } from '@/hooks/useAuth';
import { useBlocking } from '@/hooks/useBlocking';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from '@/components/ChatWindow';

interface MeetingWithProfile {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  other_profile?: ProfileType;
}

export default function Profile() {
  const { language, city, setCity, profile, updateProfile, signOut, user } = useApp();
  const { isBlocked, isBlockedByMe, blockUser, unblockUser } = useBlocking();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.name || '');
  const [age, setAge] = useState(String(profile?.age || ''));
  const [about, setAbout] = useState(profile?.about || '');
  const [drinks, setDrinks] = useState<string[]>(profile?.drinks || []);
  const [level, setLevel] = useState(profile?.alcohol_level || '');
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [avatar, setAvatar] = useState<string>(profile?.avatar_url || '');
  const [profileCity, setProfileCity] = useState(profile?.city || city);
  const [showDrinks, setShowDrinks] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showCities, setShowCities] = useState(false);

  const [showEventsModal, setShowEventsModal] = useState(false);
  const [showMeetingsModal, setShowMeetingsModal] = useState(false);
  const [expandedUser, setExpandedUser] = useState<ProfileType | null>(null);
  const [chatUser, setChatUser] = useState<ProfileType | null>(null);

  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [myMeetings, setMyMeetings] = useState<MeetingWithProfile[]>([]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(String(profile.age || ''));
      setAbout(profile.about || '');
      setDrinks(profile.drinks || []);
      setLevel(profile.alcohol_level || '');
      setInterests(profile.interests || []);
      setAvatar(profile.avatar_url || '');
      setProfileCity(profile.city || city);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data: participations } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', user.id);
      if (participations && participations.length > 0) {
        const eventIds = participations.map(p => p.event_id);
        const { data: events } = await supabase.from('events').select('*').in('id', eventIds);
        setMyEvents(events || []);
      }

      // My meetings - ALL where I'm involved
      const { data: meetings } = await supabase
        .from('meetings')
        .select('*')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (meetings && meetings.length > 0) {
        const otherIds = meetings.map(m => m.requester_id === user.id ? m.receiver_id : m.requester_id);
        const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', otherIds);
        const enriched: MeetingWithProfile[] = meetings.map(m => ({
          ...m,
          status: m.status || 'pending',
          other_profile: profiles?.find(p => p.user_id === (m.requester_id === user.id ? m.receiver_id : m.requester_id)) as ProfileType | undefined,
        }));
        setMyMeetings(enriched);
      } else {
        setMyMeetings([]);
      }
    };
    fetchData();

    const channel = supabase
      .channel('profile-meetings-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const toggleDrink = (d: string) => setDrinks(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleInterest = (i: string) => setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const handleSave = async () => {
    // Check if adventure-relevant fields changed
    const adventureFieldsChanged =
      JSON.stringify(drinks) !== JSON.stringify(profile?.drinks || []) ||
      level !== (profile?.alcohol_level || '') ||
      JSON.stringify(interests) !== JSON.stringify(profile?.interests || []);

    const { error } = await updateProfile({
      name,
      age: Number(age) || 18,
      about,
      drinks,
      alcohol_level: level,
      interests,
      avatar_url: avatar,
      city: profileCity,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setCity(profileCity);
      toast.success(t('profileSaved', language));

      // Regenerate adventure plans if relevant fields changed
      if (adventureFieldsChanged && user) {
        await supabase
          .from('adventure_plans')
          .delete()
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      }
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleMessageUser = (u: ProfileType) => {
    if (isBlocked(u.user_id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    setExpandedUser(null);
    setChatUser(u);
  };

  const handleMeetingRequest = async (u: ProfileType) => {
    if (!user) return;
    if (isBlocked(u.user_id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }
    await supabase.from('meetings').insert({ requester_id: user.id, receiver_id: u.user_id });
    toast.success(t('meetingRequestSent', language));
  };

  const handleToggleBlock = async (u: ProfileType) => {
    if (isBlockedByMe(u.user_id)) {
      await unblockUser(u.user_id);
      toast.success(t('userUnblocked', language));
    } else {
      await blockUser(u.user_id);
      toast.success(t('userBlocked', language));
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    await supabase.from('meetings').delete().eq('id', meetingId);
    setMyMeetings(prev => prev.filter(m => m.id !== meetingId));
    toast.success(t('msgDeleted', language));
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;
    const ev = myEvents.find((e: any) => e.id === eventId);
    if (ev?.creator_id === user.id) {
      await supabase.from('event_participants').delete().eq('event_id', eventId);
      await supabase.from('events').delete().eq('id', eventId);
    } else {
      await supabase.from('event_participants').delete().eq('event_id', eventId).eq('user_id', user.id);
    }
    setMyEvents(prev => prev.filter((e: any) => e.id !== eventId));
    toast.success(t('msgDeleted', language));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-400';
      case 'declined': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const shortcuts = [
    { icon: Calendar, label: t('navEvents', language), count: myEvents.length, action: () => setShowEventsModal(true) },
    { icon: Handshake, label: t('proposeMeeting', language), count: myMeetings.length, action: () => setShowMeetingsModal(true) },
  ];

  const renderUserCard = (u: ProfileType) => (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setExpandedUser(null)} />
      <motion.div className="relative glass-panel-strong p-6 w-full max-w-sm" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 avatar-glow mb-3 overflow-hidden">
            {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover rounded-full" /> : <User size={36} className="text-muted-foreground" />}
          </div>
          <h2 className="text-lg font-bold">{u.name}, {u.age}</h2>
          <p className="text-sm text-muted-foreground">{t(u.city, language)}</p>
          <p className="text-sm text-primary mt-1">{u.vibe}</p>
        </div>
        <div className="space-y-3 mb-4">
          <div><p className="text-xs text-muted-foreground mb-1">{t('aboutMe', language)}</p><p className="text-sm">{u.about}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">{t('drinks', language)}</p>
            <div className="flex flex-wrap gap-1">{(u.drinks || []).map(d => <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">{t(d, language)}</span>)}</div>
          </div>
          <div><p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
            <div className="flex flex-wrap gap-1">{(u.interests || []).map(i => <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">{t(i, language)}</span>)}</div>
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= Math.round(u.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />)}
            <span className="text-xs text-muted-foreground ml-1">{u.rating} ({u.rating_count})</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleMessageUser(u)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"><MessageCircle size={14} />{t('sendMessage', language)}</button>
          <button onClick={() => handleMeetingRequest(u)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"><Handshake size={14} />{t('proposeMeeting', language)}</button>
          <button onClick={() => handleToggleBlock(u)} className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${isBlockedByMe(u.user_id) ? 'border-destructive/30 text-destructive bg-destructive/10' : 'border-destructive/30 text-muted-foreground hover:text-destructive'}`}>
            <Ban size={14} />{t(isBlockedByMe(u.user_id) ? 'unblockUser' : 'blockUser', language)}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-border overflow-hidden">
            {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={40} className="text-muted-foreground" />}
          </div>
          <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-card">
            <Camera size={14} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
      </div>

      {/* Form */}
      <div className="glass-panel p-4 space-y-3">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('profileName', language)} className="w-full px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all" />
        <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder={t('age', language)} min={18} max={99} className="w-full px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all" />
        <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder={t('aboutMe', language)} rows={3} className="w-full px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all resize-none" />

        {/* City selector */}
        <div>
          <button onClick={() => setShowCities(!showCities)} className={`w-full px-4 py-2.5 rounded-2xl text-sm text-left border transition-all ${profileCity ? 'amber-border-glow text-primary' : 'border-border text-muted-foreground'} bg-secondary/30`}>
            {t('myCity', language)}: {t(profileCity, language)}
          </button>
          {showCities && (
            <div className="mt-2 glass-panel-strong p-3 grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto scrollbar-hide">
              {cityKeys.map(c => (
                <button key={c} onClick={() => { setProfileCity(c); setShowCities(false); }} className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${profileCity === c ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                  {t(c, language)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Drinks selector */}
        <div>
          <button onClick={() => setShowDrinks(!showDrinks)} className={`w-full px-4 py-2.5 rounded-2xl text-sm text-left border transition-all ${drinks.length > 0 ? 'amber-border-glow text-primary' : 'border-border text-muted-foreground'} bg-secondary/30`}>
            {t('drinks', language)} {drinks.length > 0 && `(${drinks.length})`}
          </button>
          {showDrinks && (
            <div className="mt-2 glass-panel-strong p-3 flex flex-wrap gap-1.5">
              {drinkKeys.map(d => (
                <button key={d} onClick={() => toggleDrink(d)} className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${drinks.includes(d) ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                  {t(d, language)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alcohol level */}
        <div>
          <button onClick={() => setShowLevel(!showLevel)} className={`w-full px-4 py-2.5 rounded-2xl text-sm text-left border transition-all ${level ? 'amber-border-glow text-primary' : 'border-border text-muted-foreground'} bg-secondary/30`}>
            {t('drinkAmount', language)}{level ? `: ${t(level, language)}` : ''}
          </button>
          {showLevel && (
            <div className="mt-2 glass-panel-strong p-3 grid grid-cols-2 gap-1.5">
              {alcoholLevelKeys.map(l => (
                <button key={l} onClick={() => { setLevel(l === level ? '' : l); setShowLevel(false); }} className={`px-3 py-3 rounded-xl text-xs font-medium border whitespace-nowrap transition-all text-center ${level === l ? 'bg-primary/15 text-primary amber-border-glow' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                  {t(l, language)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Interests selector */}
        <div>
          <button onClick={() => setShowInterests(!showInterests)} className={`w-full px-4 py-2.5 rounded-2xl text-sm text-left border transition-all ${interests.length > 0 ? 'amber-border-glow text-primary' : 'border-border text-muted-foreground'} bg-secondary/30`}>
            {t('interests', language)} {interests.length > 0 && `(${interests.length})`}
          </button>
          {showInterests && (
            <div className="mt-2 glass-panel-strong p-3 flex flex-wrap gap-1.5">
              {interestKeys.map(i => (
                <button key={i} onClick={() => toggleInterest(i)} className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${interests.includes(i) ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                  {t(i, language)}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleSave} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
          {t('save', language)}
        </button>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-2 gap-2">
        {shortcuts.map(({ icon: Icon, label, count, action }) => (
          <button key={label} onClick={action} className="glass-panel p-3 flex items-center gap-2 card-hover">
            <Icon size={18} className="text-primary" />
            <span className="text-sm font-medium flex-1 text-left">{label}</span>
            <span className="bg-primary/15 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{count}</span>
          </button>
        ))}
      </div>

      {/* Log out */}
      <button onClick={signOut} className="w-full py-3 rounded-2xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2">
        <LogOut size={16} />
        {t('logOut', language)}
      </button>

      {/* My Events Modal */}
      <AnimatePresence>
        {showEventsModal && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setShowEventsModal(false)} />
            <motion.div className="relative glass-panel-strong p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto scrollbar-hide" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold amber-glow">{t('myEvents', language)}</h2>
                <button onClick={() => setShowEventsModal(false)} className="p-1 rounded-lg hover:bg-accent"><X size={20} /></button>
              </div>
              {myEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('noEvents', language)}</p>
              ) : (
                <div className="space-y-3">
                  {myEvents.map((ev: any) => (
                    <div key={ev.id} className="glass-panel p-3 flex items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-sm amber-glow">{ev.title}</h3>
                        <p className="text-xs text-muted-foreground">{ev.date} • {ev.time}</p>
                        <p className="text-xs text-muted-foreground">{ev.location}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Meetings Modal */}
      <AnimatePresence>
        {showMeetingsModal && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setShowMeetingsModal(false)} />
            <motion.div className="relative glass-panel-strong p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto scrollbar-hide" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold amber-glow">{t('myMeetings', language)}</h2>
                <button onClick={() => setShowMeetingsModal(false)} className="p-1 rounded-lg hover:bg-accent"><X size={20} /></button>
              </div>
              {myMeetings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('noMeetings', language)}</p>
              ) : (
                <div className="space-y-3">
                  {myMeetings.map((meeting) => (
                    <div key={meeting.id} className="glass-panel p-3 flex items-center gap-3 card-hover cursor-pointer" onClick={() => { if (meeting.other_profile) { setShowMeetingsModal(false); setExpandedUser(meeting.other_profile); } }}>
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
                        {meeting.other_profile?.avatar_url ? <img src={meeting.other_profile.avatar_url} alt={meeting.other_profile.name} className="w-full h-full object-cover rounded-full" /> : <User size={24} className="text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{meeting.other_profile?.name || 'User'}</h3>
                        <p className="text-xs text-muted-foreground">{new Date(meeting.created_at).toLocaleDateString()}</p>
                        <p className={`text-xs font-medium ${getStatusColor(meeting.status)}`}>
                          {t(meeting.status, language)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteMeeting(meeting.id); }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{expandedUser && renderUserCard(expandedUser)}</AnimatePresence>
      <AnimatePresence>{chatUser && <ChatWindow user={chatUser} onClose={() => setChatUser(null)} />}</AnimatePresence>
    </div>
  );
}
