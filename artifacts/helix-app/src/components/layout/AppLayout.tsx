import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, ArrowLeftRight, Server, Activity } from "lucide-react";
import { useHealthCheck, getHealthCheckQueryKey } from "@workspace/api-client-react";

import logoText from "@assets/472CA289-8E06-4255-8C91-5C62964309DB_1778441808722.png";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: health } = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });

  const navItems = [
    { href: "/app", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/app/nodes", label: "Nodes", icon: Server },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <Link href="/">
            <div className="h-8 w-full cursor-pointer relative overflow-hidden flex items-center justify-start">
              {/* Extracting logo by positioning */}
              <div className="font-bold text-lg tracking-wider text-white">HELIX <span className="text-primary">PRO</span></div>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold capitalize">
              {location === '/app' ? 'Network Overview' : location.split('/').pop()}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 text-xs font-medium">
              <div className={`h-2 w-2 rounded-full ${health?.status === 'ok' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-muted-foreground">Network Status:</span>
              <span className="text-foreground uppercase">{health?.status || 'Unknown'}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
