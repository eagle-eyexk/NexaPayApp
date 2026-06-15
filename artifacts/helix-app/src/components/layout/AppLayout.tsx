import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Send, QrCode, ArrowLeft, Building2, Wallet, Settings, History, LogOut } from "lucide-react";
import { useHealthCheck, getHealthCheckQueryKey, useLogout } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: health } = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => setLocation("/login"),
    });
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/nexa", label: "NEXA Wallet", icon: Wallet },
    { href: "/dashboard/send", label: "Send", icon: Send },
    { href: "/dashboard/receive", label: "Receive / QR", icon: QrCode },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans dark">
      <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-border/40 gap-3">
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="relative w-8 h-8 shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm" />
                <img src={nexaLogo} alt="Nexa" className="relative w-8 h-8 object-contain rounded-lg" />
              </div>
              <div>
                <div className="font-black text-sm tracking-widest text-white">NEXA</div>
                <div className="text-[8px] text-primary/70 font-bold tracking-[0.25em] -mt-0.5">WALLET</div>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${isActive ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_12px_rgba(251,191,36,0.1)]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40 space-y-2">
          <div className="text-xs text-muted-foreground">Signed in as</div>
          <div className="font-semibold text-sm text-foreground truncate">{user?.fullName}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          {user?.role === "merchant" && (
            <Link href="/merchant">
              <div className="flex items-center gap-1.5 pt-1 text-xs text-primary hover:text-primary/80 cursor-pointer transition-colors">
                <Building2 className="h-3 w-3" /> Merchant Dashboard
              </div>
            </Link>
          )}
          <Link href="/">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to site
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 cursor-pointer transition-colors"
          >
            <LogOut className="h-3 w-3" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-semibold capitalize">
            {location === "/dashboard" ? "My Wallet" : navItems.find((n) => n.href === location)?.label ?? location.split("/").pop()}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 text-xs font-medium">
              <div className={`h-2 w-2 rounded-full ${health?.status === "ok" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" : "bg-yellow-500"}`} />
              <span className="text-muted-foreground">Network:</span>
              <span className="text-foreground uppercase">{health?.status ?? "—"}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
