import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

/**
 * Reusable empty state block.
 * Always offers a next action so users never hit a dead end.
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      {icon && (
        <div className="mb-5 text-[#4A4A4A]" aria-hidden>
          {icon}
        </div>
      )}
      <h2 className="font-[family-name:var(--font-oswald)] text-xl sm:text-2xl font-bold text-[#F5F0E8] uppercase tracking-wider">
        {title}
      </h2>
      {description && (
        <p className="font-[family-name:var(--font-source-serif)] text-sm sm:text-base text-[#B0B0B0] mt-2 max-w-md">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block mt-6 px-6 py-3 bg-[#D4A843] text-[#0A0A0A] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider hover:bg-[#E8C840] transition-colors no-underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
