import { Heart, Users, GlassWater } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6 pb-8">
      <div className="text-center">
        <h1 className="text-2xl font-black amber-glow-strong mb-2">СОБУТЫЛЬНИК</h1>
        <p className="text-sm text-muted-foreground">THE NIGHT OUT COMPANION</p>
      </div>

      <div className="glass-panel p-6 space-y-4 text-sm leading-relaxed text-secondary-foreground">
        <p>
          Это приложение родилось в один из тех вечеров, когда хочется выйти, но не с кем. 
          Момент, когда ты понимаешь, что хочешь не просто выпить — а разделить этот момент с кем-то. 
          Кем-то, кто понимает.
        </p>
        <p>
          <GlassWater size={16} className="inline text-primary mr-1" />
          Мы создали это, чтобы объединять людей. Чтобы можно было найти товарищей, друзей, 
          собутыльников — по интересам, мировоззрению, по жизненным принципам.
        </p>
        <p>
          <Users size={16} className="inline text-primary mr-1" />
          Здесь ты расширишь свои знания, откроешь для себя вкусовые эксперименты, 
          узнаешь разнообразность напитков и коктейлей. Расслабление, познание этого мира 
          с разных сторон. Коктейль эмоций, чувств.
        </p>
        <p>
          <Heart size={16} className="inline text-primary mr-1" />
          Общаться, дружить, встречаться, радоваться, бухать, перезагружаться. 
          Как важно быть в обществе и быть нужным со своими людьми в своей среде. 
          Возможно, ты найдёшь здесь любовь.
        </p>
        <p className="text-xs text-muted-foreground text-center mt-6">
          © 2026 СОБУТЫЛЬНИК • Made with 🥃 and ❤️
        </p>
      </div>
    </div>
  );
}
