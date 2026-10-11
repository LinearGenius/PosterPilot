# 08 · 测试与验收记录

## 1. 验收命令

使用 Node.js >= 20：

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
pnpm dev
```

接口检查：

```bash
curl http://localhost:8787/health

curl -X POST http://localhost:8787/api/runs \
  -H 'Content-Type: application/json' \
  -d '{"productName":"Aurora X1 耳机","campaign":"夏日新品","sellingPoint":"轻盈降噪，全天舒适","style":"premium","ratio":"4:5"}'

curl -X POST http://localhost:8787/api/runs \
  -H 'Content-Type: application/json' \
  -d '{"productName":"","campaign":"双十一","sellingPoint":"","style":"energetic","ratio":"4:5"}'
```

## 2. 自动化验收项

| 项目 | 预期 | 当前结果 |
|---|---|---|
| Agent 缺失信息测试 | `waiting_for_user` 且字段准确 | PASS |
| Agent 完整 brief 测试 | `succeeded` 且 6 个图层 | PASS |
| TypeScript | 所有 workspace 无类型错误 | PASS |
| Production build | API 与 Web 都构建成功 | PASS |

## 3. API 验收项

| 场景 | 预期 | 当前结果 |
|---|---|---|
| `/health` | HTTP 200，planner 为 deterministic-v1 | PASS |
| 完整 brief | 返回 plan 和 `run.completed` | PASS |
| 缺字段内容 | HTTP 200，返回结构化 questions | PASS |
| 非法枚举 | HTTP 400 `INVALID_BRIEF` | PASS |

## 4. 浏览器验收项

- 页面三栏在桌面宽度下完整显示。
- 点击运行后能看到海报预览。
- 风格切换会生成对应配色。
- 比例切换会改变画布比例。
- 清空卖点后运行，字段高亮并展示追问。
- 移动宽度下三栏纵向排列，无横向溢出。
- 浏览器控制台没有阻塞性错误。

Chrome 实测结果：

- PASS：页面正常渲染，三栏桌面布局无明显遮挡。
- PASS：默认 brief 运行后生成高端质感 4:5 海报预览和 6 条事件。
- PASS：清空产品名称和核心卖点后，状态变为 `waiting_for_user`，展示两个准确问题。
- PASS：方案预览、设计说明和事件时间线同步刷新。
- 后续已执行：移动端 `390×844` 视口和浏览器控制台专项检查，结果见下方回归记录。

视觉改版回归（2026-10-10）：

- PASS：浅蓝冰川背景、玻璃胶囊导航、悬浮卡片和超大圆角层级正常渲染。
- PASS：设备漂浮、轨道旋转、方案进入和事件序列动效正常。
- PASS：运行 Agent 后三栏内容、海报结果与 6 条事件完整可见。
- PASS：Chrome console warning/error 为 0。
- PASS：改版后 TypeScript 检查与生产构建通过。
- 后续已执行：Chrome 移动视口视觉回归；物理真机仍属于发布前可选补充项。

中文双页面与响应式验收（2026-10-10）：

| 场景 | 验收目标 | 状态 |
| --- | --- | --- |
| 介绍页 `/` | 仅展示项目价值、能力、流程和工作台入口 | PASS |
| 工作台 `/studio` | 需求、画布、轨迹职责清晰，能完整运行现有闭环 | PASS |
| 桌面端 | 三项核心功能在同一视口内可见，轨迹超长时栏内滚动 | PASS |
| 平板端 | 输入与画布保持足够宽度，轨迹自然换到下一行 | PASS |
| 手机端 | 单栏排列，无横向溢出，输入和按钮可触控 | PASS |
| 中文文案 | 面向用户的导航、提示、状态和事件详情均为中文 | PASS |

实测视口：桌面 `1470×737`、低高度桌面 `1365×650`、平板 `1024×768`、手机 `390×844`。完整生成后展示 6 个中文事件，Chrome 控制台 warning/error 为 0。

3D 助手接入回归（2026-10-10）：

| 场景 | 验收目标 | 状态 |
| --- | --- | --- |
| 介绍页桌面端 | 助手位于主视觉中心，悬浮卡片和状态胶囊仍清晰可读 | PASS |
| 介绍页手机端 `390×844` | 助手随场景缩放，不造成横向溢出 | PASS |
| 工作台桌面端 `1470×737` | 助手完整位于执行轨迹空状态，三栏仍在单屏内 | PASS |
| 状态切换 | 运行后由问题或事件轨迹替换助手空状态 | PASS |
| 透明图片资源 | 返回 `200 image/png`，Alpha 通道有效 | PASS |
| 浏览器控制台 | warning/error 为 0 | PASS |

## 5. 结果记录规则

执行后把“待执行”替换为：

- `PASS`：真实执行通过。
- `FAIL`：附错误摘要和对应 issue。
- `BLOCKED`：说明外部依赖或权限，不得写成通过。

每次重要版本都更新日期、Node/pnpm 版本和失败证据，避免 README 与实际状态脱节。

## 6. 本轮环境

- 日期：2026-10-10
- 系统默认 Node：v12.18.2（不兼容）
- 实际使用 Node：v24.19.0
- pnpm：v11.25.0
- 最终执行结果：单测 2/2、类型检查、生产构建、4 个 API 场景、Chrome 主流程与追问流程均 PASS。
- 生产启动：`pnpm --filter @poster-pilot/api start` 使用编译后的 JavaScript 启动成功，`/health` PASS。
- 依赖安全：pnpm 安装时仅批准 `esbuild` 安装脚本，记录在 `pnpm-workspace.yaml`。

## 7. W2 Planner 基础验收（2026-10-11）

| 检查项 | 结果 |
| --- | --- |
| Provider 抽象 | PASS：确定性 Planner 通过 `PlannerProvider` 注入 |
| 运行时结构校验 | PASS：非法输出被 Zod 拒绝，Run 返回 `failed`，画布没有 Plan |
| Telemetry 协议 | PASS：结果包含 Provider、模型、Prompt 版本、耗时、Token 和成本字段 |
| 固定用例 | PASS：20 个电商品类 brief 均生成合法 6 图层方案 |
| API 生产入口 | PASS：`/health` 与 `/api/runs` 返回 200，响应包含 Planner telemetry |
| 单元测试 | PASS：2 个测试文件、23 个测试全部通过 |
| 类型检查 | PASS：4 个 workspace 全部通过 |
| 生产构建 | PASS：API、Web、Agent、Shared 全部通过 |

环境说明：系统默认 Node v12 会导致现代 ESM 工具报 `ERR_UNSUPPORTED_ESM_URL_SCHEME`。切换到项目要求的 Node v24.19.0 后全部通过；因此失败属于运行时版本不满足 `Node >= 20`，不是功能回归。
