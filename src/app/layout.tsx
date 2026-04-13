import type { Metadata } from "next";
import { Oswald, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { CartDrawerProvider } from "@/contexts/CartDrawerContext";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CartDrawer from "@/components/shop/CartDrawer";
import ToastViewport from "@/components/ui/Toast";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "¡FICHAJE! — Camisetas de fútbol vintage originales",
  description:
    "Plataforma de coleccionistas de camisetas de fútbol vintage originales. Navega el mapa, ficha tu camiseta.",
};

/**
 * Root layout — providers, global header, and toast viewport
 * wrap every page of the app.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${oswald.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased bg-[#0A0A0A] text-[#F5F0E8] min-h-screen">
        <I18nProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <CartDrawerProvider>
                  <ToastProvider>
                    <SiteHeader />
                    {children}
                    <SiteFooter />
                    <CartDrawer />
                    <ToastViewport />
                  </ToastProvider>
                </CartDrawerProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
