import { Link } from "wouter";
import { useGetNetworkStats, getGetNetworkStatsQueryKey, useGetTransactionSummary, getGetTransactionSummaryQueryKey } from "@workspace/api-client-react";
import {
  Zap, Shield, Globe, Cpu, ArrowRight, TrendingUp, Lock,
  Code2, Building2, Users, Layers, CheckCircle, ChevronRight, Terminal, Hexagon
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
  {
    icon: Hexagon,
    title: "99.9% EVM Compatible",
    desc: "Every opcode, gas schedule, and EIP-1559 field mirrors Ethereum Mainnet exactly — MetaMask, Foundry, and Hardhat work out of the box.",
  },
  {
    icon: Globe,
    title: "Merkle Patricia Trie",
    desc: "Hardened MPT implementation ensures identical cryptographic stateRoot hashes for full EVM tooling compatibility and verifiable state.",
  },
  {
    icon: Zap,
    title: "CometBFT Consensus",
    desc: "Sub-second block finality via CometBFT — a battle-tested BFT engine powering low-latency, high-throughput transaction ordering.",
  },
  {
    icon: Cpu,
    title: "ABCI 2.0 Execution",
    desc: "Clean-room ABCI 2.0 connector pipeline links the EVM state machine to the consensus layer with isolated CheckTx and DeliverTx flows.",
  },
  {
    icon: Lock,
    title: "ECDSA secp256k1",
    desc: "Native Ethereum signature verification — ecrecover precompile at 0x01, sha256 at 0x02, ripemd160 at 0x03, identity at 0x04.",
  },
  {
    icon: TrendingUp,
    title: "EIP-1559 Transactions",
    desc: "Full dynamic fee support: LegacyTx and DynamicFeeTx with hand-rolled RLP decoding — zero go-ethereum dependency, full architectural ownership.",
  },
];

const STATS_DISPLAY = [
  { value: "3.2M+", label: "Transactions", sub: "Monthly" },
  { value: "$24.8B+", label: "Volume Settled", sub: "All Time" },
  { value: "1.2M+", label: "Active Wallets", sub: "Global" },
  { value: "99.98%", label: "Uptime SLA", sub: "12 months" },
  { value: "150+", label: "Networks", sub: "& growing" },
];

const WHO_FOR = [
  { icon: Code2, title: "Developers", desc: "JSON-RPC 2.0 APIs, EVM bytecode execution, SDKs in 12 languages, webhooks. Deploy Solidity contracts instantly." },
  { icon: Building2, title: "Businesses", desc: "POS terminals, shareable payment links, revenue analytics, and PDF invoicing — all out of the box, no crypto knowledge needed." },
  { icon: Layers, title: "Institutions", desc: "High-throughput settlement rails, multi-node validator infrastructure, compliance tooling, and dedicated SLAs." },
  { icon: Users, title: "Everyone", desc: "Send, receive, and manage multi-chain wallets with a single tap. Sovereign finance, made simple." },
];

const COMPAT_TOOLS = ["MetaMask", "Foundry", "Hardhat", "Remix IDE", "ethers.js", "viem", "wagmi", "Truffle"];

const ARCH_STACK = [
  { label: "Public Ecosystem", sub: "Web3 Apps · External Wallets", light: true },
  { label: "Reverse Proxy", sub: "NGINX / HAProxy Load Balancer", light: false },
  { label: "JSON-RPC Gateway", sub: "nexa_getBalance · nexa_getSystemStatus", light: false },
  { label: "CometBFT Consensus", sub: "P2P Engine · Mempool · ABCI 2.0", highlight: true },
  { label: "NEXA EVM State Machine", sub: "EVM Bytecode · MPT State · Gas Metering", highlight: true },
  { label: "BadgerDB NVMe Store", sub: "LSM-Tree · Atomic Commits · State Root", light: false },
];

