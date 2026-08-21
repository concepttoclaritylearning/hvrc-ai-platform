import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkle,
  Code,
  Cpu,
  ShieldCheck,
  Lightning,
  ArrowsClockwise,
  UsersThree,
  Key,
  FolderSimple,
  Globe,
  Terminal,
  Play,
  ArrowRight,
  CheckCircle
} from "@phosphor-icons/react";

const FEATURES = [
  {
    icon: <Cpu className="w-6 h-6 text-[#2F6BFF]" />,
    title: "Universal Model Gateway (460+)",
    desc: "Connect NVIDIA NIM, OpenRouter, Groq, or Local Ollama. Auto-discover all your models with zero vendor lock-in.",
    badge: "BYOK Gateway"
  },
  {
    icon: <UsersThree className="w-6 h-6 text-emerald-400" />,
    title: "Multi-Agent Swarm Runtimes",
    desc: "Collaborative agent swarms: Primary Orchestrator, Code Reviewer, Test Engineer, Bug Hunter, and System Architect.",
    badge: "Autonomous Swarm"
  },
  {
    icon: <Code className="w-6 h-6 text-cyan-400" />,
    title: "Full-Stack Code IDE & Sandbox",
    desc: "Tabbed editor with JetBrains Mono, live hot-reloading web preview, diagnostics panel, and 1-click AI auto-fix.",
    badge: "Zero-Setup IDE"
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
    title: "Zero-Server Privacy & Google Drive",
    desc: "Projects, chats, and code are saved directly to your Google Drive or local browser storage. We store zero user data.",
    badge: "100% Client-First"
  },
  {
    icon: <Lightning className="w-6 h-6 text-amber-400" />,
    title: "Serverless High-Speed Proxy",
    desc: "Built-in stateless CORS proxy with rate-limiting, instant token streaming, and token latency monitoring.",
    badge: "Sub-50ms Latency"
  },
  {
    icon: <Globe className="w-6 h-6 text-rose-400" />,
    title: "Knowledge Grounding & RAG",
    desc: "Upload technical documentation, PDFs, and codebase repositories. Models retrieve factual context automatically.",
    badge: "Vector RAG"
  }
];

const MODELS = [
  { name: "DeepSeek R1", tag: "Free NIM", color: "#ef4444" },
  { name: "Llama 3.3 70B", tag: "Free NIM", color: "#7c3aed" },
  { name: "Claude 3.5 Sonnet", tag: "Anthropic", color: "#d4a27f" },
  { name: "GPT-4o", tag: "OpenAI", color: "#10a37f" },
  { name: "Qwen 2.5 72B", tag: "Free NIM", color: "#06b6d4" },
  { name: "Nemotron 70B", tag: "NVIDIA", color: "#76b900" },
  { name: "Mistral Large", tag: "Mistral", color: "#f97316" },
  { name: "Gemini 2.5 Flash", tag: "Google", color: "#4285f4" },
  { name: "Mixtral 8x22B", tag: "Free Open", color: "#8b5cf6" }
];

