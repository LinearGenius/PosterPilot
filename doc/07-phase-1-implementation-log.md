# 07 · Phase 1 实施记录

日期：2026-10-10

## 1. 阶段目标

在不使用付费模型、数据库和图片 Provider 的前提下，验证最重要的 Agent 产品闭环：输入需求、判断信息、追问或规划、展示结构化输出和执行轨迹。

## 2. 实施步骤

### Step 1：检查环境和仓库

- 工作目录初始为空，仅包含 `work/` 与 `outputs/`。
- 系统默认 Node.js 为 v12.18.2，不能满足现代 Vite/Fastify。
- 使用 Node.js v24.19.0 和 pnpm v11.25.0 完成依赖安装与验证。
- 项目声明 `node >= 20`，后续命令使用新版运行时。

### Step 2：建立 Monorepo

- 用 pnpm workspace 管理 `apps/*` 和 `packages/*`。
- 根脚本统一提供 `dev`、`test`、`typecheck`、`build`。
- 增加 `.env.example`，明确 Key 只能留在 API 侧。

### Step 3：先定义协议

- 在 `packages/shared` 定义 brief、状态、事件、追问、DesignPlan 和图层。
- 用枚举限制风格和比例。
- 前后端使用同一个 TypeScript 协议，减少字段漂移。

### Step 4：实现 Agent 最小状态

- 在 `packages/agent` 定义三个必填信息规则。
- brief 缺失时返回 `waiting_for_user` 和问题列表。
- 信息完整时生成固定可重复的 DesignPlan。
- 记录路由、Planner、画布更新和完成事件。

### Step 5：建立 API 边界

- Fastify 提供 `/health` 和 `/api/runs`。
- Zod 区分非法请求与业务信息缺失。
- CORS 默认只允许本地 Web 来源。

### Step 6：实现 Web 演示

- 左栏收集 brief。
- 中间使用 DOM 图层渲染设计方案。
- 右栏展示 Agent 事件轨迹或追问。
- 支持三种视觉风格、三种比例和移动端布局。

### Step 7：测试和验收

- Agent 单测覆盖缺失信息和完整信息两条主路径。
- 执行 `pnpm test`、`pnpm typecheck`、`pnpm build`。
- 启动 Web/API，检查 health、成功 Run、追问 Run 和浏览器页面。
- 真实结果记录在 `08-testing-and-acceptance.md`。

实际结果：2 个单元测试通过；所有 workspace 类型检查通过；API 与 Web 生产构建通过；Chrome 中的成功流程和追问流程均通过。

### Step 8：修正生产入口并初始化 Git

- 将 workspace 包拆分为 `development` 源码入口和 `default` 编译入口。
- 验证 `node dist/server.js` 能真实启动 API，而不是只验证 TypeScript 编译通过。
- 增加 MIT License 和贡献指南。
- 初始化本地 Git 仓库并将默认分支设为 `main`；当前未替用户提交、推送或创建远端仓库。

### Step 9：参考视觉与动效改造

- 分析 Pinterest 网页参考中的冰川浅蓝、超大圆角、胶囊导航、半透明悬浮卡片和非对称叠层。
- 分析 Xiaomi 动效参考中的零件聚合、缓动减速、慢速轨道、轻微漂浮和景深淡入。
- 用原创 CSS 图形构建设备、轨道、山体和网格，不复制参考素材或品牌资产。
- 首屏加入分层入场、设备持续漂浮、轨道慢转以及运行完成后的聚合动画。
- 海报结果加入上浮/缩放/模糊消散动画，事件轨迹采用 80ms 逐项延迟。
- 增加 `prefers-reduced-motion` 降级，尊重系统减少动态效果设置。
- 重新执行类型检查、生产构建和 Chrome 主流程，浏览器控制台无 warning/error。

### Step 10：中文双页面与响应式改造

- 将项目介绍与实际工作台拆分到 `/` 和 `/studio`，用 History API 保持浏览器前进、后退能力。
- 将页面标题、按钮、状态、空态、事件说明等用户可见文案统一为中文。
- 桌面端使用 `100dvh` 三栏布局，让设计需求、方案画布和执行轨迹在一个视口内同时出现。
- 平板端改为两栏加轨迹行，手机端改为单栏纵向布局，保证触控与阅读体验。
- 详细实现与验收边界见 `11-chinese-pages-and-responsive-layout.md`。

### Step 11：3D 助手精灵接入

- 根据三视图生成带透明通道的正面网站资产，保留角色造型和 `P` 徽章。
- 用角色替换介绍页原有的抽象设备主体，并复用轨道、柔光、悬浮卡和状态动效。
- 在工作台执行轨迹的空状态加入助手角色；运行时加快漂浮，事件返回后让位于真实轨迹。
- 角色设定、材质、三视图和接入规则见 `12-assistant-mascot-design.md`。

## 3. 技术取舍

| 决策 | 选择 | 理由 | 代价 |
|---|---|---|---|
| 首版 Planner | 确定性函数 | 零成本、可测、先验证协议 | 还不能理解自由文本 |
| 首版画布 | DOM 绝对定位 | 快速验证 DesignPlan | 暂时不能拖拽和导出 |
| 首版事件 | 单次响应事件数组 | 减少基础设施 | 不是实时流 |
| Monorepo | pnpm workspace | 共享类型且边界清楚 | 初学者需理解 workspace |
| API | Fastify | 轻量、Schema 友好 | 生态习惯可能不如 Express 普及 |

## 4. 当前真实能力边界

当前可以说：

> 我实现了一个海报 Agent 的第一条可运行纵向链路，包括结构化 brief、缺失信息追问、Skill 路由、本地 Planner、DesignPlan 协议、API 校验、事件轨迹和前端预览。

当前不能说：

- 已实现自主多 Agent 协作。
- 已接入图片生成或真实 LLM。
- 已完成可编辑 Canvas、异步队列或生产部署。
- 已验证真实用户指标。

## 5. 下一步

优先完成 W2：抽象 `PlannerProvider`，以现有本地 Planner 作为测试替身，再接入真实结构化模型输出。不要先接图片生成，因为 Planner 协议尚未通过足够 fixtures 验证。
