interface ShirtCardProps {
  name: string;
  season: string;
  type: string;
  stars: number;
  price: number;
}

export default function ShirtCard({
  name,
  season,
  type,
  stars,
  price,
}: ShirtCardProps) {
  return (
    <div className="group bg-tunnel-grey border border-tunnel-border rounded-sm p-5 transition-all duration-300 hover:scale-[1.03] hover:border-whistle-gold/50 hover:shadow-[0_0_20px_rgba(212,168,67,0.15)]">
      {/* Shirt emoji placeholder */}
      <div className="flex items-center justify-center text-6xl mb-4 h-40 bg-pitch-black/50 rounded-sm">
        👕
      </div>

      {/* Name */}
      <h3 className="font-[family-name:var(--font-oswald)] uppercase text-floodlight-white text-lg font-bold truncate mb-1">
        {name}
      </h3>

      {/* Season */}
      <p className="font-[family-name:var(--font-jetbrains)] text-whistle-gold text-sm mb-2">
        {season}
      </p>

      {/* Type badge + Stars row */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-block px-2 py-0.5 bg-tunnel-border text-programme-cream text-xs font-[family-name:var(--font-jetbrains)] uppercase rounded-sm">
          {type}
        </span>
        <span className="text-whistle-gold text-sm tracking-wide">
          {"★".repeat(stars)}
          {"☆".repeat(5 - stars)}
        </span>
      </div>

      {/* Price */}
      <p className="font-[family-name:var(--font-oswald)] text-whistle-gold text-xl font-bold">
        {price.toFixed(2)} €
      </p>
    </div>
  );
}
