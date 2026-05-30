import { Heart, Users, GlassWater, Search, Shield, Sparkles, Wine, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import SEO from '@/components/SEO';

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function About() {
  const { language } = useApp();

  return (
    <div className="space-y-6 pb-8">
      <SEO title="About Drink Mate — Your Night Out Companion" description="Learn why Drink Mate exists: a social app for adults who want company for nights out, bar hops, and toasts." path="/about" />
      {/* Hero */}
      <motion.div className="text-center py-4" {...fadeIn(0)}>
        <h1 className="text-2xl font-black amber-glow-strong mb-1">About {t('appName', language)} — The Night Out Companion</h1>
        <p className="text-xs tracking-[0.15em] text-muted-foreground font-medium">THE NIGHT OUT COMPANION</p>
      </motion.div>

      {/* Subtitle */}
      <motion.div className="glass-panel-strong p-5 text-center" {...fadeIn(0.1)}>
        <p className="text-lg font-bold text-foreground leading-snug">
          {t('aboutSubtitle', language)}
        </p>
      </motion.div>

      {/* Main story */}
      <motion.div className="glass-panel p-5 space-y-4 text-sm leading-relaxed text-secondary-foreground" {...fadeIn(0.2)}>
        <p>{t('aboutIntro', language)}</p>
        <p>{t('aboutStory', language)}</p>
        <p>{t('aboutEureka', language)}</p>
        <p className="font-semibold text-foreground">
          <GlassWater size={16} className="inline text-primary mr-1.5 -mt-0.5" />
          {t('aboutManifesto', language)}
        </p>
      </motion.div>

      {/* Зачем это нужно */}
      <motion.div className="glass-panel p-5 space-y-4" {...fadeIn(0.3)}>
        <h2 className="text-base font-bold amber-glow flex items-center gap-2">
          <Sparkles size={18} />
          {t('aboutWhyTitle', language)}
        </h2>
        <p className="text-sm leading-relaxed text-secondary-foreground">
          {t('aboutWhyText', language)}
        </p>
      </motion.div>

      {/* Что найдете */}
      <motion.div className="glass-panel p-5 space-y-4" {...fadeIn(0.4)}>
        <h2 className="text-base font-bold amber-glow flex items-center gap-2">
          <Wine size={18} />
          {t('aboutFindTitle', language)}
        </h2>
        <div className="space-y-3">
          {[
            { icon: <Users size={16} className="text-primary mt-0.5 shrink-0" />, titleKey: 'aboutFind1Title', textKey: 'aboutFind1Text' },
            { icon: <Heart size={16} className="text-primary mt-0.5 shrink-0" />, titleKey: 'aboutFind2Title', textKey: 'aboutFind2Text' },
            { icon: <GlassWater size={16} className="text-primary mt-0.5 shrink-0" />, titleKey: 'aboutFind3Title', textKey: 'aboutFind3Text' },
            { icon: <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />, titleKey: 'aboutFind4Title', textKey: 'aboutFind4Text' },
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 text-sm leading-relaxed text-secondary-foreground">
              {item.icon}
              <p><span className="font-semibold text-foreground">{t(item.titleKey, language)}</span> {t(item.textKey, language)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Больше чем посиделки */}
      <motion.div className="glass-panel p-5 space-y-4" {...fadeIn(0.5)}>
        <h2 className="text-base font-bold amber-glow flex items-center gap-2">
          <PartyPopper size={18} />
          {t('aboutMoreTitle', language)}
        </h2>
        <p className="text-sm leading-relaxed text-secondary-foreground">
          {t('aboutMoreText', language)}
        </p>
        <div className="space-y-2 text-sm leading-relaxed text-secondary-foreground pl-1">
          <p><span className="font-semibold text-foreground">{t('aboutFriendship', language)}</span> {t('aboutFriendshipText', language)}</p>
          <p><span className="font-semibold text-foreground">{t('aboutLove', language)}</span> {t('aboutLoveText', language)}</p>
          <p><span className="font-semibold text-foreground">{t('aboutReboot', language)}</span> {t('aboutRebootText', language)}</p>
        </div>
      </motion.div>

      {/* Манифест */}
      <motion.div className="glass-panel-strong p-5 amber-border-glow" {...fadeIn(0.6)}>
        <p className="text-sm leading-relaxed text-foreground italic text-center">
          <Heart size={14} className="inline text-primary mr-1 -mt-0.5" />
          {t('aboutManifestoFinal', language)}
        </p>
      </motion.div>

      {/* Что внутри */}
      <motion.div className="glass-panel p-5 space-y-4" {...fadeIn(0.7)}>
        <h2 className="text-base font-bold amber-glow flex items-center gap-2">
          <Search size={18} />
          {t('aboutInsideTitle', language)}
        </h2>
        <div className="space-y-2 text-sm leading-relaxed text-secondary-foreground pl-1">
          <p><span className="font-semibold text-foreground">{t('aboutSearch', language)}</span> {t('aboutSearchText', language)}</p>
          <p><span className="font-semibold text-foreground">{t('aboutTaste', language)}</span> {t('aboutTasteText', language)}</p>
          <p>
            <Shield size={14} className="inline text-primary mr-1 -mt-0.5" />
            <span className="font-semibold text-foreground">{t('aboutSafety', language)}</span> {t('aboutSafetyText', language)}
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div className="glass-panel-strong p-5 text-center" {...fadeIn(0.8)}>
        <p className="text-sm leading-relaxed text-foreground font-medium">
          {t('aboutCTA', language)}
        </p>
      </motion.div>

      <motion.p className="text-xs text-muted-foreground text-center pt-2" {...fadeIn(0.9)}>
        © 2026 {t('appName', language)} • Made with 🥃 and ❤️
      </motion.p>
    </div>
  );
}
