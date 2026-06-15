import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Building2 } from "lucide-react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "merchant">("user");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const register = useRegister();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    register.mutate(
      { data: { fullName, email, password, role, ...(role === "merchant" ? { businessName } : {}) } },
      {
        onSuccess: (user) => {
          setUser(user);
          setLocation(user.role === "merchant" ? "/merchant" : "/dashboard");
        },
        onError: (err: any) => {
          setError(err?.message ?? "Registration failed. Email may already be taken.");
        },
      }
    );
  }

  return (
    <div className="dark min-h-screen bg-[#07070d] text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/3 rounded-full blur-3xl" />
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
          <h1 className="text-2xl font-bold text-white mt-5">Create your account</h1>
          <p className="text-white/40 text-sm mt-1">Join the future of finance</p>
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 shadow-[0_0_60px_rgba(251,191,36,0.06)] backdrop-blur">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([["user","Personal","For individuals & power users",User], ["merchant","Business","For merchants & businesses",Building2]] as const).map(([val, label, sub, Icon]) => (
              <button
                key={val}
                type="button"
                data-testid={`btn-role-${val}`}
                onClick={() => setRole(val)}
                className={`p-4 rounded-xl border text-left transition-all ${role === val ? "border-amber-400/50 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.15)]" : "border-white/8 bg-white/3 hover:border-amber-400/25 hover:bg-white/5"}`}
              >
                <Icon className={`h-5 w-5 mb-2 ${role === val ? "text-amber-400" : "text-white/30"}`} />
                <div className={`font-bold text-sm ${role === val ? "text-white" : "text-white/40"}`}>{label}</div>
                <div className="text-xs text-white/25 mt-0.5">{sub}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Full Name</label>
              <input data-testid="input-fullname" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Alex Johnson" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all" />
            </div>

            {role === "merchant" && (
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Business Name</label>
                <input data-testid="input-business" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Corp" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all" />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
              <input data-testid="input-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
              <input data-testid="input-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all" />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">{error}</div>}

            <button data-testid="btn-register" type="submit" disabled={register.isPending} className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold py-3 rounded-lg transition-all shadow-[0_0_24px_rgba(251,191,36,0.3)] hover:shadow-[0_0_36px_rgba(251,191,36,0.5)] disabled:opacity-50">
              {register.isPending ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link href="/login"><span className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition-colors">Sign in</span></Link>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link href="/"><span className="text-xs text-white/25 hover:text-white/60 cursor-pointer transition-colors">← Back to Nexa</span></Link>
        </div>
      </div>
    </div>
  );
}
