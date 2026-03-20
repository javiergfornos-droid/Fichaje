import { Shield, Package, Star } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Original",
    description: "Todas nuestras camisetas son verificadas y autenticadas",
  },
  {
    icon: Package,
    title: "Envío seguro",
    description:
      "Envío asegurado con seguimiento a toda Europa y América",
  },
  {
    icon: Star,
    title: "Piezas únicas",
    description: "Cada camiseta es una pieza de colección irrepetible",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 px-6 bg-pitch-black">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="font-[family-name:var(--font-oswald)] uppercase text-floodlight-white text-3xl sm:text-4xl font-bold text-center mb-12">
          ¿Por qué{" "}
          <span className="text-whistle-gold">¡FICHAJE!</span>?
        </h2>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-tunnel-grey border border-tunnel-border rounded-sm p-6 text-center transition-all duration-300 hover:border-whistle-gold/40"
            >
              <div className="flex items-center justify-center mb-4">
                <feature.icon className="w-10 h-10 text-whistle-gold" />
              </div>
              <h3 className="font-[family-name:var(--font-oswald)] uppercase text-floodlight-white text-lg font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-programme-cream text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
