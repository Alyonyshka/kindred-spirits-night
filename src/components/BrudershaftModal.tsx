import { useEffect, useState } from 'react';
import { X, Beer, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';

interface BrudershaftModalProps {
  otherUserId: string;
  otherUserName: string;
  onClose: () => void;
}

interface MeetingRow {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  brudershaft_code: string | null;
  brudershaft_initiator_id: string | null;
  met_at: string | null;
}

const genCode = () => Math.floor(1000 + Math.random() * 9000).toString();

export default function BrudershaftModal({ otherUserId, otherUserName, onClose }: BrudershaftModalProps) {
  const { language, user: currentUser } = useApp();
  const [meeting, setMeeting] = useState<MeetingRow | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Load meeting state + subscribe
  const fetchMeeting = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from('meetings')
      .select('*')
      .or(`and(requester_id.eq.${currentUser.id},receiver_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    setMeeting((data as MeetingRow) || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchMeeting();
    const ch = supabase
      .channel(`brudershaft-${otherUserId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => fetchMeeting())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [currentUser?.id, otherUserId]);

  const startBrudershaft = async () => {
    if (!currentUser) return;
    const code = genCode();
    if (meeting) {
      await supabase.from('meetings').update({
        brudershaft_code: code,
        brudershaft_initiator_id: currentUser.id,
      }).eq('id', meeting.id);
    } else {
      await supabase.from('meetings').insert({
        requester_id: currentUser.id,
        receiver_id: otherUserId,
        status: 'pending',
        brudershaft_code: code,
        brudershaft_initiator_id: currentUser.id,
      });
    }
    fetchMeeting();
  };

  const submitCode = async () => {
    if (!currentUser || !meeting) return;
    if (!meeting.brudershaft_code || meeting.brudershaft_code !== inputCode.trim()) {
      toast.error(t('brudershaftWrong', language));
      return;
    }
    const { error } = await supabase.from('meetings').update({
      met_at: new Date().toISOString(),
      status: 'confirmed',
      brudershaft_code: null,
    }).eq('id', meeting.id);
    if (error) { toast.error(error.message); return; }
    toast.success(t('brudershaftConfirmed', language));
    setInputCode('');
    fetchMeeting();
  };

  const isConfirmed = !!meeting?.met_at;
  const hasOpenCode = !!meeting?.brudershaft_code;
  const iAmInitiator = meeting?.brudershaft_initiator_id === currentUser?.id;

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative glass-panel-strong p-6 w-full max-w-sm rounded-2xl border border-primary/30"
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-accent"><X size={18} /></button>

        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-3 avatar-glow">
            <Beer size={28} className="text-primary" />
          </div>
          <h2 className="text-lg font-bold amber-glow">{t('brudershaftTitle', language)}</h2>
          <p className="text-xs text-muted-foreground mt-1">{otherUserName}</p>
        </div>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground py-6">{t('loading', language)}</p>
        ) : isConfirmed ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Check size={24} className="text-emerald-400" />
            </div>
            <p className="text-sm">{t('brudershaftAlreadyDone', language)}</p>
          </div>
        ) : hasOpenCode && iAmInitiator ? (
          // Initiator: show code, wait for partner
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground text-center">{t('brudershaftDesc', language)}</p>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t('brudershaftYourCode', language)}</p>
              <div className="text-5xl font-bold amber-glow tracking-[0.5em] py-3">{meeting!.brudershaft_code}</div>
            </div>
            <p className="text-center text-xs text-primary/80 animate-pulse">{t('brudershaftWaiting', language)}</p>
          </div>
        ) : hasOpenCode && !iAmInitiator ? (
          // Receiver: input code
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground text-center">{t('brudershaftDesc', language)}</p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              className="w-full text-center text-3xl font-bold tracking-[0.5em] py-3 rounded-2xl bg-secondary/30 border border-border focus:outline-none focus:amber-border-glow"
            />
            <button
              onClick={submitCode}
              disabled={inputCode.length !== 4}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('brudershaftConfirm', language)}
            </button>
          </div>
        ) : (
          // No active code: offer both options
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center">{t('brudershaftDesc', language)}</p>
            <button
              onClick={startBrudershaft}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {t('weMet', language)}
            </button>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder={t('brudershaftEnterCode', language)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow"
              />
              <button
                onClick={submitCode}
                disabled={inputCode.length !== 4}
                className="px-4 py-2.5 rounded-2xl border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('brudershaftConfirm', language)}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
