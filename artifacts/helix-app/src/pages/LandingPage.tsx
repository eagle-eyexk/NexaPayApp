import React from "react";
import { Link } from "wouter";
import { useGetNetworkStats, getGetNetworkStatsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, ShieldCheck, Zap, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandingPage() {
  const { data: stats, isLoading } = useGetNetworkStats({ query: { queryKey: getGetNetworkStatsQueryKey() } });

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B+`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    return num.toLocaleString();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            MAINNET BETA IS LIVE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            The Neural Network of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Global Finance</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Finance, Evolved. Route, settle, and secure cross-chain transactions in real time with absolute precision and trust.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-base h-12 px-8 shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-primary/20 hover:bg-primary/10">
              Read Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 divide-x divide-border/40">
            {[
              { label: "Transactions", value: stats ? formatNumber(stats.totalTransactions) : null },
              { label: "Volume", value: stats ? formatNumber(stats.totalVolume) : null },
              { label: "Active Wallets", value: stats ? formatNumber(stats.activeWallets) : null },
              { label: "Uptime", value: stats ? `${stats.networkUptime}%` : null },
              { label: "Countries", value: stats ? `${stats.countriesCount}+` : null },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center justify-center ${i === 0 ? 'border-none' : ''}`}>
                <div className="text-2xl md:text-3xl font-mono font-bold text-foreground mb-2">
                  {isLoading || !stat.value ? <Skeleton className="h-8 w-24" /> : stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Precision Engineering</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built for institutions and power users who demand sub-second settlement and zero compromise on security.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Zap className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Settlement</h3>
              <p className="text-muted-foreground text-sm">Average settlement time of {stats?.avgSettlementMs || '120'}ms across major chains. No more waiting for block confirmations.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ShieldCheck className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Institutional Security</h3>
              <p className="text-muted-foreground text-sm">Advanced AI fraud prevention with {stats?.fraudPreventionRate || '99.9'}% detection rate before transactions hit the mempool.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Globe className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Omnichain Routing</h3>
              <p className="text-muted-foreground text-sm">Seamlessly route liquidity across L1s, L2s, and subnets finding the optimal path for lowest slippage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-card/50 border-y border-border/40">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">Integrated with global liquidity networks</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-70">
            {['Solana', 'Ethereum', 'Base', 'Polygon', 'Avalanche', 'Arbitrum'].map((chain) => (
              <div key={chain} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-sm">{chain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
