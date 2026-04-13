"use client";

import Link from "next/link";
import { ShieldCheck, Lock, Truck, Mail } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

/**
 * Global footer with help, policies and discreet trust signals.
 * Visible from every route to keep contact + returns reachable.
 */
export default function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[#1A1A1A] mt-16 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 gap-y-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-2">
          <p className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#D4A843]">
            ¡FICHAJE!
          </p>
          <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#888] leading-relaxed">
            {t("footer.tagline")}
          </p>
        </div>

        {/* Help */}
        <FooterColumn title={t("footer.help")}>
          <FooterLink href="/faq">{t("footer.faq")}</FooterLink>
          <FooterLink href="/help/shipping">{t("footer.shipping")}</FooterLink>
          <FooterLink href="/help/returns">{t("footer.returns")}</FooterLink>
          <FooterLink href="/help/contact">{t("footer.contact")}</FooterLink>
        </FooterColumn>

        {/* Legal */}
        <FooterColumn title={t("nav.account")}>
          <FooterLink href="/account">{t("nav.account")}</FooterLink>
          <FooterLink href="/wishlist">{t("nav.wishlist")}</FooterLink>
          <FooterLink href="/legal/terms">{t("footer.terms")}</FooterLink>
          <FooterLink href="/legal/privacy">{t("footer.privacy")}</FooterLink>
        </FooterColumn>

        {/* Need help bubble */}
        <div className="col-span-2 md:col-span-1 space-y-2 border border-[#1F1F1F] bg-[#0F0F0F] p-4">
          <p className="font-[family-name:var(--font-oswald)] text-xs font-bold text-[#F5F0E8] uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#D4A843]" aria-hidden />
            {t("footer.needHelp")}
          </p>
          <a
            href="mailto:hola@fichaje.com"
            className="block font-[family-name:var(--font-jetbrains)] text-xs text-[#D4A843] hover:underline no-underline"
          >
            hola@fichaje.com
          </a>
          <p className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#888] leading-relaxed">
            L–V · 10:00–18:00 CET
          </p>
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-[#1A1A1A] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-5 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[#666]">
          <TrustItem icon={<Lock className="w-3.5 h-3.5" aria-hidden />} label="Stripe SSL" />
          <TrustItem icon={<ShieldCheck className="w-3.5 h-3.5" aria-hidden />} label="Auténticas" />
          <TrustItem icon={<Truck className="w-3.5 h-3.5" aria-hidden />} label="14d returns" />
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px]">
            © 2025 ¡Fichaje!
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-[family-name:var(--font-oswald)] text-[11px] font-bold text-[#888] uppercase tracking-widest">
        {title}
      </h3>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="font-[family-name:var(--font-source-serif)] text-sm text-[#B0B0B0] hover:text-[#D4A843] no-underline transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider">
      {icon}
      {label}
    </span>
  );
}
