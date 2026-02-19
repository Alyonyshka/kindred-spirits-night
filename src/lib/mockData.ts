export interface MockUser {
  id: string;
  name: string;
  age: number;
  avatar: string;
  city: string;
  drinks: string[];
  alcoholLevel: string;
  interests: string[];
  vibe: string;
  about: string;
  online: boolean;
  rating: number;
  ratingCount: number;
}

export const READ_CHATS_KEY = 'sobutylnik-read-chats';
export const JOINED_EVENTS_KEY = 'sobutylnik-joined-events';
export const SEEN_FAVORITES_KEY = 'sobutylnik-seen-favorites';

// Total favorites count (first 3 mock users treated as favorites)
export const TOTAL_FAVORITES = 3;

export interface ChatEntry {
  id: string;
  userId: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
}

export const initialChats: ChatEntry[] = [
  { id: '1', userId: '2', lastMsg: 'Привет! Давай встретимся сегодня?', time: '14:22', unread: 2, online: true },
  { id: '2', userId: '7', lastMsg: 'Слушай, я нашёл крутой бар 🍸', time: '12:05', unread: 1, online: true },
  { id: '3', userId: '6', lastMsg: 'Принято! До встречи', time: 'вчера', unread: 0, online: false },
];

// Initial event IDs (to compare with joined list)
export const INITIAL_EVENT_IDS = ['1', '2', '3'];

export function getUnreadCount(): number {
  try {
    const readIds: string[] = JSON.parse(localStorage.getItem(READ_CHATS_KEY) || '[]');
    return initialChats.filter(c => c.unread > 0 && !readIds.includes(c.id)).length;
  } catch {
    return 0;
  }
}

export function getNewEventsCount(): number {
  try {
    const joinedIds: string[] = JSON.parse(localStorage.getItem(JOINED_EVENTS_KEY) || '[]');
    return INITIAL_EVENT_IDS.filter(id => !joinedIds.includes(id)).length;
  } catch {
    return INITIAL_EVENT_IDS.length;
  }
}

export function getNewFavoritesCount(): number {
  try {
    const seenCount = parseInt(localStorage.getItem(SEEN_FAVORITES_KEY) || '0', 10);
    return Math.max(0, TOTAL_FAVORITES - seenCount);
  } catch {
    return TOTAL_FAVORITES;
  }
}

export function markFavoritesSeen(): void {
  localStorage.setItem(SEEN_FAVORITES_KEY, String(TOTAL_FAVORITES));
}

export const mockUsers: MockUser[] = [
  {
    id: '1', name: 'Алексей', age: 28, avatar: '',
    city: 'kyiv', drinks: ['whiskey', 'beer'], alcoholLevel: 'navigator',
    interests: ['activeSport', 'travel'], vibe: '🔥 Всегда за приключения',
    about: 'Люблю хороший виски и горные лыжи', online: true, rating: 4.7, ratingCount: 12
  },
  {
    id: '2', name: 'Марина', age: 25, avatar: '',
    city: 'kyiv', drinks: ['wine', 'champagne'], alcoholLevel: 'light',
    interests: ['creativity', 'cultural'], vibe: '🌙 Вечерний вайб',
    about: 'Художница, обожаю вино и закаты', online: true, rating: 4.9, ratingCount: 23
  },
  {
    id: '3', name: 'Дмитрий', age: 32, avatar: '',
    city: 'odessa', drinks: ['cognac', 'rum'], alcoholLevel: 'master',
    interests: ['cooking', 'social'], vibe: '🍷 Знаток напитков',
    about: 'Шеф-повар, коллекционирую редкие бутылки', online: false, rating: 4.5, ratingCount: 8
  },
  {
    id: '4', name: 'Оксана', age: 23, avatar: '',
    city: 'lviv', drinks: ['beer', 'cider'], alcoholLevel: 'light',
    interests: ['travel', 'volunteering', 'hookah'], vibe: '✨ Позитив 24/7',
    about: 'Путешествую, волонтерю, ищу компанию', online: true, rating: 4.8, ratingCount: 15
  },
  {
    id: '5', name: 'Игорь', age: 30, avatar: '',
    city: 'kharkiv', drinks: ['vodka', 'tincture'], alcoholLevel: 'candidate',
    interests: ['intellectual', 'technical'], vibe: '🧠 Философ вечеринок',
    about: 'Программист, люблю дебаты за рюмкой', online: false, rating: 3.9, ratingCount: 6
  },
  {
    id: '6', name: 'Катерина', age: 27, avatar: '',
    city: 'dnipro', drinks: ['gin', 'vermouth'], alcoholLevel: 'navigator',
    interests: ['cultural', 'social', 'creativity'], vibe: '🎭 Душа компании',
    about: 'Актриса, люблю коктейли и театр', online: true, rating: 4.6, ratingCount: 19
  },
  {
    id: '7', name: 'Андрей', age: 35, avatar: '',
    city: 'kyiv', drinks: ['tequila', 'absinthe'], alcoholLevel: 'master',
    interests: ['activeSport', 'collecting'], vibe: '🌋 Без тормозов',
    about: 'Экстремал. Ночь - мой формат', online: true, rating: 4.2, ratingCount: 31
  },
  {
    id: '8', name: 'Юлия', age: 24, avatar: '',
    city: 'odessa', drinks: ['liqueur', 'champagne'], alcoholLevel: 'light',
    interests: ['handicraft', 'gardening'], vibe: '🌸 Уютный вечер',
    about: 'Рукодельница, делаю свечи и настойки', online: false, rating: 4.4, ratingCount: 9
  },
];
