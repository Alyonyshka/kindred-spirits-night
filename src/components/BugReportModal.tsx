import { useState } from 'react';
import { X, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BugReportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BugReportModal({ open, onClose }: BugReportModalProps) {
  const { language, user } = useApp();
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('bug_reports').insert({
        user_id: user?.id || null,
        screen_url: window.location.href,
        description: description.trim(),
      });

      if (error) {
        console.error('Bug report insert error:', error);
        toast.error(t('bugReportError', language));
      } else {
        toast.success(t('bugReportThanks', language));
        setDescription('');
        onClose();
      }
    } catch (err) {
      console.error('Bug report submit error:', err);
      toast.error(t('bugReportError', language));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            className="relative glass-panel-strong p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bug size={20} className="text-primary" />
                <h2 className="text-lg font-bold amber-glow">
                  {t('bugReportTitle', language)}
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  {t('bugReportDescription', language)}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('bugReportPlaceholder', language)}
                  rows={4}
                  className="w-full rounded-xl bg-accent/50 border border-border/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('sending', language) : t('bugReportSend', language)}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
