"use client";

import Link from "next/link";
import { Mail, Truck, RotateCcw, ShieldCheck, CreditCard } from "lucide-react";
import FaqAccordion, { type FaqItem } from "@/components/shop/FaqAccordion";
import { useI18n } from "@/contexts/I18nContext";

interface Section {
  id: string;
  icon: React.ReactNode;
  title: string;
  items: FaqItem[];
}

/**
 * Standalone FAQ page. Groups questions by topic so users can scan.
 * Content is hardcoded in Spanish for now — marketing can translate later.
 */
export default function FaqPageClient() {
  const { t } = useI18n();

  const sections: Section[] = [
    {
      id: "shipping",
      icon: <Truck className="w-4 h-4" aria-hidden />,
      title: "Envíos",
      items: [
        {
          id: "s1",
          question: "¿Cuánto tarda mi pedido?",
          answer:
            "Preparamos y autenticamos cada pedido en 24h laborables. España peninsular 24-48h, resto de Europa 3-5 días, fuera de la UE 5-8 días.",
        },
        {
          id: "s2",
          question: "¿Cuánto cuesta el envío?",
          answer:
            "Envío estándar 5,99 € en España y 9,99 € en la UE. Gratis a partir de 500 € en España peninsular.",
        },
        {
          id: "s3",
          question: "¿Puedo seguir mi pedido?",
          answer:
            "Sí. Cuando salga a reparto recibirás un email con el número de seguimiento y el enlace al transportista.",
        },
      ],
    },
    {
      id: "returns",
      icon: <RotateCcw className="w-4 h-4" aria-hidden />,
      title: "Devoluciones",
      items: [
        {
          id: "r1",
          question: "¿Cuánto tiempo tengo para devolver?",
          answer:
            "Tienes 14 días naturales desde la recepción del pedido. Debe volver en el mismo estado en que la recibiste.",
        },
        {
          id: "r2",
          question: "¿Quién paga el envío de devolución?",
          answer:
            "Si la camiseta no es lo que esperabas, el envío de devolución corre por cuenta del cliente. Si hay un error por nuestra parte, lo pagamos nosotros.",
        },
        {
          id: "r3",
          question: "¿Cuánto tarda el reembolso?",
          answer:
            "Reembolsamos en un máximo de 5 días laborables desde que recibimos la camiseta en nuestras instalaciones.",
        },
      ],
    },
    {
      id: "authentication",
      icon: <ShieldCheck className="w-4 h-4" aria-hidden />,
      title: "Autenticidad",
      items: [
        {
          id: "a1",
          question: "¿Cómo garantizáis que es original?",
          answer:
            "Cada camiseta pasa por un proceso de autenticación manual realizado por nuestros expertos en vintage. Revisamos etiquetas, costuras, serigrafías y tejidos.",
        },
        {
          id: "a2",
          question: "¿Y si tengo dudas sobre una pieza?",
          answer:
            "Escríbenos a hola@fichaje.com con el enlace de la camiseta y te enviamos fotos de detalle adicionales o la retiramos del catálogo.",
        },
      ],
    },
    {
      id: "payments",
      icon: <CreditCard className="w-4 h-4" aria-hidden />,
      title: "Pagos",
      items: [
        {
          id: "p1",
          question: "¿Qué métodos de pago aceptáis?",
          answer:
            "Aceptamos tarjeta de crédito/débito (Visa, Mastercard, Amex) mediante Stripe, Apple Pay, Google Pay, PayPal y Bizum.",
        },
        {
          id: "p2",
          question: "¿Es seguro pagar en vuestra web?",
          answer:
            "Sí. No almacenamos los datos bancarios: el pago lo procesa directamente Stripe (certificado PCI-DSS nivel 1) mediante conexión cifrada SSL/TLS.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <header className="mb-8 space-y-2">
        <p className="font-[family-name:var(--font-oswald)] text-[11px] text-[#D4A843] uppercase tracking-[0.15em]">
          {t("footer.help")}
        </p>
        <h1 className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl font-bold text-[#F5F0E8] uppercase tracking-wider">
          {t("footer.faq")}
        </h1>
        <p className="font-[family-name:var(--font-source-serif)] text-sm text-[#888] max-w-lg">
          Respuestas rápidas. Si no encuentras lo que buscas, escríbenos a{" "}
          <a
            href="mailto:hola@fichaje.com"
            className="text-[#D4A843] hover:underline no-underline"
          >
            hola@fichaje.com
          </a>
          .
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`faq-${section.id}`}>
            <h2
              id={`faq-${section.id}`}
              className="flex items-center gap-2 font-[family-name:var(--font-oswald)] text-base font-bold text-[#F5F0E8] uppercase tracking-wider mb-3"
            >
              <span className="text-[#D4A843]">{section.icon}</span>
              {section.title}
            </h2>
            <FaqAccordion items={section.items} />
          </section>
        ))}
      </div>

      <section className="mt-12 border-t border-[#1F1F1F] pt-6 flex items-start gap-3">
        <Mail className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" aria-hidden />
        <div>
          <h2 className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider">
            {t("footer.needHelp")}
          </h2>
          <p className="mt-1 font-[family-name:var(--font-source-serif)] text-sm text-[#888]">
            Nuestro equipo responde en menos de 24h laborables.
          </p>
          <Link
            href="mailto:hola@fichaje.com"
            className="mt-2 inline-block font-[family-name:var(--font-oswald)] text-xs text-[#D4A843] hover:underline uppercase tracking-wider no-underline"
          >
            hola@fichaje.com
          </Link>
        </div>
      </section>
    </div>
  );
}
