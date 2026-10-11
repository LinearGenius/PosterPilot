# 05 · API 与事件协议

## 1. 当前 API

### `GET /health`

响应：

```json
{
  "status": "ok",
  "service": "poster-pilot-api",
  "planner": "deterministic-v1"
}
```

### `POST /api/runs`

请求：

```json
{
  "productName": "Aurora X1 耳机",
  "campaign": "夏日新品",
  "sellingPoint": "轻盈降噪，全天舒适",
  "style": "premium",
  "ratio": "4:5"
}
```

需要追问时：

```json
{
  "runId": "uuid",
  "status": "waiting_for_user",
  "skill": "commerce-poster",
  "events": [],
  "questions": [
    {
      "field": "sellingPoint",
      "question": "用户最需要记住的一个核心卖点是什么？",
      "reason": "单一核心卖点能避免首屏信息过载。"
    }
  ]
}
```

执行成功时额外返回 `plan`。

错误：

```json
{
  "error": "INVALID_BRIEF",
  "message": "提交的海报需求格式不正确。",
  "details": {}
}
```

## 2. 事件类型

| 类型 | 含义 | UI 行为 |
|---|---|---|
| `run.started` | 创建运行 | 显示初始化状态 |
| `skill.selected` | 已选择任务 Skill | 显示路由结果 |
| `clarification.required` | 需要用户信息 | 高亮输入字段并暂停 |
| `plan.created` | DesignPlan 通过校验 | 展示设计说明 |
| `tool.started` | 工具开始 | 显示进行中状态 |
| `asset.generated` | 素材已完成（Phase 2） | 加入资源库 |
| `canvas.updated` | 画布文档已更新 | 刷新预览 |
| `run.completed` | 主流程完成 | 开启编辑/导出 |
| `run.failed` | 运行失败 | 显示恢复动作 |

## 3. Phase 2 SSE

目标接口：

```text
POST /api/runs                  创建运行
GET  /api/runs/:runId/events   SSE 订阅事件
POST /api/runs/:runId/messages 提交追问答案或修改指令
POST /api/tool-calls/:id/retry 只重试失败工具
```

SSE 数据格式：

```text
id: 17
event: tool.started
data: {"runId":"...","toolCallId":"...","tool":"generate_background"}

```

客户端通过 `Last-Event-ID` 断线续传；服务端从数据库中补发缺失事件，再继续推送新事件。

## 4. 版本策略

- URL 当前使用 `/api`，开源 MVP 达到稳定后切换 `/api/v1`。
- 事件只新增字段，不删除或改名已有字段。
- Canvas 文档包含 `schemaVersion`，迁移逻辑集中处理。
- Provider 的原始响应不直接暴露给前端，避免耦合。

## 5. 输入校验

当前 API 用 Zod 校验：

- 三个文本字段必须是字符串，并设置最大长度。
- `style`、`ratio` 必须来自固定枚举。
- 缺少业务信息和格式非法是两类情况：空字符串是业务追问；错误类型或超长是 HTTP 400。

这一区分很重要：前者属于 Agent 工作流，后者属于系统边界防御。
