import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('passwordUpdated', language));
        navigate('/profile');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-muted-foreground">{t('loading', language)}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        className="glass-panel-strong p-8 w-full max-w-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-lg font-bold mb-4 text-center">
          {t('setNewPassword', language)}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="on">
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              name="new-password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('newPassword', language)}
              required
              minLength={6}
              className="w-full px-4 py-3 pl-11 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : t('setNewPassword', language)}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
