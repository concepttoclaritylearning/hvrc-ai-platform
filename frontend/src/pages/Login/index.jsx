import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lightning, ArrowRight, CloudCheck, Lock, ArrowLeft } from "@phosphor-icons/react";
import { signInWithGoogle } from "@/utils/supabase";

const isSupabaseConfigured =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes("xyzcompany");

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase is not yet configured. Use 'Continue without account' to access the app.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await signInWithGoogle();
      // signInWithGoogle redirects the page via OAuth — no need to navigate
    } catch (err) {
      console.error("Google Auth failed:", err);
      setError("Google sign-in failed. Please try again or continue without an account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await System.markOnboardingComplete();
    } catch (e) {
      console.warn("Could not mark onboarding complete:", e);
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06070f] text-white" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
        <button onClick={() => navigate("/landing")} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-[#2F6BFF] flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Lightning weight="fill" className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">
            HVRC<span className="text-[#2F6BFF]">.AI</span>
          </span>
        </button>
        <button onClick={() => navigate("/landing")} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to overview
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-9 space-y-7 backdrop-blur-sm">

            {/* Icon + heading */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2F6BFF]/15 border border-[#2F6BFF]/30 flex items-center justify-center">
                <Lightning weight="fill" className="w-7 h-7 text-[#2F6BFF]" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Sign in to HVRC.AI</h1>
                <p className="text-sm text-white/40 mt-1">
                  Your AI operating system &amp; workspace
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Supabase not configured notice */}
            {!isSupabaseConfigured && (
              <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 leading-relaxed">
                <strong className="block mb-0.5">⚠️ Supabase not configured</strong>
                Add <code className="bg-white/10 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-white/10 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your <code className="bg-white/10 px-1 rounded">.env</code> file to enable Google sign-in. You can still use the app below.
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              {/* Google sign-in */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-xl font-semibold text-sm bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.35 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.01 10.04.01 12c0 1.96.46 3.8 1.28 5.42l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                {loading ? "Connecting..." : "Sign in with Google"}
              </button>

              <div className="flex items-center gap-3 text-xs text-white/20">
                <div className="flex-1 h-px bg-white/[0.06]" />
                or
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Guest / developer bypass */}
              <button
                onClick={handleGuestLogin}
                className="w-full py-3.5 px-5 rounded-xl font-semibold text-sm border border-white/[0.1] text-white/60 hover:text-white hover:border-white/25 hover:bg-white/[0.04] flex items-center justify-center gap-2 transition-all"
              >
                Continue without account
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Privacy note */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <CloudCheck className="w-5 h-5 text-[#2F6BFF] shrink-0 mt-0.5" />
              <div className="text-xs text-white/40 leading-relaxed">
                <strong className="text-white/60 block mb-0.5">Zero server storage</strong>
                Only your login is stored in Supabase. All your projects, chats and code files are saved in your own Google Drive — private by design.
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-white/20 mt-6">
            By signing in you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
