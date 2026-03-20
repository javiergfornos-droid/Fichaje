import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "¡FICHAJE! — Camisetas de fútbol vintage originales",
  description:
    "Plataforma de coleccionistas de camisetas de fútbol vintage originales. Navega el mapa, ficha tu camiseta.",
};

/**
 * Root layout providing base HTML structure.
 * Fonts are loaded via CSS @font-face with Google Fonts CDN links.
 * In production with Vercel, switch to next/font/google for self-hosting.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Oswald:wght@400;500;600;700&family=Source+Serif+4:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
