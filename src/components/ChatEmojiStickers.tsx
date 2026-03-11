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
    emojis: ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','🥰','😘','😗','😙','😚','🙂','🤗','🤔','🤐','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥴','😵','🤯','🤠','🥳','😈','👿','💀','☠️','👻','👽','🤖'],
  },
  {
    label: '🍻',
    emojis: ['🍻','🍺','🍷','🥂','🍸','🍹','🍾','🥃','🧉','🍶','🫗','🍵','☕','🧃','🥤','🧋','🫖','🍼','🥛','🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🫐','🥝','🍅'],
  },
  {
    label: '🎉',
    emojis: ['🎉','🎊','🎈','🎂','🎁','🎆','🎇','✨','🎵','🎶','🎤','🎧','🎸','🎹','🥁','🎺','🎻','🎬','🎮','🎯','🎲','🎰','🃏','🏆','🥇','🏅','🎖️','🎗️','🎪','🎭','🎨'],
  },
  {
    label: '❤️',
    emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','♥️','🫶','👍','👎','✊','👊','🤛','🤜','👏','🙌','🤝','💪','🤟','🤘','✌️','🤞','🤙','👌'],
  },
  {
    label: '🌙',
    emojis: ['🌙','🌟','⭐','🔥','💥','⚡','🌈','☀️','🌤️','🌧️','❄️','💨','🌊','🏖️','🏝️','🌄','🌅','🌆','🌇','🌃','🌌','🎑','🏙️','🌉','🌁','🛸','🚀','🎠','🎡','🎢'],
  },
];

// Alcohol-themed stickers (emoji combos rendered as "stickers")
const STICKER_SETS = [
  { id: 'party', label: '🥳', stickers: [
    '🍻🥳🎉', '🍷😎✨', '🥂🎊💫', '🍸🌙🔥', '🍺💪😤',
    '🥃🤠🎶', '🍹🏖️☀️', '🍾🎆🥳', '🫗😵‍💫🌀', '🧉🤙🎵',
    '🍻👯‍♂️🎉', '🥂💋✨', '🍷🕯️🌹', '🍸🎰💰', '🍺🏆🥇',
    '🥃🔥💀', '🍹🌈😍', '🍾💎👑', '🍻🎸🤘', '🥂🎭🎪',
  ]},
  { id: 'mood', label: '😵‍💫', stickers: [
    '😵‍💫🍺🌀', '🤪🍹🎭', '😈🥃🔥', '🥴🍷💫', '🤯🍸⚡',
    '😎🍻🎶', '🥳🍾🎊', '💀🥃☠️', '🤤🍺🍕', '😴🍷💤',
    '🤑🍸💰', '🥶🍹❄️', '😱🍻👻', '🤩🥂⭐', '😏🍷🌙',
    '🫠🍺🫗', '🤓🥃📚', '🥸🍸🕵️', '😤🍻💢', '🫡🥂🎖️',
  ]},
];

const TENOR_API_KEY = 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ'; // Public Tenor API key

export default function ChatEmojiStickers({ onSelectEmoji, onSendSticker, onSendGif }: Props) {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'emoji' | 'stickers' | 'gifs'>('emoji');
  const [activeCat, setActiveCat] = useState(0);
  const [gifSearch, setGifSearch] = useState('');
  const [gifs, setGifs] = useState<string[]>([]);
  const [gifLoading, setGifLoading] = useState(false);

  const searchGifs = async (query: string) => {
    if (!query.trim()) {
      // Load trending
      setGifLoading(true);
      try {
        const res = await fetch(`https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&limit=20&media_filter=tinygif`);
        const data = await res.json();
        setGifs(data.results?.map((r: any) => r.media_formats?.tinygif?.url).filter(Boolean) || []);
      } catch { setGifs([]); }
      setGifLoading(false);
      return;
    }
    setGifLoading(true);
    try {
      const res = await fetch(`https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=20&media_filter=tinygif`);
      const data = await res.json();
      setGifs(data.results?.map((r: any) => r.media_formats?.tinygif?.url).filter(Boolean) || []);
    } catch { setGifs([]); }
    setGifLoading(false);
  };

  const handleGifTabOpen = () => {
    setActiveTab('gifs');
    if (gifs.length === 0) searchGifs('');
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
            onClick={() => tab.key === 'gifs' ? handleGifTabOpen() : setActiveTab(tab.key)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Emoji tab */}
      {activeTab === 'emoji' && (
        <div>
          <div className="flex gap-1 px-2 py-1.5 border-b border-border/20">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button key={i} onClick={() => setActiveCat(i)} className={`text-lg px-2 py-0.5 rounded transition-colors ${activeCat === i ? 'bg-primary/15' : 'hover:bg-accent'}`}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="p-2 grid grid-cols-8 gap-1 max-h-[180px] overflow-y-auto scrollbar-hide">
            {EMOJI_CATEGORIES[activeCat].emojis.map(e => (
              <button key={e} onClick={() => onSelectEmoji(e)} className="text-xl hover:scale-125 transition-transform p-1 rounded hover:bg-accent">
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stickers tab */}
      {activeTab === 'stickers' && (
        <div>
          <div className="flex gap-1 px-2 py-1.5 border-b border-border/20">
            {STICKER_SETS.map(set => (
              <button key={set.id} onClick={() => {}} className="text-lg px-2 py-0.5 rounded hover:bg-accent">
                {set.label}
              </button>
            ))}
          </div>
          <div className="p-2 grid grid-cols-4 gap-2 max-h-[180px] overflow-y-auto scrollbar-hide">
            {STICKER_SETS.flatMap(set => set.stickers).map((sticker, i) => (
              <button
                key={i}
                onClick={() => onSendSticker(sticker)}
                className="text-2xl p-2 rounded-xl border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-center"
              >
                {sticker}
              </button>
            ))}
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
