import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

/**
 * Compact shipping + returns block displayed near the PDP CTAs.
 * Low-visual-weight but always visible at decision time.
 */
export default function ShippingInfo() {
  return (
    <ul className="space-y-2 border-t border-[#2A2A2A] pt-4" aria-label="Información de envío y devoluciones">
      <li className="flex items-start gap-3">
        <Truck className="w-4 h-4 text-[#88CC88] mt-0.5 shrink-0" aria-hidden />
        <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#D0D0D0] leading-relaxed">
          <span className="font-bold text-[#F5F0E8]">Envío 24-48h</span> — España peninsular.
          Gratis en pedidos &gt;&nbsp;500&nbsp;€.
        </p>
      </li>
      <li className="flex items-start gap-3">
        <RotateCcw className="w-4 h-4 text-[#88AACC] mt-0.5 shrink-0" aria-hidden />
        <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#D0D0D0] leading-relaxed">
          <span className="font-bold text-[#F5F0E8]">Devoluciones 14 días</span> — Reembolso íntegro si no es lo que esperabas.
        </p>
      </li>
      <li className="flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[#D4A843] mt-0.5 shrink-0" aria-hidden />
        <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#D0D0D0] leading-relaxed">
          <span className="font-bold text-[#F5F0E8]">Autenticidad garantizada</span> — Verificado por nuestros expertos.
        </p>
      </li>
    </ul>
  );
}
