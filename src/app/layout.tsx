import type { Metadata } from "next";
import { Oswald, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
 * Root layout providing fonts and base HTML structure.
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
