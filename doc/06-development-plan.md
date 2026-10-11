# 06 · 10 周实施与学习计划

按每周 20–24 小时、每天约 4 小时估算，总投入约 200–240 小时；若 Provider、部署或画布兼容问题较多，预留到 300 小时。每周都要有可演示增量和对应文档，不把集成风险全部堆到最后。

本文件保留完整范围和生产化学习路径。如果目标改为每天 8 小时、两周交付可演示 MVP，必须采用范围收缩版本，详见 `14-two-week-mvp-plan.md`；两份计划不能视为同等完成口径。

## 总体里程碑

| 周次 | 交付物 | 重点理解 | 验收方式 |
|---|---|---|---|
| W1 | Monorepo、brief、追问、确定性 Plan、预览 | Agent 与聊天框的区别；结构化输出 | 本地端到端 + 单测 |
| W2 | LLM Planner Adapter、Schema 重试、Prompt 版本 | 模型不确定性如何隔离 | 20 个 fixtures 通过率 |
| W3 | 项目/Run/Event 持久化、SSE | 状态与事件的关系 | 刷新后恢复运行轨迹 |
| W4 | 图片 Provider、队列和 Worker | 长任务、重试、幂等、成本 | 模拟失败后只重试工具 |
| W5 | Fabric.js 可编辑图层、素材置入 | 模型输出与确定性画布分层 | 第一条完整可演示链路 |
| W6 | 对话修改协议与版本保存 | 安全的有限操作，而非执行代码 | 修改单图层并撤销 |
| W7 | PNG 导出、字体/资源加载、项目页 | Canvas 导出常见坑 | 三种比例视觉验收 |
| W8 | 品牌规则、模板和 Prompt/Eval 集 | 质量评估与回归 | 固定用例前后对比 |
| W9 | 鉴权、限流、日志、预算控制 | 可上线的安全与成本边界 | 并发/限额测试 |
| W10 | 部署、README、演示视频、技术 FAQ | 项目叙事和证据 | 陌生人按 README 启动 |

## W1：Agent 骨架（已完成）

任务：

- [x] 建立 pnpm monorepo。
- [x] 定义 PosterBrief、AgentEvent、DesignPlan。
- [x] 实现关键信息追问。
- [x] 实现本地 Planner。
- [x] 提供 API 和 React 页面。
- [x] 显示事件轨迹和 DOM 预览。
- [x] 编写单元测试与文档。
- [x] 安装依赖并记录真实验收结果。

学习清单：

- 能解释为什么空字段是业务追问，而错误类型是 400。
- 能手写简化状态图。
- 能说明 DesignPlan 为什么是模型与画布之间的边界。
- 能指出 Phase 1 哪些是假实现、未来如何替换。

## W2：真实 Planner，不接图片生成

实施步骤：

- [x] 定义 `PlannerProvider` 接口。
- [x] 保留 `DeterministicPlanner` 作为测试替身。
- [ ] 新增一个服务端 LLM Provider，不把 Key 暴露到 Web。
- [x] 使用 Zod 解析 Planner 输出。
- [ ] 失败时把校验错误摘要返回模型，只重试一次。
- [x] 记录 Provider、模型名、Prompt 版本、耗时、Token 数和估算成本字段。
- [x] 建 20 个固定 brief，验证合法结构和一致的图层数量。
- [ ] 用真实模型运行固定用例并生成成功率、延迟和成本报告。

当前状态：W2 基础完成，真实模型适配器和受控重试待实现。详细证据见 `13-phase-2-planner-foundation.md`。

关键设计问题：

- 为什么不能相信模型会稳定返回 JSON？
- function calling 与直接要求 JSON 有何差异？
- Prompt 版本如何与历史 Run 对应？
- 如何降低 Token 和延迟？

## W3：持久化与实时事件

实施步骤：

1. Docker Compose 启动 PostgreSQL/Redis。
2. 建 Project、AgentRun、AgentEvent、DesignPlan 表。
3. 事件使用单调递增 sequence。
4. `POST /runs` 创建后立即返回 runId。
5. `GET /runs/:id/events` 使用 SSE。
6. Web 用 reducer 消费事件，刷新后先拉快照再续流。
7. 测试断网重连和事件去重。

## W4：图片工具和异步任务

实施步骤：

1. 定义 `ImageProvider`，先实现 mock，再接真实服务。
2. API 把长任务放入 BullMQ。
3. Worker 更新 ToolCall 与事件。
4. 图片上传对象存储，数据库只存元数据。
5. 增加超时、退避、限次和幂等键。
6. 记录单次调用成本并设置每日硬限额。

付费前验收：mock Provider 必须走通排队、进度、失败、重试和恢复。

## W5：可编辑画布

实施步骤：

1. 将 DesignLayer 转换为 Fabric Object。
2. 区分系统锁定层和用户可编辑层。
3. 图片模型只提供无文字视觉素材。
4. 中文文字由 Canvas 精确渲染。
5. 画布变更序列化为带 schemaVersion 的文档。
6. 资源跨域、字体加载完成后才允许导出。

## W6：对话修改与版本

实现 `update_layer`、`move_layer`、`replace_asset`、`undo_to_version` 四种操作。模型只输出白名单操作，服务端校验后执行。每个有效操作生成版本，失败不覆盖最近成功版本。

## W7–W10：产品化

- W7：导出、项目列表、三种比例和响应式体验。
- W8：品牌颜色/禁用词/Logo 安全区；加入 Eval 报告。
- W9：鉴权、速率限制、上传安全、日志脱敏、预算熔断。
- W10：云端部署、架构图、演示视频、FAQ、项目复盘。

## 每日 4 小时模板

1. 30 分钟：闭卷复述昨天的状态/协议/取舍。
2. 120 分钟：完成当日最小纵向功能。
3. 45 分钟：测试异常路径并记录证据。
4. 30 分钟：更新 `doc/` 和提交 Git。
5. 15 分钟：用口语复述一个关键设计问题。

## Git 提交建议

不要一次性提交全部代码。推荐里程碑式提交：

```text
chore: initialize poster-pilot monorepo
feat(agent): add brief clarification state
feat(agent): create deterministic design planner
feat(api): expose run endpoint with validation
feat(web): render brief, poster plan and event trace
test(agent): cover clarification and success paths
docs: document phase one architecture and acceptance
```

## 完整项目技术叙事

推荐顺序：问题边界 → 为什么需要 Agent → 状态机 → 结构化协议 → 异步工具 → 可编辑画布 → 失败恢复 → 成本与安全 → 结果数据。每个阶段都只讲自己真正完成并可展示的部分。
