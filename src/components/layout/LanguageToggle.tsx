"use client";

import { Globe } from "lucide-react";
import { useI18n, type Locale } from "@/contexts/I18nContext";
import { track } from "@/lib/analytics";

interface LanguageToggleProps {
  variant?: "compact" | "full";
}

/**
 * ES / EN locale switch. Compact pill in the desktop nav,
 * full row labels inside the mobile menu.
 */
export default function LanguageToggle({ variant = "compact" }: LanguageToggleProps) {
  const { locale, setLocale, t } = useI18n();

  const change = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
    track("locale_changed", { from: locale, to: next });
  };

  if (variant === "full") {
    return (
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A]"
        role="group"
        aria-label={t("nav.language")}
      >
        <Globe className="w-4 h-4 text-[#888]" aria-hidden />
        <span className="font-[family-name:var(--font-oswald)] text-xs font-bold text-[#888] uppercase tracking-wider mr-2">
          {t("nav.language")}
        </span>
        <LangButton current={locale} value="es" onSelect={change} label="ES" />
        <LangButton current={locale} value="en" onSelect={change} label="EN" />
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className="hidden md:inline-flex items-center border border-[#2A2A2A] divide-x divide-[#2A2A2A]"
    >
      <LangButton current={locale} value="es" onSelect={change} label="ES" />
      <LangButton current={locale} value="en" onSelect={change} label="EN" />
    </div>
  );
}

function LangButton({
  current,
  value,
  onSelect,
  label,
}: {
  current: Locale;
  value: Locale;
  onSelect: (l: Locale) => void;
  label: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={active}
      aria-label={`${label}`}
      className={`min-w-[36px] min-h-[32px] px-2 font-[family-name:var(--font-jetbrains)] text-[11px] font-bold transition-colors ${
        active
          ? "bg-[#D4A843] text-[#0A0A0A]"
          : "bg-transparent text-[#888] hover:text-[#F5F0E8]"
      }`}
    >
      {label}
    </button>
  );
}
