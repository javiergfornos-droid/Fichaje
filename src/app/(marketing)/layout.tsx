/**
 * Layout for the marketing/landing pages — "Stadium Archive" dark theme.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">
      {children}
    </div>
  );
}
