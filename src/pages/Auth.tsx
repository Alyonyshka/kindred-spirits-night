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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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
        if (!acceptedTerms) {
          toast.error(t('mustAcceptTerms', language));
          return;
        }
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message || String(result.error));
      }
      if (result.redirected) {
        return;
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
          {isSignUp && !isForgot && (
            <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary shrink-0 cursor-pointer"
              />
              <span className="leading-snug">
                {t('termsAgreementPrefix', language)}{' '}
                <a href="/terms" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                  {t('termsAgreementLink', language)}
                </a>{' '}
                {t('termsAgreementAnd', language)}{' '}
                <a href="/privacy" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                  {t('termsAgreementPrivacy', language)}
                </a>
                .
              </span>
            </label>
          )}
          <button
            type="submit"
            disabled={loading || (isSignUp && !isForgot && !acceptedTerms)}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : t(isForgot ? 'resetPassword' : isSignUp ? 'signUp' : 'signIn', language)}
          </button>
        </form>

        {!isForgot && (
          <div className="mt-4">
            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-background px-3 text-xs text-muted-foreground uppercase tracking-wider">
                {t('orDivider', language)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white text-foreground font-semibold text-sm border border-border hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.58-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.166.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.823.957 4.042l3.007-2.332z" />
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.436 1.346l2.578-2.578C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
              </svg>
              {t('signInWithGoogle', language)}
            </button>
          </div>
        )}

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
