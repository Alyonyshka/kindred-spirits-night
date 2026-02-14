import { useState } from 'react';
import { User, Heart, MessageCircle, Calendar, Handshake, Camera } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t, drinkKeys, alcoholLevelKeys, interestKeys } from '@/lib/i18n';

export default function Profile() {
  const { language } = useApp();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [about, setAbout] = useState('');
  const [drinks, setDrinks] = useState<string[]>([]);
  const [level, setLevel] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [showDrinks, setShowDrinks] = useState(false);
  const [showInterests, setShowInterests] = useState(false);

  const toggleDrink = (d: string) => setDrinks(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleInterest = (i: string) => setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const shortcuts = [
    { icon: Heart, label: t('navFavorites', language), count: 3 },
    { icon: MessageCircle, label: t('navMessages', language), count: 5 },
    { icon: Calendar, label: t('navEvents', language), count: 2 },
    { icon: Handshake, label: t('proposeMeeting', language), count: 1 },
  ];

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-border">
            <User size={40} className="text-muted-foreground" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-card">
            <Camera size={14} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="glass-panel p-4 space-y-3">
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder={t('eventName', language)}
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

        <button className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
          {t('save', language)}
        </button>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-2 gap-2">
        {shortcuts.map(({ icon: Icon, label, count }) => (
          <button key={label} className="glass-panel p-3 flex items-center gap-2 card-hover">
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