export default function LandingPage() {
  const { data: networkStats } = useGetNetworkStats({ query: { queryKey: getGetNetworkStatsQueryKey() } });
  const { data: _txSummary } = useGetTransactionSummary({ query: { queryKey: getGetTransactionSummaryQueryKey() } });

  return (
    <div className="bg-white text-slate-900">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6">
        {/* Subtle background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-amber-50 via-orange-50/40 to-transparent rounded-full blur-3xl opacity-70" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-300/30 rounded-3xl blur-2xl scale-125" />
              <img src={nexaLogo} alt="Nexa" className="relative w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-2xl" />
            </div>
          </div>

          {/* Ethereum compat badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-6 tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            99.9% ETHEREUM COMPATIBLE — NO GETH FORK
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-slate-900 mb-4">
            The Sovereign
          </h1>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Payment Crypto
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Nexa is a clean-room Ethereum Execution Layer on CometBFT — delivering EVM bytecode compatibility, real-time settlement, and institutional payments without forking Geth.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/login">
              <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-sm rounded-full shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 transition-all">
                Launch App
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-700 font-semibold text-sm rounded-full shadow-sm hover:shadow-md transition-all">
              Read Whitepaper
            </button>
          </div>

          {/* Compat tool pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-xs text-slate-400 font-semibold mr-1">Works with:</span>
            {COMPAT_TOOLS.map((t) => (
              <div key={t} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 hover:border-amber-300 hover:text-amber-700 transition-all cursor-default">
                <CheckCircle className="h-3 w-3 text-amber-500" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE NETWORK STATS ──────────────────────────────── */}
      {networkStats && (
        <section className="py-8 bg-gradient-to-r from-amber-500 to-amber-400">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Volume", value: `$${((networkStats.totalVolume ?? 0) / 1e9).toFixed(1)}B` },
              { label: "Transactions", value: (networkStats.totalTransactions ?? 0).toLocaleString() },
              { label: "Avg Settlement", value: `${networkStats.avgSettlementMs ?? 0}ms` },
              { label: "Network Uptime", value: `${networkStats.networkUptime ?? 99}%` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white">{s.value}</div>
                <div className="text-[10px] text-amber-100 font-semibold mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PARTNER NETWORKS ─────────────────────────────── */}
      <section className="py-14 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-7">Powering transactions across</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {PARTNERS.map((p) => (
              <div key={p.name} className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-amber-300 hover:bg-amber-50 transition-all cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
                  <span className="text-[7px] font-black text-white">{p.abbr.slice(0,1)}</span>
                </div>
                <span className="font-semibold text-slate-600 group-hover:text-amber-700 text-sm transition-colors">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE NEXA ADVANTAGE ─────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-3">Why Nexa</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">The Nexa Advantage</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">A clean-room Ethereum execution layer built from first principles — no Geth fork, full EVM compatibility, sovereign infrastructure.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`group bg-white border rounded-2xl p-7 hover:shadow-xl transition-all cursor-default ${i === 0 ? "border-amber-200 shadow-md shadow-amber-50" : "border-slate-100 hover:border-amber-200"}`}>
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 mb-5 group-hover:bg-amber-100 transition-colors">
                  <f.icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}

            {/* CTA card */}
            <div className="relative bg-gradient-to-br from-amber-500 to-amber-400 rounded-2xl p-7 flex flex-col justify-between overflow-hidden shadow-xl shadow-amber-200">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/20 rounded-full blur-xl" />
              <div className="relative">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/70 mb-3">Get Started</div>
                <h3 className="font-black text-2xl text-white mb-3">Start building today</h3>
                <p className="text-white/75 text-sm leading-relaxed">Deploy Solidity contracts, integrate wallets, and process payments on the sovereign payment protocol.</p>
              </div>
              <Link href="/register">
                <button className="relative mt-6 flex items-center gap-2 px-5 py-3 bg-white text-amber-600 font-bold text-sm rounded-full hover:bg-amber-50 transition-colors shadow-lg">
                  Create Account <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-3">Technology</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Sovereign Layer 1 Architecture</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">Enterprise-grade multi-layer execution system — EVM-equivalent state machine, MPT state storage, and CometBFT BFT consensus working in unison.</p>
          </div>

          {/* Stack diagram */}
          <div className="flex flex-col items-center gap-0 max-w-sm mx-auto">
            <div className="flex gap-3 mb-2">
              {["Native Web3 Apps","External Wallets"].map((n) => (
                <div key={n} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-500">{n}</div>
              ))}
            </div>

            <div className="w-px h-5 bg-gradient-to-b from-slate-200 to-amber-300" />

            {ARCH_STACK.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center w-full">
                <div className={`w-full px-6 py-4 rounded-xl border text-center ${
                  node.highlight
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 shadow-md shadow-amber-100"
                    : node.light
                    ? "bg-white border-slate-200"
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <div className={`text-sm font-bold mb-0.5 ${node.highlight ? "text-amber-700" : "text-slate-800"}`}>{node.label}</div>
                  <div className="text-xs text-slate-400 font-medium">{node.sub}</div>
                </div>
                {i < ARCH_STACK.length - 1 && (
                  <div className="flex flex-col items-center">
                    <div className={`w-px h-5 bg-gradient-to-b ${i < 2 ? "from-slate-200 to-amber-200" : "from-amber-300 to-amber-400"}`} />
                    <ChevronRight className={`h-3 w-3 rotate-90 -mt-1 ${i < 2 ? "text-slate-300" : "text-amber-400"}`} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-12">
            {["CometBFT Consensus","Merkle Patricia Trie","ABCI 2.0","EIP-1559","secp256k1 ECDSA","BIP39 Wallets","JSON-RPC 2.0","Go 1.21","BadgerDB v4"].map((t) => (
              <span key={t} className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-700 tracking-wide">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVM COMPATIBILITY HIGHLIGHT ──────────────────── */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400 mb-4">Ethereum Execution Layer</p>
              <h2 className="text-4xl font-black mb-5 leading-tight">Deploy your Solidity contracts. No changes required.</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-8">Nexa implements the Ethereum Yellow Paper specification from scratch — without forking Geth. Every opcode gas schedule, transaction RLP serialization rule, and EIP-1559 field mirrors Ethereum Mainnet exactly.</p>
              <ul className="space-y-3">
                {[
                  "Full EVM opcode execution: PUSH1–PUSH32, ADD, MUL, SLOAD, SSTORE, REVERT",
                  "Hand-rolled RLP decoder — LegacyTx & DynamicFeeTx (EIP-1559)",
                  "Ethereum precompiles: ecrecover (0x01), sha256 (0x02), ripemd160 (0x03)",
                  "Merkle Patricia Trie with Keccak-256 node hashing",
                  "Native secp256k1 ECDSA signature recovery",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-white/60 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code block */}
            <div className="bg-black/40 rounded-2xl border border-white/8 p-6 font-mono text-xs overflow-hidden">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="text-white/20 text-[10px] ml-2 font-sans">engine/evm.go</span>
              </div>
              <div className="space-y-1 leading-5">
                <div><span className="text-amber-400">type</span> <span className="text-blue-300">EVM</span> <span className="text-white/40">struct {"{"}</span></div>
                <div className="pl-4"><span className="text-white/60">Stack</span>        <span className="text-emerald-400">*MemoryStack</span></div>
                <div className="pl-4"><span className="text-white/60">Memory</span>       <span className="text-emerald-400">*ByteMemory</span></div>
                <div className="pl-4"><span className="text-white/60">State</span>        <span className="text-emerald-400">*Trie</span></div>
                <div className="pl-4"><span className="text-white/60">GasRemaining</span> <span className="text-purple-400">uint64</span></div>
                <div className="pl-4"><span className="text-white/60">Code</span>         <span className="text-purple-400">[]byte</span></div>
                <div className="pl-4"><span className="text-white/60">PC</span>           <span className="text-purple-400">uint64</span></div>
                <div><span className="text-white/40">{"}"}</span></div>
                <div className="mt-3"><span className="text-white/25">// SLOAD: 2100 gas cold access</span></div>
                <div><span className="text-amber-400">case</span> <span className="text-blue-300">SLOAD</span><span className="text-white/40">:</span></div>
                <div className="pl-4"><span className="text-white/60">key</span> <span className="text-white/40">:=</span> evm.<span className="text-blue-300">Stack</span>.<span className="text-yellow-300">Pop</span><span className="text-white/40">()</span></div>
                <div className="pl-4">evm.<span className="text-blue-300">GasRemaining</span> <span className="text-white/40">-=</span> <span className="text-purple-400">2100</span></div>
                <div className="pl-4">evm.<span className="text-blue-300">Stack</span>.<span className="text-yellow-300">Push</span><span className="text-white/40">(</span>evm.<span className="text-blue-300">State</span>.<span className="text-yellow-300">Get</span><span className="text-white/40">(</span>key<span className="text-white/40">))</span></div>
                <div className="mt-3"><span className="text-white/25">// SSTORE: 100 gas warm minimum</span></div>
                <div><span className="text-amber-400">case</span> <span className="text-blue-300">SSTORE</span><span className="text-white/40">:</span></div>
                <div className="pl-4">evm.<span className="text-blue-300">GasRemaining</span> <span className="text-white/40">-=</span> <span className="text-purple-400">100</span></div>
                <div className="pl-4">evm.<span className="text-blue-300">State</span>.<span className="text-yellow-300">Update</span><span className="text-white/40">(</span>key<span className="text-white/40">,</span> val<span className="text-white/40">)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS COUNTER ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-3">By The Numbers</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-16">Infrastructure you can count on</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {STATS_DISPLAY.map((s) => (
              <div key={s.label} className="group">
                <div className="text-4xl md:text-5xl font-black text-amber-500 mb-2">{s.value}</div>
                <div className="text-slate-600 font-semibold text-sm">{s.label}</div>
                <div className="text-slate-400 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-3">Built for Everyone</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">One protocol. Infinite use cases.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {WHO_FOR.map((w) => (
              <div key={w.title} className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:border-amber-200 transition-all cursor-default">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <w.icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{w.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="py-28 px-6 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-50 rounded-full blur-3xl opacity-80" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-amber-300/30 rounded-2xl blur-xl" />
              <img src={nexaLogo} alt="Nexa" className="relative w-20 h-20 object-contain drop-shadow-xl" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-3">
            Own your finances.
          </h2>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Sovereignty starts here.
            </span>
          </h2>
          <p className="text-slate-500 text-base mb-12 max-w-xl mx-auto leading-relaxed">
            Join Nexa today — whether you're an individual, a business, or a developer building the sovereign financial stack of tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-sm rounded-full shadow-xl shadow-amber-200 hover:shadow-2xl hover:shadow-amber-300 transition-all">
                Get Started Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-700 font-semibold text-sm rounded-full transition-all">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
