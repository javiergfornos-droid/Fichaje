import Link from "next/link";

export const metadata = {
  title: "¡FICHAJE! — ¡Fichaje completado!",
};

/**
 * Checkout success page — shown after a successful Stripe payment.
 */
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <span className="text-6xl">⚽</span>
        <h1 className="font-[family-name:var(--font-oswald)] text-3xl text-[#30C040] uppercase">
          ¡Fichaje completado!
        </h1>
        <p className="font-[family-name:var(--font-source-serif)] text-[#E8DCC8]">
          Tu camiseta está en camino. Recibirás un email con los detalles del envío.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/map"
            className="font-[family-name:var(--font-oswald)] text-sm uppercase px-6 py-3 bg-[#D4A843] text-[#0A0A0A] font-bold hover:bg-[#E8C840] transition-colors no-underline"
          >
            Seguir fichando
          </Link>
        </div>
      </div>
    </div>
  );
}
