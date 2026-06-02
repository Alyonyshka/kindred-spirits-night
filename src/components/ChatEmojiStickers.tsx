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

const TENOR_API_KEY = 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ';
const STICKER_QUERIES = ['party', 'cheers', 'cocktail', 'bar', 'beer', 'drunk', 'friends', 'wine', 'dance', 'celebrate'];

export default function ChatEmojiStickers({ onSelectEmoji, onSendSticker, onSendGif }: Props) {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'emoji' | 'stickers' | 'gifs'>('emoji');
  const [activeCat, setActiveCat] = useState(0);
  const [gifSearch, setGifSearch] = useState('');
  const [gifs, setGifs] = useState<string[]>([]);
  const [gifLoading, setGifLoading] = useState(false);
  const [stickers, setStickers] = useState<string[]>([]);
  const [stickerLoading, setStickerLoading] = useState(false);
  const [stickerQuery, setStickerQuery] = useState('party');

  const loadStickers = async (query: string) => {
    setStickerLoading(true);
    try {
      const res = await fetch(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=24&searchfilter=sticker&media_filter=tinygif_transparent`
      );
      const data = await res.json();
      const items = data.results
        ?.map((r: any) => r.media_formats?.tinygif_transparent?.url || r.media_formats?.tinygif?.url)
        .filter(Boolean) || [];
      setStickers(items);
    } catch {
      setStickers([]);
    }
    setStickerLoading(false);
  };

  const searchGifs = async (query: string) => {
    setGifLoading(true);
    try {
      const url = query.trim()
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=24&media_filter=tinygif`
        : `https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&limit=24&media_filter=tinygif`;
      const res = await fetch(url);
      const data = await res.json();
      setGifs(data.results?.map((r: any) => r.media_formats?.tinygif?.url).filter(Boolean) || []);
    } catch { setGifs([]); }
    setGifLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'stickers' && stickers.length === 0) loadStickers(stickerQuery);
    if (activeTab === 'gifs' && gifs.length === 0) searchGifs('');
  }, [activeTab]);

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
