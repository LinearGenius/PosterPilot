# PosterPilot 文档索引

这套文档和代码同步演进。每完成一个阶段，都必须更新实施记录、验收结果和对应架构说明，避免出现“代码能演示，但面试时讲不清”的情况。

## 建议阅读顺序

1. [00-project-scope.md](00-project-scope.md)：为什么做、做什么、不做什么。
2. [01-product-flow.md](01-product-flow.md)：用户流程与 Agent 流程。
3. [02-architecture.md](02-architecture.md)：前后端、Agent、工具和存储如何协作。
4. [03-domain-model.md](03-domain-model.md)：核心数据结构和未来数据库表。
5. [04-agent-state-machine.md](04-agent-state-machine.md)：状态机、追问条件和失败恢复。
6. [05-api-and-event-protocol.md](05-api-and-event-protocol.md)：API 与事件协议。
7. [06-development-plan.md](06-development-plan.md)：10 周实施与学习计划。
8. [07-phase-1-implementation-log.md](07-phase-1-implementation-log.md)：第一阶段实际做了什么。
9. [08-testing-and-acceptance.md](08-testing-and-acceptance.md)：如何验证功能与记录证据。
10. [09-interview-guide.md](09-interview-guide.md)：如何演示、陈述和应对追问。
11. [10-visual-redesign.md](10-visual-redesign.md)：Pinterest 参考拆解、视觉语言与动效参数。
12. [11-chinese-pages-and-responsive-layout.md](11-chinese-pages-and-responsive-layout.md)：中文双页面、一屏工作台与响应式改造记录。
13. [12-assistant-mascot-design.md](12-assistant-mascot-design.md)：3D 助手精灵的参考拆解、角色设定与三视图。
14. [13-phase-2-planner-foundation.md](13-phase-2-planner-foundation.md)：Planner Provider、Schema、防污染失败路径和固定用例集。
15. [14-two-week-portfolio-mvp-plan.md](14-two-week-portfolio-mvp-plan.md)：每天 8 小时的两周压缩范围、逐日任务和验收标准。
16. [decisions/ADR-001-deterministic-first.md](decisions/ADR-001-deterministic-first.md)：为什么先用确定性 Planner。

## 文档维护规则

- 产品边界变化：更新 `00`、`01`。
- 组件或依赖关系变化：更新 `02` 和对应 ADR。
- 状态、事件、接口变化：更新 `03`、`04`、`05`。
- 每次完成一个里程碑：追加 `07`，执行并更新 `08`。
- README 中只写快速开始，细节归档在这里。

## 面试表达边界

PosterPilot 是独立实现的求职项目。可以讲设计分析、实现和验证，但不要把其他公司的 Agent 核心能力描述成自己的历史工作。合理表达是：曾参与相关产品的前端协作，由此观察到一些产品模式；离职后独立拆解并实现了这个边界更小、可验证的项目。
