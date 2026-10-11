export const POSTER_STYLES = ["energetic", "minimal", "premium"] as const;
export const POSTER_RATIOS = ["4:5", "1:1", "16:9"] as const;

export type PosterStyle = (typeof POSTER_STYLES)[number];
export type PosterRatio = (typeof POSTER_RATIOS)[number];

export interface PosterBrief {
  productName: string;
  campaign: string;
  sellingPoint: string;
  style: PosterStyle;
  ratio: PosterRatio;
}

export type RunStatus =
  | "routing"
  | "clarifying"
  | "waiting_for_user"
  | "planning"
  | "tool_running"
  | "succeeded"
  | "failed";

export type AgentEventType =
  | "run.started"
  | "skill.selected"
  | "clarification.required"
  | "plan.created"
  | "tool.started"
  | "canvas.updated"
  | "run.completed"
  | "run.failed";

export interface AgentEvent {
  id: string;
  type: AgentEventType;
  label: string;
  detail: string;
  createdAt: string;
}

export interface ClarificationQuestion {
  field: keyof Pick<PosterBrief, "productName" | "campaign" | "sellingPoint">;
  question: string;
  reason: string;
}

export interface DesignLayer {
  id: string;
  kind: "background" | "product" | "text" | "cta";
  name: string;
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  align?: "left" | "center";
}

export interface DesignPlan {
  title: string;
  rationale: string;
  palette: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
  };
  composition: string;
  layers: DesignLayer[];
}

export interface PlannerTelemetry {
  provider: string;
  model: string;
  promptVersion: string;
  durationMs: number;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
}

export interface AgentRunResult {
  runId: string;
  status: "waiting_for_user" | "succeeded" | "failed";
  skill: "commerce-poster";
  events: AgentEvent[];
  questions: ClarificationQuestion[];
  plan?: DesignPlan;
  planner?: PlannerTelemetry;
}
