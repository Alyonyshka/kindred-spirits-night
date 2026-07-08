import { useState } from 'react';
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

const toTwemojiUrl = (emoji: string): string => {
  const codepoints: string[] = [];
  for (const ch of emoji) {
    const cp = ch.codePointAt(0);
    if (cp && cp !== 0xfe0f) codepoints.push(cp.toString(16));
  }
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codepoints.join('-')}.png`;
};

const gif = (id: string) => `https://media.giphy.com/media/${id}/giphy.gif`;

type CategoryKey = 'cats' | 'memes' | 'reactions' | 'greetings';

// Curated, verified Giphy IDs (each URL returns 200 with real content, not the placeholder).
const GIF_LIBRARY: Record<CategoryKey, string[]> = {
  cats: [
    'vFKqnCdLPNOKc','JIX9t2j0ZTN9S','yFQ0ywscgobJK','mlvseq9yvZhba','MDJ9IbxxvDUQM',
    '3oriO0OEd9QIDdllqo','3o7TKUM3IgJBX2as9O','VbnUQpnihPSIgIXuZv','BzyTuYCmvSORqs1ABM',
    '13CoXDiaCcCoyk','tXL4FHPSnVJ0A','10LKovKon8DENq','3o6Zt6ML6BklcajjsA','JVOfHDrfjxK4o',
  ].map(gif),
  memes: [
    '3o7527pa7qs9kCG78A','l0HlBO7eyXzSZkJri','3o7TKSjRrfIPjeiVyM','3oz8xLd9DJq2l2VFtu',
    'xT5LMHxhOfscxPfIfm','l0HlvtIPzPdt2usKs','xT9IgDEI1iZyb2wqo8','3ornk57KwDXf81rjWM',
    'd3mlE7uhX8KFgEmY','xTiTnxpQ3ghPiB2Hp6','3o7TKr3nzbh5WgCFxe','l3q2K5jinAlChoCLS',
    '3oz9ZE2Oo9zRC','g01ZnwAUvutuK8GIQn','111ebonMs90YLu',
  ].map(gif),
  reactions: [
    '5VKbvrjxpVJCM','3oEjI105rmEC22CJFK','3o7abKhOpu0NwenH3O','1BXa2alBjrCXC',
    'JER2en0ZRiGUE','d2lcHJTG5Tscg','xT0xezQGU5xCDJuCPe','QMHoU66sBXqqLqYvGO',
    '14aUO0Mf7dWDXW','OPU6wzx8JrHna','3orieUe6ejxSFxYCXe','WsNbxuFkLi3IuGI9NU',
    'YEL7FJP6ed008','l1J9EdzfOSgfyueLm','l0MYt5jPR6QX5pnqM','6nWhy3ulBL7GSCvKw6',
  ].map(gif),
  greetings: [
    'LmNwrBhejkK9EFP504','H4uE6w9G1uK4M','LnQjpWaON8nhr21vNW','3o84U6421OOWegpQhq',
    '3o7TKF1fSIs1R19B8k','EDt1m8p5hqXG8','3oEjHV0z8S7WM4MwnK','3o7TKtnuHOHHUjR38Y',
    '3o84sq21TxDH6PyYms','xT9IgIc0lryrxvqVGM',
  ].map(gif),
};

const CATEGORY_LABELS: Record<CategoryKey, Record<string, string>> = {
  cats:      { ru: 'Котики',      en: 'Cats',      ua: 'Котики' },
  memes:     { ru: 'Мемы',        en: 'Memes',     ua: 'Меми' },
  reactions: { ru: 'Реакции',     en: 'Reactions', ua: 'Реакції' },
  greetings: { ru: 'Приветствия', en: 'Greetings', ua: 'Вітання' },
};

const CATEGORIES: CategoryKey[] = ['cats', 'memes', 'reactions', 'greetings'];
const ALL_GIFS: string[] = Array.from(new Set(CATEGORIES.flatMap(k => GIF_LIBRARY[k])));

