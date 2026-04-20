import Link from "next/link";
import ShirtPageClient from "./ShirtPageClient";
import {
  getShirtBySlug,
  getClubById,
} from "@/lib/mocks/clubs-and-shirts";
import { DEMO_COUNTRIES } from "@/lib/mocks/countries";

/**
 * Shirt detail page (/camiseta/[slug]) — PC Fútbol 5.0 style player-card layout.
 * Server component: resolves slug → shirt + club; hands everything to the client.
 */
export default async function CamisetaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shirt = getShirtBySlug(slug);

  if (!shirt) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="border border-[#2A2A2A] bg-[#0F0F0F] px-8 py-10 text-center space-y-4">
          <p className="font-[family-name:var(--font-oswald)] text-xl text-[#D83030] uppercase tracking-wider">
            Camiseta no encontrada
          </p>
          <Link
            href="/map"
            className="inline-block mt-2 px-5 py-2.5 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:bg-[#E8C059] no-underline"
          >
            Volver al mapa
          </Link>
        </div>
      </div>
    );
  }

  const club = getClubById(shirt.club_id);
  const country = club ? DEMO_COUNTRIES.find((c) => c.id === club.country_id) : undefined;
  const backHref = club ? `/map/${club.country_id}/${club.id}` : "/map";

  return (
    <ShirtPageClient
      shirt={shirt}
      club={club ?? null}
      countryName={country?.name ?? ""}
      backHref={backHref}
    />
  );
}
