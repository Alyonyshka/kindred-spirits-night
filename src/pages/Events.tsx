import { useState } from 'react';
import { Plus, Search, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';

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
}

const mockEvents: MockEvent[] = [
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

  const filtered = mockEvents.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

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
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
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
                <button className="px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  {t('join', language)}
                </button>
                <button className="px-4 py-2 rounded-xl text-xs font-medium border border-border text-muted-foreground hover:text-foreground transition-colors">
                  {t('participants', language)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