const COMPARISONS = [
  { name: "ChatGPT", what: "AI Chat Assistant" },
  { name: "Cursor", what: "AI Code Editor" },
  { name: "Bolt.new", what: "Live Preview Sandbox" },
  { name: "Replit", what: "Cloud Workspaces" },
  { name: "Notion AI", what: "Knowledge Base" }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#06070f] text-white overflow-x-hidden font-sans selection:bg-[#2F6BFF]/30 selection:text-white">
      
      {/* ══ AMBIENT BACKGROUND GLOWS ══ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#2F6BFF]/20 via-[#06B6D4]/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[800px] -left-60 w-[600px] h-[600px] bg-[#7C3AED]/10 blur-[150px] rounded-full" />
        <div className="absolute top-[1600px] -right-60 w-[600px] h-[600px] bg-[#10B981]/10 blur-[150px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
      </div>

      {/* ══ FIXED GLASS NAVBAR ══ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#06070f]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-black tracking-tight flex items-center gap-1.5">
              <span>HVRC</span>
              <span className="text-[#2F6BFF]">.AI</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono font-bold bg-[#2F6BFF]/15 text-[#60A5FA] px-2.5 py-0.5 rounded-full border border-[#2F6BFF]/30">
              AI OS v3.0
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-400">
            <a href="#features" className="hover:text-white transition-colors">Platform Features</a>
            <a href="#swarm" className="hover:text-white transition-colors">Multi-Agent Swarm</a>
            <a href="#models" className="hover:text-white transition-colors">460+ Models</a>
            <a href="#security" className="hover:text-white transition-colors">Zero-Server Security</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-xs sm:text-sm px-4 py-2 rounded-xl border border-white/[0.12] text-stone-300 hover:text-white hover:border-white/30 transition-all cursor-pointer font-bold"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-xs sm:text-sm px-5 py-2 rounded-xl font-extrabold bg-[#2F6BFF] hover:bg-blue-600 transition-all shadow-lg shadow-[#2F6BFF]/30 hover:scale-[1.02] cursor-pointer flex items-center gap-1.5"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ══ HERO SECTION ══ */}
      <section className="relative z-10 pt-36 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#2F6BFF]/40 bg-[#2F6BFF]/10 text-xs font-bold text-[#93C5FD] mb-8 shadow-sm backdrop-blur-md">
          <Sparkle className="w-4 h-4 text-[#60A5FA] animate-pulse" />
          <span>The Next-Generation AI Operating System for Developers</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[1.05] max-w-5xl">
          One Workspace.<br />
          <span className="text-gradient-blue">Every AI Model.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-3xl text-stone-400 text-base sm:text-lg leading-relaxed font-medium">
          HVRC.AI unifies <strong className="text-white">AI Pair Programming</strong>, <strong className="text-white">Multi-Agent Swarm Orchestration</strong>, <strong className="text-white">Universal Model BYOK Gateway</strong>, and <strong className="text-white">Live Code Sandbox</strong> into a zero-server browser environment.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
          <button
            onClick={() => navigate("/login")}
            className="px-9 py-4 rounded-2xl font-extrabold text-base bg-[#2F6BFF] hover:bg-blue-600 transition-all shadow-2xl shadow-[#2F6BFF]/40 hover:scale-[1.03] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Building for Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate("/project/default/workspace")}
            className="px-8 py-4 rounded-2xl font-bold text-base border border-white/[0.15] bg-white/[0.04] text-stone-200 hover:text-white hover:bg-white/[0.08] hover:border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Play className="w-4 h-4 text-[#60A5FA]" />
            <span>Live Workspace Demo</span>
          </button>
        </div>

        <p className="mt-6 text-xs text-stone-500 font-medium">
          Free Public NVIDIA Endpoints &nbsp;•&nbsp; No Credit Card Required &nbsp;•&nbsp; Zero Server Storage
        </p>

        {/* ══ HERO SHOWCASE BANNER IMAGE ══ */}
        <div className="mt-16 w-full max-w-6xl relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#2F6BFF] via-[#06B6D4] to-[#8B5CF6] rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition duration-1000"></div>
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#0D0F18]">
            <img
              src="/images/hero_os_banner.jpg"
              alt="HVRC.AI OS Command Center"
              className="w-full h-auto object-cover transform transition duration-700 hover:scale-[1.01]"
            />
            {/* Overlay Glass Status Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#06070F] via-[#06070F]/80 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <div>
                  <div className="text-sm font-extrabold text-white">HVRC.AI Live OS Kernel v3.0</div>
                  <div className="text-xs text-stone-400 font-mono">Multi-Agent Runtimes • Universal Model Gateway Active</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-stone-300">
                  460+ Live Endpoints
                </span>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1.5 bg-[#2F6BFF] hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  Open Studio →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Replaces Chips */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-2 max-w-3xl">
          <span className="text-xs text-stone-400 font-bold uppercase tracking-wider mr-2">Replaces Fragmented Tools:</span>
          {COMPARISONS.map((c) => (
            <span
              key={c.name}
              className="px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] text-xs font-medium text-stone-300 backdrop-blur-md"
            >
              <span className="line-through text-stone-500 mr-1.5">{c.name}</span>
              <span className="text-[#60A5FA] font-bold">{c.what}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ══ LIVE MODEL TICKER ══ */}
      <section id="models" className="py-8 border-y border-white/[0.08] bg-white/[0.02] overflow-hidden relative">
        <p className="text-center text-xs font-extrabold text-stone-400 uppercase tracking-[0.25em] mb-4">
          Connect 460+ Live Models across NVIDIA NIM • OpenRouter • Groq • Local Ollama
        </p>
        <div className="flex animate-[marquee_35s_linear_infinite] whitespace-nowrap gap-4">
          {[...MODELS, ...MODELS, ...MODELS].map((m, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border border-white/[0.08] bg-[#0D0F18]/80 text-xs font-bold text-stone-200 shrink-0 shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
              <span className="font-extrabold">{m.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-stone-300 border border-white/5">
                {m.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MULTI-AGENT SWARM ARCHITECTURE SECTION ══ */}
      <section id="swarm" className="max-w-7xl mx-auto px-6 py-28 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/20">
              <UsersThree className="w-4 h-4" />
              <span>Multi-Agent Swarm Intelligence</span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-tight">
              A Symphony of AI Agents<br />
              <span className="text-gradient-emerald">Working Together in Parallel.</span>
            </h2>

            <p className="text-stone-400 text-base leading-relaxed">
              Don't settle for a single chat box. In HVRC.AI, your Primary Orchestrator agent delegates parallel tasks to dedicated specialized Co-Workers:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                { title: "🧠 Primary Orchestrator", desc: "Main project manager and strategist" },
                { title: "🔍 Code Reviewer Worker", desc: "Performs security, pattern & QA audits" },
                { title: "🧪 Test Engineer Worker", desc: "Writes complete unit tests & assertions" },
                { title: "🐛 Bug Hunter Worker", desc: "Diagnoses stack traces & fixes bugs" },
                { title: "📝 Documentation Writer", desc: "Generates specs, markdown & READMEs" },
                { title: "📐 System Architect", desc: "Enforces clean design patterns" }
              ].map((agent, i) => (
                <div key={i} className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] space-y-1">
                  <div className="font-extrabold text-xs text-white">{agent.title}</div>
                  <div className="text-[11px] text-stone-400">{agent.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#0D0F18] group">
              <img
                src="/images/multi_agent_swarm.jpg"
                alt="Multi-Agent Swarm Architecture"
                className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ PLATFORM FEATURES GRID ══ */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.08]">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-extrabold border border-blue-500/20">
            <Sparkle className="w-3.5 h-3.5" />
            <span>Built for AI-Native Engineering</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight">
            Full-Stack AI Operating System
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto text-base">
            Everything you need to ideate, code, test, and synchronize project workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#2F6BFF]/40 transition-all duration-300 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                  {f.icon}
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/5 text-stone-300 border border-white/5">
                  {f.badge}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-lg">{f.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ZERO SERVER PRIVACY CALLOUT ══ */}
      <section id="security" className="max-w-5xl mx-auto px-6 py-16">
        <div className="p-8 sm:p-12 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-extrabold text-2xl text-white">Your Data Never Touches Our Servers</h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              HVRC.AI adheres to a strict <strong className="text-white">Zero-Server Storage architecture</strong>. Your workspace files, chat histories, code repositories, and API credentials are kept exclusively inside <strong className="text-emerald-400">your own Google Drive</strong> and encrypted browser localStorage. We never store, inspect, or sell your code.
            </p>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="relative rounded-3xl p-12 sm:p-16 text-center overflow-hidden border border-[#2F6BFF]/40 bg-gradient-to-b from-[#0B1536] to-[#06070F] shadow-2xl">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgba(47,107,255,0.25),transparent_70%)]" />
          <h2 className="relative font-display font-black text-4xl sm:text-5xl tracking-tight mb-4">
            Start Building with the AI OS Today
          </h2>
          <p className="relative text-stone-300 mb-8 max-w-lg mx-auto text-base">
            Free public NIM endpoints included. Bring your own API keys for unlimited model access.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="relative px-10 py-4 rounded-2xl font-extrabold text-base bg-[#2F6BFF] hover:bg-blue-600 transition-all duration-200 shadow-2xl shadow-[#2F6BFF]/50 hover:scale-[1.03] cursor-pointer"
          >
            Launch Command Center →
          </button>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-white/[0.08] py-12 px-6 bg-[#04050A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm text-stone-300">HVRC<span className="text-[#2F6BFF]">.AI</span></span>
            <span>•</span>
            <span>Next-Gen AI Operating System &amp; Development Workspace</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} HVRC Labs. Zero-Server Architecture. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
