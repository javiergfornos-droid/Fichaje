"use client";

import { useState } from "react";
import { ChevronDown, Shirt as ShirtIcon, Droplets, Ruler } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { track } from "@/lib/analytics";

export type FitType = "slim" | "regular" | "oversized";

interface ProductSpecsProps {
  fit: FitType;
  /** Optional override for materials text (defaults to dictionary). */
  materials?: string;
  /** Optional override for care text (defaults to dictionary). */
  care?: string;
}

/**
 * Collapsible product specifications block: fit indicator + materials + care.
 * Fit row stays open by default (it's the most decision-relevant info).
 */
export default function ProductSpecs({ fit, materials, care }: ProductSpecsProps) {
  const { t } = useI18n();
  const [openKey, setOpenKey] = useState<"fit" | "materials" | "care" | null>("fit");

  const fitLabel: Record<FitType, string> = {
    slim: t("pdp.fit.slim"),
    regular: t("pdp.fit.regular"),
    oversized: t("pdp.fit.oversized"),
  };
  const fitOrder: FitType[] = ["slim", "regular", "oversized"];

  const toggle = (key: "fit" | "materials" | "care") => {
    setOpenKey((current) => {
      const next = current === key ? null : key;
      if (next) track("specs_expanded", { section: next });
      return next;
    });
  };

  return (
    <div className="border-t border-[#2A2A2A]">
      {/* Fit */}
      <Row
        icon={<Ruler className="w-4 h-4" aria-hidden />}
        title={t("pdp.fit")}
        open={openKey === "fit"}
        onToggle={() => toggle("fit")}
      >
        <div className="space-y-3">
          <div className="flex gap-1.5" role="group" aria-label={t("pdp.fit")}>
            {fitOrder.map((f) => {
              const active = f === fit;
              return (
                <span
                  key={f}
                  className={`flex-1 text-center min-h-[36px] px-2 flex items-center justify-center font-[family-name:var(--font-oswald)] text-[11px] font-bold uppercase tracking-wider border-2 ${
                    active
                      ? "border-[#D4A843] bg-[#D4A843]/10 text-[#D4A843]"
                      : "border-[#1F1F1F] text-[#666]"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  {fitLabel[f]}
                </span>
              );
            })}
          </div>
          <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#888] leading-relaxed">
            {t("pdp.fitInfo")}
          </p>
        </div>
      </Row>

      {/* Materials */}
      <Row
        icon={<ShirtIcon className="w-4 h-4" aria-hidden />}
        title={t("pdp.materials")}
        open={openKey === "materials"}
        onToggle={() => toggle("materials")}
      >
        <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#D0D0D0] leading-relaxed">
          {materials ?? t("pdp.materialsBody")}
        </p>
      </Row>

      {/* Care */}
      <Row
        icon={<Droplets className="w-4 h-4" aria-hidden />}
        title={t("pdp.care")}
        open={openKey === "care"}
        onToggle={() => toggle("care")}
      >
        <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#D0D0D0] leading-relaxed">
          {care ?? t("pdp.careBody")}
        </p>
      </Row>
    </div>
  );
}

function Row({
  icon,
  title,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#2A2A2A]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full min-h-[52px] flex items-center justify-between px-1 py-3 text-left hover:text-[#D4A843] transition-colors group"
      >
        <span className="flex items-center gap-2 font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider group-hover:text-[#D4A843]">
          <span className="text-[#D4A843]">{icon}</span>
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#888] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && <div className="pb-4 pl-7 pr-1">{children}</div>}
    </div>
  );
}
