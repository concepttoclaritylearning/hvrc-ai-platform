import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: "⚡",
    title: "Blazing Fast AI Chat",
    desc: "Chat with GPT-4o, Claude 3.5, Gemini 2.5, Llama 3.3 and 200+ models. Switch providers instantly without leaving the page.",
  },
  {
    icon: "💻",
    title: "AI-Powered Code IDE",
    desc: "Full Monaco editor with live web preview, AI pair programming, file system, and instant deploy. Think Cursor meets Bolt.new.",
  },
  {
    icon: "🗂️",
    title: "Project Workspaces",
    desc: "Organise your AI work into projects. Each project has its own chat history, files, knowledge base and code workspace.",
  },
  {
    icon: "🔑",
    title: "Bring Your Own Key",
    desc: "Paste your OpenRouter, Groq or NVIDIA NIM API key. We auto-fetch all your available models — no subscriptions or lock-in.",
  },
  {
    icon: "🔒",
    title: "Zero Server Storage",
    desc: "Your projects, chats and code are saved directly in your Google Drive. HVRC.AI stores only your login — nothing else.",
  },
  {
    icon: "🌐",
    title: "Built-in CORS Proxy",
    desc: "Call any AI API endpoint from the browser. Our serverless proxy eliminates CORS restrictions without backend setup.",
  },
  {
    icon: "📚",
    title: "Knowledge Base (RAG)",
    desc: "Upload documents, PDFs and websites. Your AI models search them automatically to give grounded, factual answers.",
  },
  {
    icon: "🤖",
    title: "Agent Skills & MCP",
    desc: "Enable web browsing, code execution, API calls and custom tools. Build autonomous AI agents that act, not just chat.",
  },
  {
    icon: "🎙️",
    title: "Voice Chat (STT/TTS)",
    desc: "Speak to your AI with speech-to-text and listen back with natural text-to-speech — entirely in the browser.",
  },
];

const MODELS = [
  { name: "GPT-4o", tag: "OpenAI", color: "#10a37f" },
  { name: "Claude 3.5 Sonnet", tag: "Anthropic", color: "#d4a27f" },
  { name: "Gemini 2.5 Flash Free", tag: "Free", color: "#4285f4" },
  { name: "Llama 3.3 70B Free", tag: "Free", color: "#7c3aed" },
  { name: "DeepSeek R1 Free", tag: "Free", color: "#ef4444" },
  { name: "Mistral Large", tag: "Mistral", color: "#f97316" },
  { name: "Qwen 2.5 72B Free", tag: "Free", color: "#06b6d4" },
  { name: "Nemotron 70B", tag: "NVIDIA", color: "#76b900" },
  { name: "Mixtral 8x22B", tag: "Free", color: "#8b5cf6" },
  { name: "Command R+", tag: "Cohere", color: "#0891b2" },
];

const STEPS = [
  { n: "01", title: "Sign in with Google", desc: "Create your account in one click with Google OAuth. No passwords, no forms." },
  { n: "02", title: "Add your API key", desc: "Paste your free OpenRouter, Groq or NVIDIA NIM key. All models load automatically." },
  { n: "03", title: "Start building", desc: "Chat, code, organise projects and deploy — everything from one unified AI workspace." },
];

