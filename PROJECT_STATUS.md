# PosterPilot 项目状态

更新日期：2026-10-11

## 当前结论

PosterPilot 已完成可运行的 Phase 1，并进入 Phase 2 Planner 工程化阶段。介绍页、工作台、响应式界面、3D 助手、结构化追问、确定性 Planner、Schema 校验、事件轨迹和固定用例均已进入项目目录。

当前可以用于展示“受约束 Agent 的最小纵向链路”，但还不能宣称完成真实 LLM、图片生成、可编辑 Canvas、持久化、版本恢复和生产部署。

## 产出入口

| 类型 | 位置 | 内容 |
| --- | --- | --- |
| Web | `apps/web` | 中文介绍页、工作台、响应式布局、海报预览、3D 助手 |
| API | `apps/api` | Fastify 健康检查和 Agent Run 接口 |
| Agent | `packages/agent` | 追问、Skill 路由、Planner Provider、Zod 校验和失败保护 |
| 协议 | `packages/shared` | Brief、Run、Event、DesignPlan 和 Telemetry 类型 |
| 视觉资产 | `apps/web/public/assets` | 助手正面透明图和三视图 |
| 产品与架构文档 | `doc/00`–`doc/06` | 范围、流程、架构、领域模型、状态机、API 和路线图 |
| 实施与验收 | `doc/07`、`doc/08`、`doc/10`–`doc/13` | 实施步骤、测试证据、视觉改版、响应式、助手和 Planner 基础 |
| 面试材料 | `doc/09-interview-guide.md` | 项目陈述、演示路径和真实能力边界 |
| 两周计划 | `doc/14-two-week-portfolio-mvp-plan.md` | 每天 8 小时的压缩范围、日程和验收标准 |

完整文档索引见 [`doc/README.md`](doc/README.md)。

## 已验证

- 23 个测试通过，其中包含 20 个 Planner 固定用例。
- 全部 workspace TypeScript 检查通过。
- Web、API、Agent、Shared 生产构建通过。
- API 生产入口 `/health` 与 `/api/runs` 返回 200。
- Chrome 桌面端和移动视口视觉回归通过。

## 当前最高优先级

1. 接入一个真实 LLM Planner Provider。
2. 加入 Prompt 版本和单次 Schema 修复重试。
3. 生成第一份真实模型 Eval 报告。
4. 在继续扩大功能前建立第一次 Git 基线提交。

## 完成口径

- “两周完成”指求职可演示 MVP，不等于原十周计划中的生产化版本。
- 每个完成项必须同时具备：代码、异常路径测试、`doc/` 记录和可重复验收命令。
- 未接入或未验证的能力必须继续标注为计划项，不能写入简历的已完成功能。
