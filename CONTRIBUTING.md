# Contributing to PosterPilot

感谢你愿意参与。当前项目仍在 MVP 阶段，请先通过 issue 说明要解决的问题，再提交范围小、可验证的变更。

## 本地检查

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

## 提交原则

- 一次提交只解决一个明确问题。
- Agent 状态、事件或协议变化必须同步更新 `doc/`。
- 新能力必须覆盖成功路径与至少一个失败路径。
- 不提交 API Key、用户图片、内部公司代码或其他受限材料。
- 第三方 Provider 必须通过接口适配，不让原始响应渗透到 UI。

## Pull Request 描述

请写明：问题、方案、边界、验证命令、截图（如有 UI 变化）以及新增成本/安全风险。
