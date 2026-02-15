import { useState } from 'react';
import { Plus, Search, Calendar, MapPin, Users, Clock, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t, drinkKeys } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface MockEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  drink: string;
  joined?: boolean;
}

const initialEvents: MockEvent[] = [
  {
    id: '1', title: 'Вечер виски', description: 'Дегустация односолодового виски в уютном баре',
    date: '2026-02-20', time: '20:00', location: 'Bar "Whiskey Room", Киев',
    participants: 4, maxParticipants: 8, drink: 'whiskey'
  },
  {
    id: '2', title: 'Крафтовая пятница', description: 'Пробуем новинки локальных пивоварен',
    date: '2026-02-21', time: '19:00', location: 'Craft Pub, Киев',
    participants: 6, maxParticipants: 12, drink: 'beer'
  },
  {
    id: '3', title: 'Коктейльный мастер-класс', description: 'Учимся делать классические коктейли',
    date: '2026-02-22', time: '18:30', location: 'MixBar Academy, Одесса',
    participants: 2, maxParticipants: 6, drink: 'gin'
  },
];

export default function Events() {
  const { language } = useApp();
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState(initialEvents);
  const [showCreate, setShowCreate] = useState(false);
  const [showParticipants, setShowParticipants] = useState<string | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDrink, setNewDrink] = useState('beer');
  const [newMax, setNewMax] = useState('8');

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        if (e.joined) {
          toast.success(t('leftEvent', language));
          return { ...e, joined: false, participants: e.participants - 1 };
        }
        if (e.participants >= e.maxParticipants) return e;
        toast.success(t('joinedEvent', language));
        return { ...e, joined: true, participants: e.participants + 1 };
      }
      return e;
    }));
  };

  const handleCreate = () => {
    if (!newTitle.trim() || !newDate || !newTime) return;
    const newEvent: MockEvent = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      date: newDate,
      time: newTime,
      location: newLocation.trim(),
      participants: 1,
      maxParticipants: Math.max(2, Math.min(99, Number(newMax) || 8)),
      drink: newDrink,
      joined: true,
    };
    setEvents(prev => [newEvent, ...prev]);
    setShowCreate(false);
    setNewTitle(''); setNewDesc(''); setNewDate(''); setNewTime(''); setNewLocation(''); setNewDrink('beer'); setNewMax('8');
    toast.success(t('eventCreated', language));
  };

  const inputClass = "w-full px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchEvents', language)}
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl glass-panel border border-border bg-secondary/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">{t('createEvent', language)}</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar size={32} className="mx-auto mb-2 opacity-30" />
          <p>{t('noEventsFound', language)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(event => (
            <div key={event.id} className="glass-panel p-4 card-hover space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold amber-glow">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20 whitespace-nowrap">
                  {t(event.drink, language)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {event.participants}/{event.maxParticipants}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleJoin(event.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                    event.joined
                      ? 'bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {t(event.joined ? 'leave' : 'join', language)}
                </button>
                <button
                  onClick={() => setShowParticipants(showParticipants === event.id ? null : event.id)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('participants', language)} ({event.participants})
                </button>
              </div>
              {showParticipants === event.id && (
                <div className="glass-panel p-3 text-xs text-muted-foreground">
                  {t('participants', language)}: {event.participants} / {event.maxParticipants}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
            <motion.div
              className="relative glass-panel-strong p-6 w-full max-w-md max-h-[85vh] overflow-y-auto scrollbar-hide"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold amber-glow">{t('createEvent', language)}</h2>
                <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-accent transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={t('eventName', language)} className={inputClass} />
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={t('eventDescription', language)} rows={3} className={`${inputClass} resize-none`} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className={inputClass} />
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className={inputClass} />
                </div>
                <input type="text" value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder={t('eventLocation', language)} className={inputClass} />
                <div className="grid grid-cols-2 gap-2">
                  <select value={newDrink} onChange={e => setNewDrink(e.target.value)} className={inputClass}>
                    {drinkKeys.map(d => (
                      <option key={d} value={d}>{t(d, language)}</option>
                    ))}
                  </select>
                  <input type="number" value={newMax} onChange={e => setNewMax(e.target.value)} min={2} max={99} placeholder={t('maxParticipants', language)} className={inputClass} />
                </div>
                <button onClick={handleCreate} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                  {t('createEvent', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
