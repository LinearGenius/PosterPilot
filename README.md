# PosterPilot

PosterPilot 是一个用于探索“受约束设计 Agent”工程实践的电商活动海报开源项目。项目从零实现，边界清晰、过程可解释，并提供可重复验证的完整技术记录。

当前版本完成了第一个可运行纵向切片，并进入 Planner 工程化阶段：

1. 用户提交海报 brief。
2. Agent 检查关键信息，缺失时返回结构化追问。
3. 信息完整时，Agent 选择 `commerce-poster` Skill。
4. Planner 输出结构化 `DesignPlan`。
5. Web 端呈现海报预览、状态和完整事件时间线。
6. Planner 通过可替换 Provider 接口执行，输出必须通过 Zod Schema 才能进入画布。
7. 每次规划记录 Provider、模型、Prompt 版本、耗时、Token 和估算成本字段。

当前仍使用确定性本地 Planner，方便零成本开发和测试；真实 LLM 适配器和一次受控重试尚未接入。图片生成、可编辑图层、版本恢复会按 `doc/06-development-plan.md` 逐步实现。真实完成边界见 `doc/13-phase-2-planner-foundation.md`。

当前产出总览见 [`PROJECT_STATUS.md`](PROJECT_STATUS.md)。项目后续统一按照 [`doc/06-development-plan.md`](doc/06-development-plan.md) 中的 10 周计划推进，每个阶段均需完成实现、测试和文档验收。

## 环境要求

- Node.js >= 20（推荐 22 或 24）
- pnpm 11

本机如果默认 Node 版本过低，可通过 nvm、fnm 或 Node.js 官方安装包切换到受支持版本。

## 启动

```bash
pnpm install
pnpm dev
```

- Web: http://localhost:5173
- API 健康检查: http://localhost:8787/health

## 验证

```bash
pnpm test
pnpm typecheck
pnpm build
```

构建后单独启动 API：

```bash
pnpm --filter @poster-pilot/api start
```

## 目录

```text
apps/web        React 用户界面与方案预览
apps/api        Fastify API，承接 Agent 运行请求
packages/agent  Agent 状态、追问策略与 Planner
packages/shared 跨端领域类型和事件协议
doc             产品、架构、协议、计划和实施记录
```

从 [doc/README.md](doc/README.md) 开始阅读完整文档。

## 开源协议

MIT。参与方式见 [CONTRIBUTING.md](CONTRIBUTING.md)。
