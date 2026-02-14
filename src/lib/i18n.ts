export type Language = 'ru' | 'en' | 'ua';

export const translations: Record<string, Record<Language, string>> = {
  // App name
  appName: { ru: 'СОБУТЫЛЬНИК', en: 'SOBUTYLNIK', ua: 'СПІВПЛЯШНИК' },
  slogan: { ru: 'THE NIGHT OUT COMPANION', en: 'THE NIGHT OUT COMPANION', ua: 'THE NIGHT OUT COMPANION' },

  // Navigation
  navSearch: { ru: 'Поиск', en: 'Search', ua: 'Пошук' },
  navMessages: { ru: 'Сообщения', en: 'Messages', ua: 'Повідомлення' },
  navFavorites: { ru: 'Избранные', en: 'Favorites', ua: 'Обрані' },
  navEvents: { ru: 'События', en: 'Events', ua: 'Події' },
  navProfile: { ru: 'Профиль', en: 'Profile', ua: 'Профіль' },

  // Header
  location: { ru: 'Локация', en: 'Location', ua: 'Локація' },

  // Filters
  interests: { ru: 'Интересы', en: 'Interests', ua: 'Інтереси' },
  drinks: { ru: 'Напитки', en: 'Drinks', ua: 'Напої' },
  drinkAmount: { ru: 'Количество алкоголя', en: 'Alcohol level', ua: 'Кількість алкоголю' },
  age: { ru: 'Возраст', en: 'Age', ua: 'Вік' },
  resetFilters: { ru: 'Сброс', en: 'Reset', ua: 'Скинути' },
  searchPlaceholder: { ru: 'Искать по имени...', en: 'Search by name...', ua: 'Шукати за ім\'ям...' },
  resultsFound: { ru: 'Найдено', en: 'Found', ua: 'Знайдено' },

  // Interests list
  activeSport: { ru: 'Активный спорт', en: 'Active sports', ua: 'Активний спорт' },
  creativity: { ru: 'Творчество', en: 'Creativity', ua: 'Творчість' },
  handicraft: { ru: 'Рукоделие', en: 'Handicraft', ua: 'Рукоділля' },
  cooking: { ru: 'Кулинария', en: 'Cooking', ua: 'Кулінарія' },
  gardening: { ru: 'Садоводство', en: 'Gardening', ua: 'Садівництво' },
  travel: { ru: 'Путешествия', en: 'Travel', ua: 'Подорожі' },
  intellectual: { ru: 'Интеллектуальные', en: 'Intellectual', ua: 'Інтелектуальні' },
  volunteering: { ru: 'Волонтерство', en: 'Volunteering', ua: 'Волонтерство' },
  collecting: { ru: 'Коллекционирование', en: 'Collecting', ua: 'Колекціонування' },
  technical: { ru: 'Технические', en: 'Technical', ua: 'Технічні' },
  cultural: { ru: 'Культурные', en: 'Cultural', ua: 'Культурні' },
  social: { ru: 'Социальные', en: 'Social', ua: 'Соціальні' },
  hookah: { ru: 'Кальян', en: 'Hookah', ua: 'Кальян' },

  // Drinks
  vodka: { ru: 'Водка', en: 'Vodka', ua: 'Горілка' },
  whiskey: { ru: 'Виски', en: 'Whiskey', ua: 'Віскі' },
  cognac: { ru: 'Коньяк/Бренди', en: 'Cognac/Brandy', ua: 'Коньяк/Бренді' },
  rum: { ru: 'Ром', en: 'Rum', ua: 'Ром' },
  gin: { ru: 'Джин', en: 'Gin', ua: 'Джин' },
  tequila: { ru: 'Текила/Мескаль', en: 'Tequila/Mezcal', ua: 'Текіла/Мескаль' },
  absinthe: { ru: 'Абсент', en: 'Absinthe', ua: 'Абсент' },
  wine: { ru: 'Вино', en: 'Wine', ua: 'Вино' },
  champagne: { ru: 'Шампанское', en: 'Champagne', ua: 'Шампанське' },
  beer: { ru: 'Пиво', en: 'Beer', ua: 'Пиво' },
  cider: { ru: 'Сидр', en: 'Cider', ua: 'Сидр' },
  vermouth: { ru: 'Вермут', en: 'Vermouth', ua: 'Вермут' },
  tincture: { ru: 'Настойка', en: 'Tincture', ua: 'Настоянка' },
  liqueur: { ru: 'Ликёр', en: 'Liqueur', ua: 'Лікер' },

  // Alcohol levels
  light: { ru: 'Лайт', en: 'Light', ua: 'Лайт' },
  navigator: { ru: 'Штурман', en: 'Navigator', ua: 'Штурман' },
  candidate: { ru: 'Кандидат наук', en: 'PhD Candidate', ua: 'Кандидат наук' },
  master: { ru: 'Мастер спорта', en: 'Master of Sport', ua: 'Майстер спорту' },

  // Cities
  kyiv: { ru: 'Киев', en: 'Kyiv', ua: 'Київ' },
  kharkiv: { ru: 'Харьков', en: 'Kharkiv', ua: 'Харків' },
  odessa: { ru: 'Одесса', en: 'Odessa', ua: 'Одеса' },
  dnipro: { ru: 'Днепр', en: 'Dnipro', ua: 'Дніпро' },
  lviv: { ru: 'Львов', en: 'Lviv', ua: 'Львів' },
  zaporizhzhia: { ru: 'Запорожье', en: 'Zaporizhzhia', ua: 'Запоріжжя' },
  vinnytsia: { ru: 'Винница', en: 'Vinnytsia', ua: 'Вінниця' },
  lutsk: { ru: 'Луцк', en: 'Lutsk', ua: 'Луцьк' },
  donetsk: { ru: 'Донецк', en: 'Donetsk', ua: 'Донецьк' },
  zhytomyr: { ru: 'Житомир', en: 'Zhytomyr', ua: 'Житомир' },
  uzhhorod: { ru: 'Ужгород', en: 'Uzhhorod', ua: 'Ужгород' },
  ivanoFrankivsk: { ru: 'Ивано-Франковск', en: 'Ivano-Frankivsk', ua: 'Івано-Франківськ' },
  kropyvnytskyi: { ru: 'Кропивницкий', en: 'Kropyvnytskyi', ua: 'Кропивницький' },
  luhansk: { ru: 'Луганск', en: 'Luhansk', ua: 'Луганськ' },
  mykolaiv: { ru: 'Николаев', en: 'Mykolaiv', ua: 'Миколаїв' },
  poltava: { ru: 'Полтава', en: 'Poltava', ua: 'Полтава' },
  rivne: { ru: 'Ровно', en: 'Rivne', ua: 'Рівне' },
  sumy: { ru: 'Сумы', en: 'Sumy', ua: 'Суми' },
  ternopil: { ru: 'Тернополь', en: 'Ternopil', ua: 'Тернопіль' },
  kherson: { ru: 'Херсон', en: 'Kherson', ua: 'Херсон' },
  khmelnytskyi: { ru: 'Хмельницкий', en: 'Khmelnytskyi', ua: 'Хмельницький' },
  cherkasy: { ru: 'Черкассы', en: 'Cherkasy', ua: 'Черкаси' },
  chernihiv: { ru: 'Чернигов', en: 'Chernihiv', ua: 'Чернігів' },
  chernivtsi: { ru: 'Черновцы', en: 'Chernivtsi', ua: 'Чернівці' },
  simferopol: { ru: 'Симферополь', en: 'Simferopol', ua: 'Сімферополь' },

  // Profile
  aboutMe: { ru: 'О себе', en: 'About me', ua: 'Про себе' },
  vibe: { ru: 'Вайб', en: 'Vibe', ua: 'Вайб' },
  addToFavorites: { ru: 'Добавить в избранное', en: 'Add to favorites', ua: 'Додати до обраних' },
  sendMessage: { ru: 'Написать', en: 'Message', ua: 'Написати' },
  proposeMeeting: { ru: 'Предложить встречу', en: 'Propose meeting', ua: 'Запропонувати зустріч' },
  blockUser: { ru: 'Заблокировать', en: 'Block', ua: 'Заблокувати' },
  unblockUser: { ru: 'Разблокировать', en: 'Unblock', ua: 'Розблокувати' },

  // Events
  createEvent: { ru: 'Создать событие', en: 'Create event', ua: 'Створити подію' },
  eventName: { ru: 'Название', en: 'Name', ua: 'Назва' },
  eventDescription: { ru: 'Описание', en: 'Description', ua: 'Опис' },
  eventDate: { ru: 'Дата', en: 'Date', ua: 'Дата' },
  eventTime: { ru: 'Время', en: 'Time', ua: 'Час' },
  eventLocation: { ru: 'Место', en: 'Location', ua: 'Місце' },
  participants: { ru: 'Участники', en: 'Participants', ua: 'Учасники' },
  join: { ru: 'Присоединиться', en: 'Join', ua: 'Приєднатися' },
  leave: { ru: 'Выйти', en: 'Leave', ua: 'Вийти' },
  searchEvents: { ru: 'Поиск событий...', en: 'Search events...', ua: 'Пошук подій...' },
  noEventsFound: { ru: 'Событий не найдено', en: 'No events found', ua: 'Подій не знайдено' },

  // About
  aboutApp: { ru: 'О приложении', en: 'About', ua: 'Про додаток' },

  // Friend of the week
  friendOfWeek: { ru: 'Друг недели', en: 'Friend of the week', ua: 'Друг тижня' },

  // Misc
  online: { ru: 'В сети', en: 'Online', ua: 'Онлайн' },
  offline: { ru: 'Не в сети', en: 'Offline', ua: 'Офлайн' },
  rating: { ru: 'Рейтинг', en: 'Rating', ua: 'Рейтинг' },
  save: { ru: 'Сохранить', en: 'Save', ua: 'Зберегти' },
  cancel: { ru: 'Отмена', en: 'Cancel', ua: 'Скасувати' },
  accept: { ru: 'Принять', en: 'Accept', ua: 'Прийняти' },
  decline: { ru: 'Отклонить', en: 'Decline', ua: 'Відхилити' },
  noResults: { ru: 'Ничего не найдено', en: 'Nothing found', ua: 'Нічого не знайдено' },
};

export const cityKeys = [
  'vinnytsia', 'lutsk', 'dnipro', 'donetsk', 'zhytomyr', 'uzhhorod', 'zaporizhzhia',
  'ivanoFrankivsk', 'kyiv', 'kropyvnytskyi', 'luhansk', 'lviv', 'mykolaiv', 'odessa',
  'poltava', 'rivne', 'sumy', 'ternopil', 'kharkiv', 'kherson', 'khmelnytskyi',
  'cherkasy', 'chernihiv', 'chernivtsi', 'simferopol'
] as const;

export const interestKeys = [
  'activeSport', 'creativity', 'handicraft', 'cooking', 'gardening', 'travel',
  'intellectual', 'volunteering', 'collecting', 'technical', 'cultural', 'social', 'hookah'
] as const;

export const drinkKeys = [
  'vodka', 'whiskey', 'cognac', 'rum', 'gin', 'tequila', 'absinthe',
  'wine', 'champagne', 'beer', 'cider', 'vermouth', 'tincture', 'liqueur'
] as const;

export const alcoholLevelKeys = ['light', 'navigator', 'candidate', 'master'] as const;

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] || key;
}
