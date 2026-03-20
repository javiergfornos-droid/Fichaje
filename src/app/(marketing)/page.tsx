import Hero from "@/components/landing/Hero";
import ShirtCard from "@/components/landing/ShirtCard";
import DropCountdown from "@/components/landing/DropCountdown";
import TrustSection from "@/components/landing/TrustSection";
import AchievementsPreview from "@/components/landing/AchievementsPreview";
import Link from "next/link";

// Demo featured shirts — in production fetched from Supabase
const FEATURED_SHIRTS = [
  { name: "Arsenal Bruised Banana", season: "1991-93", type: "Visitante", stars: 4, price: 450 },
  { name: "Barcelona Home UCL Final", season: "2005-06", type: "Local", stars: 5, price: 1200 },
  { name: "Juventus Home UCL Winners", season: "1995-96", type: "Local", stars: 5, price: 750 },
  { name: "Arsenal Home Invincibles", season: "2003-04", type: "Local", stars: 5, price: 850 },
  { name: "Barcelona Away Kappa", season: "1996-97", type: "Visitante", stars: 4, price: 380 },
  { name: "AC Milan Home UCL", season: "1993-94", type: "Local", stars: 4, price: 620 },
];

/**
 * Landing page — "Stadium Archive" dark aesthetic.
 */
export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Drop countdown */}
      <section className="py-16 px-6">
        <DropCountdown />
      </section>

      {/* Featured catalog grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold text-[#F5F0E8] uppercase text-center mb-10">
          Fichajes destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_SHIRTS.map((shirt) => (
            <ShirtCard key={shirt.name} {...shirt} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/map"
            className="font-[family-name:var(--font-oswald)] text-sm uppercase text-[#D4A843] hover:text-[#E8C840] transition-colors no-underline"
          >
            Explorar todas en el mapa →
          </Link>
        </div>
      </section>

      {/* Trust section */}
      <TrustSection />

      {/* Achievements preview */}
      <AchievementsPreview />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-[family-name:var(--font-oswald)] text-xl font-bold text-[#D4A843] mb-2">
            ¡FICHAJE!
          </p>
          <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#E8DCC8]">
            Camisetas de fútbol vintage originales · Temporada 2025-26
          </p>
          <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[#555] mt-4">
            © 2025 ¡Fichaje! Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
