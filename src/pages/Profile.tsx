import { useState, useEffect, useRef } from 'react';
import { User, Heart, MessageCircle, Calendar, Handshake, Camera } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t, drinkKeys, alcoholLevelKeys, interestKeys, cityKeys } from '@/lib/i18n';
import { toast } from 'sonner';

export default function Profile() {
  const { language, setActiveTab, city, setCity } = useApp();
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
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const navigate = (tab: string) => {
    setActiveTab(tab);
    // Use router navigation via path
    const paths: Record<string, string> = { favorites: '/favorites', messages: '/messages', events: '/events' };
    if (paths[tab]) window.location.hash = ''; // will be handled by BottomNav click
  };

  const shortcuts = [
    { icon: Heart, label: t('navFavorites', language), count: 3, path: '/favorites' },
    { icon: MessageCircle, label: t('navMessages', language), count: 5, path: '/messages' },
    { icon: Calendar, label: t('navEvents', language), count: 2, path: '/events' },
    { icon: Handshake, label: t('proposeMeeting', language), count: 1, path: '/messages' },
  ];

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-border overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-muted-foreground" />
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-card"
          >
            <Camera size={14} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
      </div>

      {/* Form */}
      <div className="glass-panel p-4 space-y-3">
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder={t('profileName', language)}
          className="w-full px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all"
        />
        <input
          type="number" value={age} onChange={e => setAge(e.target.value)}
          placeholder={t('age', language)} min={18} max={99}
          className="w-full px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all"
        />
        <textarea
          value={about} onChange={e => setAbout(e.target.value)}
          placeholder={t('aboutMe', language)} rows={3}
          className="w-full px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all resize-none"
        />

        {/* City selector */}
        <div>
          <button onClick={() => setShowCities(!showCities)}
            className={`w-full px-4 py-2.5 rounded-2xl text-sm text-left border transition-all ${profileCity ? 'amber-border-glow text-primary' : 'border-border text-muted-foreground'} bg-secondary/30`}
          >
            {t('myCity', language)}: {t(profileCity, language)}
          </button>
          {showCities && (
            <div className="mt-2 glass-panel-strong p-3 grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto scrollbar-hide">
              {cityKeys.map(c => (
                <button key={c} onClick={() => { setProfileCity(c); setShowCities(false); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    profileCity === c ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(c, language)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Drinks selector */}
        <div>
          <button onClick={() => setShowDrinks(!showDrinks)}
            className={`w-full px-4 py-2.5 rounded-2xl text-sm text-left border transition-all ${drinks.length > 0 ? 'amber-border-glow text-primary' : 'border-border text-muted-foreground'} bg-secondary/30`}
          >
            {t('drinks', language)} {drinks.length > 0 && `(${drinks.length})`}
          </button>
          {showDrinks && (
            <div className="mt-2 glass-panel-strong p-3 flex flex-wrap gap-1.5">
              {drinkKeys.map(d => (
                <button key={d} onClick={() => toggleDrink(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    drinks.includes(d) ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(d, language)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alcohol level */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {alcoholLevelKeys.map(l => (
            <button key={l} onClick={() => setLevel(l === level ? '' : l)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border whitespace-nowrap transition-all ${
                level === l ? 'bg-primary/15 text-primary amber-border-glow' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(l, language)}
            </button>
          ))}
        </div>

        {/* Interests selector */}
        <div>
          <button onClick={() => setShowInterests(!showInterests)}
            className={`w-full px-4 py-2.5 rounded-2xl text-sm text-left border transition-all ${interests.length > 0 ? 'amber-border-glow text-primary' : 'border-border text-muted-foreground'} bg-secondary/30`}
          >
            {t('interests', language)} {interests.length > 0 && `(${interests.length})`}
          </button>
          {showInterests && (
            <div className="mt-2 glass-panel-strong p-3 flex flex-wrap gap-1.5">
              {interestKeys.map(i => (
                <button key={i} onClick={() => toggleInterest(i)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    interests.includes(i) ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
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
        {shortcuts.map(({ icon: Icon, label, count, path }) => (
          <button
            key={label}
            onClick={() => window.location.href = path}
            className="glass-panel p-3 flex items-center gap-2 card-hover"
          >
            <Icon size={18} className="text-primary" />
            <span className="text-sm font-medium flex-1 text-left">{label}</span>
            <span className="bg-primary/15 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
