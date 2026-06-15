import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Terminal, Link2, BarChart3, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { href: "/merchant", label: "Overview", icon: LayoutDashboard },
    { href: "/merchant/pos", label: "POS Terminal", icon: Terminal },
    { href: "/merchant/links", label: "Payment Links", icon: Link2 },
    { href: "/merchant/revenue", label: "Revenue", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans dark">
      <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-border/40 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 shrink-0">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm" />
              <img src={nexaLogo} alt="Nexa" className="relative w-8 h-8 object-contain rounded-lg" />
            </div>
            <div>
              <div className="font-black text-sm tracking-widest text-white">NEXA</div>
              <div className="text-[8px] text-primary/70 font-bold tracking-[0.25em] -mt-0.5">MERCHANT</div>
            </div>
          </div>
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

        <div className="p-4 border-t border-border/40">
          <div className="text-xs text-muted-foreground mb-2">Logged in as</div>
          <div className="font-semibold text-sm text-foreground truncate">{user?.businessName ?? user?.fullName}</div>
          <Link href="/">
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to site
            </div>
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-semibold capitalize">
            {navItems.find((n) => n.href === location)?.label ?? "Merchant"}
          </h2>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors border border-border/50 rounded-full px-3 py-1">Switch to User Dashboard</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
