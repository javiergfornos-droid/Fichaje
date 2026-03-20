interface StarsProps {
  count: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "text-xs", md: "text-base", lg: "text-xl" };

/**
 * 1-5 gold star display for quality rating.
 */
export default function Stars({ count, size = "md" }: StarsProps) {
  return (
    <span className={`${sizeMap[size]} text-[#D4A843] tracking-wider`} aria-label={`${count} estrellas`}>
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}
