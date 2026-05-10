import { Link } from "wouter";
import { useGetNetworkStats, getGetNetworkStatsQueryKey, useGetTransactionSummary, getGetTransactionSummaryQueryKey } from "@workspace/api-client-react";
import {
  Zap, Shield, Globe, Cpu, ArrowRight, TrendingUp, Clock, CheckCircle,
  Code2, Building2, Users
} from "lucide-react";

const PARTNERS = [
  { name: "Solana", color: "bg-purple-500" },
  { name: "Ethereum", color: "bg-indigo-500" },
  { name: "BASE", color: "bg-blue-500" },
  { name: "Polygon", color: "bg-violet-500" },
  { name: "Avalanche", color: "bg-red-500" },
  { name: "Arbitrum", color: "bg-sky-500" },
];

const FEATURES = [
  { icon: Zap, title: "Real-Time Settlement", desc: "Sub-second finality across all supported chains. No waiting, no delays — just instant value transfer at any scale.", color: "text-cyan-500 bg-cyan-50" },
  { icon: Globe, title: "Cross-Chain Routing", desc: "Intelligent pathfinding across 150+ networks. Helix dynamically selects the optimal route for every transaction.", color: "text-blue-500 bg-blue-50" },
  { icon: Shield, title: "AI-Powered Security", desc: "Machine learning models monitor every transaction in real time — flagging anomalies before they become threats.", color: "text-indigo-500 bg-indigo-50" },
  { icon: Cpu, title: "Protocol-Level Efficiency", desc: "Our adaptive execution engine reduces gas and fees by 60–80% vs naïve routing — so more value reaches your recipients.", color: "text-violet-500 bg-violet-50" },
  { icon: TrendingUp, title: "Enterprise Analytics", desc: "Deep insights into your financial flows, settlement performance, trust scores, and network health — in real time.", color: "text-emerald-500 bg-emerald-50" },
];

const STATS_DISPLAY = [
  { value: "3.2M+", label: "Transactions Processed", sub: "Monthly" },
  { value: "$24.8B+", label: "Volume Settled", sub: "All Time" },
  { value: "1.2M+", label: "Active Wallets", sub: "Global" },
  { value: "99.98%", label: "Uptime SLA", sub: "12 months" },
  { value: "150+", label: "Networks Supported", sub: "& growing" },
];

const WHO_FOR = [
  { icon: Code2, title: "Developers", desc: "REST & WebSocket APIs, SDKs in 12 languages, webhooks, and a sandbox — launch in hours." },
  { icon: Building2, title: "Businesses", desc: "POS terminals, payment links, revenue analytics, and PDF invoicing out of the box." },
  { icon: Building2, title: "Institutions", desc: "High-throughput settlement rails, compliance tooling, and dedicated SLAs." },
  { icon: Users, title: "Everyone", desc: "Send, receive, and manage multi-chain wallets with a tap — no crypto knowledge required." },
];

export default function LandingPage() {
  const { data: networkStats } = useGetNetworkStats({ query: { queryKey: getGetNetworkStatsQueryKey() } });
  const { data: _txSummary } = useGetTransactionSummary({ query: { queryKey: getGetTransactionSummaryQueryKey() } });

  return (
    <div className="bg-white text-slate-900">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-32 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-indigo-100/60 via-blue-100/40 to-purple-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-50/80 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50/80 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-8">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Now live on 150+ networks
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight text-slate-900 mb-6">
            Finance,{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Evolved.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            The next-generation Web3 infrastructure for cross-chain payments, real-time settlement, and intelligent transaction routing at institutional scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/login">
              <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold text-base rounded-full shadow-xl hover:shadow-2xl transition-all">
                Explore Helix
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-base rounded-full shadow-sm hover:shadow-md transition-all">
              Read Whitepaper
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Zap, label: "Real-Time Settlement", color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
              { icon: Globe, label: "Adaptive Routing", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
              { icon: Shield, label: "AI-Powered Security", color: "text-violet-600 bg-violet-50 border-violet-200" },
              { icon: TrendingUp, label: "Cross-Chain Interoperability", color: "text-blue-600 bg-blue-50 border-blue-200" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold ${color}`}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE NETWORK STATS ──────────────────────────────── */}
      {networkStats && (
        <section className="py-10 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Volume", value: `$${((networkStats.totalVolume ?? 0) / 1e9).toFixed(1)}B` },
              { label: "Transactions", value: (networkStats.totalTransactions ?? 0).toLocaleString() },
              { label: "Avg Settlement", value: `${networkStats.avgSettlementMs ?? 0}ms` },
              { label: "Network Uptime", value: `${networkStats.networkUptime ?? 99}%` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-indigo-700">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PARTNER LOGOS ─────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">Powering transactions across</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PARTNERS.map((p) => (
              <div key={p.name} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
                <div className={`w-3 h-3 rounded-full ${p.color}`} />
                <span className="font-semibold text-slate-700 text-sm">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE HELIX ADVANTAGE ─────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Why Helix</p>
            <h2 className="text-4xl font-black text-slate-900">The Helix Advantage</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Every component built from the ground up for the demands of modern decentralized finance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white border border-slate-100 rounded-2xl p-7 hover:shadow-lg hover:border-slate-200 transition-all">
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.color} mb-5`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl p-7 flex flex-col justify-between text-white">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-3">Get Started</div>
                <h3 className="font-black text-2xl mb-3">Start building today</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">Join thousands of developers and businesses already using Helix.</p>
              </div>
              <Link href="/register">
                <button className="mt-6 flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-bold text-sm rounded-full hover:bg-indigo-50 transition-colors">
                  Create Account <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS COUNTER ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-3">By The Numbers</p>
          <h2 className="text-4xl font-black mb-14">Infrastructure you can count on</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {STATS_DISPLAY.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-black text-white mb-1">{s.value}</div>
                <div className="text-indigo-200 font-semibold text-sm">{s.label}</div>
                <div className="text-indigo-300/70 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Built for Everyone</p>
            <h2 className="text-4xl font-black text-slate-900">One protocol. Many use cases.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {WHO_FOR.map((w) => (
              <div key={w.title} className="border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-100 transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <w.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{w.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-black text-slate-900 mb-5">
            Ready to evolve your finances?
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto">
            Join Helix Protocol today — whether you're an individual, business, or developer building the future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold text-base rounded-full shadow-xl hover:shadow-2xl transition-all">
                Get Started Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-base rounded-full transition-all">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
