"use client";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { resolveSynonyms } from "@/lib/utils/synonyms";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * Search bar with synonym resolution.
 */
export default function SearchBar({
  onSearch,
  placeholder = "Buscar camisetas, clubes, jugadores...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const resolved = resolveSynonyms(query);
      onSearch(resolved);
    },
    [query, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-source-serif)] text-sm placeholder-[#666] focus:border-[#D4A843] focus:outline-none transition-colors"
      />
    </form>
  );
}
