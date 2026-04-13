"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Mail,
  MapPin,
  CreditCard,
  Smartphone,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import OrderSummary from "@/components/shop/OrderSummary";
import CouponField, { type AppliedCoupon } from "@/components/shop/CouponField";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils/formatters";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useI18n } from "@/contexts/I18nContext";
import { track } from "@/lib/analytics";

type PaymentMethod = "card" | "bizum" | "apple" | "google" | "paypal";
type FieldKey =
  | "email"
  | "firstName"
  | "lastName"
  | "address"
  | "postalCode"
  | "city";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Guest checkout. Single-screen, mobile-first stacked sections:
 *   1. Contact (email only)
 *   2. Shipping address
 *   3. Payment method
 *   4. Review + pay
 *
 * Order summary is sticky on desktop and collapses into a recap block on mobile.
 * Fields get per-field validation on blur (touched) with inline errors that
 * clear as soon as the user corrects them.
 */
export default function CheckoutPageClient() {
  const router = useRouter();
  const { t } = useI18n();
  const { items, count, subtotalCents, clear, isHydrated } = useCart();
  const { show: showToast } = useToast();

  const [values, setValues] = useState<Record<FieldKey, string>>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
  });
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [country, setCountry] = useState("ES");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = useMemo<Partial<Record<FieldKey, string>>>(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    (Object.keys(values) as FieldKey[]).forEach((key) => {
      const v = values[key].trim();
      if (!v) {
        e[key] = t("checkout.required");
        return;
      }
      if (key === "email" && !EMAIL_RE.test(v)) {
        e[key] = t("checkout.emailInvalid");
      }
    });
    return e;
  }, [values, t]);

  const hasErrors = Object.keys(errors).length > 0;

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
          title={t("cart.empty.title")}
          description={t("cart.empty.description")}
          actionLabel={t("cart.empty.cta")}
          actionHref="/browse"
        />
      </div>
    );
  }

  const setField = (key: FieldKey, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (touched[key] && errors[key]) {
      // tracked as correction if it flips from errored to valid
      track("field_corrected", { field: key });
    }
  };
  const blurField = (key: FieldKey) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    if (errors[key]) track("field_error", { field: key, error: errors[key] });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    // Force all fields touched to surface errors
    setTouched({
      email: true,
      firstName: true,
      lastName: true,
      address: true,
      postalCode: true,
      city: true,
    });
    if (hasErrors) {
      const firstKey = (Object.keys(errors) as FieldKey[])[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setIsSubmitting(true);
    track("checkout_started", { paymentMethod, itemCount: count, subtotalCents });

    // Stub — in production this triggers a Server Action that creates
    // the Stripe Checkout session (or Bizum flow) and redirects.
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      track("checkout_completed", { paymentMethod, subtotalCents });
      clear();
      showToast({
        variant: "success",
        title: t("success.title"),
        description: t("success.subtitle"),
      });
      router.push("/success");
    } catch {
      setSubmitError(t("checkout.errorGeneric"));
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
          {t("common.back")}
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl font-bold text-[#F5F0E8] uppercase tracking-wider">
          {t("checkout.title")}
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
          <Section icon={<Mail className="w-4 h-4" aria-hidden />} title={t("checkout.contact")}>
            <Field
              id="email"
              label={t("checkout.email")}
              type="email"
              value={values.email}
              onChange={(v) => setField("email", v)}
              onBlur={() => blurField("email")}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              help={t("checkout.contact.helper")}
              error={touched.email ? errors.email : undefined}
            />
            <p className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#888] mt-1">
              {t("checkout.guestBadge")}
            </p>
          </Section>

          {/* 2. Shipping */}
          <Section
            icon={<MapPin className="w-4 h-4" aria-hidden />}
            title={t("checkout.shipping")}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="firstName"
                label={t("checkout.firstName")}
                value={values.firstName}
                onChange={(v) => setField("firstName", v)}
                onBlur={() => blurField("firstName")}
                required
                autoComplete="given-name"
                error={touched.firstName ? errors.firstName : undefined}
              />
              <Field
                id="lastName"
                label={t("checkout.lastName")}
                value={values.lastName}
                onChange={(v) => setField("lastName", v)}
                onBlur={() => blurField("lastName")}
                required
                autoComplete="family-name"
                error={touched.lastName ? errors.lastName : undefined}
              />
            </div>
            <Field
              id="address"
              label={t("checkout.address")}
              value={values.address}
              onChange={(v) => setField("address", v)}
              onBlur={() => blurField("address")}
              placeholder={t("checkout.addressHelper")}
              required
              autoComplete="street-address"
              error={touched.address ? errors.address : undefined}
            />
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <Field
                id="postalCode"
                label={t("checkout.postalCode")}
                value={values.postalCode}
                onChange={(v) => setField("postalCode", v)}
                onBlur={() => blurField("postalCode")}
                required
                autoComplete="postal-code"
                inputMode="numeric"
                error={touched.postalCode ? errors.postalCode : undefined}
              />
              <Field
                id="city"
                label={t("checkout.city")}
                value={values.city}
                onChange={(v) => setField("city", v)}
                onBlur={() => blurField("city")}
                required
                autoComplete="address-level2"
                error={touched.city ? errors.city : undefined}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="country"
                className="block font-[family-name:var(--font-oswald)] text-[11px] font-bold text-[#B0B0B0] uppercase tracking-wider"
              >
                {t("checkout.country")}
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
            title={t("checkout.payment")}
          >
            <fieldset className="space-y-2">
              <legend className="sr-only">{t("checkout.payment")}</legend>
              <PaymentOption
                id="pm-card"
                icon={<CreditCard className="w-4 h-4" aria-hidden />}
                label={t("checkout.pmCard")}
                description={t("checkout.pmCardDesc")}
                checked={paymentMethod === "card"}
                onSelect={() => {
                  setPaymentMethod("card");
                  track("payment_method_selected", { method: "card" });
                }}
              />
              <PaymentOption
                id="pm-bizum"
                icon={<Smartphone className="w-4 h-4" aria-hidden />}
                label={t("checkout.pmBizum")}
                description={t("checkout.pmBizumDesc")}
                checked={paymentMethod === "bizum"}
                onSelect={() => {
                  setPaymentMethod("bizum");
                  track("payment_method_selected", { method: "bizum" });
                }}
              />
              <PaymentOption
                id="pm-apple"
                icon={<Wallet className="w-4 h-4" aria-hidden />}
                label={t("checkout.pmApple")}
                checked={paymentMethod === "apple"}
                onSelect={() => {
                  setPaymentMethod("apple");
                  track("payment_method_selected", { method: "apple" });
                }}
              />
              <PaymentOption
                id="pm-google"
                icon={<Wallet className="w-4 h-4" aria-hidden />}
                label={t("checkout.pmGoogle")}
                checked={paymentMethod === "google"}
                onSelect={() => {
                  setPaymentMethod("google");
                  track("payment_method_selected", { method: "google" });
                }}
              />
              <PaymentOption
                id="pm-paypal"
                icon={<Wallet className="w-4 h-4" aria-hidden />}
                label={t("checkout.pmPaypal")}
                checked={paymentMethod === "paypal"}
                onSelect={() => {
                  setPaymentMethod("paypal");
                  track("payment_method_selected", { method: "paypal" });
                }}
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
          aria-label={t("checkout.summaryTitle")}
          className="bg-[#0F0F0F] border border-[#1F1F1F] p-5 lg:sticky lg:top-20 space-y-4"
        >
          <h2 className="font-[family-name:var(--font-oswald)] text-lg font-bold text-[#F5F0E8] uppercase tracking-wider">
            {t("checkout.summaryTitle")}
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
                    {item.season} · {t("pdp.size")} {item.size}
                  </p>
                </div>
                <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[#F5F0E8] whitespace-nowrap">
                  {formatPrice(item.priceCents)}
                </p>
              </li>
            ))}
          </ul>

          <CouponField
            applied={coupon}
            onApply={setCoupon}
            onRemove={() => setCoupon(null)}
            subtotalCents={subtotalCents}
          />

          <OrderSummary
            subtotalCents={subtotalCents}
            itemCount={count}
            shippingMode="calculated"
            discountCents={coupon?.discountCents ?? 0}
            couponCode={coupon?.code}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-base font-bold uppercase tracking-wider hover:bg-[#E8C059] active:bg-[#C09830] disabled:bg-[#4A4A4A] disabled:text-[#888] disabled:cursor-not-allowed transition-colors"
          >
            <Lock className="w-4 h-4" aria-hidden />
            {isSubmitting ? t("checkout.processing") : t("checkout.payCta")}
          </button>
          <p className="font-[family-name:var(--font-source-serif)] text-[10px] text-[#666] leading-relaxed text-center">
            {t("checkout.legalNotice")}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2 border-t border-[#1F1F1F]">
            <span className="flex items-center gap-1 font-[family-name:var(--font-oswald)] text-[9px] text-[#666] uppercase tracking-wider">
              <Lock className="w-3 h-3" aria-hidden /> SSL
            </span>
            <span className="text-[#333]" aria-hidden>·</span>
            <span className="flex items-center gap-1 font-[family-name:var(--font-oswald)] text-[9px] text-[#666] uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" aria-hidden /> Stripe
            </span>
          </div>
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
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email";
  help?: string;
  error?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  required,
  autoComplete,
  inputMode,
  help,
  error,
}: FieldProps) {
  const describedBy = error ? `${id}-error` : help ? `${id}-help` : undefined;
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
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`w-full min-h-[48px] px-3 bg-[#0F0F0F] border ${
          error ? "border-[#D83030]" : "border-[#2A2A2A]"
        } text-[#F5F0E8] font-[family-name:var(--font-jetbrains)] text-sm placeholder:text-[#555] focus:outline-none focus:border-[#D4A843]`}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#D83030]">
          {error}
        </p>
      ) : help ? (
        <p id={`${id}-help`} className="font-[family-name:var(--font-source-serif)] text-[11px] text-[#888]">
          {help}
        </p>
      ) : null}
    </div>
  );
}

interface PaymentOptionProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  checked: boolean;
  onSelect: () => void;
}

function PaymentOption({ id, icon, label, description, checked, onSelect }: PaymentOptionProps) {
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
      <span className="mt-0.5 text-[#D4A843]">{icon}</span>
      <div className="flex-1">
        <p className="font-[family-name:var(--font-oswald)] text-sm font-bold text-[#F5F0E8] uppercase tracking-wider">
          {label}
        </p>
        {description && (
          <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#888] mt-0.5">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
