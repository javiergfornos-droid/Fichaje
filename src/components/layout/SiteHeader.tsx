"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, ShoppingBag, User, X, Menu, Search, ChevronLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useI18n } from "@/contexts/I18nContext";
import SearchAutocomplete from "@/components/layout/SearchAutocomplete";
import LanguageToggle from "@/components/layout/LanguageToggle";

/**
 * Global site header — sticky, mobile-first navigation.
 *
 * Desktop (≥ 768px):
 *   [LOGO] [search+autocomplete] [Browse] [Map] [ES|EN] [♡] [🛒-drawer] [👤]
 *
 * Mobile (< 768px):
 *   [LOGO]                                      [🔍] [🛒-drawer] [≡]
 */
export default function SiteHeader() {
  const { count: cartCount, isHydrated: cartHydrated } = useCart();
  const { count: wishCount, isHydrated: wishHydrated } = useWishlist();
  const { open: openCartDrawer } = useCartDrawer();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const isMapRoute = pathname === "/map" || pathname?.startsWith("/map/");

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, [pathname]);

  useEffect(() => {
    const close = () => {
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
    };
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-[#0A0A0A]"
      style={{
        backdropFilter: "saturate(1.2)",
        borderBottom: isMapRoute ? "2px solid #D4A843" : "1px solid #1A1A1A",
      }}
    >
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center gap-3">
        {/* Logo — swaps to "FICHAJE MUNDIAL" on the map route (brand name, never translated) */}
        {isMapRoute ? (
          <Link
            href="/"
            className="font-[family-name:var(--font-oswald)] font-bold text-[#D4A843] hover:text-[#E8C840] transition-colors no-underline shrink-0"
            style={{
              fontSize: 24,
              letterSpacing: "3px",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
            aria-label="Fichaje Mundial — home"
          >
            FICHAJE MUNDIAL
          </Link>
        ) : (
          <Link
            href="/"
            className="font-[family-name:var(--font-oswald)] text-lg sm:text-xl font-bold text-[#D4A843] hover:text-[#E8C840] transition-colors no-underline shrink-0 tracking-tight"
            aria-label="¡FICHAJE! — home"
          >
            ¡FICHAJE!
          </Link>
        )}

        {/* Back button — only on /map, only when there is navigable history */}
        {isMapRoute && canGoBack && (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Volver"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 font-[family-name:var(--font-oswald)] text-xs font-bold uppercase tracking-widest text-[#E8DCC8] hover:text-[#D4A843] transition-colors"
            style={{
              border: "2px outset #4a5a7a",
              background: "linear-gradient(180deg, #2A3A54, #1A2A44)",
            }}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden />
            Volver
          </button>
        )}

        {/* Desktop search */}
        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <SearchAutocomplete variant="desktop" />
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/browse"
            className="px-3 py-2 font-[family-name:var(--font-oswald)] text-xs font-bold text-[#B0B0B0] hover:text-[#D4A843] uppercase tracking-wider transition-colors no-underline"
          >
            {t("nav.explore")}
          </Link>
          <Link
            href="/map"
            className="px-3 py-2 font-[family-name:var(--font-oswald)] text-xs font-bold text-[#B0B0B0] hover:text-[#D4A843] uppercase tracking-wider transition-colors no-underline"
          >
            {t("nav.map")}
          </Link>
        </nav>

        {/* Mobile icons (right) */}
        <div className="flex md:hidden items-center gap-1 ml-auto">
          <IconButton
            label={t("nav.search.label")}
            onClick={() => setMobileSearchOpen((v) => !v)}
          >
            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </IconButton>
          <CartIconButton
            count={cartHydrated ? cartCount : 0}
            label={t("nav.cart")}
            onClick={openCartDrawer}
          />
          <IconButton
            label={t("nav.menu")}
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </IconButton>
        </div>

        {/* Desktop right-side actions */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <LanguageToggle variant="compact" />
          <IconLink href="/wishlist" label={t("nav.wishlist")} badge={wishHydrated ? wishCount : 0}>
            <Heart className="w-5 h-5" />
          </IconLink>
          <CartIconButton
            count={cartHydrated ? cartCount : 0}
            label={t("nav.cart")}
            onClick={openCartDrawer}
          />
          <IconLink href="/account" label={t("nav.account")}>
            <User className="w-5 h-5" />
          </IconLink>
        </div>
      </div>

      {/* Mobile expanded search */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-[#1A1A1A] px-4 py-3 bg-[#0A0A0A]">
          <SearchAutocomplete
            variant="mobile"
            autoFocus
            onSubmitted={() => setMobileSearchOpen(false)}
          />
        </div>
      )}

      {/* Mobile expanded menu */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden border-t border-[#1A1A1A] bg-[#0A0A0A]"
          aria-label={t("nav.menu")}
        >
          <LanguageToggle variant="full" />
          <MobileLink href="/browse" label={t("nav.explore")} onNavigate={() => setMobileMenuOpen(false)} />
          <MobileLink href="/map" label={t("nav.map")} onNavigate={() => setMobileMenuOpen(false)} />
          <MobileLink
            href="/wishlist"
            label={t("nav.wishlist")}
            badge={wishHydrated ? wishCount : 0}
            onNavigate={() => setMobileMenuOpen(false)}
          />
          <MobileLink href="/account" label={t("nav.account")} onNavigate={() => setMobileMenuOpen(false)} />
          <MobileLink href="/faq" label={t("footer.faq")} onNavigate={() => setMobileMenuOpen(false)} />
        </nav>
      )}
    </header>
  );
}

/* ── Small helpers ─────────────────────────────────────────── */

function IconLink({
  href,
  label,
  badge,
  children,
}: {
  href: string;
  label: string;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={badge && badge > 0 ? `${label} (${badge})` : label}
      className="relative p-2.5 text-[#E8DCC8] hover:text-[#D4A843] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center no-underline"
    >
      {children}
      {badge !== undefined && badge > 0 && <Badge value={badge} />}
    </Link>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative p-2.5 text-[#E8DCC8] hover:text-[#D4A843] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
    >
      {children}
    </button>
  );
}

function CartIconButton({
  count,
  label,
  onClick,
}: {
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `${label} (${count})` : label}
      className="relative p-2.5 text-[#E8DCC8] hover:text-[#D4A843] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
    >
      <ShoppingBag className="w-5 h-5" aria-hidden />
      {count > 0 && <Badge value={count} />}
    </button>
  );
}

function Badge({ value }: { value: number }) {
  return (
    <span
      className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-jetbrains)] text-[10px] font-bold flex items-center justify-center leading-none"
      aria-hidden
    >
      {value > 99 ? "99+" : value}
    </span>
  );
}

function MobileLink({
  href,
  label,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  badge?: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center justify-between px-4 py-4 border-b border-[#1A1A1A] font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider hover:bg-[#141414] no-underline"
    >
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-jetbrains)] text-xs font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
}
