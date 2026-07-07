import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface Props {
  onSelectEmoji: (emoji: string) => void;
  onSendSticker: (stickerUrl: string) => void;
  onSendGif: (gifUrl: string) => void;
}

const EMOJI_CATEGORIES = [
  {
    label: '😀',
    emojis: ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','🥰','😘','🙂','🤗','🤔','😐','😶','😏','😒','🙄','😬','😌','😔','😪','🤤','😴','🤒','🤕','🤢','🤮','🥴','😵','🤯','🤠','🥳','😈','👿','💀','👻','👽','🤖'],
  },
  {
    label: '🍻',
    emojis: ['🍻','🍺','🍷','🥂','🍸','🍹','🍾','🥃','🧉','🍶','🍵','☕','🥤','🧋','🍼','🥛','🍇','🍉','🍊','🍋','🍌','🍍','🍎','🍏','🍐','🍑','🍒','🍓','🥝','🍅'],
  },
  {
    label: '🎉',
    emojis: ['🎉','🎊','🎈','🎂','🎁','🎆','🎇','✨','🎵','🎶','🎤','🎧','🎸','🎹','🥁','🎺','🎻','🎬','🎮','🎯','🎲','🎰','🏆','🥇','🏅','🎪','🎭','🎨'],
  },
  {
    label: '❤️',
    emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','💕','💞','💓','💗','💖','💘','💝','♥️','👍','👎','✊','👊','👏','🙌','🤝','💪','🤟','🤘','✌️','🤞','👌'],
  },
  {
    label: '🌙',
    emojis: ['🌙','🌟','⭐','🔥','💥','⚡','🌈','☀️','❄️','💨','🌊','🏖️','🏝️','🌄','🌅','🌆','🌇','🌃','🌌','🚀'],
  },
];

