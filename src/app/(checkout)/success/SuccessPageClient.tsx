"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Mail, Package, Truck, LifeBuoy } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { track } from "@/lib/analytics";

/**
 * Post-purchase success screen. Built to answer the three questions
 * the user actually has after paying:
 *   1. Did it go through?          → big check + order number
 *   2. What happens next?          → numbered timeline
 *   3. How do I get help?          → contact block + tracking CTA
 */
export default function SuccessPageClient() {
  const { t } = useI18n();
  const [orderNumber, setOrderNumber] = useState<string>("");

  // Generate a stable-looking ref client-side so we avoid hydration mismatch
  // and so refreshing the page doesn't flip it between renders.
  const storageKey = "fichaje.lastOrder.v1";
  useEffect(() => {
    let existing: string | null = null;
    try {
      existing = sessionStorage.getItem(storageKey);
    } catch {
      /* ignore */
    }
    if (existing) {
      setOrderNumber(existing);
    } else {
      const generated = `FJ-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        Math.random() * 9000 + 1000
      )}`;
      setOrderNumber(generated);
      try {
        sessionStorage.setItem(storageKey, generated);
      } catch {
        /* ignore */
      }
    }
    track("order_confirmation_viewed");
  }, []);

  const steps = useMemo(
    () => [
      { icon: <Mail className="w-4 h-4" aria-hidden />, text: t("success.next1") },
      { icon: <Package className="w-4 h-4" aria-hidden />, text: t("success.next2") },
      { icon: <Truck className="w-4 h-4" aria-hidden />, text: t("success.next3") },
    ],
    [t]
  );

  return (
    <div className="min-h-[70vh] max-w-2xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#88CC88]/10 border border-[#88CC88]/40">
          <CheckCircle2 className="w-9 h-9 text-[#88CC88]" strokeWidth={1.8} aria-hidden />
        </div>
        <h1 className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl font-bold text-[#F5F0E8] uppercase tracking-wider">
          {t("success.title")}
        </h1>
        <p className="font-[family-name:var(--font-source-serif)] text-base text-[#D0D0D0] max-w-lg mx-auto">
          {t("success.subtitle")}
        </p>
        {orderNumber && (
          <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[#888] uppercase tracking-wider">
            {t("success.orderNumber")}:{" "}
            <span className="text-[#D4A843] font-bold">{orderNumber}</span>
          </p>
        )}
      </div>

      {/* Next steps timeline */}
      <section className="mt-10 border border-[#1F1F1F] bg-[#0F0F0F] p-5 sm:p-6">
        <h2 className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider mb-4">
          {t("success.nextSteps")}
        </h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full border border-[#D4A843] text-[#D4A843] font-[family-name:var(--font-jetbrains)] text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="flex-1 flex items-start gap-2">
                <span className="mt-0.5 text-[#D4A843]">{step.icon}</span>
                <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#D0D0D0] leading-relaxed">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => track("track_order_click")}
          className="flex-1 min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:bg-[#E8C059] active:bg-[#C09830] transition-colors"
        >
          <Truck className="w-4 h-4" aria-hidden />
          {t("success.trackOrder")}
        </button>
        <Link
          href="/browse"
          className="flex-1 min-h-[52px] flex items-center justify-center px-6 py-3 border-2 border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:border-[#D4A843] hover:text-[#D4A843] transition-colors no-underline"
        >
          {t("success.keepShopping")}
        </Link>
      </div>

      {/* Questions block */}
      <section className="mt-10 border-t border-[#1F1F1F] pt-6 flex items-start gap-3">
        <LifeBuoy className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" aria-hidden />
        <div>
          <h2 className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider">
            {t("success.questionsTitle")}
          </h2>
          <p className="mt-1 font-[family-name:var(--font-source-serif)] text-sm text-[#888] leading-relaxed">
            {t("success.questionsBody")}
          </p>
          <Link
            href="/faq"
            onClick={() => track("contact_click")}
            className="mt-2 inline-block font-[family-name:var(--font-oswald)] text-xs text-[#D4A843] hover:underline uppercase tracking-wider no-underline"
          >
            {t("footer.faq")}
          </Link>
        </div>
      </section>
    </div>
  );
}
