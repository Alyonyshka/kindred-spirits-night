import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';

const content = {
  ru: {
    title: 'Политика конфиденциальности мобильного приложения «Собутыльник»',
    intro:
      'Настоящая Политика конфиденциальности описывает, как Администрация приложения собирает, использует и защищает вашу личную информацию. Мы уважаем вашу конфиденциальность и стремимся защитить ваши персональные данные.',
    sections: [
      {
        title: '1. Какие данные мы собираем',
        body: '1.1. Информация профиля: При регистрации вы предоставляете нам свое имя (или никнейм), электронную почту, данные о возрасте (18+), поле и фотографию профиля.\n1.2. Геолокация: Для поиска компании и отображения баров или событий поблизости приложение запрашивает доступ к геопозиции вашего устройства.\n1.3. Сообщения: Мы храним историю ваших чатов исключительно для обеспечения работы функции обмена сообщениями между пользователями.',
      },
      {
        title: '2. Как мы используем ваши данные',
        body: '2.1. Для обеспечения работы основных функций приложения (создание профиля, поиск компании в барах, отображение на карте).\n2.2. Для модерации и безопасности: данные могут использоваться для рассмотрения жалоб на неадекватное поведение или блокировки нарушителей.',
      },
      {
        title: '3. Передача данных третьим лицам',
        body: '3.1. Мы НИКОГДА не продаем, не передаем и не разглашаем ваши личные данные, номера телефонов или историю переписки третьим лицам или рекламным компаниям.\n3.2. Доступ к вашим данным может быть предоставлен правоохранительным органам исключительно в случаях, предусмотренных действующим законодательством.',
      },
      {
        title: '4. Защита и хранение данных',
        body: '4.1. Все данные пользователей надежно хранятся в зашифрованной базе данных (Supabase). Мы принимаем все необходимые технические меры для защиты от несанкционированного доступа.\n4.2. Вы имеете право в любой момент удалить свой аккаунт через настройки приложения, после чего все ваши персональные данные будут безвозвратно удалены из базы.',
      },
    ],
  },
  ua: {
    title: 'Політика конфіденційності мобільного додатка «Собутыльник»',
    intro:
      'Ця Політика конфіденційності описує, як Адміністрація додатка збирає, використовує та захищає вашу особисту інформацію. Ми поважаємо вашу конфіденційність і прагнемо захистити ваші персональні дані.',
    sections: [
      {
        title: '1. Які дані ми збираємо',
        body: '1.1. Інформація профілю: При реєстрації ви надаєте нам своє ім\'я (або нікнейм), електронну пошту, дані про вік (18+), стать та фотографію профілю.\n1.2. Геолокація: Для пошуку компанії та відображення барів або подій поблизу додаток запитує доступ до геопозиції вашого пристрою.\n1.3. Повідомлення: Ми зберігаємо історію ваших чатів виключно для забезпечення роботи функції обміну повідомленнями між користувачами.',
      },
      {
        title: '2. Як ми використовуємо ваші дані',
        body: '2.1. Для забезпечення роботи основних функцій додатка (створення профілю, пошук компанії в барах, відображення на карті).\n2.2. Для модерації та безпеки: дані можуть використовуватися для розгляду скарг на неадекватну поведінку або блокування порушників.',
      },
      {
        title: '3. Передача даних третім особам',
        body: '3.1. Ми НІКОЛИ не продаємо, не передаємо та не розголошуємо ваші особисті дані, номери телефонів або історію листування третім особам чи рекламним компаніям.\n3.2. Доступ до ваших даних може бути наданий правоохоронним органам виключно у випадках, передбачених чинним законодавством України.',
      },
      {
        title: '4. Захист та зберігання даних',
        body: '4.1. Всі дані користувачів надійно зберігаються у зашифрованій базі даних (Supabase). Ми вживаємо всіх необхідних технічних заходів для захисту від несанкціонованого доступу.\n4.2. Ви маєте право в будь-який момент видалити свій акаунт через налаштування додатка, після чого всі ваші персональні дані будуть безповоротно видалені з бази.',
      },
    ],
  },
  en: {
    title: 'Privacy Policy of the «Drink Mate» mobile application',
    intro:
      'This Privacy Policy describes how the Application Administration collects, uses and protects your personal information. We respect your privacy and strive to protect your personal data.',
    sections: [
      {
        title: '1. What data we collect',
        body: '1.1. Profile information: During registration you provide us with your name (or nickname), email, age data (18+), gender and profile photo.\n1.2. Geolocation: To find company and display nearby bars or events, the application requests access to your device\'s geolocation.\n1.3. Messages: We store your chat history solely to power the messaging feature between users.',
      },
      {
        title: '2. How we use your data',
        body: '2.1. To provide the core features of the application (creating a profile, finding company in bars, displaying on the map).\n2.2. For moderation and safety: data may be used to review complaints about inappropriate behavior or to block offenders.',
      },
      {
        title: '3. Sharing data with third parties',
        body: '3.1. We NEVER sell, transfer or disclose your personal data, phone numbers or message history to third parties or advertising companies.\n3.2. Access to your data may be provided to law enforcement authorities solely in cases provided for by applicable law.',
      },
      {
        title: '4. Protection and storage of data',
        body: '4.1. All user data is securely stored in an encrypted database (Supabase). We take all necessary technical measures to protect against unauthorized access.\n4.2. You have the right at any time to delete your account through the application settings, after which all your personal data will be permanently erased from the database.',
      },
    ],
  },
};

export default function Privacy() {
  const { language } = useApp();
  const c = content[language] ?? content.ru;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <header className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-black amber-glow-strong">{c.title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">{c.intro}</p>
      </header>

      <div className="space-y-5">
        {c.sections.map((s) => (
          <section key={s.title} className="glass-panel p-5 rounded-2xl">
            <h2 className="text-lg font-bold amber-glow mb-2">{s.title}</h2>
            <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
              {s.body}
            </p>
          </section>
        ))}
      </div>
    </motion.div>
  );
}
