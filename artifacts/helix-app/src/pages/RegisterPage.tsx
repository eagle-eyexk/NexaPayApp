import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, User, Building2 } from "lucide-react";

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
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 border border-primary/30 rounded-2xl mb-4 shadow-[0_0_24px_rgba(0,255,255,0.15)]">
            <Zap className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join the future of finance</p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,255,255,0.05)]">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([["user","Personal","For individuals & power users",User], ["merchant","Business","For merchants & businesses",Building2]] as const).map(([val, label, sub, Icon]) => (
              <button
                key={val}
                type="button"
                data-testid={`btn-role-${val}`}
                onClick={() => setRole(val)}
                className={`p-4 rounded-xl border text-left transition-all ${role === val ? "border-primary bg-primary/10 shadow-[0_0_16px_rgba(0,255,255,0.15)]" : "border-border/50 bg-muted hover:border-primary/30"}`}
              >
                <Icon className={`h-5 w-5 mb-2 ${role === val ? "text-primary" : "text-muted-foreground"}`} />
                <div className={`font-semibold text-sm ${role === val ? "text-foreground" : "text-muted-foreground"}`}>{label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
              <input data-testid="input-fullname" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Alex Johnson" required className="w-full bg-muted border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>

            {role === "merchant" && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Business Name</label>
                <input data-testid="input-business" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Corp" required className="w-full bg-muted border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <input data-testid="input-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-muted border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
              <input data-testid="input-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required className="w-full bg-muted border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>

            {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive">{error}</div>}

            <button data-testid="btn-register" type="submit" disabled={register.isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] disabled:opacity-60">
              {register.isPending ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login"><span className="text-primary hover:text-primary/80 font-medium cursor-pointer">Sign in</span></Link>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link href="/"><span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">← Back to Helix Protocol</span></Link>
        </div>
      </div>
    </div>
  );
}
