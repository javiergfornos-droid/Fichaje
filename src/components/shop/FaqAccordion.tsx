"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { track } from "@/lib/analytics";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  /** Heading rendered above the list. Pass empty to skip. */
  title?: string;
}

export default function FaqAccordion({ items, title }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="space-y-3">
      {title && (
        <h2 className="font-[family-name:var(--font-oswald)] text-base font-bold text-[#F5F0E8] uppercase tracking-wider">
          {title}
        </h2>
      )}
      <ul className="border-t border-[#2A2A2A]">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <li key={item.id} className="border-b border-[#2A2A2A]">
              <button
                type="button"
                onClick={() => {
                  const next = open ? null : item.id;
                  setOpenId(next);
                  if (next) track("faq_expanded", { id: item.id });
                }}
                aria-expanded={open}
                className="w-full min-h-[52px] flex items-center justify-between gap-3 py-3 text-left hover:text-[#D4A843] transition-colors group"
              >
                <span className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider group-hover:text-[#D4A843]">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#888] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {open && (
                <p className="pb-4 font-[family-name:var(--font-source-serif)] text-sm text-[#D0D0D0] leading-relaxed">
                  {item.answer}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
