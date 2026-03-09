export type Language = 'ru' | 'en' | 'ua';

export const translations: Record<string, Record<Language, string>> = {
  // App name
  appName: { ru: 'СОБУТЫЛЬНИК', en: 'DRINK MATE', ua: 'СПІВПЛЯШНИК' },
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
  profileName: { ru: 'Имя', en: 'Name', ua: 'Ім\'я' },
  myCity: { ru: 'Мой город', en: 'My city', ua: 'Моє місто' },
  meetingRequestSent: { ru: 'Запрос на встречу отправлен!', en: 'Meeting request sent!', ua: 'Запит на зустріч надіслано!' },
  meetingAccepted: { ru: 'Встреча принята!', en: 'Meeting accepted!', ua: 'Зустріч прийнята!' },
  meetingDeclined: { ru: 'Встреча отклонена', en: 'Meeting declined', ua: 'Зустріч відхилена' },
  addedToFavorites: { ru: 'Добавлено в избранное!', en: 'Added to favorites!', ua: 'Додано до обраних!' },
  removedFromFavorites: { ru: 'Удалено из избранного', en: 'Removed from favorites', ua: 'Видалено з обраних' },
  userBlocked: { ru: 'Пользователь заблокирован', en: 'User blocked', ua: 'Користувача заблоковано' },
  userUnblocked: { ru: 'Пользователь разблокирован', en: 'User unblocked', ua: 'Користувача розблоковано' },
  profileSaved: { ru: 'Профиль сохранён!', en: 'Profile saved!', ua: 'Профіль збережено!' },
  typeMessage: { ru: 'Написать сообщение...', en: 'Type a message...', ua: 'Написати повідомлення...' },
  send: { ru: 'Отправить', en: 'Send', ua: 'Надіслати' },
  typing: { ru: 'Печатает...', en: 'Typing...', ua: 'Друкує...' },
  voiceMessage: { ru: 'Голосовое сообщение', en: 'Voice message', ua: 'Голосове повідомлення' },
  recording: { ru: 'Запись...', en: 'Recording...', ua: 'Запис...' },
  photoSent: { ru: 'Фото отправлено', en: 'Photo sent', ua: 'Фото надіслано' },
  videoSent: { ru: 'Видео отправлено', en: 'Video sent', ua: 'Відео надіслано' },
  msgReply: { ru: 'Ответить', en: 'Reply', ua: 'Відповісти' },
  msgCopy: { ru: 'Копировать', en: 'Copy', ua: 'Копіювати' },
  msgEdit: { ru: 'Изменить', en: 'Edit', ua: 'Змінити' },
  msgForward: { ru: 'Переслать', en: 'Forward', ua: 'Переслати' },
  msgDownload: { ru: 'Загрузить', en: 'Download', ua: 'Завантажити' },
  msgDelete: { ru: 'Удалить', en: 'Delete', ua: 'Видалити' },
  msgDeleted: { ru: 'Сообщение удалено', en: 'Message deleted', ua: 'Повідомлення видалено' },
  msgEdited: { ru: 'изменено', en: 'edited', ua: 'змінено' },
  msgForwarded: { ru: 'Сообщение переслано', en: 'Message forwarded', ua: 'Повідомлення переслано' },
  msgCopied: { ru: 'Скопировано', en: 'Copied', ua: 'Скопійовано' },
  myEvents: { ru: 'Мои события', en: 'My Events', ua: 'Мої події' },
  myMeetings: { ru: 'Мои встречи', en: 'My Meetings', ua: 'Мої зустрічі' },
  noEvents: { ru: 'Нет событий', en: 'No events', ua: 'Немає подій' },
  noMeetings: { ru: 'Нет встреч', en: 'No meetings', ua: 'Немає зустрічей' },
  joinedEvent: { ru: 'Вы присоединились!', en: 'You joined!', ua: 'Ви приєдналися!' },
  leftEvent: { ru: 'Вы вышли из события', en: 'You left the event', ua: 'Ви вийшли з події' },
  eventCreated: { ru: 'Событие создано!', en: 'Event created!', ua: 'Подію створено!' },
  maxParticipants: { ru: 'Макс. участников', en: 'Max participants', ua: 'Макс. учасників' },
  uploadPhoto: { ru: 'Загрузить фото', en: 'Upload photo', ua: 'Завантажити фото' },
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

  // Auth
  signIn: { ru: 'Войти', en: 'Sign In', ua: 'Увійти' },
  signUp: { ru: 'Регистрация', en: 'Sign Up', ua: 'Реєстрація' },
  password: { ru: 'Пароль', en: 'Password', ua: 'Пароль' },
  haveAccount: { ru: 'Уже есть аккаунт?', en: 'Already have an account?', ua: 'Вже є акаунт?' },
  noAccount: { ru: 'Нет аккаунта?', en: 'No account?', ua: 'Немає акаунту?' },
  checkEmail: { ru: 'Проверьте почту для подтверждения!', en: 'Check your email to confirm!', ua: 'Перевірте пошту для підтвердження!' },
  logOut: { ru: 'Выйти из аккаунта', en: 'Log out', ua: 'Вийти з акаунту' },
  pending: { ru: 'В ожидании', en: 'Pending', ua: 'В очікуванні' },
  confirmed: { ru: 'Подтверждено', en: 'Confirmed', ua: 'Підтверджено' },
  declined: { ru: 'Отклонено', en: 'Declined', ua: 'Відхилено' },
  confirmMeeting: { ru: 'Подтвердить встречу', en: 'Confirm meeting', ua: 'Підтвердити зустріч' },
  forgotPassword: { ru: 'Забыли пароль?', en: 'Forgot password?', ua: 'Забули пароль?' },
  resetPassword: { ru: 'Сбросить пароль', en: 'Reset password', ua: 'Скинути пароль' },
  newPassword: { ru: 'Новый пароль', en: 'New password', ua: 'Новий пароль' },
  resetEmailSent: { ru: 'Ссылка для сброса пароля отправлена на почту!', en: 'Password reset link sent to your email!', ua: 'Посилання для скидання пароля надіслано на пошту!' },
  passwordUpdated: { ru: 'Пароль успешно обновлён!', en: 'Password updated successfully!', ua: 'Пароль успішно оновлено!' },
  setNewPassword: { ru: 'Установить новый пароль', en: 'Set new password', ua: 'Встановити новий пароль' },
  blockedCannotAction: { ru: 'Действие невозможно: пользователь заблокирован', en: 'Action blocked: user is blocked', ua: 'Дію заблоковано: користувача заблоковано' },
  sent: { ru: 'Отправлено', en: 'Sent', ua: 'Надіслано' },

  // Misc
  online: { ru: 'В сети', en: 'Online', ua: 'Онлайн' },
  offline: { ru: 'Не в сети', en: 'Offline', ua: 'Офлайн' },
  rating: { ru: 'Рейтинг', en: 'Rating', ua: 'Рейтинг' },
  save: { ru: 'Сохранить', en: 'Save', ua: 'Зберегти' },
  cancel: { ru: 'Отмена', en: 'Cancel', ua: 'Скасувати' },
  accept: { ru: 'Принять', en: 'Accept', ua: 'Прийняти' },
  decline: { ru: 'Отклонить', en: 'Decline', ua: 'Відхилити' },
  noResults: { ru: 'Ничего не найдено', en: 'Nothing found', ua: 'Нічого не знайдено' },
  loading: { ru: 'Загрузка...', en: 'Loading...', ua: 'Завантаження...' },
  deleted: { ru: 'Удалено', en: 'Deleted', ua: 'Видалено' },

  // Adventure generator
  missionNight: { ru: 'МИССИЯ: НОЧЬ', en: 'MISSION: NIGHT', ua: 'МІСІЯ: НІЧ' },
  adventureGenerator: { ru: 'Генератор приключений', en: 'Adventure Generator', ua: 'Генератор пригод' },
  generatePlan: { ru: 'План на вечер', en: 'Evening Plan', ua: 'План на вечір' },
  generatingPlan: { ru: 'Генерируем безумный план...', en: 'Generating a crazy plan...', ua: 'Генеруємо шалений план...' },
  tapToSkip: { ru: 'Нажмите, чтобы пропустить анимацию', en: 'Tap to skip animation', ua: 'Натисніть, щоб пропустити анімацію' },
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
