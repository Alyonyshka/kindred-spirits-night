import { useState } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { t, cityKeys } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const langLabels = { ru: 'RU', en: 'EN', ua: 'UA' } as const;

export default function Header() {
  const { language, setLanguage, city, setCity } = useApp();
  const [showCities, setShowCities] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel-strong px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-wider amber-glow-strong cursor-pointer">
              {t('appName', language)}
            </span>
            <span className="text-[10px] sm:text-xs tracking-[0.2em] text-muted-foreground font-medium">
              {t('slogan', language)}
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language switcher */}
            <div className="flex gap-1 glass-panel px-1 py-1">
              {(Object.keys(langLabels) as Array<keyof typeof langLabels>).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    language === lang
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {langLabels[lang]}
                </button>
              ))}
            </div>

            {/* City selector */}
            <button
              onClick={() => setShowCities(true)}
              className="flex items-center gap-1 glass-panel px-3 py-2 hover:amber-border-glow transition-all duration-200"
            >
              <MapPin size={14} className="text-primary" />
              <span className="text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-none">
                {t(city, language)}
              </span>
              <ChevronDown size={12} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* City selector modal */}
      <AnimatePresence>
        {showCities && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setShowCities(false)} />
            <motion.div
              className="relative glass-panel-strong p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold amber-glow">{t('location', language)}</h2>
                <button onClick={() => setShowCities(false)} className="p-1 rounded-lg hover:bg-accent transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cityKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => { setCity(key); setShowCities(false); }}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      city === key
                        ? 'amber-border-glow text-primary bg-primary/10'
                        : 'border-border hover:border-primary/40 hover:bg-accent text-foreground'
                    }`}
                  >
                    {t(key, language)}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
