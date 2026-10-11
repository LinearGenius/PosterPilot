import { FormEvent, useMemo, useState } from "react";
import type { AgentRunResult, PosterBrief, PosterRatio, PosterStyle } from "@poster-pilot/shared";
import { Brand } from "../components/Brand";
import { PosterPreview } from "../components/PosterPreview";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

const initialBrief: PosterBrief = {
  productName: "星澜 X1 耳机",
  campaign: "夏日新品",
  sellingPoint: "轻盈降噪，全天舒适",
  style: "premium",
  ratio: "4:5",
};

const styleLabels: Record<PosterStyle, string> = {
  energetic: "活力促销",
  minimal: "极简清爽",
  premium: "高端质感",
};

const statusLabels = {
  idle: "等待运行",
  waiting_for_user: "等待补充",
  succeeded: "执行成功",
  failed: "执行失败",
} as const;

const eventTypeLabels: Record<string, string> = {
  "run.started": "任务初始化",
  "skill.selected": "技能已选择",
  "clarification.required": "需要补充信息",
  "plan.created": "方案已创建",
  "tool.started": "规划器已启动",
  "canvas.updated": "画布已更新",
  "run.completed": "运行已完成",
  "run.failed": "运行失败",
};

interface StudioPageProps {
  onNavigate: (path: "/" | "/studio") => void;
}

export function StudioPage({ onNavigate }: StudioPageProps) {
  const [brief, setBrief] = useState<PosterBrief>(initialBrief);
  const [result, setResult] = useState<AgentRunResult>();
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const missingFields = useMemo(() => new Set(result?.questions.map((question) => question.field) ?? []), [result]);
  const status = result?.status ?? "idle";

  function updateBrief<K extends keyof PosterBrief>(field: K, value: PosterBrief[K]) {
    setBrief((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setIsRunning(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });

      if (!response.ok) throw new Error(`请求失败：服务返回 ${response.status}`);
      setResult((await response.json()) as AgentRunResult);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "设计智能体暂时不可用");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className={`studio-shell ${isRunning ? "is-running" : result?.plan ? "is-complete" : "is-idle"}`}>
      <header className="studio-topbar">
        <button className="back-button" type="button" onClick={() => onNavigate("/")}><span>←</span> 返回介绍页</button>
        <Brand compact />
        <div className="studio-heading"><strong>海报设计工作台</strong><small>需求、画布与执行轨迹同屏呈现</small></div>
        <div className="studio-status">
          <span className={isRunning ? "status-dot running" : "status-dot"} />
          {isRunning ? "智能体正在执行" : result ? `任务编号 ${result.runId.slice(0, 8)}` : "系统准备就绪"}
        </div>
      </header>

      <section className="studio-workspace">
        <form className="brief-panel studio-panel" onSubmit={submit}>
          <div className="panel-heading compact-heading">
            <div><span className="step-index">01</span><h2>设计需求</h2></div>
            <span className="skill-chip">电商海报技能</span>
          </div>

          <div className="brief-fields">
            <label className={missingFields.has("productName") ? "field missing" : "field"}>
              <span>产品名称</span>
              <input value={brief.productName} onChange={(event) => updateBrief("productName", event.target.value)} placeholder="例如：星澜 X1 耳机" />
            </label>
            <label className={missingFields.has("campaign") ? "field missing" : "field"}>
              <span>活动主题</span>
              <input value={brief.campaign} onChange={(event) => updateBrief("campaign", event.target.value)} placeholder="例如：夏日新品" />
            </label>
            <label className={missingFields.has("sellingPoint") ? "field missing" : "field"}>
              <span>核心卖点</span>
              <textarea value={brief.sellingPoint} onChange={(event) => updateBrief("sellingPoint", event.target.value)} placeholder="只写一个用户最该记住的卖点" rows={2} />
            </label>
          </div>

          <fieldset>
            <legend>视觉风格</legend>
            <div className="option-grid">
              {(Object.keys(styleLabels) as PosterStyle[]).map((style) => (
                <button type="button" className={brief.style === style ? "option active" : "option"} onClick={() => updateBrief("style", style)} key={style}>
                  <span className={`swatch ${style}`} />{styleLabels[style]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>画布比例</legend>
            <div className="ratio-options">
              {(["4:5", "1:1", "16:9"] as PosterRatio[]).map((ratio) => (
                <button type="button" className={brief.ratio === ratio ? "ratio active" : "ratio"} onClick={() => updateBrief("ratio", ratio)} key={ratio}>{ratio}</button>
              ))}
            </div>
          </fieldset>

          <button className="run-button" disabled={isRunning} type="submit">
            {isRunning ? "正在生成方案…" : result?.status === "waiting_for_user" ? "补充信息后继续" : "运行设计智能体"}<span>→</span>
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <section className="canvas-panel studio-panel">
          <div className="panel-heading compact-heading">
            <div><span className="step-index">02</span><h2>方案画布</h2></div>
            <span className="canvas-meta">{brief.ratio} · 浏览器渲染</span>
          </div>
          <div className="canvas-stage">
            <PosterPreview key={`${result?.runId ?? "empty"}-${brief.ratio}`} plan={result?.plan} ratio={brief.ratio} />
          </div>
          {result?.plan && (
            <div className="plan-summary">
              <div><span>设计说明</span><p>{result.plan.rationale}</p></div>
              <div><span>构图策略</span><p>{result.plan.composition}</p></div>
            </div>
          )}
        </section>

        <aside className="trace-panel studio-panel">
          <div className="panel-heading compact-heading">
            <div><span className="step-index">03</span><h2>执行轨迹</h2></div>
            <span className={`result-status ${status}`}>{isRunning ? "执行中" : statusLabels[status]}</span>
          </div>

          {!result && (
            <div className="empty-trace">
              <img className="trace-mascot" src="/assets/posterpilot-assistant-front.png" alt="" aria-hidden="true" />
              <p>我会陪你完成这次设计，并记录每一个关键步骤。</p>
            </div>
          )}

          {result?.questions.length ? (
            <div className="questions">
              <strong>智能体正在等待你补充信息</strong>
              {result.questions.map((question) => <div key={question.field}><p>{question.question}</p><small>{question.reason}</small></div>)}
            </div>
          ) : null}

          <ol className="timeline">
            {result?.events.map((event, index) => (
              <li key={event.id}>
                <span className="event-index">{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{event.label}</strong><p>{event.detail}</p><small>{eventTypeLabels[event.type] ?? "执行步骤"}</small></div>
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </main>
  );
}
