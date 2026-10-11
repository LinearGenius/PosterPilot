import type {
  AgentEvent,
  AgentRunResult,
  ClarificationQuestion,
  PosterBrief,
} from "@poster-pilot/shared";
import { DeterministicPlanner, parseDesignPlan, type PlannerProvider } from "./planner.js";

export { DeterministicPlanner, designPlanSchema, parseDesignPlan } from "./planner.js";
export type { PlannerGeneration, PlannerProvider } from "./planner.js";

const requiredQuestions: Array<{
  field: ClarificationQuestion["field"];
  question: string;
  reason: string;
}> = [
  {
    field: "productName",
    question: "这张海报要突出哪个产品？",
    reason: "产品名称决定主标题和视觉主体。",
  },
  {
    field: "campaign",
    question: "这次活动的主题或时间节点是什么？",
    reason: "活动语境决定信息层级和传播语气。",
  },
  {
    field: "sellingPoint",
    question: "用户最需要记住的一个核心卖点是什么？",
    reason: "单一核心卖点能避免首屏信息过载。",
  },
];

function createEvent(type: AgentEvent["type"], label: string, detail: string): AgentEvent {
  return {
    id: crypto.randomUUID(),
    type,
    label,
    detail,
    createdAt: new Date().toISOString(),
  };
}

function findMissingInformation(brief: PosterBrief): ClarificationQuestion[] {
  return requiredQuestions.filter(({ field }) => !brief[field].trim());
}

const defaultPlanner = new DeterministicPlanner();

export async function executePosterAgent(
  brief: PosterBrief,
  options: { planner?: PlannerProvider } = {},
): Promise<AgentRunResult> {
  const runId = crypto.randomUUID();
  const events: AgentEvent[] = [
    createEvent("run.started", "任务已创建", "收到设计需求，开始判断任务类型与必要信息。"),
    createEvent("skill.selected", "选择海报技能", "路由到电商海报设计技能，并限制可用工具和输出结构。"),
  ];
  const questions = findMissingInformation(brief);

  if (questions.length > 0) {
    events.push(
      createEvent(
        "clarification.required",
        "需要补充信息",
        `缺少 ${questions.map((item) => ({ productName: "产品名称", campaign: "活动主题", sellingPoint: "核心卖点" })[item.field]).join("、")}，暂停执行并等待用户。`,
      ),
    );

    return {
      runId,
      status: "waiting_for_user",
      skill: "commerce-poster",
      events,
      questions,
    };
  }

  events.push(
    createEvent("tool.started", "启动方案规划器", "将设计需求转换为受约束的结构化设计方案。"),
  );
  const planner = options.planner ?? defaultPlanner;
  const startedAt = Date.now();

  try {
    const generation = await planner.generatePlan(brief);
    const plan = parseDesignPlan(generation.output);
    const plannerTelemetry = {
      provider: planner.id,
      model: generation.model,
      promptVersion: generation.promptVersion,
      durationMs: Date.now() - startedAt,
      inputTokens: generation.inputTokens,
      outputTokens: generation.outputTokens,
      estimatedCostUsd: generation.estimatedCostUsd,
    };

    events.push(
      createEvent("plan.created", "方案已生成", `生成 ${plan.layers.length} 个图层和配色、构图说明。`),
      createEvent("canvas.updated", "画布已更新", "浏览器渲染器已获得可视化图层数据。"),
      createEvent("run.completed", "任务完成", "第一版方案已可预览，后续可进入图层编辑与版本保存。"),
    );

    return { runId, status: "succeeded", skill: "commerce-poster", events, questions: [], plan, planner: plannerTelemetry };
  } catch {
    events.push(createEvent("run.failed", "方案生成失败", "规划器输出未通过结构校验，画布未更新，可以安全重试。"));
    return { runId, status: "failed", skill: "commerce-poster", events, questions: [] };
  }
}
