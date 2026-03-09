import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';

interface AdventurePlanModalProps {
  otherUserId: string;
  otherUserName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdventurePlanModal({ otherUserId, otherUserName, isOpen, onClose }: AdventurePlanModalProps) {
  const { language } = useApp();
  const [plan, setPlan] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchOrGeneratePlan();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  // Typewriter animation
  useEffect(() => {
    if (!plan || animating) return;
    setAnimating(true);
    setDisplayedText('');
    let i = 0;
    const typeNext = () => {
      if (i < plan.length) {
        setDisplayedText(plan.slice(0, i + 1));
        i++;
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
        timerRef.current = setTimeout(typeNext, 12);
      } else {
        setAnimating(false);
      }
    };
    typeNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [plan]);

  const fetchOrGeneratePlan = async () => {
    setLoading(true);
    setPlan('');
    setDisplayedText('');
    try {
      const { data, error } = await supabase.functions.invoke('generate-adventure', {
        body: { other_user_id: otherUserId },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setPlan(data.plan || '');
    } catch (e: any) {
      console.error(e);
      toast.error(t('loading', language));
    } finally {
      setLoading(false);
    }
  };

  const handleSkipAnimation = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayedText(plan);
    setAnimating(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          style={{
            background: 'linear-gradient(145deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)',
            border: '1px solid hsl(var(--primary) / 0.3)',
            boxShadow: '0 0 40px hsl(var(--primary) / 0.15), 0 0 80px hsl(var(--primary) / 0.05)',
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-primary/20 flex items-center justify-between"
            style={{ background: 'linear-gradient(90deg, hsl(var(--primary) / 0.1), transparent)' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-primary animate-pulse" />
              <div>
                <h3 className="font-bold text-sm neon-title" style={{
                  textShadow: '0 0 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)',
                  color: 'hsl(var(--primary))',
                }}>
                  {t('missionNight', language)}
                </h3>
                <p className="text-[10px] text-muted-foreground">{otherUserName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 scrollbar-hide" onClick={animating ? handleSkipAnimation : undefined}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 size={32} className="text-primary animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse">
                  {t('generatingPlan', language)}
                </p>
              </div>
            ) : displayedText ? (
              <div className="space-y-1">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                  {displayedText}
                  {animating && (
                    <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
                  )}
                </pre>
                {animating && (
                  <p className="text-[10px] text-muted-foreground text-center mt-3 animate-pulse">
                    {t('tapToSkip', language)}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm py-8">{t('noResults', language)}</p>
            )}
          </div>

          {/* Neon bottom bar */}
          <div className="h-1 w-full" style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
            boxShadow: '0 0 10px hsl(var(--primary) / 0.5)',
          }} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
