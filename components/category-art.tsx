/** Fine-line geometric illustration per category, drawn in code (1.5 px strokes). */
export function CategoryArt({ slug }: { slug: string }) {
  if (slug === "ai-app-builders") {
    return (
      <svg viewBox="0 0 240 160" aria-hidden="true" className="w-full" fill="none" strokeWidth="1.5">
        <rect x="20" y="20" width="90" height="56" className="stroke-ink" />
        <rect x="130" y="20" width="90" height="56" className="stroke-ink" />
        <rect x="75" y="100" width="90" height="44" className="stroke-primary" />
        <path d="M65 76 V88 H120 V100 M175 76 V88 H120" className="stroke-ink" />
        <path d="M32 36 H80 M32 48 H96 M32 60 H70 M142 36 H200 M142 48 H186" className="stroke-ink" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 160" aria-hidden="true" className="w-full" fill="none" strokeWidth="1.5">
      <rect x="20" y="16" width="200" height="128" className="stroke-ink" />
      <path d="M20 36 H220" className="stroke-ink" />
      <rect x="36" y="52" width="80" height="48" className="stroke-primary" />
      <path d="M132 56 H200 M132 70 H188 M132 84 H196 M36 116 H200 M36 128 H160" className="stroke-ink" />
    </svg>
  );
}
