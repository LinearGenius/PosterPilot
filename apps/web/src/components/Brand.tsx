interface BrandProps {
  compact?: boolean;
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <span className={compact ? "brand brand-compact" : "brand"}>
      <span className="brand-mark"><span>P</span></span>
      <span className="brand-copy">PosterPilot<small>DESIGN AGENT</small></span>
    </span>
  );
}
