"use server";

/**
 * Server Action: Create a Stripe Checkout session for a shirt purchase.
 */
export async function createCheckoutSession(shirtId: string, amountCents: number) {
  // TODO: Implement with Stripe
  // 1. Fetch shirt details from Supabase
  // 2. Create Stripe Checkout session with:
  //    - line_items: [{ price_data: { currency: 'eur', unit_amount: amountCents, product_data: { name, images } }, quantity: 1 }]
  //    - mode: 'payment'
  //    - success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`
  //    - cancel_url: `${origin}/shirt/${shirt.slug}`
  // 3. Return session URL for redirect

  console.log(`Creating checkout session for shirt ${shirtId}, amount: ${amountCents}`);

  return { url: "/success" };
}
