import type { DesignLayer, DesignPlan, PosterRatio } from "@poster-pilot/shared";

function Layer({ layer }: { layer: DesignLayer }) {
  const baseStyle = {
    left: `${layer.x}%`,
    top: `${layer.y}%`,
    width: `${layer.width}%`,
    height: `${layer.height}%`,
    color: layer.color,
    fontSize: layer.fontSize ? `clamp(0.58rem, ${layer.fontSize / 26}vw, ${layer.fontSize}px)` : undefined,
    fontWeight: layer.fontWeight,
    textAlign: layer.align,
  } as const;

  if (layer.kind === "background") {
    return <div className="poster-layer layer-background" style={{ ...baseStyle, background: layer.color }} />;
  }

  if (layer.kind === "product") {
    return (
      <div className="poster-layer layer-product" style={{ ...baseStyle, background: layer.color }}>
        <div className="product-orbit" />
        <span>{layer.content}</span>
      </div>
    );
  }

  if (layer.kind === "cta") {
    return <div className="poster-layer layer-cta" style={{ ...baseStyle, background: layer.color }}>{layer.content}</div>;
  }

  return <div className="poster-layer layer-text" style={baseStyle}>{layer.content}</div>;
}

export function PosterPreview({ plan, ratio }: { plan?: DesignPlan; ratio: PosterRatio }) {
  const aspectRatio = ratio === "4:5" ? "4 / 5" : ratio === "1:1" ? "1 / 1" : "16 / 9";

  if (!plan) {
    return (
      <div className="empty-preview" style={{ aspectRatio }}>
        <div className="empty-orbit" />
        <span>等待智能体生成方案</span>
        <small>结构化图层将在这里呈现</small>
      </div>
    );
  }

  return (
    <div className="poster-preview" style={{ aspectRatio }} aria-label="海报预览">
      {plan.layers.map((layer) => <Layer key={layer.id} layer={layer} />)}
      <div className="grain" />
    </div>
  );
}