const COMPARISONS = [
  { name: "ChatGPT", what: "AI Chat" },
  { name: "Cursor", what: "AI Code IDE" },
  { name: "Bolt.new", what: "Live Code Preview" },
  { name: "Replit", what: "Code Workspace" },
  { name: "Notion AI", what: "Knowledge Base" },
  { name: "ElevenLabs", what: "Voice Chat" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#06070f] text-white overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>

      {/* ══ NAVBAR ══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#06070f]/95 backdrop-blur-xl border-b border-white/[0.06]" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">
            HVRC<span className="text-[#2F6BFF]">.AI</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#models" className="hover:text-white transition-colors">Models</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="text-sm px-4 py-2 rounded-lg border border-white/[0.12] text-white/70 hover:text-white hover:border-white/30 transition-all">
              Sign In
            </button>
            <button onClick={() => navigate("/login")} className="text-sm px-5 py-2 rounded-lg font-bold bg-[#2F6BFF] hover:bg-[#1d5aef] transition-all shadow-lg shadow-blue-900/30">
              Start Free →
            </button>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-28 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 100% 70% at 50% -5%, rgba(47,107,255,0.22) 0%, transparent 65%)",
        }} />
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2F6BFF]/35 bg-[#2F6BFF]/10 text-xs font-semibold text-[#7eb3ff] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF] animate-pulse inline-block" />
          Next-Gen AI Operating System
        </div>

        {/* Headline */}
        <h1 className="relative z-10 font-black leading-[1.02] tracking-tighter text-white max-w-5xl" style={{ fontSize: "clamp(3.2rem, 7vw, 6.5rem)" }}>
          One platform.<br />
          <span style={{
            backgroundImage: "linear-gradient(135deg, #2F6BFF 0%, #7EB3FF 40%, #a5c8ff 60%, #2F6BFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Every AI model.
          </span>
        </h1>

        <p className="relative z-10 mt-6 max-w-2xl text-white/50 text-lg leading-relaxed">
          HVRC.AI combines <strong className="text-white/80">ChatGPT</strong>, <strong className="text-white/80">Cursor</strong>, <strong className="text-white/80">Bolt.new</strong>, <strong className="text-white/80">Replit</strong> and <strong className="text-white/80">Notion AI</strong> into one workspace — with 200+ free & paid AI models, a live code IDE, knowledge base, voice chat, and zero server-side data storage.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-10">
          <button onClick={() => navigate("/login")}
            className="px-9 py-4 rounded-xl font-bold text-base bg-[#2F6BFF] hover:bg-[#1d5aef] transition-all duration-200 shadow-2xl shadow-blue-900/50 hover:scale-[1.02]">
            Get Started Free →
          </button>
          <a href="#features"
            className="px-9 py-4 rounded-xl font-semibold text-base border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 transition-all duration-200 text-center">
            Explore Features
          </a>
        </div>

        <p className="relative z-10 mt-7 text-xs text-white/25">
          Free to start &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Your data stays in your Google Drive
        </p>

        {/* Replaces comparison chips */}
        <div className="relative z-10 mt-14 flex flex-wrap justify-center gap-2 max-w-2xl">
          <span className="text-xs text-white/30 w-full text-center mb-1">Replaces</span>
          {COMPARISONS.map((c) => (
            <span key={c.name} className="px-3 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] text-xs text-white/50">
              <span className="line-through text-white/30">{c.name}</span>
              <span className="ml-1.5 text-white/50">{c.what}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ══ MODEL TICKER ══ */}
      <section id="models" className="py-10 border-y border-white/[0.06] overflow-hidden">
        <p className="text-center text-[11px] text-white/25 uppercase tracking-[0.2em] mb-5">200+ models available via OpenRouter · Groq · NVIDIA NIM</p>
        <div style={{ display: "flex", animation: "marquee 30s linear infinite", whiteSpace: "nowrap" }}>
          {[...MODELS, ...MODELS, ...MODELS].map((m, i) => (
            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", margin: "0 6px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", flexShrink: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, display: "inline-block" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{m.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: m.color + "22", color: m.color }}>{m.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <h2 className="font-black text-4xl md:text-5xl tracking-tight mb-4">
            Built for AI-first builders
          </h2>
          <p className="text-white/45 max-w-xl mx-auto text-lg">
            Everything you need to ideate, code, chat and ship — in one AI-native workspace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="group relative p-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.05] hover:border-[#2F6BFF]/40 transition-all duration-300 cursor-default">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 30% 30%, rgba(47,107,255,0.06) 0%, transparent 70%)" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-center font-black text-4xl md:text-5xl tracking-tight mb-16">
          Up and running in <span className="text-[#2F6BFF]">3 minutes</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="relative p-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] text-center">
              <div className="text-6xl font-black text-[#2F6BFF]/20 mb-4">{s.n}</div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PRIVACY CALLOUT ══ */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="text-5xl shrink-0">🔒</div>
          <div>
            <h3 className="font-black text-xl mb-2">Your data never touches our servers</h3>
            <p className="text-white/45 text-sm leading-relaxed">
              HVRC.AI only stores your login credentials in Supabase Auth. All projects, chat histories, code files and knowledge base documents are saved exclusively inside <strong className="text-white/70">your own Google Drive</strong> — encrypted, private and always under your control. We cannot read, sell or access your data.
            </p>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="relative rounded-3xl p-14 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(47,107,255,0.18) 0%, rgba(90,158,255,0.08) 100%)", border: "1px solid rgba(47,107,255,0.25)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(47,107,255,0.18) 0%, transparent 70%)" }} />
          <h2 className="relative font-black text-4xl md:text-5xl tracking-tight mb-4">
            Start building with AI today
          </h2>
          <p className="relative text-white/50 mb-9 max-w-md mx-auto text-lg">
            Free to start. No credit card. Bring your own API key.
          </p>
          <button onClick={() => navigate("/login")}
            className="relative px-12 py-4 rounded-xl font-black text-lg bg-[#2F6BFF] hover:bg-[#1d5aef] transition-all duration-200 shadow-2xl shadow-blue-900/40 hover:scale-[1.03]">
            Get Started Free →
          </button>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <span className="font-black text-sm text-white/50">HVRC<span className="text-[#2F6BFF]">.AI</span></span>
          <span>Next-Gen AI Operating System &amp; Workspace</span>
          <span>© {new Date().getFullYear()} HVRC Labs. All rights reserved.</span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
