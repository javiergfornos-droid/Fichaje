interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * Loading skeleton primitive — subtle pulse on a dark surface.
 */
export default function Skeleton({
  className = "",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#1A1A1A] ${className}`}
      style={{ width, height }}
      aria-hidden
    />
  );
}
