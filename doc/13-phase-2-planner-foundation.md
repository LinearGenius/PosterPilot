# 13 · Phase 2 Planner 基础

日期：2026-10-11

## 1. 本轮目标

在接入付费模型前，先把 Planner 从 Agent 主流程中解耦，并建立模型输出进入画布前的运行时边界。这样可以继续使用零成本确定性实现做回归，同时让后续 LLM Provider 只负责生成，不绕过校验和失败处理。

## 2. 实施步骤

### Step 1：抽象 Planner Provider

- 新增 `PlannerProvider` 接口，统一 `generatePlan(brief)` 调用入口。
- 新增 `PlannerGeneration`，允许 Provider 返回原始未知输出和模型元数据。
- 将原来的固定规划逻辑迁入 `DeterministicPlanner`，作为默认实现和测试替身。
- `executePosterAgent` 改为异步，并允许测试或 API 注入其他 Provider。

### Step 2：增加运行时 Schema

- 使用 Zod 定义 `DesignPlan`、颜色、图层、位置、尺寸和字体数值边界。
- Provider 输出类型固定为 `unknown`，不能仅依赖 TypeScript 的编译期类型。
- 只有 `parseDesignPlan` 成功后，方案才会进入 `plan.created` 和 `canvas.updated`。

### Step 3：建立失败保护

- Provider 抛错或输出结构非法时，Run 返回 `failed`。
- 失败路径追加 `run.failed` 事件。
- 不返回 `plan`，因此前端不会用非法数据覆盖最近的有效画布。
- 当前错误详情不直接暴露给用户，避免泄漏 Provider 响应；后续会把可控的校验摘要用于一次模型重试。

### Step 4：补充可观测字段

成功结果新增 `PlannerTelemetry`：

```ts
interface PlannerTelemetry {
  provider: string;
  model: string;
  promptVersion: string;
  durationMs: number;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
}
```

确定性 Planner 的 Token 和成本为 0；真实 LLM Provider 接入后填写实际用量或明确标注为估算值。

### Step 5：建立固定用例集

- 新增 20 个覆盖食品、美妆、数码、服饰、家居和健康品类的完整 brief。
- 覆盖三种风格与三种画布比例。
- 每个用例验证 Run 成功、标题包含产品名、结果固定为 6 个合法图层。
- 额外注入一个故意返回非法结构的 Provider，验证失败保护。

### Step 6：恢复依赖并验证

- 初次验证使用系统 Node v12，ESM 加载失败。
- 改用工作区 Node v24.19.0 与 pnpm v11.25.0。
- 重新安装依赖并运行测试、类型检查和生产构建。

## 3. 验收结果

| 项目 | 结果 |
| --- | --- |
| 测试文件 | 2 个通过 |
| 测试数量 | 23 个通过 |
| 固定 Planner 用例 | 20/20 通过 |
| 非法 Provider 输出 | 正确返回 `failed`，不产生 Plan |
| API 生产入口 | `/health` 与 `/api/runs` 返回 200，真实响应包含 telemetry |
| TypeScript | 全部 workspace 通过 |
| 生产构建 | API、Web、Agent、Shared 全部通过 |

## 4. 当前可以怎么讲

> 我先定义 Provider 边界，把确定性 Planner 保留为测试替身。所有 Provider 都只能返回未知数据，Agent 必须通过 Zod 运行时校验后才允许更新画布。非法输出会进入可恢复失败状态，并且不会污染最后一次有效方案。这样接入真实模型时，不确定性被限制在 Adapter 内部。

## 5. 本轮还没有完成什么

- 没有接入真实 LLM API。
- 没有实现把 Schema 错误摘要反馈给模型并只重试一次。
- 没有真实 Token、价格和延迟数据。
- 没有对 20 个用例做语义质量评分，目前只验证协议和结构稳定性。
- 没有 Prompt 模板文件及版本哈希。

## 6. 下一步

1. 选择一个支持结构化输出的服务端模型 Provider。
2. 把 Prompt 拆成可版本化模板，并固定 `promptVersion`。
3. 实现第一次生成、Schema 失败摘要、单次修复重试的完整路径。
4. 用 20 个固定 brief 记录成功率、P50/P95 延迟、Token 和估算成本。
5. 保持 Web 无法访问 Provider Key，API 只返回必要 telemetry。
