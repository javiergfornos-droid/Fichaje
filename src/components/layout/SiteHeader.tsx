"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Search, Heart, ShoppingBag, User, X, Menu } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

/**
 * Global site header — sticky, mobile-first navigation.
 *
 * Desktop (≥ 768px):
 *   [LOGO]  [search bar · flex-1]  [♡ Cartera] [🛒 Carrito] [👤 Cuenta]
 *
 * Mobile (< 768px):
 *   [LOGO]                         [🔍] [🛒] [≡]
 *   [optional expanded search row]
 *   [optional expanded mobile menu]
 */
export default function SiteHeader() {
  const router = useRouter();
  const { count: cartCount, isHydrated: cartHydrated } = useCart();
  const { count: wishCount, isHydrated: wishHydrated } = useWishlist();

  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu/search on route change (listen to history popstate)
  useEffect(() => {
    const close = () => {
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
    };
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    },
    [query, router]
  );

  return (
    <header
      className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-[#1A1A1A]"
      style={{ backdropFilter: "saturate(1.2)" }}
    >
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-oswald)] text-lg sm:text-xl font-bold text-[#D4A843] hover:text-[#E8C840] transition-colors no-underline shrink-0 tracking-tight"
          aria-label="¡FICHAJE! — Ir al inicio"
        >
          ¡FICHAJE!
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl mx-4 relative"
          role="search"
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666] pointer-events-none"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar camisetas, clubes, jugadores…"
            className="w-full pl-10 pr-4 py-2 bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-source-serif)] text-sm placeholder-[#555] focus:border-[#D4A843] focus:outline-none focus:ring-1 focus:ring-[#D4A843] transition-colors"
            aria-label="Buscar camisetas, clubes, jugadores"
          />
        </form>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/browse"
            className="px-3 py-2 font-[family-name:var(--font-oswald)] text-xs font-bold text-[#B0B0B0] hover:text-[#D4A843] uppercase tracking-wider transition-colors no-underline"
          >
            Explorar
          </Link>
          <Link
            href="/map"
            className="px-3 py-2 font-[family-name:var(--font-oswald)] text-xs font-bold text-[#B0B0B0] hover:text-[#D4A843] uppercase tracking-wider transition-colors no-underline"
          >
            Mapa
          </Link>
        </nav>

        {/* Mobile icons (right side) */}
        <div className="flex md:hidden items-center gap-1 ml-auto">
          <IconButton
            label="Buscar"
            onClick={() => setMobileSearchOpen((v) => !v)}
          >
            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </IconButton>
          <IconLink
            href="/cart"
            label="Carrito"
            badge={cartHydrated ? cartCount : 0}
          >
            <ShoppingBag className="w-5 h-5" />
          </IconLink>
          <IconButton
            label="Menú"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </IconButton>
        </div>

        {/* Desktop right-side actions */}
        <div className="hidden md:flex items-center gap-1 ml-auto">
          <IconLink
            href="/wishlist"
            label="Cartera"
            badge={wishHydrated ? wishCount : 0}
          >
            <Heart className="w-5 h-5" />
          </IconLink>
          <IconLink
            href="/cart"
            label="Carrito"
            badge={cartHydrated ? cartCount : 0}
          >
            <ShoppingBag className="w-5 h-5" />
          </IconLink>
          <IconLink href="/account" label="Cuenta">
            <User className="w-5 h-5" />
          </IconLink>
        </div>
      </div>

      {/* Mobile expanded search */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-[#1A1A1A] px-4 py-3 bg-[#0A0A0A]">
          <form onSubmit={handleSearch} role="search" className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666] pointer-events-none"
              aria-hidden
            />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar camisetas, clubes, jugadores…"
              className="w-full pl-10 pr-4 py-3 bg-[#141414] border border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-source-serif)] text-sm placeholder-[#555] focus:border-[#D4A843] focus:outline-none"
              aria-label="Buscar camisetas, clubes, jugadores"
            />
          </form>
        </div>
      )}

      {/* Mobile expanded menu */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden border-t border-[#1A1A1A] bg-[#0A0A0A]"
          aria-label="Navegación principal"
        >
          <MobileLink href="/browse" label="Explorar camisetas" onNavigate={() => setMobileMenuOpen(false)} />
          <MobileLink href="/map" label="Mapa de fichajes" onNavigate={() => setMobileMenuOpen(false)} />
          <MobileLink
            href="/wishlist"
            label="Mi cartera"
            badge={wishHydrated ? wishCount : 0}
            onNavigate={() => setMobileMenuOpen(false)}
          />
          <MobileLink href="/account" label="Mi cuenta" onNavigate={() => setMobileMenuOpen(false)} />
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
      {badge !== undefined && badge > 0 && (
        <span
          className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-jetbrains)] text-[10px] font-bold flex items-center justify-center leading-none"
          aria-hidden
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
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
