import type { ReactNode } from "react";
import { Brand } from "../components/Brand";

interface LandingPageProps {
  onNavigate: (path: "/" | "/studio") => void;
}

function PageLink({ children, className, onNavigate }: { children: ReactNode; className: string; onNavigate: () => void }) {
  return (
    <a
      className={className}
      href="/studio"
      onClick={(event) => {
        event.preventDefault();
        onNavigate();
      }}
    >
      {children}
    </a>
  );
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <main className="landing-shell">
      <header className="topbar landing-topbar">
        <a href="#introduce" aria-label="PosterPilot 首页"><Brand /></a>
        <nav className="nav-pill" aria-label="介绍页导航">
          <a href="#introduce">项目介绍</a>
          <a href="#abilities">核心能力</a>
          <a href="#process">工作方式</a>
        </nav>
        <div className="topbar-actions">
          <PageLink className="header-studio-link" onNavigate={() => onNavigate("/studio")}>打开工作台 <span>↗</span></PageLink>
        </div>
      </header>

      <section className="hero" id="introduce">
        <div className="hero-copy">
          <div className="eyebrow"><span /> 可解释的海报设计智能体 · 01</div>
          <h1 className="hero-title">
            <span className="hero-title-line">从一句需求，</span>
            <span className="hero-title-line hero-title-result"><span>生长出</span><em>完整视觉。</em></span>
          </h1>
          <p className="hero-lead">把模糊的营销想法，变成可解释、可继续编辑的海报方案。</p>
          <p className="hero-note">智能体会先识别信息缺口，再生成结构化方案并交给画布；从追问到结果，每一个步骤都可以观察和验证。</p>
          <div className="hero-actions">
            <PageLink className="primary-cta" onNavigate={() => onNavigate("/studio")}>进入设计工作台 <span>↗</span></PageLink>
          </div>
        </div>

        <div className="motion-scene is-idle" aria-hidden="true">
          <div className="scene-aura" /><div className="scene-grid" />
          <div className="orbit orbit-outer"><span /><span /><span /></div>
          <div className="orbit orbit-inner"><span /><span /></div>
          <div className="assistant-shadow" />
          <img className="hero-assistant" src="/assets/posterpilot-assistant-front.png" alt="" loading="eager" />
          <div className="floating-card card-skill"><i>01</i><span>技能路由</span><strong>电商海报设计</strong></div>
          <div className="floating-card card-plan"><i>02</i><span>设计方案</span><strong>等待输入需求</strong></div>
          <div className="scene-status"><span className="scene-status-dot" />系统准备就绪</div>
        </div>

        <div className="hero-index"><span>01</span><i /><span>03</span></div>
      </section>

      <section className="intro-section" id="abilities">
        <div className="section-heading">
          <span>核心能力</span>
          <h2>不是聊天框，而是一条<br />可观察的设计执行链路。</h2>
        </div>
        <div className="ability-grid">
          <article><i>01</i><h3>主动追问</h3><p>信息不足时暂停执行，针对产品、活动和核心卖点提出明确问题。</p></article>
          <article><i>02</i><h3>清晰成案</h3><p>把需求整理为配色、构图和图层方案，方便查看并继续调整。</p></article>
          <article><i>03</i><h3>过程透明</h3><p>需求检查、方案生成和画布更新都会清晰呈现，结果来源一目了然。</p></article>
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="process-copy">
          <span>工作方式</span>
          <h2>需求先收敛，<br />生成再发生。</h2>
          <p>先明确目标和必要信息，再把想法转成可查看、可继续调整的视觉方案。</p>
        </div>
        <ol className="process-list">
          <li><span>01</span><strong>提交设计需求</strong><small>产品、活动、卖点、风格与比例</small></li>
          <li><span>02</span><strong>检查信息完整性</strong><small>缺失时进入追问并等待补充</small></li>
          <li><span>03</span><strong>生成结构化方案</strong><small>输出构图、配色和可渲染图层</small></li>
          <li><span>04</span><strong>呈现执行轨迹</strong><small>结果与每个关键事件同步展示</small></li>
        </ol>
      </section>

      <section className="landing-cta">
        <div><span>准备好了吗？</span><h2>现在生成你的第一张方案。</h2></div>
        <PageLink className="primary-cta" onNavigate={() => onNavigate("/studio")}>打开设计工作台 <span>↗</span></PageLink>
      </section>

      <footer><span>PosterPilot</span><span>从需求到视觉，每一步都清晰可见</span></footer>
    </main>
  );
}
