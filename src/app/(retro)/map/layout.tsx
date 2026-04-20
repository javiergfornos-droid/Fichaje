import MapShell from "./MapShell";

export const metadata = {
  title: "¡FICHAJE! — Mapa de fichajes",
};

/**
 * Layout shared by /map, /map/[country] and /map/[country]/[club].
 * The shell renders the chrome (tabs, map, onboarding, CTAs); the page slot
 * injects the right-side panel appropriate to the current state.
 */
export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MapShell>{children}</MapShell>;
}
