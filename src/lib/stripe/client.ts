/**
 * Stripe client placeholder.
 * Initialize with: npm install stripe @stripe/stripe-js
 *
 * import Stripe from 'stripe';
 * export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 */

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  currency: "eur" as const,
};
