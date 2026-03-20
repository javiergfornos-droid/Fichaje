import Link from "next/link";

export const metadata = {
  title: "¡FICHAJE! — Carrito",
};

/**
 * Cart page — placeholder for checkout flow.
 */
export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="font-[family-name:var(--font-oswald)] text-2xl text-[#F5F0E8] uppercase">
          Tu carrito está vacío
        </h1>
        <p className="font-[family-name:var(--font-source-serif)] text-[#E8DCC8]">
          Explora el mapa para fichar tus camisetas
        </p>
        <Link
          href="/map"
          className="inline-block font-[family-name:var(--font-oswald)] text-sm uppercase px-6 py-3 bg-[#D4A843] text-[#0A0A0A] font-bold hover:bg-[#E8C840] transition-colors no-underline"
        >
          Explorar el mapa
        </Link>
      </div>
    </div>
  );
}
