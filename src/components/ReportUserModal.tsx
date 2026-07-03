import { useState } from 'react';
import { X, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReportUserModalProps {
  open: boolean;
  reportedUserId: string;
  reportedUserName?: string;
  onClose: () => void;
}

const REASONS = [
  { key: 'inappropriate', labelKey: 'reportReasonInappropriate' },
  { key: 'fake', labelKey: 'reportReasonFake' },
  { key: 'spam', labelKey: 'reportReasonSpam' },
  { key: 'other', labelKey: 'reportReasonOther' },
] as const;

export default function ReportUserModal({ open, reportedUserId, reportedUserName, onClose }: ReportUserModalProps) {
  const { language, user } = useApp();
  const [reason, setReason] = useState<string>('inappropriate');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setReason('inappropriate');
    setDetails('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('reportError', language));
      return;
    }
    if (reason === 'other' && !details.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_id: reportedUserId,
      reason,
      details: details.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      console.error('Report insert error:', error);
      toast.error(t('reportError', language));
    } else {
      toast.success(t('reportSuccess', language));
      reset();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            className="relative glass-panel-strong p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flag size={20} className="text-destructive" />
                <h2 className="text-lg font-bold">
                  {t('reportTitle', language)}
                  {reportedUserName ? `: ${reportedUserName}` : ''}
                </h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="p-1 rounded-lg hover:bg-accent transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                {REASONS.map((r) => (
                  <label
                    key={r.key}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                      reason === r.key
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-border hover:border-primary/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={r.key}
                      checked={reason === r.key}
                      onChange={() => setReason(r.key)}
                      className="accent-primary"
                    />
                    <span className="text-sm">{t(r.labelKey, language)}</span>
                  </label>
                ))}
              </div>

              {reason === 'other' && (
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={t('reportDetailsPlaceholder', language)}
                  rows={3}
                  maxLength={1000}
                  className="w-full rounded-xl bg-accent/50 border border-border/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  required
                />
              )}

              <button
                type="submit"
                disabled={submitting || (reason === 'other' && !details.trim())}
                className="w-full py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('reportSend', language)}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
