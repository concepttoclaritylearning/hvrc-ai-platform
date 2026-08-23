import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkle,
  ArrowRight,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Info,
  CheckCircle,
  Key,
  GoogleLogo,
  EnvelopeSimple,
  Question
} from "@phosphor-icons/react";
import { signInWithGoogle, supabase } from "@/utils/supabase";
import System from "@/models/system";

const isSupabaseConfigured =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes("xyzcompany");

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithGoogle();
    } catch (err) {
      console.error("Google Auth failed:", err);
      setError(
        "Google sign-in encountered an issue. You can enter instantly using '1-Click Developer Access' below."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError("");
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      setEmailSent(true);
    } catch (err) {
      console.error("Magic link failed:", err);
      setError(err.message || "Failed to send magic link. Use 1-Click Developer Access below.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      // Initialize local storage developer session
      localStorage.setItem("hvrc_dev_session", JSON.stringify({
        id: "dev_user",
        email: "developer@hvrc.ai",
        name: "Lead Developer",
        created_at: new Date().toISOString()
      }));
      await System.markOnboardingComplete();
    } catch (e) {
      console.warn("Session init notice:", e);
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#1C1917] font-sans selection:bg-[#2F6BFF]/15 selection:text-[#2F6BFF]">
      
      {/* ══ TOP BAR ══ */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-stone-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <button onClick={() => navigate("/landing")} className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-[#2F6BFF] flex items-center justify-center shadow-md shadow-[#2F6BFF]/20">
            <Sparkle weight="fill" className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-xl tracking-tight text-stone-900">
            HVRC<span className="text-[#2F6BFF]">.AI</span>
          </span>
        </button>

        <button
          onClick={() => navigate("/landing")}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer px-3 py-1.5 rounded-xl hover:bg-stone-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </button>
      </header>

      {/* ══ MAIN CONTENT CARD ══ */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-4">
          
          <div className="bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-9 space-y-6 shadow-sm">
            
            {/* Header / Logo */}
            <div className="text-center space-y-2">
              <div className="w-13 h-13 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2F6BFF] shadow-inner">
                <Sparkle weight="fill" className="w-6 h-6" />
              </div>
              <h1 className="font-display font-black text-2xl text-stone-900 tracking-tight">
                Sign in to HVRC.AI
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                The Next-Gen AI Operating System &amp; Development Workspace
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 leading-relaxed">
                {error}
              </div>
            )}

            {/* Email Sent Notice */}
            {emailSent && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 leading-relaxed flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Verification link sent to <strong>{email}</strong>. Check your inbox!</span>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-3">
              {/* 1. Google OAuth Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2.5 shadow-2xs hover:border-stone-400 transition-all cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* 2. Instant 1-Click Developer Mode (Guaranteed zero-block) */}
              <button
                onClick={handleGuestLogin}
                className="w-full py-3 px-4 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#2F6BFF]/20 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <span>⚡ 1-Click Instant Developer Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Or Magic Link
              </span>
            </div>

            {/* Email OTP / Magic Link Form */}
            <form onSubmit={handleEmailMagicLink} className="space-y-2.5">
              <div className="relative">
                <EnvelopeSimple className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 outline-none focus:border-[#2F6BFF] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Send Sign-in Link
              </button>
            </form>

            {/* Security / Privacy Trust Badge */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 font-medium border-t border-stone-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero-Server Privacy</span>
              </div>

              <button
                onClick={() => setShowConfigHelp(!showConfigHelp)}
                className="text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer"
              >
                <Question className="w-3.5 h-3.5" />
                <span>Auth Setup Help</span>
              </button>
            </div>

          </div>

          {/* Config Setup Helper Accordion */}
          {showConfigHelp && (
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 text-xs space-y-2 text-stone-600 shadow-sm animate-fade-in">
              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#2F6BFF]" />
                <span>Google Console &amp; Supabase Configuration Guide:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-stone-600">
                <li>Go to <strong>Google Cloud Console → Credentials → OAuth 2.0 Client IDs</strong>.</li>
                <li>Add <strong>Authorized redirect URIs</strong>: <code className="bg-stone-100 px-1 py-0.5 rounded text-[#2F6BFF]">https://&lt;your-project-ref&gt;.supabase.co/auth/v1/callback</code></li>
                <li>In <strong>Supabase Dashboard → Authentication → Providers → Google</strong>, paste your Client ID and Client Secret.</li>
                <li>Under <strong>URL Configuration</strong>, set Site URL to <code className="bg-stone-100 px-1 py-0.5 rounded text-[#2F6BFF]">{window.location.origin}</code>.</li>
              </ol>
            </div>
          )}

        </div>
      </main>

      {/* ══ FOOTER ══ */}
      <footer className="py-5 text-center text-xs text-stone-400 font-medium">
        <span>© {new Date().getFullYear()} HVRC.AI • Client-Side Zero-Server Architecture</span>
      </footer>

    </div>
  );
}
