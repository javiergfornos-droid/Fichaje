"use client";

export default function ShirtError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-60px)]">
      <div className="retro-dark-panel px-8 py-6 text-center space-y-4">
        <p className="font-[family-name:var(--font-oswald)] text-[#D83030] uppercase">
          Error al cargar la ficha
        </p>
        <p className="font-[family-name:var(--font-source-serif)] text-xs text-[#88AACC]">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="retro-btn-outset px-4 py-2 font-[family-name:var(--font-oswald)] text-sm uppercase cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
