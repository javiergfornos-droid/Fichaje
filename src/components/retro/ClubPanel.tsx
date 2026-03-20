"use client";

import Link from "next/link";
import type { Club } from "@/types/club";

interface ClubPanelProps {
  clubs: Club[];
  countryName: string;
  countryFlag: string;
}

/**
 * Right sidebar panel showing clubs for a selected country.
 */
export default function ClubPanel({ clubs, countryName, countryFlag }: ClubPanelProps) {
  return (
    <div className="retro-dark-panel p-3 w-64 overflow-y-auto">
      <div className="retro-panel-inset px-3 py-2 mb-3">
        <h2 className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#1a1a2e] uppercase">
          {countryFlag} {countryName}
        </h2>
      </div>

      <div className="space-y-1">
        {clubs.map((club) => (
          <Link
            key={club.id}
            href={`/roster/${club.id}`}
            className="flex items-center gap-3 px-3 py-2 hover:bg-[#3a4a6a] rounded-sm transition-colors no-underline group"
          >
            <span className="text-lg">{club.badge_emoji}</span>
            <span className="font-[family-name:var(--font-oswald)] text-sm text-[#F5F0E8] group-hover:text-[#E8C840] transition-colors">
              {club.name}
            </span>
          </Link>
        ))}

        {clubs.length === 0 && (
          <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#88AACC] text-center py-4">
            No hay clubes disponibles
          </p>
        )}
      </div>
    </div>
  );
}
