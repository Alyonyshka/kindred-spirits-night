import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';

export default function Auth() {
  const { language } = useApp();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full px-4 py-3 pl-11 rounded-2xl bg-secondary/30 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) toast.error(error.message);
        else toast.success(t('resetEmailSent', language));
        return;
      }
      if (isSignUp) {
        const { error } = await signUp(email, password, name);
        if (error) toast.error(error.message);
        else toast.success(t('checkEmail', language));
      } else {
        const { error } = await signIn(email, password);
        if (error) toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        className="glass-panel-strong p-8 w-full max-w-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black amber-glow-strong mb-1">
            {t('appName', language)}
          </h1>
          <p className="text-xs text-muted-foreground tracking-widest">
            {t('slogan', language)}
          </p>
        </div>

        <h2 className="text-lg font-bold mb-4 text-center">
          {t(isForgot ? 'forgotPassword' : isSignUp ? 'signUp' : 'signIn', language)}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="on">
          {isSignUp && !isForgot && (
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('profileName', language)}
                required
                className={inputClass}
              />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={inputClass}
            />
          </div>
          {!isForgot && (
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                name="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('password', language)}
                required
                minLength={6}
                className={inputClass}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : t(isForgot ? 'resetPassword' : isSignUp ? 'signUp' : 'signIn', language)}
          </button>
        </form>

        {!isForgot && !isSignUp && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            <button
              onClick={() => setIsForgot(true)}
              className="text-primary hover:underline font-medium"
            >
              {t('forgotPassword', language)}
            </button>
          </p>
        )}

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isForgot ? (
            <button onClick={() => setIsForgot(false)} className="text-primary hover:underline font-medium">
              {t('signIn', language)}
            </button>
          ) : (
            <>
              {t(isSignUp ? 'haveAccount' : 'noAccount', language)}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {t(isSignUp ? 'signIn' : 'signUp', language)}
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