// Twemoji CDN — renders emoji as consistent images across all devices
const toTwemojiUrl = (emoji: string): string => {
  const codepoints: string[] = [];
  for (const ch of emoji) {
    const cp = ch.codePointAt(0);
    if (cp && cp !== 0xfe0f) codepoints.push(cp.toString(16));
  }
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codepoints.join('-')}.png`;
};

// Curated static GIF/sticker library (Giphy public CDN URLs — no API key needed to display)
const STICKER_QUERIES = ['party', 'cheers', 'cocktail', 'beer', 'wine', 'dance', 'celebrate'] as const;
type StickerQuery = typeof STICKER_QUERIES[number];

const STICKER_LIBRARY: Record<StickerQuery, string[]> = {
  party: [
    'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    'https://media.giphy.com/media/xUOxfhtTZTU21NIYZ2/giphy.gif',
    'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
    'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif',
    'https://media.giphy.com/media/xT0GqH01ZbXikrxDlS/giphy.gif',
    'https://media.giphy.com/media/3o6ozsIxg5legZigmc/giphy.gif',
    'https://media.giphy.com/media/JltOMwYmi0VrO/giphy.gif',
  ],
  cheers: [
    'https://media.giphy.com/media/xUOxfguTfXbNxjSAOc/giphy.gif',
    'https://media.giphy.com/media/l0MYymPUZKvzYCg2Q/giphy.gif',
    'https://media.giphy.com/media/JQNyk4xEfvzUY/giphy.gif',
    'https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif',
    'https://media.giphy.com/media/l0Iyl55kTeh71nTXy/giphy.gif',
    'https://media.giphy.com/media/26tPplGWjN0xLybiU/giphy.gif',
    'https://media.giphy.com/media/l2JIe6bKmZbtahYWA/giphy.gif',
    'https://media.giphy.com/media/xTiTndDHV3GeIy6aNa/giphy.gif',
  ],
  cocktail: [
    'https://media.giphy.com/media/xT9DPPHwWuHLTKUNy8/giphy.gif',
    'https://media.giphy.com/media/l0MYD4mSCXlvHZ2XC/giphy.gif',
    'https://media.giphy.com/media/26BRCVezhU1t5eENy/giphy.gif',
    'https://media.giphy.com/media/xUPGcJi5PMXsRuBiCk/giphy.gif',
    'https://media.giphy.com/media/l2JhL7jMhqQtQ0uWY/giphy.gif',
    'https://media.giphy.com/media/xT0xeuOy2Fcl9vDGiA/giphy.gif',
  ],
  beer: [
    'https://media.giphy.com/media/l0HlSNOxJB0MTGlXO/giphy.gif',
    'https://media.giphy.com/media/xT9DPIlGnuHpr2yObC/giphy.gif',
    'https://media.giphy.com/media/l0Ex6kAKKcjmpJoTC/giphy.gif',
    'https://media.giphy.com/media/26xBIygOcC3bAFykw/giphy.gif',
    'https://media.giphy.com/media/3o6UB6UOTPr9tDrjO0/giphy.gif',
    'https://media.giphy.com/media/xT5LMKt8LqlHNlWobK/giphy.gif',
  ],
  wine: [
    'https://media.giphy.com/media/xUPGcguWZHRC2HyBRe/giphy.gif',
    'https://media.giphy.com/media/l2JhBUzgvUKQhrp32/giphy.gif',
    'https://media.giphy.com/media/l0MYyv3g7wCxWJDe8/giphy.gif',
    'https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif',
    'https://media.giphy.com/media/xT9IgFLBcm3Wi6l6iA/giphy.gif',
    'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
  ],
  dance: [
    'https://media.giphy.com/media/l0HlKrB02QY0f1mbm/giphy.gif',
    'https://media.giphy.com/media/xThta7hbXNRRZuXBOw/giphy.gif',
    'https://media.giphy.com/media/26tPplGWjN0xLybiU/giphy.gif',
    'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
    'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    'https://media.giphy.com/media/xThuWbwrw5Q6VfxRRK/giphy.gif',
    'https://media.giphy.com/media/l2JhOVXFXNbKzzC0M/giphy.gif',
    'https://media.giphy.com/media/l0Ex6kAKKcjmpJoTC/giphy.gif',
  ],
  celebrate: [
    'https://media.giphy.com/media/3o6ozC18XKvOOEBBK0/giphy.gif',
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    'https://media.giphy.com/media/26u4b45b8KlgAB7iM/giphy.gif',
    'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif',
    'https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif',
    'https://media.giphy.com/media/xUOxeZeYIzu0hkfxUY/giphy.gif',
    'https://media.giphy.com/media/l0HlKghz8IvrQ8TYQ/giphy.gif',
    'https://media.giphy.com/media/3o6ZsWQ8Vjjm1PMSUE/giphy.gif',
  ],
};

const ALL_GIFS: string[] = Array.from(new Set(Object.values(STICKER_LIBRARY).flat()));

export default function ChatEmojiStickers({ onSelectEmoji, onSendSticker, onSendGif }: Props) {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'emoji' | 'stickers' | 'gifs'>('emoji');
  const [activeCat, setActiveCat] = useState(0);
  const [gifSearch, setGifSearch] = useState('');
  const [gifs, setGifs] = useState<string[]>(ALL_GIFS);
  const [gifLoading] = useState(false);
  const [stickers, setStickers] = useState<string[]>(STICKER_LIBRARY.party);
  const [stickerLoading] = useState(false);
  const [stickerQuery, setStickerQuery] = useState<StickerQuery>('party');

  const loadStickers = (query: StickerQuery) => {
    setStickerQuery(query);
    setStickers(STICKER_LIBRARY[query] || []);
  };

  const searchGifs = (query: string) => {
    setGifSearch(query);
    const q = query.trim().toLowerCase();
    if (!q) { setGifs(ALL_GIFS); return; }
    const matchedKey = (STICKER_QUERIES as readonly string[]).find(k => k.includes(q) || q.includes(k)) as StickerQuery | undefined;
    setGifs(matchedKey ? STICKER_LIBRARY[matchedKey] : ALL_GIFS);
  };


  const tabs = [
    { key: 'emoji' as const, label: '😀' },
    { key: 'stickers' as const, label: t('stickers', language) },
    { key: 'gifs' as const, label: 'GIF' },
  ];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="glass-panel-strong border-t border-border/50 overflow-hidden"
    >
      {/* Tabs */}
      <div className="flex border-b border-border/30">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            {typeof tab.label === 'string' && tab.label === '😀' ? (
              <img src={toTwemojiUrl('😀')} alt="emoji" className="w-5 h-5 inline-block" />
            ) : tab.label}
          </button>
        ))}
      </div>

      {/* Emoji tab */}
      {activeTab === 'emoji' && (
        <div>
          <div className="flex gap-1 px-2 py-1.5 border-b border-border/20">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCat(i)}
                className={`px-2 py-0.5 rounded transition-colors ${activeCat === i ? 'bg-primary/15' : 'hover:bg-accent'}`}
              >
                <img src={toTwemojiUrl(cat.label)} alt="cat" className="w-5 h-5" />
              </button>
            ))}
          </div>
          <div className="p-2 grid grid-cols-8 gap-1 max-h-[180px] overflow-y-auto scrollbar-hide">
            {EMOJI_CATEGORIES[activeCat].emojis.map(e => (
              <button
                key={e}
                onClick={() => onSelectEmoji(e)}
                className="hover:scale-125 transition-transform p-1 rounded hover:bg-accent flex items-center justify-center"
                title={e}
              >
                <img
                  src={toTwemojiUrl(e)}
                  alt={e}
                  className="w-6 h-6"
                  loading="lazy"
                  onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stickers tab */}
      {activeTab === 'stickers' && (
        <div>
          <div className="flex gap-1 px-2 py-1.5 border-b border-border/20 overflow-x-auto scrollbar-hide">
            {STICKER_QUERIES.map(q => (
              <button
                key={q}
                onClick={() => { setStickerQuery(q); loadStickers(q); }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${stickerQuery === q ? 'bg-primary/20 text-primary' : 'bg-secondary/40 text-muted-foreground hover:bg-accent'}`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="p-2 grid grid-cols-4 gap-1.5 max-h-[180px] overflow-y-auto scrollbar-hide">
            {stickerLoading ? (
              <div className="col-span-4 text-center py-4 text-muted-foreground text-xs">{t('loading', language)}</div>
            ) : stickers.length === 0 ? (
              <div className="col-span-4 text-center py-4 text-muted-foreground text-xs">{t('noResults', language)}</div>
            ) : (
              stickers.map((url, i) => (
                <button
                  key={i}
                  onClick={() => onSendSticker(url)}
                  className="rounded-xl p-1.5 hover:bg-primary/10 transition-all flex items-center justify-center aspect-square"
                >
                  <img src={url} alt="sticker" className="max-w-full max-h-full object-contain" loading="lazy" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* GIF tab */}
      {activeTab === 'gifs' && (
        <div>
          <div className="p-2 pb-1">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={gifSearch}
                onChange={e => { setGifSearch(e.target.value); searchGifs(e.target.value); }}
                placeholder={t('searchGif', language)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-secondary/30 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all"
              />
            </div>
          </div>
          <div className="p-2 grid grid-cols-3 gap-1.5 max-h-[180px] overflow-y-auto scrollbar-hide">
            {gifLoading ? (
              <div className="col-span-3 text-center py-4 text-muted-foreground text-xs">{t('loading', language)}</div>
            ) : gifs.length === 0 ? (
              <div className="col-span-3 text-center py-4 text-muted-foreground text-xs">{t('noResults', language)}</div>
            ) : (
              gifs.map((url, i) => (
                <button key={i} onClick={() => onSendGif(url)} className="rounded-lg overflow-hidden border border-border/30 hover:border-primary/30 transition-all">
                  <img src={url} alt="gif" className="w-full h-20 object-cover" loading="lazy" />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
