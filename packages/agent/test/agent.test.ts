import { describe, expect, it } from "vitest";
import { executePosterAgent, type PlannerProvider } from "../src/index";

describe("executePosterAgent", () => {
  it("pauses and asks structured questions when required information is missing", async () => {
    const result = await executePosterAgent({
      productName: "",
      campaign: "双十一",
      sellingPoint: "",
      style: "energetic",
      ratio: "4:5",
    });

    expect(result.status).toBe("waiting_for_user");
    expect(result.questions.map((item) => item.field)).toEqual(["productName", "sellingPoint"]);
    expect(result.plan).toBeUndefined();
  });

  it("creates a structured design plan for a complete brief", async () => {
    const result = await executePosterAgent({
      productName: "Aurora X1 耳机",
      campaign: "夏日新品",
      sellingPoint: "轻盈降噪，全天舒适",
      style: "premium",
      ratio: "4:5",
    });

    expect(result.status).toBe("succeeded");
    expect(result.plan?.layers).toHaveLength(6);
    expect(result.events.at(-1)?.type).toBe("run.completed");
    expect(result.planner).toMatchObject({ provider: "deterministic", promptVersion: "deterministic-v1" });
  });

  it("rejects invalid provider output without updating the canvas", async () => {
    const invalidPlanner: PlannerProvider = {
      id: "invalid-fixture",
      async generatePlan() {
        return { output: { title: "缺少必要结构" }, model: "invalid", promptVersion: "test" };
      },
    };

    const result = await executePosterAgent({
      productName: "测试商品",
      campaign: "测试活动",
      sellingPoint: "测试卖点",
      style: "minimal",
      ratio: "1:1",
    }, { planner: invalidPlanner });

    expect(result.status).toBe("failed");
    expect(result.plan).toBeUndefined();
    expect(result.events.at(-1)?.type).toBe("run.failed");
  });
});
