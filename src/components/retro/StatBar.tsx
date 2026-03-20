import { getStatColor } from "@/lib/utils/conditions";

interface StatBarProps {
  label: string;
  value: number;
}

/**
 * Condition stat bar with colored fill, PC Fútbol player attribute style.
 */
export default function StatBar({ label, value }: StatBarProps) {
  const color = getStatColor(value);

  return (
    <div className="flex items-center gap-2">
      <span className="font-[family-name:var(--font-oswald)] text-[10px] uppercase text-[#8a8a8a] w-28 text-right shrink-0">
        {label}
      </span>
      <div className="flex-1 h-3 bg-[#1a1a2e] rounded-sm overflow-hidden border border-[#333]">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span
        className="font-[family-name:var(--font-jetbrains)] text-xs font-bold w-8 text-right"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}
