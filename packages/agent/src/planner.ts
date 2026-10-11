import type { DesignPlan, PosterBrief } from "@poster-pilot/shared";
import { z } from "zod";

const designLayerSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["background", "product", "text", "cta"]),
  name: z.string().min(1),
  content: z.string().optional(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().positive().max(100),
  height: z.number().positive().max(100),
  color: z.string().optional(),
  fontSize: z.number().positive().max(200).optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  align: z.enum(["left", "center"]).optional(),
});

export const designPlanSchema = z.object({
  title: z.string().min(1).max(160),
  rationale: z.string().min(1).max(600),
  palette: z.object({
    background: z.string().min(1),
    surface: z.string().min(1),
    primary: z.string().min(1),
    accent: z.string().min(1),
    text: z.string().min(1),
  }),
  composition: z.string().min(1).max(600),
  layers: z.array(designLayerSchema).min(1).max(24),
});

export interface PlannerGeneration {
  output: unknown;
  model: string;
  promptVersion: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
}

export interface PlannerProvider {
  readonly id: string;
  generatePlan(brief: PosterBrief): Promise<PlannerGeneration>;
}

const palettes: Record<PosterBrief["style"], DesignPlan["palette"]> = {
  energetic: {
    background: "#0b0d18",
    surface: "#202541",
    primary: "#ff4f7b",
    accent: "#ffd166",
    text: "#fff8f1",
  },
  minimal: {
    background: "#f2efe8",
    surface: "#ffffff",
    primary: "#181818",
    accent: "#6c63ff",
    text: "#181818",
  },
  premium: {
    background: "#11100e",
    surface: "#29251f",
    primary: "#d9b36c",
    accent: "#f0dfb8",
    text: "#fffaf0",
  },
};

function createDeterministicPlan(brief: PosterBrief): DesignPlan {
  const palette = palettes[brief.style];

  return {
    title: `${brief.campaign} · ${brief.productName}`,
    rationale: `围绕“${brief.sellingPoint}”建立单一视觉焦点；先传达活动，再解释产品价值，最后用行动按钮收口。`,
    palette,
    composition: "上方活动标签，中部产品视觉，底部卖点与行动按钮；采用 12 列网格保持留白。",
    layers: [
      { id: "background", kind: "background", name: "背景", x: 0, y: 0, width: 100, height: 100, color: palette.background },
      { id: "campaign", kind: "text", name: "活动标签", content: brief.campaign.toUpperCase(), x: 8, y: 8, width: 84, height: 8, color: palette.accent, fontSize: 18, fontWeight: 700 },
      { id: "product-visual", kind: "product", name: "产品视觉占位", content: brief.productName.slice(0, 1).toUpperCase(), x: 14, y: 20, width: 72, height: 40, color: palette.surface, fontSize: 72, fontWeight: 800, align: "center" },
      { id: "product-name", kind: "text", name: "产品主标题", content: brief.productName, x: 8, y: 64, width: 84, height: 10, color: palette.text, fontSize: 34, fontWeight: 800 },
      { id: "selling-point", kind: "text", name: "核心卖点", content: brief.sellingPoint, x: 8, y: 76, width: 84, height: 8, color: palette.text, fontSize: 17, fontWeight: 500 },
      { id: "cta", kind: "cta", name: "行动按钮", content: "立即了解", x: 8, y: 87, width: 36, height: 7, color: palette.primary, fontSize: 15, fontWeight: 700, align: "center" },
    ],
  };
}

export class DeterministicPlanner implements PlannerProvider {
  readonly id = "deterministic";

  async generatePlan(brief: PosterBrief): Promise<PlannerGeneration> {
    return {
      output: createDeterministicPlan(brief),
      model: "deterministic-rules-v2",
      promptVersion: "deterministic-v1",
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostUsd: 0,
    };
  }
}

export function parseDesignPlan(output: unknown): DesignPlan {
  return designPlanSchema.parse(output) as DesignPlan;
}