export default function ChatEmojiStickers({ onSelectEmoji, onSendSticker, onSendGif }: Props) {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'emoji' | 'stickers' | 'gifs'>('emoji');
  const [activeCat, setActiveCat] = useState(0);
  const [gifSearch, setGifSearch] = useState('');
  const [stickerCategory, setStickerCategory] = useState<CategoryKey>('cats');
  const [gifCategory, setGifCategory] = useState<CategoryKey | 'all'>('all');

  const filteredGifs: string[] = (() => {
    const base = gifCategory === 'all' ? ALL_GIFS : GIF_LIBRARY[gifCategory];
    const q = gifSearch.trim().toLowerCase();
    if (!q) return base;
    const match = CATEGORIES.find(k =>
      k.includes(q) ||
      Object.values(CATEGORY_LABELS[k]).some(l => l.toLowerCase().includes(q))
    );
    return match ? GIF_LIBRARY[match] : base;
  })();

  const catLabel = (k: CategoryKey) => CATEGORY_LABELS[k][language] || CATEGORY_LABELS[k].en;

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
            {CATEGORIES.map(k => (
              <button
                key={k}
                onClick={() => setStickerCategory(k)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${stickerCategory === k ? 'bg-primary/20 text-primary' : 'bg-secondary/40 text-muted-foreground hover:bg-accent'}`}
              >
                {catLabel(k)}
              </button>
            ))}
          </div>
          <div className="p-2 grid grid-cols-4 gap-1.5 max-h-[180px] overflow-y-auto scrollbar-hide">
            {GIF_LIBRARY[stickerCategory].length === 0 ? (
              <div className="col-span-4 text-center py-4 text-muted-foreground text-xs">{t('noResults', language)}</div>
            ) : (
              GIF_LIBRARY[stickerCategory].map((url, i) => (
                <button
                  key={i}
                  onClick={() => onSendSticker(url)}
                  className="rounded-xl p-1.5 hover:bg-primary/10 transition-all flex items-center justify-center aspect-square"
                >
                  <img
                    src={url}
                    alt="sticker"
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    onError={(ev) => {
                      const btn = (ev.currentTarget as HTMLImageElement).parentElement;
                      if (btn) (btn as HTMLElement).style.display = 'none';
                    }}
                  />
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
                onChange={e => setGifSearch(e.target.value)}
                placeholder={t('searchGif', language)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-secondary/30 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:amber-border-glow transition-all"
              />
            </div>
          </div>
          <div className="flex gap-1 px-2 pb-1.5 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setGifCategory('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${gifCategory === 'all' ? 'bg-primary/20 text-primary' : 'bg-secondary/40 text-muted-foreground hover:bg-accent'}`}
            >
              {language === 'en' ? 'All' : language === 'ua' ? 'Усі' : 'Все'}
            </button>
            {CATEGORIES.map(k => (
              <button
                key={k}
                onClick={() => setGifCategory(k)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${gifCategory === k ? 'bg-primary/20 text-primary' : 'bg-secondary/40 text-muted-foreground hover:bg-accent'}`}
              >
                {catLabel(k)}
              </button>
            ))}
          </div>
          <div className="p-2 grid grid-cols-3 gap-1.5 max-h-[180px] overflow-y-auto scrollbar-hide">
            {filteredGifs.length === 0 ? (
              <div className="col-span-3 text-center py-4 text-muted-foreground text-xs">{t('noResults', language)}</div>
            ) : (
              filteredGifs.map((url, i) => (
                <button
                  key={i}
                  onClick={() => onSendGif(url)}
                  className="rounded-lg overflow-hidden border border-border/30 hover:border-primary/30 transition-all"
                >
                  <img
                    src={url}
                    alt="gif"
                    className="w-full h-20 object-cover"
                    loading="lazy"
                    onError={(ev) => {
                      const btn = (ev.currentTarget as HTMLImageElement).parentElement;
                      if (btn) (btn as HTMLElement).style.display = 'none';
                    }}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
