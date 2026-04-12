"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, MapPin, CreditCard } from "lucide-react";
import OrderSummary from "@/components/shop/OrderSummary";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils/formatters";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";

type PaymentMethod = "card" | "bizum";

/**
 * Guest checkout. Single-screen, mobile-first stacked sections:
 *   1. Contact (email only)
 *   2. Shipping address
 *   3. Payment method
 *   4. Review + pay
 *
 * Order summary is sticky on desktop and collapses into a recap block on mobile.
 */
export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, count, subtotalCents, clear, isHydrated } = useCart();
  const { show: showToast } = useToast();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("ES");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-[#1A1A1A]" />
          <div className="h-60 bg-[#141414] border border-[#1F1F1F]" />
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <EmptyState
          title="No hay nada que pagar"
          description="Tu carrito está vacío. Vuelve a explorar y añade camisetas antes de completar el fichaje."
          actionLabel="Explorar camisetas"
          actionHref="/browse"
        />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    // Stub — in production this triggers a Server Action that creates
    // the Stripe Checkout session (or Bizum flow) and redirects.
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      clear();
      showToast({
        variant: "success",
        title: "Fichaje completado",
        description: "Te hemos enviado un email con el resumen.",
      });
      router.push("/success");
    } catch {
      setSubmitError(
        "No hemos podido procesar el pago. Revisa los datos e inténtalo de nuevo."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10 pb-28 lg:pb-10">
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-oswald)] text-xs text-[#888] uppercase tracking-wider hover:text-[#D4A843] no-underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          Volver al carrito
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl font-bold text-[#F5F0E8] uppercase tracking-wider">
          Completar fichaje
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 lg:gap-12 items-start"
        noValidate
      >
        {/* ── Form sections ─────────────────────────────── */}
        <div className="space-y-8">
          {/* 1. Contact */}
          <Section icon={<Mail className="w-4 h-4" aria-hidden />} title="Contacto">
            <Field
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              help="Te enviaremos el resumen y el seguimiento a este email."
            />
            <p className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#888] mt-1">
              Checkout sin cuenta — no necesitas registrarte.
            </p>
          </Section>

          {/* 2. Shipping */}
          <Section
            icon={<MapPin className="w-4 h-4" aria-hidden />}
            title="Dirección de envío"
          >
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="firstName"
                label="Nombre"
                value={firstName}
                onChange={setFirstName}
                required
                autoComplete="given-name"
              />
              <Field
                id="lastName"
                label="Apellidos"
                value={lastName}
                onChange={setLastName}
                required
                autoComplete="family-name"
              />
            </div>
            <Field
              id="address"
              label="Dirección"
              value={address}
              onChange={setAddress}
              placeholder="Calle, número, piso"
              required
              autoComplete="street-address"
            />
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <Field
                id="postalCode"
                label="Código postal"
                value={postalCode}
                onChange={setPostalCode}
                required
                autoComplete="postal-code"
                inputMode="numeric"
              />
              <Field
                id="city"
                label="Ciudad"
                value={city}
                onChange={setCity}
                required
                autoComplete="address-level2"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="country"
                className="block font-[family-name:var(--font-oswald)] text-[11px] font-bold text-[#B0B0B0] uppercase tracking-wider"
              >
                País
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full min-h-[48px] px-3 bg-[#0F0F0F] border border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-jetbrains)] text-sm focus:outline-none focus:border-[#D4A843]"
              >
                <option value="ES">España</option>
                <option value="PT">Portugal</option>
                <option value="FR">Francia</option>
                <option value="IT">Italia</option>
                <option value="DE">Alemania</option>
              </select>
            </div>
          </Section>

          {/* 3. Payment */}
          <Section
            icon={<CreditCard className="w-4 h-4" aria-hidden />}
            title="Método de pago"
          >
            <fieldset className="space-y-2">
              <legend className="sr-only">Elige un método de pago</legend>
              <PaymentOption
                id="pm-card"
                label="Tarjeta de crédito/débito"
                description="Procesado de forma segura por Stripe."
                checked={paymentMethod === "card"}
                onSelect={() => setPaymentMethod("card")}
              />
              <PaymentOption
                id="pm-bizum"
                label="Bizum"
                description="Paga desde tu móvil en segundos."
                checked={paymentMethod === "bizum"}
                onSelect={() => setPaymentMethod("bizum")}
              />
            </fieldset>
          </Section>

          {submitError && (
            <div
              role="alert"
              className="border border-[#D83030] bg-[#D83030]/10 text-[#F5F0E8] px-4 py-3 font-[family-name:var(--font-source-serif)] text-sm"
            >
              {submitError}
            </div>
          )}
        </div>

        {/* ── Summary ───────────────────────────────────── */}
        <aside
          aria-label="Resumen del pedido"
          className="bg-[#0F0F0F] border border-[#1F1F1F] p-5 lg:sticky lg:top-20 space-y-4"
        >
          <h2 className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#F5F0E8] uppercase tracking-wider">
            Resumen
          </h2>

          <ul className="space-y-3 border-b border-[#1F1F1F] pb-4 max-h-60 overflow-auto">
            {items.map((item) => (
              <li key={item.shirtId} className="flex gap-3 text-sm">
                <div className="shrink-0 w-12 h-12 bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
                  <span className="text-xl opacity-70" aria-hidden>👕</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-[family-name:var(--font-oswald)] text-xs font-bold text-[#F5F0E8] uppercase truncate">
                    {item.name}
                  </p>
                  <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#888]">
                    {item.season} · Talla {item.size}
                  </p>
                </div>
                <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[#F5F0E8] whitespace-nowrap">
                  {formatPrice(item.priceCents)}
                </p>
              </li>
            ))}
          </ul>

          <OrderSummary
            subtotalCents={subtotalCents}
            itemCount={count}
            shippingMode="calculated"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-base font-bold uppercase tracking-wider hover:bg-[#E8C059] active:bg-[#C09830] disabled:bg-[#4A4A4A] disabled:text-[#888] disabled:cursor-not-allowed transition-colors"
          >
            <Lock className="w-4 h-4" aria-hidden />
            {isSubmitting ? "Procesando…" : "Pagar el fichaje"}
          </button>
          <p className="font-[family-name:var(--font-source-serif)] text-[10px] text-[#666] leading-relaxed text-center">
            Al pagar aceptas nuestras condiciones de venta y la política de
            devoluciones de 14 días.
          </p>
        </aside>
      </form>
    </div>
  );
}

/* ── Helper subcomponents ────────────────────────────── */

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider border-b border-[#1F1F1F] pb-2">
        <span className="text-[#D4A843]">{icon}</span>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email";
  help?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  autoComplete,
  inputMode,
  help,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-[family-name:var(--font-oswald)] text-[11px] font-bold text-[#B0B0B0] uppercase tracking-wider"
      >
        {label} {required && <span className="text-[#D83030]" aria-hidden>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-describedby={help ? `${id}-help` : undefined}
        className="w-full min-h-[48px] px-3 bg-[#0F0F0F] border border-[#2A2A2A] text-[#F5F0E8] font-[family-name:var(--font-jetbrains)] text-sm placeholder:text-[#555] focus:outline-none focus:border-[#D4A843]"
      />
      {help && (
        <p id={`${id}-help`} className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#888]">
          {help}
        </p>
      )}
    </div>
  );
}

interface PaymentOptionProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onSelect: () => void;
}

function PaymentOption({ id, label, description, checked, onSelect }: PaymentOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 p-4 border-2 cursor-pointer transition-colors ${
        checked
          ? "border-[#D4A843] bg-[#D4A843]/5"
          : "border-[#2A2A2A] hover:border-[#4A4A4A]"
      }`}
    >
      <input
        id={id}
        type="radio"
        name="payment-method"
        checked={checked}
        onChange={onSelect}
        className="mt-1 accent-[#D4A843]"
      />
      <div className="flex-1">
        <p className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider">
          {label}
        </p>
        <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#888] mt-0.5">
          {description}
        </p>
      </div>
    </label>
  );
}
