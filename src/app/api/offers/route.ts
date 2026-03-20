import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const offerSchema = z.object({
  shirt_id: z.string().uuid(),
  amount_cents: z.number().int().min(1),
});

/**
 * POST /api/offers — create a new offer on a shirt.
 * Validates minimum offer percentage server-side.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = offerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de oferta inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // TODO: Implement with Supabase
    // 1. Verify user is authenticated
    // 2. Fetch shirt to check min_offer_pct
    // 3. Validate amount >= min_offer_pct% of price
    // 4. Insert offer into offers table
    // 5. Return created offer

    return NextResponse.json(
      { message: "Oferta creada (demo)", offer: { ...parsed.data, status: "pending" } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la oferta" },
      { status: 500 }
    );
  }
}
