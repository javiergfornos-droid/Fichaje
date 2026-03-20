import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhooks/stripe — handle Stripe webhook events.
 * Processes checkout.session.completed to mark shirts as sold.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // TODO: Implement Stripe webhook verification and handling
  // 1. Verify webhook signature with stripe.webhooks.constructEvent
  // 2. Handle checkout.session.completed:
  //    - Mark shirt as sold (is_sold = true)
  //    - Create order record
  //    - Update offer status if applicable
  // 3. Handle payment_intent.payment_failed:
  //    - Log failure
  //    - Notify user

  console.log("Stripe webhook received", { bodyLength: body.length });

  return NextResponse.json({ received: true });
}
