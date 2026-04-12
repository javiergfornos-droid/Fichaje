import ProductCard from "./ProductCard";
import type { Shirt } from "@/types/shirt";

interface RelatedProductsProps {
  shirts: Shirt[];
  title?: string;
}

/**
 * Related products block shown at the bottom of PDPs.
 * Only rendered below the primary purchase path to avoid distraction.
 */
export default function RelatedProducts({
  shirts,
  title = "También te puede interesar",
}: RelatedProductsProps) {
  if (shirts.length === 0) return null;

  return (
    <section className="border-t border-[#1A1A1A] pt-8 mt-8">
      <h2 className="font-[family-name:var(--font-oswald)] text-xl sm:text-2xl font-bold text-[#F5F0E8] uppercase tracking-wider mb-5">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {shirts.map((shirt) => (
          <ProductCard key={shirt.id} shirt={shirt} />
        ))}
      </div>
    </section>
  );
}
