import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Phone, PhoneOff, User, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import type { Profile } from '@/hooks/useAuth';
import type { RealtimeChannel } from '@supabase/supabase-js';

type CallState =
  | { phase: 'idle' }
  | { phase: 'outgoing'; peer: Profile; callId: string; startedAt: number }
  | { phase: 'incoming'; peer: Profile; callId: string; startedAt: number }
  | { phase: 'active'; peer: Profile; callId: string; startedAt: number };

interface CallCtx {
  startCall: (peer: Profile) => Promise<void>;
  callState: CallState;
}

const CallContext = createContext<CallCtx | null>(null);

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used within CallManager');
  return ctx;
}

function userChannelName(userId: string) {
  return `call-user-${userId}`;
}

export default function CallManager({ children }: { children: ReactNode }) {
  const { user, profile, language } = useApp();
  const [callState, setCallState] = useState<CallState>({ phase: 'idle' });
  const [muted, setMuted] = useState(false);
  const [now, setNow] = useState(Date.now());
  const myChannelRef = useRef<RealtimeChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const ringToneRef = useRef<HTMLAudioElement | null>(null);

  // Blocked check before signalling
  const isBlockedWith = useCallback(async (otherId: string) => {
    if (!user) return true;
    const { data } = await supabase
      .from('blocked_users')
      .select('blocker_id')
      .or(
        `and(blocker_id.eq.${user.id},blocked_id.eq.${otherId}),and(blocker_id.eq.${otherId},blocked_id.eq.${user.id})`
      )
      .limit(1);
    return !!(data && data.length > 0);
  }, [user?.id]);

  const stopLocalMedia = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((tr) => tr.stop());
    localStreamRef.current = null;
  }, []);

  const sendTo = useCallback(async (otherId: string, event: string, payload: any) => {
    const ch = supabase.channel(userChannelName(otherId));
    await new Promise<void>((resolve) => {
      ch.subscribe((status) => {
        if (status === 'SUBSCRIBED') resolve();
      });
    });
    await ch.send({ type: 'broadcast', event, payload });
    // Give it a tick to flush
    setTimeout(() => supabase.removeChannel(ch), 500);
  }, []);

  const endCall = useCallback(async (notify = true) => {
    const s = callState;
    stopLocalMedia();
    if (notify && s.phase !== 'idle') {
      await sendTo(s.peer.user_id, 'call-end', { callId: s.callId });
    }
    setCallState({ phase: 'idle' });
    setMuted(false);
  }, [callState, sendTo, stopLocalMedia]);

  // Subscribe to my incoming-call channel
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(userChannelName(user.id));
    myChannelRef.current = ch;

    ch.on('broadcast', { event: 'call-ring' }, async ({ payload }) => {
      // Ignore if busy
      setCallState((prev) => {
        if (prev.phase !== 'idle') {
          // auto-reject if busy
          sendTo(payload.from.user_id, 'call-decline', { callId: payload.callId, busy: true });
          return prev;
        }
        return prev;
      });

      if (await isBlockedWith(payload.from.user_id)) return;

      setCallState((prev) => {
        if (prev.phase !== 'idle') return prev;
        return {
          phase: 'incoming',
          peer: payload.from as Profile,
          callId: payload.callId,
          startedAt: Date.now(),
        };
      });
    })
      .on('broadcast', { event: 'call-accept' }, ({ payload }) => {
        setCallState((prev) => {
          if (prev.phase === 'outgoing' && prev.callId === payload.callId) {
            return { phase: 'active', peer: prev.peer, callId: prev.callId, startedAt: Date.now() };
          }
          return prev;
        });
      })
      .on('broadcast', { event: 'call-decline' }, ({ payload }) => {
        setCallState((prev) => {
          if ((prev.phase === 'outgoing' || prev.phase === 'active') && prev.callId === payload.callId) {
            stopLocalMedia();
            toast.info(payload.busy ? t('callBusy', language) : t('callDeclined', language));
            return { phase: 'idle' };
          }
          return prev;
        });
      })
      .on('broadcast', { event: 'call-end' }, ({ payload }) => {
        setCallState((prev) => {
          if (prev.phase !== 'idle' && prev.callId === payload.callId) {
            stopLocalMedia();
            toast.info(t('callEnded', language));
            return { phase: 'idle' };
          }
          return prev;
        });
      });

    ch.subscribe();
    return () => {
      supabase.removeChannel(ch);
      myChannelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, language]);

  // Tick timer while active
  useEffect(() => {
    if (callState.phase !== 'active') return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [callState.phase]);

  const startCall = useCallback(async (peer: Profile) => {
    if (!user || !profile) return;
    if (callState.phase !== 'idle') return;

    if (await isBlockedWith(peer.user_id)) {
      toast.error(t('blockedCannotAction', language));
      return;
    }

    const callId = crypto.randomUUID();
    setCallState({ phase: 'outgoing', peer, callId, startedAt: Date.now() });

    // Try to acquire mic (best-effort; simulation only, no peer transport)
    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      /* ignore */
    }

    await sendTo(peer.user_id, 'call-ring', {
      callId,
      from: {
        id: profile.id,
        user_id: user.id,
        name: profile.name,
        avatar_url: profile.avatar_url,
      },
    });

    // Auto-timeout after 30s if not answered
    setTimeout(() => {
      setCallState((prev) => {
        if (prev.phase === 'outgoing' && prev.callId === callId) {
          stopLocalMedia();
          sendTo(peer.user_id, 'call-end', { callId });
          toast.info(t('callNoAnswer', language));
          return { phase: 'idle' };
        }
        return prev;
      });
    }, 30000);
  }, [user?.id, profile?.id, callState.phase, isBlockedWith, sendTo, language, stopLocalMedia]);

  const acceptCall = useCallback(async () => {
    if (callState.phase !== 'incoming') return;
    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      toast.error(t('micUnavailable', language));
    }
    await sendTo(callState.peer.user_id, 'call-accept', { callId: callState.callId });
    setCallState({
      phase: 'active',
      peer: callState.peer,
      callId: callState.callId,
      startedAt: Date.now(),
    });
  }, [callState, sendTo, language]);

  const declineCall = useCallback(async () => {
    if (callState.phase !== 'incoming') return;
    await sendTo(callState.peer.user_id, 'call-decline', { callId: callState.callId });
    setCallState({ phase: 'idle' });
  }, [callState, sendTo]);

  const toggleMute = useCallback(() => {
    const s = localStreamRef.current;
    if (!s) return;
    s.getAudioTracks().forEach((tr) => (tr.enabled = muted));
    setMuted((m) => !m);
  }, [muted]);

  const formatDuration = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <CallContext.Provider value={{ startCall, callState }}>
      {children}

      {/* Incoming Call Modal */}
      <AnimatePresence>
        {callState.phase === 'incoming' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-background/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-panel-strong p-8 rounded-3xl w-[92%] max-w-sm text-center border border-primary/30"
              style={{ boxShadow: '0 0 60px hsl(var(--primary) / 0.3)' }}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center border-2 border-primary overflow-hidden mb-4"
              >
                {callState.peer.avatar_url ? (
                  <img src={callState.peer.avatar_url} alt={callState.peer.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-muted-foreground" />
                )}
              </motion.div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                {t('incomingCall', language)}
              </p>
              <h3 className="text-xl font-semibold mb-6">{callState.peer.name}</h3>
              <div className="flex items-center justify-center gap-10">
                <button
                  onClick={declineCall}
                  className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  aria-label={t('callDecline', language)}
                >
                  <PhoneOff size={22} />
                </button>
                <button
                  onClick={acceptCall}
                  className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  aria-label={t('callAccept', language)}
                  style={{ boxShadow: '0 0 24px rgb(16 185 129 / 0.5)' }}
                >
                  <Phone size={22} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outgoing / Active Call Modal */}
      <AnimatePresence>
        {(callState.phase === 'outgoing' || callState.phase === 'active') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-background/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-panel-strong p-8 rounded-3xl w-[92%] max-w-sm text-center border border-primary/30"
              style={{ boxShadow: '0 0 60px hsl(var(--primary) / 0.3)' }}
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center border-2 border-primary overflow-hidden mb-4">
                {callState.peer.avatar_url ? (
                  <img src={callState.peer.avatar_url} alt={callState.peer.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-muted-foreground" />
                )}
              </div>
              <h3 className="text-xl font-semibold">{callState.peer.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                {callState.phase === 'outgoing'
                  ? t('callRinging', language)
                  : formatDuration(now - callState.startedAt)}
              </p>
              <div className="flex items-center justify-center gap-6">
                {callState.phase === 'active' && (
                  <button
                    onClick={toggleMute}
                    className="w-12 h-12 rounded-full bg-secondary hover:bg-accent text-foreground flex items-center justify-center border border-border"
                    aria-label={muted ? t('unmute', language) : t('mute', language)}
                  >
                    {muted ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                )}
                <button
                  onClick={() => endCall(true)}
                  className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  aria-label={t('callEnd', language)}
                >
                  <PhoneOff size={22} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={ringToneRef} />
    </CallContext.Provider>
  );
}
