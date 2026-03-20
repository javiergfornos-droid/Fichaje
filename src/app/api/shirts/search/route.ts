import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(1).max(200),
  club_id: z.string().optional(),
  country_id: z.string().optional(),
  min_price: z.coerce.number().int().min(0).optional(),
  max_price: z.coerce.number().int().min(0).optional(),
  size: z.enum(["S", "M", "L", "XL", "XXL"]).optional(),
  type: z.enum(["Local", "Visitante", "Especial"]).optional(),
  min_condition: z.coerce.number().int().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

/**
 * GET /api/shirts/search — full-text search for shirts.
 * In production, queries Supabase with faceted filters.
 */
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = searchSchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parámetros de búsqueda inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // TODO: Implement Supabase full-text search with RPC
  // const supabase = await createClient();
  // const { data, error } = await supabase.rpc('search_shirts', parsed.data);

  return NextResponse.json({
    shirts: [],
    total: 0,
    query: parsed.data,
  });
}
