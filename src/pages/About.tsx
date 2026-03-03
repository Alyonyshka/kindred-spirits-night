import { Heart, Users, GlassWater, Search, Shield, Sparkles, Wine, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function About() {
  return (
    <div className="space-y-6 pb-8">
      {/* Hero */}
      <motion.div className="text-center py-4" {...fadeIn(0)}>
        <h1 className="text-2xl font-black amber-glow-strong mb-1">СОБУТЫЛЬНИК</h1>
        <p className="text-xs tracking-[0.15em] text-muted-foreground font-medium">THE NIGHT OUT COMPANION</p>
      </motion.div>

      {/* Subtitle */}
      <motion.div className="glass-panel-strong p-5 text-center" {...fadeIn(0.1)}>
        <p className="text-lg font-bold text-foreground leading-snug">
          Приложение «Собутыльник»: Когда друзья хотят в бар, а ты хочешь в плед
        </p>
      </motion.div>

      {/* Main story */}
      <motion.div className="glass-panel p-5 space-y-4 text-sm leading-relaxed text-secondary-foreground" {...fadeIn(0.2)}>
        <p>
          Давайте будем честными: у каждого в жизни наступает момент, когда «здоровье уже не то», дел невпроворот, а настроение — просто попить чаю и посмотреть в стену.
        </p>
        <p>
          Знакомая картина? Ваши близкие горят желанием «бахнуть по коктейльчику», обсуждать мироздание до трех утра и праздновать пятницу так, будто она последняя в истории. А вы… вы смотрите на них с нежностью, легкой грустью и понимаете: я не вывезу. Мое время героических заплывов в море просекко временно (или навсегда) встало на паузу.
        </p>
        <p>
          Именно в такой вечер, когда я в очередной раз «отшивала» любимых друзей, меня осенило: «Зачем им ждать меня, если мир полон людей, которые прямо сейчас скучают с полным бокалом?»
        </p>
        <p className="font-semibold text-foreground">
          <GlassWater size={16} className="inline text-primary mr-1.5 -mt-0.5" />
          Так родился «Собутыльник» — приложение для тех, кто не хочет пить в одиночестве, и для тех, кто, как и я, хочет отправить своих друзей в надежные руки (и печень)!
        </p>
      </motion.div>

      {/* Зачем это нужно */}
      <motion.div className="glass-panel p-5 space-y-4" {...fadeIn(0.3)}>
        <h2 className="text-base font-bold amber-glow flex items-center gap-2">
          <Sparkles size={18} />
          Зачем это нужно?
        </h2>
        <p className="text-sm leading-relaxed text-secondary-foreground">
          Мир огромен, но найти человека, с которым «совпадут пазлы» за барной стойкой, бывает квестом. Мы создали пространство, где одиночество превращается в компанию, а вечер — в историю.
        </p>
      </motion.div>

      {/* Что найдете */}
      <motion.div className="glass-panel p-5 space-y-4" {...fadeIn(0.4)}>
        <h2 className="text-base font-bold amber-glow flex items-center gap-2">
          <Wine size={18} />
          В «Собутыльнике» вы найдете:
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: <Users size={16} className="text-primary mt-0.5 shrink-0" />,
              title: 'Своих людей:',
              text: 'Тех, кто разделяет ваше мировоззрение, жизненные принципы и чувство юмора.',
            },
            {
              icon: <Heart size={16} className="text-primary mt-0.5 shrink-0" />,
              title: 'Родственные души:',
              text: 'Кому можно излить душу, рассказать о планах, поныть о грустном или вместе поорать от радости.',
            },
            {
              icon: <GlassWater size={16} className="text-primary mt-0.5 shrink-0" />,
              title: 'Экспертов и новичков:',
              text: 'Расширяйте кругозор! Узнавайте всё о крафтовом пиве, тонкостях выдержки виски или искусстве смешивания идеального «Негрони».',
            },
            {
              icon: <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />,
              title: 'Коктейль эмоций:',
              text: 'Это не просто про алкоголь. Это про перезагрузку, новые знания и тот самый «вайб», когда тебя понимают с первого тоста.',
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 text-sm leading-relaxed text-secondary-foreground">
              {item.icon}
              <p><span className="font-semibold text-foreground">{item.title}</span> {item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Больше чем посиделки */}
      <motion.div className="glass-panel p-5 space-y-4" {...fadeIn(0.5)}>
        <h2 className="text-base font-bold amber-glow flex items-center gap-2">
          <PartyPopper size={18} />
          Больше, чем просто «посиделки»
        </h2>
        <p className="text-sm leading-relaxed text-secondary-foreground">
          Я искренне верю: человеку нужен человек. Нам важно быть в обществе, чувствовать себя нужными и услышанными. «Собутыльник» — это про:
        </p>
        <div className="space-y-2 text-sm leading-relaxed text-secondary-foreground pl-1">
          <p><span className="font-semibold text-foreground">Дружбу:</span> Которая начинается с фразы «О, ты тоже любишь сухой мартини?».</p>
          <p><span className="font-semibold text-foreground">Любовь:</span> Кто знает, может, ваша судьба сидит в соседнем квартале и тоже ищет компанию на вечер?</p>
          <p><span className="font-semibold text-foreground">Перезагрузку:</span> Чтобы выплеснуть стресс и вернуться в жизнь обновленным.</p>
        </div>
      </motion.div>

      {/* Манифест */}
      <motion.div className="glass-panel-strong p-5 amber-border-glow" {...fadeIn(0.6)}>
        <p className="text-sm leading-relaxed text-foreground italic text-center">
          <Heart size={14} className="inline text-primary mr-1 -mt-0.5" />
          Мой манифест: Я не могу пить с вами так часто, как раньше, но я создала целую вселенную, чтобы вы никогда не чувствовали себя одинокими. Живите ярко, пейте ответственно и находите своих!
        </p>
      </motion.div>

      {/* Что внутри */}
      <motion.div className="glass-panel p-5 space-y-4" {...fadeIn(0.7)}>
        <h2 className="text-base font-bold amber-glow flex items-center gap-2">
          <Search size={18} />
          Что внутри?
        </h2>
        <div className="space-y-2 text-sm leading-relaxed text-secondary-foreground pl-1">
          <p><span className="font-semibold text-foreground">Поиск по интересам:</span> От ядерной физики до разведения кактусов.</p>
          <p><span className="font-semibold text-foreground">Вкусовые эксперименты:</span> Гайд по напиткам и коктейльная карта твоих возможностей.</p>
          <p>
            <Shield size={14} className="inline text-primary mr-1 -mt-0.5" />
            <span className="font-semibold text-foreground">Безопасность и коннект:</span> Выбирай компанию, которая тебе по душе, и назначай встречу в пару кликов.
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div className="glass-panel-strong p-5 text-center" {...fadeIn(0.8)}>
        <p className="text-sm leading-relaxed text-foreground font-medium">
          Хватит ждать особого случая или когда у друзей освободится вечер. Скачивай «Собутыльник» — твой идеальный вечер уже заждался тебя в баре!
        </p>
      </motion.div>

      <motion.p className="text-xs text-muted-foreground text-center pt-2" {...fadeIn(0.9)}>
        © 2026 СОБУТЫЛЬНИК • Made with 🥃 and ❤️
      </motion.p>
    </div>
  );
}
