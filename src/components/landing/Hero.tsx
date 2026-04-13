import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Halftone texture overlay */}
      <div className="absolute inset-0 halftone-overlay pointer-events-none" />

      {/* Film grain effect */}
      <div className="film-grain absolute inset-0 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Main title */}
        <h1
          className="font-[family-name:var(--font-oswald)] uppercase text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight mb-6"
        >
          <span className="text-floodlight-white">¡</span>
          <span className="text-whistle-gold">FICHAJE</span>
          <span className="text-floodlight-white">!</span>
        </h1>

        {/* Subtitle */}
        <p className="font-[family-name:var(--font-source-serif)] text-floodlight-white text-xl sm:text-2xl md:text-3xl mb-4">
          Camisetas de fútbol vintage originales
        </p>

        {/* Description */}
        <p className="text-programme-cream text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Descubre nuestra colección curada de camisetas de fútbol originales de
          todo el mundo. Cada pieza cuenta una historia, cada fichaje es único.
        </p>

        {/* CTA Button */}
        <Link
          href="/map"
          className="inline-block px-8 py-4 bg-whistle-gold text-pitch-black font-[family-name:var(--font-oswald)] uppercase text-lg font-bold tracking-wider rounded-sm transition-all duration-300 hover:bg-[#E0B850] hover:shadow-[0_0_24px_rgba(212,168,67,0.4)] active:scale-95"
        >
          Explorar el mapa de fichajes
        </Link>
      </div>
    </section>
  );
}
