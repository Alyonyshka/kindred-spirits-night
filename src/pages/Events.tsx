import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, MapPin, Users, Clock, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t, drinkKeys } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DbEvent {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  drink: string;
  max_participants: number;
  status: string;
  created_at: string;
  participant_count?: number;
  joined?: boolean;
}

export default function Events() {
  const { language, user } = useApp();
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showParticipants, setShowParticipants] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDrink, setNewDrink] = useState('beer');
  const [newMax, setNewMax] = useState('8');

  const fetchEvents = async () => {
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (!eventsData) { setLoading(false); return; }

    // Get participant counts and user's participation
    const { data: participants } = await supabase
      .from('event_participants')
      .select('event_id, user_id');

    const enriched = eventsData.map(e => ({
      ...e,
      participant_count: (participants || []).filter(p => p.event_id === e.id).length,
      joined: (participants || []).some(p => p.event_id === e.id && p.user_id === user?.id),
    }));

    setEvents(enriched);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();

    // Realtime subscriptions
    const eventsChannel = supabase
      .channel('events-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchEvents())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_participants' }, () => fetchEvents())
      .subscribe();

    return () => { supabase.removeChannel(eventsChannel); };
  }, [user?.id]);

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event || !user) return;

    if (event.joined) {
      await supabase.from('event_participants').delete().eq('event_id', eventId).eq('user_id', user.id);
      toast.success(t('leftEvent', language));
    } else {
      if ((event.participant_count || 0) >= event.max_participants) return;
      await supabase.from('event_participants').insert({ event_id: eventId, user_id: user.id, status: 'confirmed' });
      toast.success(t('joinedEvent', language));
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newDate || !newTime || !user) return;
    const { data, error } = await supabase.from('events').insert({
      creator_id: user.id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      date: newDate,
      time: newTime,
      location: newLocation.trim(),
      drink: newDrink,
      max_participants: Math.max(2, Math.min(99, Number(newMax) || 8)),
      status: 'confirmed',
    }).select().single();

    if (error) { toast.error(error.message); return; }
    // Auto-join as creator
    if (data) {
      await supabase.from('event_participants').insert({ event_id: data.id, user_id: user.id, status: 'confirmed' });
    }
    setShowCreate(false);
    setNewTitle(''); setNewDesc(''); setNewDate(''); setNewTime(''); setNewLocation(''); setNewDrink('beer'); setNewMax('8');
    toast.success(t('eventCreated', language));
  };

  const inputClass = "w-full px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all";

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">{t('loading', language)}</div>;
  }

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
                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20 whitespace-nowrap">
                    {t(event.drink || 'beer', language)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${
                    event.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    event.status === 'cancelled' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                    'bg-primary/5 text-muted-foreground border-border'
                  }`}>
                    {t(event.status || 'pending', language)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {event.participant_count || 0}/{event.max_participants}</span>
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
                  {t('participants', language)} ({event.participant_count || 0})
                </button>
              </div>
              {showParticipants === event.id && (
                <div className="glass-panel p-3 text-xs text-muted-foreground">
                  {t('participants', language)}: {event.participant_count || 0} / {event.max_participants}
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
