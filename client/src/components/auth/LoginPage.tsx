import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Zap, Chrome, Github, Mail, Lock, ArrowRight, TrendingUp, BarChart3, Newspaper } from "lucide-react";

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try { await signInWithGoogle(); }
    catch (err: any) { setError(err.message || "Google sign-in failed"); }
  };

  const handleGithub = async () => {
    try { await signInWithGithub(); }
    catch (err: any) { setError(err.message || "GitHub sign-in failed"); }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-surface-950 via-wire-950 to-surface-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-wire-600/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-wire-600 rounded-xl">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">SmartWire</h1>
              <p className="text-xs text-wire-300 font-medium tracking-wider uppercase">Agentic Intelligence</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            AI-Powered
            <br />
            <span className="text-wire-400">Market Intelligence</span>
          </h2>

          <p className="text-lg text-surface-400 mb-12 max-w-md leading-relaxed">
            Real-time news aggregation, sentiment analysis, and market insights
            powered by autonomous AI agents.
          </p>

          <div className="space-y-5">
            {[
              { icon: TrendingUp, label: "Real-Time Market Data", desc: "Live sector performance and trending tickers" },
              { icon: BarChart3, label: "Sentiment Heat Maps", desc: "Visual market sentiment across all sectors" },
              { icon: Newspaper, label: "Agent-Curated News", desc: "AI-filtered and categorized market news" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="p-2 bg-surface-800/60 rounded-lg border border-surface-700/50 mt-0.5">
                  <Icon className="w-5 h-5 text-wire-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-200">{label}</p>
                  <p className="text-sm text-surface-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="p-2 bg-wire-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SmartWire</span>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white">
              {isSignUp ? "Create account" : "Welcome back"}
            </h3>
            <p className="text-surface-400 mt-1.5">
              {isSignUp
                ? "Start tracking markets with AI"
                : "Sign in to your SmartWire account"}
            </p>
          </div>

          {/* Social auth */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg
                         bg-surface-800 border border-surface-700 text-surface-200
                         hover:bg-surface-700 hover:border-surface-600 transition-all text-sm font-medium"
            >
              <Chrome className="w-4.5 h-4.5" />
              Continue with Google
            </button>
            <button
              onClick={handleGithub}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg
                         bg-surface-800 border border-surface-700 text-surface-200
                         hover:bg-surface-700 hover:border-surface-600 transition-all text-sm font-medium"
            >
              <Github className="w-4.5 h-4.5" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-950 px-3 text-surface-500 uppercase tracking-wider">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-3 py-2 rounded-lg bg-loss-bg border border-loss/20 text-loss text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-2.5 gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="text-wire-400 hover:text-wire-300 font-medium"
            >
              {isSignUp ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
