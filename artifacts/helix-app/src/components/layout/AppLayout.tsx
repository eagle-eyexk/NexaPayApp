import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, ArrowLeftRight, Server, Send, QrCode, ArrowLeft, Building2 } from "lucide-react";
import { useHealthCheck, getHealthCheckQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { data: health } = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/send", label: "Send", icon: Send },
    { href: "/dashboard/receive", label: "Receive / Tap to Pay", icon: QrCode },
    { href: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/app/nodes", label: "Network Nodes", icon: Server },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans dark">
      <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <Link href="/">
            <div className="font-bold text-lg tracking-wider text-white cursor-pointer">HELIX <span className="text-primary">APP</span></div>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
          <div className="text-xs text-muted-foreground mb-1">Signed in as</div>
          <div className="font-medium text-sm text-foreground truncate">{user?.fullName}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          {user?.role === "merchant" && (
            <Link href="/merchant">
              <div className="flex items-center gap-1.5 mt-3 text-xs text-primary hover:text-primary/80 cursor-pointer transition-colors">
                <Building2 className="h-3 w-3" /> Merchant Dashboard
              </div>
            </Link>
          )}
          <Link href="/">
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to site
            </div>
          </Link>
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
