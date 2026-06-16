import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { Globe, ArrowRight, Zap, Code2 } from "lucide-react";

const NETWORKS = [
  { name: "Ethereum", symbol: "ETH", type: "Layer 1", color: "bg-indigo-500", desc: "The foundational smart contract platform. Nexa routes ETH and ERC-20 tokens across mainnet and all major L2s via the Nexa ETH Bridge Node." },
  { name: "Solana", symbol: "SOL", type: "Layer 1", color: "bg-purple-500", desc: "High-throughput, low-cost settlement. Nexa leverages Solana's sub-second finality for high-volume payment flows via dedicated SOL Bridge Nodes." },
  { name: "BASE", symbol: "BASE", type: "Layer 2", color: "bg-blue-500", desc: "Coinbase's L2 built on the OP Stack. Native USDC and ERC-20 support at Ethereum security with L2 cost — fully integrated into Nexa's AER routing." },
  { name: "Polygon", symbol: "MATIC", type: "Layer 2", color: "bg-violet-500", desc: "EVM-compatible scaling. Nexa routes transactions through Polygon for fast, cheap transfers with broad wallet compatibility and deep MATIC liquidity." },
  { name: "Avalanche", symbol: "AVAX", type: "Layer 1", color: "bg-red-500", desc: "Subnet architecture enables custom execution environments. Nexa's Optimistic consensus mode is optimized for Avalanche's transaction model." },
  { name: "Arbitrum", symbol: "ARB", type: "Layer 2", color: "bg-sky-500", desc: "Optimistic rollup with Ethereum security. Ideal for DeFi integrations and token-heavy merchant flows — integrated via Nexa's EU West bridge cluster." },
  { name: "Bitcoin", symbol: "BTC", type: "Layer 1", color: "bg-orange-500", desc: "The world's reserve digital asset. Nexa handles BTC custody addresses, receive flows, and Lightning-compatible routing for instant BTC payments." },
  { name: "USDC", symbol: "USDC", type: "Stablecoin", color: "bg-emerald-500", desc: "Circle's regulated dollar-backed stablecoin. First-class support across all Nexa networks — the default currency for merchant settlements and P2P transfers." },
];

const PARTNERS = [
  { name: "Chainlink", role: "Price Oracles", desc: "Real-time, tamper-proof price feeds power Nexa's AER cross-currency conversion and adaptive fee estimation across all 150+ supported networks." },
  { name: "Circle", role: "USDC Issuer", desc: "Nexa's primary stablecoin partner. USDC is natively supported across every settlement flow and is the default currency for the Nexa merchant platform." },
  { name: "Alchemy", role: "Node Infrastructure", desc: "Enterprise-grade RPC infrastructure ensures Nexa's bridge and edge nodes maintain sub-100ms response times across all global regions." },
  { name: "The Graph", role: "On-Chain Indexing", desc: "On-chain data indexing powers Nexa's real-time analytics, transaction history feeds, and revenue reporting for merchant dashboards." },
  { name: "WalletConnect", role: "Wallet Connectivity", desc: "Universal wallet connectivity via WalletConnect's open protocol — any Web3 wallet can connect to Nexa in seconds without custom integration." },
  { name: "1inch", role: "DEX Aggregation", desc: "When cross-chain swap routing is required, Nexa's AER engine integrates 1inch for optimal on-chain exchange rates with minimal slippage." },
];

const NODE_TYPES = [
  { type: "ValidatorNode", count: "12 active", desc: "Run Hybrid PoS + Reputation consensus. Require minimum 100,000 NEXA stake and a reputation score ≥ 0.70 to participate in block production.", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { type: "EdgeNode", count: "6 active", desc: "Route transactions globally using the AER engine. No stake required — EdgeNodes earn routing fees by relaying and optimizing transaction paths.", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { type: "Bridge", count: "2 active", desc: "Handle cross-chain asset transfers between Nexa's native chain and external networks (Ethereum, Solana). Secured by multi-sig threshold schemes.", color: "bg-violet-50 text-violet-700 border-violet-100" },
  { type: "LiquidityPool", count: "1 active", desc: "Hold multi-asset reserves for instant cross-currency settlements without waiting for external liquidity providers. Backed by protocol treasury.", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
];

export default function EcosystemPage() {
  return (
    <PublicLayout>
      <div className="bg-white text-slate-900">
        <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-indigo-50/60 to-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
              Ecosystem
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-5">One protocol. Every network.</h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Nexa bridges 150+ blockchain networks into a single, unified settlement layer via a global cluster of ValidatorNodes, EdgeNodes, Bridge Nodes, and LiquidityPools.
            </p>
          </div>
        </section>

        {/* Node Architecture */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Network Architecture</p>
              <h2 className="text-3xl font-black text-slate-900">Four node types. One network.</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">The Nexa network is composed of four specialized node types, each with distinct roles in the consensus, routing, and liquidity layers.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {NODE_TYPES.map((n) => (
                <div key={n.type} className={`border rounded-2xl p-6 ${n.color}`}>
                  <div className="font-black text-lg mb-1">{n.type}</div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70">{n.count}</div>
                  <p className="text-sm leading-relaxed opacity-90">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Supported Networks */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Supported Networks</p>
              <h2 className="text-3xl font-black text-slate-900">Natively integrated chains</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">Deep, first-class integrations — not generic bridge wrappers. Each network is validated, monitored, and optimized individually by Nexa's AER engine.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {NETWORKS.map((n) => (
                <div key={n.name} className="border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full ${n.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs">{n.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{n.name}</div>
                      <div className="text-xs text-slate-500">{n.type}</div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{n.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-600">
                <Globe className="h-4 w-4 text-indigo-600" />
                +142 more networks supported via Nexa Bridge Layer
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Partners & Integrations</p>
              <h2 className="text-3xl font-black text-slate-900">Built with the best</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PARTNERS.map((p) => (
                <div key={p.name} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Zap className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-xs text-indigo-600 font-semibold">{p.role}</div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-5">Integrate your network</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">Building a chain or protocol? Apply to become a Nexa ecosystem partner and get access to our node operator program and developer grants.</p>
          <Link href="/company/contact">
            <button className="flex items-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all">
              Apply for Partnership <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </section>
      </div>
    </PublicLayout>
  );
}
