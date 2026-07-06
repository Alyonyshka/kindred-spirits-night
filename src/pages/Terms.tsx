import { useApp } from '@/contexts/AppContext';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const content = {
  ru: {
    title: 'Условия использования мобильного приложения «Собутыльник»',
    subtitle: '(Публичная оферта и отказ от ответственности)',
    disclaimer:
      'ВНИМАНИЕ! Приложение предназначено строго для лиц старше 18 лет. Администрация не несет ответственности за поведение людей на реальных встречах и призывает к умеренному и ответственному потреблению.',
    sections: [
      {
        title: '1. Общие положения',
        body: '1.1. Данное Пользовательское соглашение является юридически обязательным договором между Пользователем и Администрацией приложения «Собутыльник».\n1.2. Используя это приложение, вы автоматически подтверждаете, что вам исполнилось 18 лет, вы обладаете полной дееспособностью и согласны со всеми условиями, изложенными в данном документе.',
      },
      {
        title: '2. Ограничение по возрасту',
        body: '2.1. Доступ к приложению лицам младше 18 лет строго запрещен. Администрация имеет право в любой момент потребовать подтверждения возраста (верификацию) или заблокировать аккаунт в случае подозрения на нарушение этого правила.',
      },
      {
        title: '3. Отказ от ответственности (Limitation of Liability)',
        body: '3.1. Приложение «Собутыльник» является исключительно платформой (техническим инструментом) для поиска компании по интересам и организации досуга пользователей.\n3.2. Администрация приложения не осуществляет проверку личных качеств, психического состояния или криминального прошлого пользователей.\n3.3. Администрация не несет ответственности за любые действия пользователей за пределами приложения, включая поведение на реальных встречах, личные конфликты, полученные травмы, материальный ущерб или любые другие последствия офлайн-общения.\n3.4. Вся ответственность за собственную безопасность во время реальных встреч возлагается исключительно на самих пользователей. Администрация настоятельно рекомендует проводить первые встречи исключительно в общественных местах (барах, кафе, пабах) и сообщать близким о своем местонахождении.',
      },
      {
        title: '4. Культура потребления и здоровье',
        body: '4.1. Приложение не занимается пропагандой, продажей или распространением алкогольных напитков.\n4.2. Администрация приложения выступает за культуру умеренного потребления и напоминает, что чрезмерное употребление алкоголя вредит вашему здоровью. Пользователи самостоятельно контролируют уровень потребления и несут за это полную ответственность.',
      },
      {
        title: '5. Модерация и правила поведения',
        body: '5.1. В приложении строго запрещено: распространение спама, мошенничество, оскорбления, использование нецензурной лексики, загрузка непристойных фотографий (18+) в профиле.\n5.2. Администрация оставляет за собой право без предупреждения заблокировать (забанить) любого пользователя в случае поступления жалоб от других участников сообщества.',
      },
    ],
  },
  ua: {
    title: 'Умови використання мобільного додатка «Собутыльник»',
    subtitle: '(Публічна оферта та відмова від відповідальності)',
    disclaimer:
      'УВАГА! Додаток призначений строго для осіб старше 18 років. Адміністрація не несе відповідальності за поведінку людей на реальних зустрічах і закликає до помірного та відповідального споживання.',
    sections: [
      {
        title: '1. Загальні положення',
        body: '1.1. Ця Угода користувача є юридично обов\'язковим договором між Користувачем та Адміністрацією додатка «Собутыльник».\n1.2. Використовуючи цей додаток, ви автоматично підтверджуєте, що вам виповнилося 18 років, ви володієте повною дієздатністю та згодні з усіма умовами, викладеними в цьому документі.',
      },
      {
        title: '2. Обмеження за віком',
        body: '2.1. Доступ до додатка особам молодше 18 років суворо заборонений. Адміністрація має право в будь-який момент вимагати підтвердження віку (верифікацію) або заблокувати акаунт у разі підозри на порушення цього правила.',
      },
      {
        title: '3. Відмова від відповідальності (Limitation of Liability)',
        body: '3.1. Додаток «Собутыльник» є виключно платформою (технічним інструментом) для пошуку компанії за інтересами та організації дозвілля користувачів.\n3.2. Адміністрація додатка не здійснює перевірку особистих якостей, психічного стану чи кримінального минулого користувачів.\n3.3. Адміністрація не несе відповідальності за будь-які дії користувачів за межами додатка, включаючи поведінку на реальних зустрічах, особисті конфлікти, отримані травми, матеріальні збитки чи будь-які інші наслідки офлайн-спілкування.\n3.4. Вся відповідальність за власну безпеку під час реальних зустрічей покладається виключно на самих користувачів. Адміністрація наполегливо рекомендує проводити перші зустрічі виключно в громадських місцях (барах, кафе, пабах) та повідомляти близьким про своє місцезнаходження.',
      },
      {
        title: '4. Культура споживання та здоров\'я',
        body: '4.1. Додаток не займається пропагандою, продажем або розповсюдженням алкогольних напоїв.\n4.2. Адміністрація додатка виступає за культуру помірного споживання та нагадує, що надмірне вживання алкоголю шкодить вашому здоров\'ю. Користувачі самостійно контролюють рівень споживання та несуть за це повну відповідальність.',
      },
      {
        title: '5. Модерація та правила поведінки',
        body: '5.1. У додатку суворо заборонено: поширення спаму, шахрайство, образи, використання нецензурної лексики, завантаження непристойних фотографій (18+) у профілі.\n5.2. Адміністрація залишає за собою право без попередження заблокувати (забанити) будь-якого користувача у разі надходження скарг від інших учасників спільноти.',
      },
    ],
  },
  en: {
    title: 'Terms of Use of the «Drink Mate» mobile application',
    subtitle: '(Public offer and disclaimer)',
    disclaimer:
      'ATTENTION! The application is intended strictly for persons over 18 years of age. The Administration is not responsible for the behavior of people at real-life meetings and encourages moderate and responsible consumption.',
    sections: [
      {
        title: '1. General Provisions',
        body: '1.1. This User Agreement is a legally binding contract between the User and the Administration of the «Drink Mate» application.\n1.2. By using this application, you automatically confirm that you are at least 18 years old, have full legal capacity, and agree to all conditions set out in this document.',
      },
      {
        title: '2. Age Restriction',
        body: '2.1. Access to the application for persons under 18 years of age is strictly prohibited. The Administration reserves the right to demand age verification at any time or to block an account if a violation of this rule is suspected.',
      },
      {
        title: '3. Limitation of Liability',
        body: '3.1. «Drink Mate» is solely a platform (a technical tool) for finding company by interests and organising users\' leisure.\n3.2. The Administration does not verify the personal qualities, mental state or criminal background of users.\n3.3. The Administration is not responsible for any actions of users outside the application, including behavior at real-life meetings, personal conflicts, injuries, material damage or any other consequences of offline communication.\n3.4. All responsibility for personal safety during real-life meetings rests solely with the users themselves. The Administration strongly recommends holding first meetings exclusively in public places (bars, cafes, pubs) and informing loved ones about your location.',
      },
      {
        title: '4. Culture of Consumption and Health',
        body: '4.1. The application does not promote, sell or distribute alcoholic beverages.\n4.2. The Administration advocates a culture of moderate consumption and reminds you that excessive alcohol consumption is harmful to your health. Users independently control their level of consumption and bear full responsibility for it.',
      },
      {
        title: '5. Moderation and Rules of Conduct',
        body: '5.1. Strictly prohibited in the application: spam, fraud, insults, use of profanity, uploading indecent (18+) photos in the profile.\n5.2. The Administration reserves the right, without warning, to block (ban) any user upon receiving complaints from other members of the community.',
      },
    ],
  },
};

export default function Terms() {
  const { language } = useApp();
  const c = content[language] ?? content.ru;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <header className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-black amber-glow-strong">{c.title}</h1>
        <p className="text-sm text-muted-foreground">{c.subtitle}</p>
      </header>

      <div className="glass-panel-strong border-2 border-destructive/70 rounded-2xl p-5 flex gap-3 items-start bg-destructive/10">
        <AlertTriangle className="text-destructive shrink-0 mt-0.5" size={28} />
        <p className="text-base md:text-lg font-bold text-destructive leading-snug">
          {c.disclaimer}
        </p>
      </div>

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
