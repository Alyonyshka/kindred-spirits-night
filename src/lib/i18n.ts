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
  removedFromFavorites: { ru: 'Удалить из избранного', en: 'Remove from favorites', ua: 'Видалити з обраних' },
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
  msgForwardedFrom: { ru: 'Переслано от', en: 'Forwarded from', ua: 'Переслано від' },
  msgForwardSelected: { ru: 'Переслать выбранные', en: 'Forward selected', ua: 'Переслати вибрані' },
  msgSelectedCount: { ru: 'Выбрано', en: 'Selected', ua: 'Вибрано' },
  msgChooseChat: { ru: 'Выберите чат', en: 'Choose a chat', ua: 'Виберіть чат' },
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
  aboutSubtitle: {
    ru: 'Приложение «Собутыльник»: Когда друзья хотят завернуться в плед, а ты хочешь в бар',
    en: 'The «Drink Mate» App: When your friends want to wrap up in a blanket, but you want to hit the bar',
    ua: 'Додаток «Співпляшник»: Коли друзі хочуть загорнутися в плед, а ти хочеш у бар',
  },
  aboutIntro: {
    ru: 'Давайте будем честными: у каждого в жизни наступает момент, когда «здоровье уже не то», дел невпроворот, а настроение — просто попить чаю и посмотреть в стену.',
    en: "Let's be honest: there comes a time in everyone's life when \"health isn't what it used to be,\" there's too much to do, and the mood is just to drink tea and stare at the wall.",
    ua: 'Давайте будемо чесними: у кожного в житті настає момент, коли «здоров\'я вже не те», справ купа, а настрій — просто попити чаю і дивитися в стіну.',
  },
  aboutStory: {
    ru: 'Вы горите желанием «бахнуть по коктейльчику», обсуждать мироздание до трех утра и праздновать пятницу так, будто она последняя в истории. А ваши друзья уже не в той форме… вы смотрите на них с нежностью, легкой грустью и понимаете: они не вывезут. Их время героических заплывов в море просекко временно (или навсегда) встало на паузу.',
    en: 'You\'re dying to "knock back a cocktail," discuss the universe until 3 AM, and celebrate Friday like it\'s the last one in history. But your friends are no longer in shape... you look at them with tenderness, slight sadness, and realize: they won\'t make it. Their era of heroic swims in a sea of prosecco has temporarily (or permanently) been put on pause.',
    ua: 'Ви горите бажанням «бахнути по коктейльчику», обговорювати всесвіт до третьої ночі й святкувати п\'ятницю так, ніби вона остання в історії. А ваші друзі вже не в тій формі… ви дивитеся на них з ніжністю, легким сумом і розумієте: вони не вивезуть. Їхній час героїчних запливів у морі просекко тимчасово (чи назавжди) став на паузу.',
  },
  aboutEureka: {
    ru: 'Именно в такой вечер, когда я в очередной раз «отшивала» любимых друзей, меня осенило: «Зачем им ждать меня, если мир полон людей, которые прямо сейчас скучают с полным бокалом?»',
    en: 'It was on one such evening, when I was once again "brushing off" my beloved friends, that it hit me: "Why should they wait for me when the world is full of people who are bored right now with a full glass?"',
    ua: 'Саме в такий вечір, коли я вкотре «відшивала» улюблених друзів, мене осінило: «Навіщо їм чекати на мене, якщо світ повний людей, які саме зараз нудьгують з повним келихом?»',
  },
  aboutManifesto: {
    ru: 'Так родился «Собутыльник» — приложение для тех, кто не хочет пить в одиночестве, и ждать тех, кто, возможно уже никогда не вернётся в алкоголизм вместе с тобой или ещё хуже того - самому бросить пить и встать на путь истины, а ищет новых друзей-алкашей и продолжить этот непростой путь, о котором, возможно напишут книгу, сочинят анекдот или просто возведут в честь тебя памятник!',
    en: 'Thus "Drink Mate" was born — an app for those who don\'t want to drink alone, waiting for those who may never return to alcoholism with you, or worse — quit drinking yourself and walk the path of righteousness. Instead, you\'re looking for new drinking buddies to continue this difficult journey, about which someone might write a book, compose a joke, or simply erect a monument in your honor!',
    ua: 'Так народився «Співпляшник» — додаток для тих, хто не хоче пити на самоті, і чекати тих, хто, можливо, вже ніколи не повернеться в алкоголізм разом з тобою, або ще гірше — самому кинути пити й стати на шлях істини, а шукає нових друзів-алкашів і продовжити цей непростий шлях, про який, можливо, напишуть книгу, складуть анекдот або просто зведуть на честь тебе пам\'ятник!',
  },
  aboutWhyTitle: {
    ru: 'Зачем это нужно?',
    en: 'Why is this needed?',
    ua: 'Навіщо це потрібно?',
  },
  aboutWhyText: {
    ru: 'Мир огромен, но найти человека, с которым «совпадут пазлы» за барной стойкой, бывает квестом. Мы создали пространство, где одиночество превращается в компанию, а вечер — в историю.',
    en: 'The world is huge, but finding someone whose "puzzle pieces match" at a bar can be a quest. We created a space where loneliness turns into company, and an evening into a story.',
    ua: 'Світ величезний, але знайти людину, з якою «пазли складуться» за барною стійкою, буває квестом. Ми створили простір, де самотність перетворюється на компанію, а вечір — на історію.',
  },
  aboutFindTitle: {
    ru: 'В «Собутыльнике» вы найдете:',
    en: 'In "Drink Mate" you\'ll find:',
    ua: 'У «Співпляшнику» ви знайдете:',
  },
  aboutFind1Title: { ru: 'Своих людей:', en: 'Your people:', ua: 'Своїх людей:' },
  aboutFind1Text: {
    ru: 'Тех, кто разделяет ваше мировоззрение, жизненные принципы и чувство юмора.',
    en: 'Those who share your worldview, life principles, and sense of humor.',
    ua: 'Тих, хто поділяє ваш світогляд, життєві принципи та почуття гумору.',
  },
  aboutFind2Title: { ru: 'Родственные души:', en: 'Kindred spirits:', ua: 'Споріднені душі:' },
  aboutFind2Text: {
    ru: 'Кому можно излить душу, рассказать о планах, поныть о грустном или вместе поорать от радости.',
    en: 'Someone you can pour your heart out to, share plans, whine about the sad stuff, or scream with joy together.',
    ua: 'Кому можна вилити душу, розповісти про плани, поскаржитися на сумне або разом покричати від радості.',
  },
  aboutFind3Title: { ru: 'Экспертов и новичков:', en: 'Experts and beginners:', ua: 'Експертів і новачків:' },
  aboutFind3Text: {
    ru: 'Расширяйте кругозор! Узнавайте всё о крафтовом пиве, тонкостях выдержки виски или искусстве смешивания идеального «Негрони».',
    en: 'Broaden your horizons! Learn everything about craft beer, whiskey aging nuances, or the art of mixing the perfect Negroni.',
    ua: 'Розширюйте кругозір! Дізнавайтеся все про крафтове пиво, тонкощі витримки віскі або мистецтво змішування ідеального «Негроні».',
  },
  aboutFind4Title: { ru: 'Коктейль эмоций:', en: 'Cocktail of emotions:', ua: 'Коктейль емоцій:' },
  aboutFind4Text: {
    ru: 'Это не просто про алкоголь. Это про перезагрузку, новые знания и тот самый «вайб», когда тебя понимают с первого тоста.',
    en: "It's not just about alcohol. It's about recharging, new knowledge, and that \"vibe\" when you're understood from the first toast.",
    ua: 'Це не просто про алкоголь. Це про перезавантаження, нові знання і той самий «вайб», коли тебе розуміють з першого тосту.',
  },
  aboutMoreTitle: {
    ru: 'Больше, чем просто «посиделки»',
    en: 'More than just "hangouts"',
    ua: 'Більше, ніж просто «посиденьки»',
  },
  aboutMoreText: {
    ru: 'Я искренне верю: человеку нужен человек. Нам важно быть в обществе, чувствовать себя нужными и услышанными. «Собутыльник» — это про:',
    en: "I sincerely believe: people need people. It's important to be in company, to feel needed and heard. \"Drink Mate\" is about:",
    ua: 'Я щиро вірю: людині потрібна людина. Нам важливо бути в товаристві, почуватися потрібними й почутими. «Співпляшник» — це про:',
  },
  aboutFriendship: { ru: 'Дружбу:', en: 'Friendship:', ua: 'Дружбу:' },
  aboutFriendshipText: {
    ru: 'Которая начинается с фразы «О, ты тоже любишь сухой мартини?».',
    en: 'That starts with "Oh, you also love dry martini?".',
    ua: 'Яка починається з фрази «О, ти теж любиш сухий мартіні?».',
  },
  aboutLove: { ru: 'Любовь:', en: 'Love:', ua: 'Кохання:' },
  aboutLoveText: {
    ru: 'Кто знает, может, ваша судьба сидит в соседнем квартале и тоже ищет компанию на вечер?',
    en: 'Who knows, maybe your destiny is sitting in the next block, also looking for company tonight?',
    ua: 'Хто знає, може ваша доля сидить у сусідньому кварталі і теж шукає компанію на вечір?',
  },
  aboutReboot: { ru: 'Перезагрузку:', en: 'Recharging:', ua: 'Перезавантаження:' },
  aboutRebootText: {
    ru: 'Чтобы выплеснуть стресс и вернуться в жизнь обновленным.',
    en: 'To release stress and return to life refreshed.',
    ua: 'Щоб виплеснути стрес і повернутися в життя оновленим.',
  },
  aboutManifestoFinal: {
    ru: 'Мой манифест: Я не могу пить с вами так часто, как раньше, но я создала целую вселенную, чтобы вы никогда не чувствовали себя одинокими. Живите ярко, пейте ответственно и находите своих!',
    en: "My manifesto: I can't drink with you as often as before, but I've created an entire universe so you never feel alone. Live brightly, drink responsibly, and find your people!",
    ua: 'Мій маніфест: Я не можу пити з вами так часто, як раніше, але я створила цілий всесвіт, щоб ви ніколи не почувалися самотніми. Живіть яскраво, пийте відповідально й знаходьте своїх!',
  },
  aboutInsideTitle: {
    ru: 'Что внутри?',
    en: "What's inside?",
    ua: 'Що всередині?',
  },
  aboutSearch: { ru: 'Поиск по интересам:', en: 'Search by interests:', ua: 'Пошук за інтересами:' },
  aboutSearchText: {
    ru: 'От ядерной физики до разведения кактусов.',
    en: 'From nuclear physics to cactus breeding.',
    ua: 'Від ядерної фізики до розведення кактусів.',
  },
  aboutTaste: { ru: 'Вкусовые эксперименты:', en: 'Taste experiments:', ua: 'Смакові експерименти:' },
  aboutTasteText: {
    ru: 'Гайд по напиткам и коктейльная карта твоих возможностей.',
    en: 'A drink guide and a cocktail menu of your possibilities.',
    ua: 'Гайд по напоях і коктейльна карта твоїх можливостей.',
  },
  aboutSafety: { ru: 'Безопасность и коннект:', en: 'Safety and connection:', ua: 'Безпека та конект:' },
  aboutSafetyText: {
    ru: 'Выбирай компанию, которая тебе по душе, и назначай встречу в пару кликов.',
    en: 'Choose company you like and set up a meeting in a couple of clicks.',
    ua: 'Обирай компанію, яка тобі до душі, і призначай зустріч у пару кліків.',
  },
  aboutCTA: {
    ru: 'Хватит ждать особого случая или когда у друзей освободится вечер. Скачивай «Собутыльник» — твой идеальный вечер уже заждался тебя в баре!',
    en: 'Stop waiting for a special occasion or for your friends to free up their evening. Download "Drink Mate" — your perfect night out is already waiting for you at the bar!',
    ua: 'Досить чекати особливого випадку або коли у друзів звільниться вечір. Завантажуй «Співпляшник» — твій ідеальний вечір вже заждався тебе в барі!',
  },

  // Chat extras
  stickers: { ru: 'Стикеры', en: 'Stickers', ua: 'Стікери' },
  gifs: { ru: 'GIF', en: 'GIF', ua: 'GIF' },
  searchGif: { ru: 'Искать GIF...', en: 'Search GIF...', ua: 'Шукати GIF...' },

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
  rateAfterMeeting: { ru: 'Доступно только после цифрового брудершафта', en: 'Available only after the digital Brudershaft', ua: 'Доступно лише після цифрового брудершафту' },
  weMet: { ru: 'Мы встретились!', en: 'We met!', ua: 'Ми зустрілися!' },
  scanBrudershaft: { ru: 'Отсканировать брудершафт', en: 'Scan Brudershaft', ua: 'Сканувати брудершафт' },
  brudershaftTitle: { ru: 'Цифровой брудершафт', en: 'Digital Brudershaft', ua: 'Цифровий брудершафт' },
  brudershaftDesc: { ru: 'Чтобы подтвердить, что вы нашли собутыльника, стукнитесь телефонами и отсканируйте код!', en: 'To confirm you found a drinking buddy, clink your phones and scan the code!', ua: 'Щоб підтвердити, що ви знайшли собутильника, стукніться телефонами і відскануйте код!' },
  brudershaftYourCode: { ru: 'Ваш код', en: 'Your code', ua: 'Ваш код' },
  brudershaftEnterCode: { ru: 'Введите код партнёра', en: 'Enter partner\'s code', ua: 'Введіть код партнера' },
  brudershaftConfirm: { ru: 'Подтвердить', en: 'Confirm', ua: 'Підтвердити' },
  brudershaftWrong: { ru: 'Неверный код', en: 'Wrong code', ua: 'Невірний код' },
  brudershaftWaiting: { ru: 'Ожидаем, пока партнёр введёт код...', en: 'Waiting for partner to enter the code...', ua: 'Очікуємо, поки партнер введе код...' },
  brudershaftConfirmed: { ru: 'Брудершафт подтверждён! Можно ставить оценки.', en: 'Brudershaft confirmed! You can now rate each other.', ua: 'Брудершафт підтверджено! Тепер можна ставити оцінки.' },
  brudershaftAlreadyDone: { ru: 'Вы уже выпили на брудершафт!', en: 'You already had the Brudershaft!', ua: 'Ви вже випили на брудершафт!' },
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
