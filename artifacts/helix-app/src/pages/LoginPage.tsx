import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const login = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    login.mutate(
      { data: { email, password } },
      {
        onSuccess: (user) => {
          setUser(user);
          setLocation(user.role === "merchant" ? "/merchant" : "/dashboard");
        },
        onError: () => setError("Invalid email or password"),
      }
    );
  }

  return (
    <div className="dark min-h-screen bg-[#07070d] text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 bg-amber-400/25 rounded-2xl blur-lg" />
              <img src={nexaLogo} alt="Nexa" className="relative w-16 h-16 object-contain rounded-2xl" />
            </div>
            <div className="font-black text-xl tracking-[0.3em] text-white">NEXA</div>
            <div className="text-[9px] text-amber-400/70 font-bold tracking-[0.4em] mt-0.5">PAYMENT CRYPTO</div>
          </div>
          <h1 className="text-2xl font-bold text-white mt-5">Welcome back</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to your Nexa account</p>
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 shadow-[0_0_60px_rgba(251,191,36,0.06)] backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/50 mb-1.5">Email</label>
              <input
                data-testid="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <input
                  data-testid="input-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              data-testid="btn-login"
              type="submit"
              disabled={login.isPending}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold py-3 rounded-lg transition-all shadow-[0_0_24px_rgba(251,191,36,0.3)] hover:shadow-[0_0_36px_rgba(251,191,36,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {login.isPending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition-colors">Create one</span>
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/">
            <span className="text-xs text-white/25 hover:text-white/60 cursor-pointer transition-colors">← Back to Nexa</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
