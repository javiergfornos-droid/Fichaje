import { Trophy, Globe, Flame, Crown } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "Primera fichaje",
    description: "Compra tu primera camiseta",
  },
  {
    icon: Globe,
    title: "Trotamundos",
    description: "Camisetas de 5 países distintos",
  },
  {
    icon: Flame,
    title: "Racha de fuego",
    description: "3 compras en una semana",
  },
  {
    icon: Crown,
    title: "Coleccionista élite",
    description: "Completa una liga entera",
  },
];

export default function AchievementsPreview() {
  return (
    <section className="py-20 px-6 bg-[#0A0A0A]/75 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <h2 className="font-[family-name:var(--font-oswald)] uppercase text-floodlight-white text-3xl sm:text-4xl font-bold mb-4">
          Tu colección, tus logros
        </h2>

        {/* "Coming soon" badge */}
        <span className="inline-block px-4 py-1.5 bg-whistle-gold/15 border border-whistle-gold/40 text-whistle-gold font-[family-name:var(--font-jetbrains)] text-xs uppercase rounded-sm mb-12">
          Próximamente
        </span>

        {/* Achievement badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className="bg-tunnel-grey border border-tunnel-border rounded-sm p-5 flex flex-col items-center transition-all duration-300 hover:border-whistle-gold/40"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-pitch-black rounded-full border border-whistle-gold/30 mb-3">
                <achievement.icon className="w-7 h-7 text-whistle-gold" />
              </div>
              <h3 className="font-[family-name:var(--font-oswald)] uppercase text-floodlight-white text-sm font-bold mb-1">
                {achievement.title}
              </h3>
              <p className="text-programme-cream text-xs leading-relaxed">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
