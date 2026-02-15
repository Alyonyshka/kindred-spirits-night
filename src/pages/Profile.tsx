import { useState, useRef } from 'react';
import { User, Calendar, Handshake, Camera, X, MessageCircle, Ban, Star } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t, drinkKeys, alcoholLevelKeys, interestKeys, cityKeys } from '@/lib/i18n';
import { toast } from 'sonner';
import { mockUsers, MockUser } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from '@/components/ChatWindow';

export default function Profile() {
  const { language, city, setCity } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(() => localStorage.getItem('profile-name') || '');
  const [age, setAge] = useState(() => localStorage.getItem('profile-age') || '');
  const [about, setAbout] = useState(() => localStorage.getItem('profile-about') || '');
  const [drinks, setDrinks] = useState<string[]>(() => JSON.parse(localStorage.getItem('profile-drinks') || '[]'));
  const [level, setLevel] = useState(() => localStorage.getItem('profile-level') || '');
  const [interests, setInterests] = useState<string[]>(() => JSON.parse(localStorage.getItem('profile-interests') || '[]'));
  const [avatar, setAvatar] = useState<string>(() => localStorage.getItem('profile-avatar') || '');
  const [profileCity, setProfileCity] = useState(() => localStorage.getItem('profile-city') || city);
  const [showDrinks, setShowDrinks] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showCities, setShowCities] = useState(false);

  // Modals
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [showMeetingsModal, setShowMeetingsModal] = useState(false);
  const [expandedUser, setExpandedUser] = useState<MockUser | null>(null);
  const [chatUser, setChatUser] = useState<MockUser | null>(null);

  // Mock data for joined events and meetings
  const myEvents = [
    { id: '1', title: 'Вечер виски', date: '2026-02-20', time: '20:00', location: 'Bar "Whiskey Room"' },
    { id: '2', title: 'Крафтовая пятница', date: '2026-02-21', time: '19:00', location: 'Craft Pub' },
  ];
  const myMeetings = mockUsers.slice(2, 5);

  const toggleDrink = (d: string) => setDrinks(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleInterest = (i: string) => setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const handleSave = () => {
    localStorage.setItem('profile-name', name);
    localStorage.setItem('profile-age', age);
    localStorage.setItem('profile-about', about);
    localStorage.setItem('profile-drinks', JSON.stringify(drinks));
    localStorage.setItem('profile-level', level);
    localStorage.setItem('profile-interests', JSON.stringify(interests));
    localStorage.setItem('profile-avatar', avatar);
    localStorage.setItem('profile-city', profileCity);
    setCity(profileCity);
    toast.success(t('profileSaved', language));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleMessageUser = (user: MockUser) => {
    setExpandedUser(null);
    setChatUser(user);
  };

  const handleMeetingUser = (user: MockUser) => {
    toast.success(t('meetingRequestSent', language));
  };

  const handleBlockUser = (user: MockUser) => {
    toast.success(t('userBlocked', language));
  };

  const shortcuts = [
    { icon: Calendar, label: t('navEvents', language), count: myEvents.length, action: () => setShowEventsModal(true) },
    { icon: Handshake, label: t('proposeMeeting', language), count: myMeetings.length, action: () => setShowMeetingsModal(true) },
  ];

  const renderUserCard = (user: MockUser) => (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setExpandedUser(null)} />
      <motion.div className="relative glass-panel-strong p-6 w-full max-w-sm" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 avatar-glow mb-3 overflow-hidden">
            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" /> : <User size={36} className="text-muted-foreground" />}
          </div>
          <h2 className="text-lg font-bold">{user.name}, {user.age}</h2>
          <p className="text-sm text-muted-foreground">{t(user.city, language)}</p>
          <p className="text-sm text-primary mt-1">{user.vibe}</p>
        </div>
        <div className="space-y-3 mb-4">
          <div><p className="text-xs text-muted-foreground mb-1">{t('aboutMe', language)}</p><p className="text-sm">{user.about}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">{t('drinks', language)}</p>
            <div className="flex flex-wrap gap-1">{user.drinks.map(d => <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">{t(d, language)}</span>)}</div>
          </div>
          <div><p className="text-xs text-muted-foreground mb-1">{t('interests', language)}</p>
            <div className="flex flex-wrap gap-1">{user.interests.map(i => <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">{t(i, language)}</span>)}</div>
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= Math.round(user.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/30'} />)}
            <span className="text-xs text-muted-foreground ml-1">{user.rating.toFixed(1)} ({user.ratingCount})</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleMessageUser(user)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"><MessageCircle size={14} />{t('sendMessage', language)}</button>
          <button onClick={() => handleMeetingUser(user)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"><Handshake size={14} />{t('proposeMeeting', language)}</button>
          <button onClick={() => handleBlockUser(user)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-destructive/30 text-muted-foreground hover:text-destructive transition-all"><Ban size={14} />{t('blockUser', language)}</button>
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
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {alcoholLevelKeys.map(l => (
            <button key={l} onClick={() => setLevel(l === level ? '' : l)} className={`px-3 py-2 rounded-xl text-xs font-medium border whitespace-nowrap transition-all ${level === l ? 'bg-primary/15 text-primary amber-border-glow' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              {t(l, language)}
            </button>
          ))}
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

      {/* Shortcuts - only Events and Meetings */}
      <div className="grid grid-cols-2 gap-2">
        {shortcuts.map(({ icon: Icon, label, count, action }) => (
          <button key={label} onClick={action} className="glass-panel p-3 flex items-center gap-2 card-hover">
            <Icon size={18} className="text-primary" />
            <span className="text-sm font-medium flex-1 text-left">{label}</span>
            <span className="bg-primary/15 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{count}</span>
          </button>
        ))}
      </div>

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
                  {myEvents.map(ev => (
                    <div key={ev.id} className="glass-panel p-3 space-y-1">
                      <h3 className="font-semibold text-sm amber-glow">{ev.title}</h3>
                      <p className="text-xs text-muted-foreground">{ev.date} • {ev.time}</p>
                      <p className="text-xs text-muted-foreground">{ev.location}</p>
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
                  {myMeetings.map(user => (
                    <div key={user.id} className="glass-panel p-3 flex items-center gap-3 card-hover cursor-pointer" onClick={() => { setShowMeetingsModal(false); setExpandedUser(user); }}>
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
                        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" /> : <User size={24} className="text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{user.name}, {user.age}</h3>
                        <p className="text-xs text-muted-foreground">{user.vibe}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded user card */}
      <AnimatePresence>
        {expandedUser && renderUserCard(expandedUser)}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {chatUser && <ChatWindow user={chatUser} onClose={() => setChatUser(null)} />}
      </AnimatePresence>
    </div>
  );
}
