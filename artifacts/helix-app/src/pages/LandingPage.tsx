import { Link } from "wouter";
import { useGetNetworkStats, getGetNetworkStatsQueryKey, useGetTransactionSummary, getGetTransactionSummaryQueryKey } from "@workspace/api-client-react";
import {
  Zap, Shield, Globe, Cpu, ArrowRight, TrendingUp, Clock,
  Code2, Building2, Users, Lock, Layers, Network, ChevronRight
} from "lucide-react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

const PARTNERS = [
  { name: "Solana", abbr: "SOL" },
  { name: "Ethereum", abbr: "ETH" },
  { name: "BASE", abbr: "BASE" },
  { name: "Polygon", abbr: "MATIC" },
  { name: "Avalanche", abbr: "AVAX" },
  { name: "Arbitrum", abbr: "ARB" },
  { name: "BNB Chain", abbr: "BNB" },
  { name: "Cosmos", abbr: "ATOM" },
];

const FEATURES = [
  { icon: Zap, title: "Real-Time Settlement", desc: "Sub-second finality across all supported chains. No waiting, no delays — instant value transfer at institutional scale.", accent: "from-amber-400 to-yellow-300" },
  { icon: Globe, title: "Cross-Chain Routing", desc: "Intelligent pathfinding across 150+ networks. Nexa dynamically selects the optimal route for every single transaction.", accent: "from-orange-400 to-amber-300" },
  { icon: Shield, title: "AI-Powered Security", desc: "Machine learning models monitor every transaction in real time — flagging anomalies and eliminating threats before they escalate.", accent: "from-yellow-400 to-amber-400" },
  { icon: Cpu, title: "Sovereign Layer 1", desc: "Built on a purpose-designed Layer 1 blockchain with CometBFT consensus, BadgerDB state storage, and ABCI 2.0 execution.", accent: "from-amber-500 to-orange-400" },
  { icon: TrendingUp, title: "Enterprise Analytics", desc: "Deep insights into your financial flows, settlement performance, trust scores, and network health — in real time.", accent: "from-amber-400 to-yellow-400" },
  { icon: Lock, title: "ECDSA Cryptography", desc: "Every transaction is cryptographically verified using ECDSA P-256 with SHA-256 — zero simulations, zero shortcuts.", accent: "from-yellow-300 to-amber-400" },
];

const STATS_DISPLAY = [
  { value: "3.2M+", label: "Transactions", sub: "Monthly" },
  { value: "$24.8B+", label: "Volume Settled", sub: "All Time" },
  { value: "1.2M+", label: "Active Wallets", sub: "Global" },
  { value: "99.98%", label: "Uptime SLA", sub: "12 months" },
  { value: "150+", label: "Networks", sub: "& growing" },
];

const WHO_FOR = [
  { icon: Code2, title: "Developers", desc: "JSON-RPC 2.0 APIs, REST endpoints, SDKs in 12 languages, webhooks, and a sandbox. Launch integrations in hours." },
  { icon: Building2, title: "Businesses", desc: "POS terminals, shareable payment links, revenue analytics, and PDF invoicing — all out of the box." },
  { icon: Layers, title: "Institutions", desc: "High-throughput settlement rails, multi-node validator infrastructure, compliance tooling, and dedicated SLAs." },
  { icon: Users, title: "Everyone", desc: "Send, receive, and manage multi-chain wallets with a tap. No crypto knowledge required." },
];

const ARCH_NODES = [
  { label: "Load Balancer", sub: "NGINX / HAProxy", tier: 0 },
  { label: "JSON-RPC Gateway", sub: "Node Instance 1 & 2", tier: 1 },
  { label: "CometBFT Consensus", sub: "P2P Engine / Mempool", tier: 2 },
  { label: "NEXA State Machine", sub: "Execution Layer Runtime", tier: 3 },
  { label: "BadgerDB Store", sub: "LSM-Tree NVMe State DB", tier: 4 },
];

