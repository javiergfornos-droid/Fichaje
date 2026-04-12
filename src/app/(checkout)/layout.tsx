import type { ReactNode } from "react";

/**
 * Checkout route group layout. Keeps the app header but provides
 * a distraction-free dark canvas for cart + checkout + success pages.
 */
export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#0A0A0A]">{children}</div>;
}