export default function LandingPage() {
  const { data: networkStats } = useGetNetworkStats({ query: { queryKey: getGetNetworkStatsQueryKey() } });
  const { data: _txSummary } = useGetTransactionSummary({ query: { queryKey: getGetTransactionSummaryQueryKey() } });

  return (
    <div className="bg-[#07070d] text-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-400/5 rounded-full blur-3xl" />
          <div className="absolute top-40 left-[10%] w-64 h-64 bg-amber-600/4 rounded-full blur-3xl" />
          <div className="absolute top-20 right-[8%] w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "linear-gradient(rgba(251,191,36,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Logo glow */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/30 rounded-3xl blur-2xl scale-125" />
              <div className="absolute inset-0 bg-amber-300/15 rounded-3xl blur-3xl scale-150" />
              <img src={nexaLogo} alt="Nexa" className="relative w-28 h-28 md:w-36 md:h-36 object-contain rounded-3xl" />
            </div>
          </div>

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/8 border border-amber-400/20 text-amber-400 text-xs font-bold mb-6 tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            LIVE ON 150+ NETWORKS
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-3">
            <span className="text-white">THE SOVEREIGN</span>
          </h1>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-8">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]">
              PAYMENT CRYPTO
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Nexa is the next-generation sovereign payment protocol — cross-chain transactions, real-time settlement, and institutional-grade blockchain infrastructure, all in one.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/login">
              <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm rounded-full shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:shadow-[0_0_50px_rgba(251,191,36,0.55)] transition-all tracking-wide">
                LAUNCH APP
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 bg-white/4 border border-white/12 hover:border-amber-400/30 hover:bg-white/6 text-white/70 hover:text-white font-semibold text-sm rounded-full transition-all tracking-wide">
              READ WHITEPAPER
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              { icon: Zap, label: "Real-Time Settlement" },
              { icon: Globe, label: "Cross-Chain Routing" },
              { icon: Shield, label: "ECDSA Cryptography" },
              { icon: Network, label: "Layer 1 Consensus" },
              { icon: Clock, label: "Sub-Second Finality" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/6 border border-amber-400/15 text-amber-400/80 text-xs font-semibold tracking-wide hover:border-amber-400/30 hover:bg-amber-400/10 transition-all cursor-default">
                <Icon className="h-3 w-3" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE NETWORK STATS ──────────────────────────────── */}
      {networkStats && (
        <section className="py-8 border-y border-amber-400/8 bg-amber-400/3">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Volume", value: `$${((networkStats.totalVolume ?? 0) / 1e9).toFixed(1)}B` },
              { label: "Transactions", value: (networkStats.totalTransactions ?? 0).toLocaleString() },
              { label: "Avg Settlement", value: `${networkStats.avgSettlementMs ?? 0}ms` },
              { label: "Network Uptime", value: `${networkStats.networkUptime ?? 99}%` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">{s.value}</div>
                <div className="text-[10px] text-white/35 font-semibold mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PARTNER NETWORKS ─────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25 mb-8">Powering transactions across</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PARTNERS.map((p) => (
              <div key={p.name} className="group flex items-center gap-2.5 px-5 py-2.5 bg-white/3 border border-white/8 rounded-full hover:border-amber-400/30 hover:bg-amber-400/5 transition-all cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400/40 to-amber-600/20 border border-amber-400/30 flex items-center justify-center">
                  <span className="text-[7px] font-black text-amber-400">{p.abbr.slice(0,1)}</span>
                </div>
                <span className="font-bold text-white/50 group-hover:text-white/80 text-sm transition-colors">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE NEXA ADVANTAGE ─────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-400/3 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-amber-600/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400/60 mb-3">Why Nexa</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">The Nexa Advantage</h2>
            <p className="text-white/35 max-w-xl mx-auto text-sm leading-relaxed">Every component built from first principles for the demands of sovereign decentralized finance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`group relative bg-white/[0.025] border border-white/6 rounded-2xl p-7 hover:border-amber-400/25 hover:bg-white/[0.04] transition-all cursor-default overflow-hidden ${i === 0 ? "md:col-span-1" : ""}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/3 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} mb-5 shadow-[0_0_20px_rgba(251,191,36,0.25)]`}>
                  <f.icon className="h-5 w-5 text-black" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
            {/* CTA card */}
            <div className="relative bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent border border-amber-400/30 rounded-2xl p-7 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-400/70 mb-3">Get Started</div>
                <h3 className="font-black text-2xl text-white mb-3">Start building today</h3>
                <p className="text-white/40 text-sm leading-relaxed">Join thousands of developers and businesses already using Nexa Payment Crypto.</p>
              </div>
              <Link href="/register">
                <button className="relative mt-6 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold text-sm rounded-full transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                  Create Account <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#050508] border-y border-amber-400/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400/60 mb-3">Technology</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Sovereign Layer 1 Architecture</h2>
            <p className="text-white/35 max-w-xl mx-auto text-sm leading-relaxed">Enterprise-grade multi-layer consensus system with isolated process boundaries and atomic state commits.</p>
          </div>

          {/* Architecture diagram */}
          <div className="relative flex flex-col items-center gap-0">
            {/* Top ecosystem */}
            <div className="flex gap-4 mb-2">
              {["Native Web3 Apps","External Wallets"].map((n) => (
                <div key={n} className="px-5 py-2.5 bg-white/3 border border-white/8 rounded-full text-xs font-semibold text-white/50">{n}</div>
              ))}
            </div>

            {/* Connector line */}
            <div className="w-px h-6 bg-gradient-to-b from-white/20 to-amber-400/40" />

            {ARCH_NODES.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center w-full max-w-sm">
                <div className={`w-full px-6 py-4 rounded-xl border text-center transition-all ${
                  i === 0 ? "bg-amber-400/8 border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                  : i === 2 ? "bg-amber-400/5 border-amber-400/20"
                  : i === 4 ? "bg-amber-400/10 border-amber-400/35 shadow-[0_0_24px_rgba(251,191,36,0.15)]"
                  : "bg-white/3 border-white/8"
                }`}>
                  <div className={`text-sm font-bold mb-0.5 ${i === 0 || i === 4 ? "text-amber-400" : "text-white/80"}`}>{node.label}</div>
                  <div className="text-xs text-white/30 font-medium">{node.sub}</div>
                </div>
                {i < ARCH_NODES.length - 1 && (
                  <div className="flex flex-col items-center">
                    <div className="w-px h-5 bg-gradient-to-b from-amber-400/30 to-amber-400/10" />
                    <ChevronRight className="h-3 w-3 text-amber-400/40 rotate-90 -mt-1" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-12">
            {["CometBFT Consensus","BadgerDB v4","ABCI 2.0","ECDSA P-256","BIP39 Wallets","JSON-RPC 2.0","Go 1.21"].map((t) => (
              <span key={t} className="px-3.5 py-1.5 bg-amber-400/6 border border-amber-400/15 rounded-full text-[11px] font-bold text-amber-400/70 tracking-wide">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS COUNTER ──────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage: "radial-gradient(circle, rgba(251,191,36,0.6) 1px, transparent 1px)", backgroundSize: "30px 30px"}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-400/4 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto text-center relative">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400/50 mb-3">By The Numbers</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-16">Infrastructure you can count on</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {STATS_DISPLAY.map((s) => (
              <div key={s.label} className="group">
                <div className="text-4xl md:text-5xl font-black text-white group-hover:text-amber-400 transition-colors drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] mb-2">{s.value}</div>
                <div className="text-white/40 font-semibold text-sm">{s.label}</div>
                <div className="text-white/20 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#050508] border-t border-amber-400/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400/60 mb-3">Built for Everyone</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">One protocol. Infinite use cases.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {WHO_FOR.map((w) => (
              <div key={w.title} className="group bg-white/[0.025] border border-white/6 rounded-2xl p-6 hover:border-amber-400/25 hover:bg-amber-400/3 transition-all cursor-default">
                <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/15 flex items-center justify-center mb-4 group-hover:bg-amber-400/15 group-hover:border-amber-400/30 transition-all">
                  <w.icon className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{w.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-amber-400/5 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-600/3 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-amber-400/25 rounded-2xl blur-xl" />
              <img src={nexaLogo} alt="Nexa" className="relative w-20 h-20 object-contain rounded-2xl" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">
            Own your finances.
          </h2>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Sovereignty starts here.
            </span>
          </h2>
          <p className="text-white/35 text-base mb-12 max-w-xl mx-auto leading-relaxed">
            Join Nexa today — whether you're an individual, a business, or a developer building the sovereign financial stack of tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm rounded-full shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:shadow-[0_0_60px_rgba(251,191,36,0.6)] transition-all tracking-wide">
                GET STARTED FREE
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 border border-white/12 hover:border-amber-400/30 text-white/50 hover:text-white font-semibold text-sm rounded-full transition-all tracking-wide">
                SIGN IN
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
