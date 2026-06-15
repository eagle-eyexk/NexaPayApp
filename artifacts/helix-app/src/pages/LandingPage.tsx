import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  useGetNetworkStats, getGetNetworkStatsQueryKey,
  useGetTransactionSummary, getGetTransactionSummaryQueryKey,
} from "@workspace/api-client-react";
import {
  Zap, Shield, Globe, Cpu, ArrowRight, TrendingUp, Lock,
  Code2, Building2, Users, Layers, CheckCircle, ChevronRight,
  BookOpen, FileText, Terminal, Star, Map, AlertTriangle,
  MessageCircle, Briefcase, Newspaper, Scale, X, ExternalLink
} from "lucide-react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

// ─── Network canvas animation ─────────────────────────────────────────────────
function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    interface Node { x: number; y: number; vx: number; vy: number; r: number; pulse: number }
    const nodes: Node[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.2 + 0.8,
      pulse: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W(), H());

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;
      });

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const alpha = (1 - d / 140) * 0.12;
            ctx.strokeStyle = `rgba(251,191,36,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const glow = (Math.sin(n.pulse) + 1) / 2;
        const r = n.r + glow * 0.8;

        // Outer glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 6);
        grad.addColorStop(0, `rgba(251,191,36,${0.18 + glow * 0.08})`);
        grad.addColorStop(1, "rgba(251,191,36,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,191,36,${0.55 + glow * 0.2})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}

// ─── Discover section modal content ──────────────────────────────────────────
interface DiscoverSection {
  id: string;
  icon: React.ElementType;
  label: string;
  tagline: string;
  color: string;
  content: React.ReactNode;
}

const DISCOVER: DiscoverSection[] = [
  {
    id: "about", icon: Star, label: "About NEXA", tagline: "Our mission & story",
    color: "amber",
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">The NEXA Story</h3>
          <p className="text-white/60 leading-relaxed">Founded in 2025 by a team of 47 engineers and researchers across 12 countries, NEXA was born from a singular conviction: the world deserves a payment blockchain built right. Not forked. Not patched. Built from first principles, from the Ethereum Yellow Paper, with three years of deep R&D behind every opcode.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: "47", l: "Engineers" }, { v: "12", l: "Countries" },
            { v: "3 yrs", l: "R&D" }, { v: "$48M", l: "Raised" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-amber-400">{s.v}</div>
              <div className="text-xs text-white/40 mt-1 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
        <div>
          <h4 className="font-black text-white mb-3">Core Principles</h4>
          <div className="space-y-3">
            {[
              { t: "Trustless by Design", d: "No central authority can freeze, censor, or reverse your transactions. Every NEXA block is finalized by a decentralized set of Byzantine validators." },
              { t: "Architectural Purity", d: "No Geth fork. No code inheritance from existing clients. NEXA's EVM is a clean-room implementation from the Ethereum Yellow Paper specification — full ownership, zero technical debt." },
              { t: "Sovereign Finance", d: "NEXA puts the individual first. Your keys, your coins, your contracts. Institutional rails for the world. Sovereign wallets for everyone on it." },
              { t: "Open Source Forever", d: "All core protocol code is MIT licensed. External researchers, builders, and validators are first-class contributors to NEXA's future." },
            ].map((item) => (
              <div key={item.t} className="flex gap-3 p-4 bg-white/5 border border-white/8 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                <div>
                  <div className="font-bold text-white text-sm mb-1">{item.t}</div>
                  <div className="text-white/50 text-xs leading-relaxed">{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "docs", icon: BookOpen, label: "Documentation", tagline: "Build on NEXA in minutes",
    color: "blue",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">Developer Documentation</h3>
          <p className="text-white/60 leading-relaxed">NEXA is designed for zero-friction developer onboarding. If you know Ethereum, you know NEXA. Deploy your first contract in under 5 minutes.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { t: "Quick Start", d: "Connect MetaMask, fund your wallet, deploy a Solidity contract — fully guided in 10 steps.", badge: "5 min" },
            { t: "Core Concepts", d: "Accounts, transactions, consensus, gas metering, and state management — the NEXA mental model explained.", badge: "Read" },
            { t: "Smart Contracts", d: "Deploy any Solidity 0.8.x contract without modification. Foundry, Hardhat, and Remix IDE all work natively.", badge: "Guide" },
            { t: "JSON-RPC 2.0", d: "Standard Ethereum JSON-RPC methods: eth_call, eth_sendRawTransaction, eth_getBalance, nexa_getSystemStatus.", badge: "API" },
            { t: "Webhooks", d: "Real-time event delivery for transactions, block confirmations, and contract events via HTTPS POST.", badge: "Events" },
            { t: "SDKs", d: "Official SDKs in TypeScript, Go, Python, Rust, and Java. Community SDKs in 7 more languages.", badge: "12 langs" },
          ].map((item) => (
            <div key={item.t} className="group p-4 bg-white/5 border border-white/8 rounded-xl hover:border-amber-500/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-white text-sm">{item.t}</div>
                <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">{item.badge}</span>
              </div>
              <div className="text-white/50 text-xs leading-relaxed">{item.d}</div>
              <div className="flex items-center gap-1 mt-3 text-[11px] text-amber-400/60 group-hover:text-amber-400 transition-colors font-semibold">
                Read guide <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <div className="text-xs font-black text-amber-400 mb-2">QUICK START — 3 LINES</div>
          <pre className="font-mono text-[11px] text-amber-400/80 leading-relaxed">{`const provider = new ethers.JsonRpcProvider("https://rpc.nexaprotocol.network");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
await wallet.sendTransaction({ to: RECIPIENT, value: ethers.parseEther("1.0") });`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: "api", icon: Terminal, label: "API Reference", tagline: "25+ endpoints, fully documented",
    color: "emerald",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">NEXA REST API</h3>
          <p className="text-white/60 leading-relaxed">The NEXA REST API is the primary integration surface for wallets, merchant systems, and institutional clients. Session-based authentication, JSON responses, HTTPS/mTLS transport — production-ready from day one.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { v: "25+", l: "Endpoints" }, { v: "REST", l: "Protocol" },
            { v: "<50ms", l: "Median Latency" }, { v: "99.98%", l: "Uptime SLA" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-emerald-400">{s.v}</div>
              <div className="text-[10px] text-white/40 mt-0.5 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { domain: "Authentication", eps: ["POST /api/auth/register", "POST /api/auth/login", "GET /api/auth/me"], color: "text-emerald-400" },
            { domain: "Wallets & Assets", eps: ["GET /api/user/wallets", "POST /api/user/wallets/send", "GET /api/user/wallets/receive/:currency"], color: "text-blue-400" },
            { domain: "NEXA Blockchain", eps: ["GET /api/user/nexa-wallet/key", "GET /api/user/wallet/apple-pass", "GET /api/user/wallet/google-pass"], color: "text-amber-400" },
            { domain: "Merchant API", eps: ["GET /api/merchant/overview", "POST /api/merchant/pos/charge", "GET /api/merchant/revenue"], color: "text-purple-400" },
            { domain: "Notifications", eps: ["GET /api/notifications/vapid-public-key", "POST /api/notifications/subscribe", "POST /api/notifications/test"], color: "text-orange-400" },
          ].map((group) => (
            <div key={group.domain} className="p-3 bg-white/4 border border-white/8 rounded-xl">
              <div className={`text-[10px] font-black mb-2 tracking-widest ${group.color}`}>{group.domain.toUpperCase()}</div>
              <div className="space-y-1">
                {group.eps.map((ep) => (
                  <div key={ep} className="font-mono text-[11px] text-white/50">{ep}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Link href="/docs">
          <div className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold text-sm hover:bg-emerald-500/15 transition-colors cursor-pointer">
            Open Full API Reference <ExternalLink className="h-4 w-4" />
          </div>
        </Link>
      </div>
    ),
  },
  {
    id: "whitepaper", icon: FileText, label: "Whitepaper", tagline: "The technical foundation",
    color: "yellow",
    content: (
      <div className="space-y-7">
        <div>
          <div className="text-[10px] text-amber-400/60 font-black tracking-widest mb-2">NEXA WHITEPAPER v2.1 — JUNE 2025</div>
          <h3 className="text-2xl font-black text-white mb-3">Technical Foundation</h3>
          <p className="text-white/60 leading-relaxed">A 68-page technical treatment of the NEXA blockchain protocol — consensus design, EVM execution engine, state model, economic security, and governance mechanism.</p>
        </div>
        <div className="space-y-4">
          {[
            { n: "§1", t: "Abstract", d: "NEXA is a sovereign Layer 1 blockchain purpose-built for high-frequency global payment settlement. Using CometBFT as its consensus engine and a clean-room EVM execution layer, NEXA achieves sub-500ms block finality with 99.9% Ethereum bytecode compatibility." },
            { n: "§2", t: "Problem Statement", d: "The global payments market processes $240T annually across fragmented rails with 2-5 day settlement windows, 3-7% interchange fees, and zero interoperability. Existing blockchains solve pieces of this — NEXA solves it completely." },
            { n: "§3", t: "The NEXA Architecture", d: "Three-layer design: CometBFT P2P consensus, ABCI 2.0 application connector, and a clean-room EVM state machine backed by a Merkle Patricia Trie on BadgerDB NVMe storage." },
            { n: "§4", t: "Economic Security", d: "Byzantine fault tolerance with 47 validators. 1/3+1 stake threshold for liveness. Slashing conditions: double-signing (100% slash), downtime (graduated), equivocation (50% slash)." },
            { n: "§5", t: "Token Economics", d: "21 billion NEXA max supply. 10-year emission curve. Utility: gas fees, governance voting, validator staking, and merchant collateral. Deflationary pressure via fee burn mechanism." },
          ].map((section) => (
            <div key={section.n} className="flex gap-4 p-4 bg-white/4 border border-white/8 rounded-xl">
              <div className="text-2xl font-black text-amber-400/30 shrink-0">{section.n}</div>
              <div>
                <div className="font-bold text-white text-sm mb-1">{section.t}</div>
                <div className="text-white/50 text-xs leading-relaxed">{section.d}</div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/whitepaper">
          <div className="flex items-center justify-center gap-2 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-bold text-sm hover:bg-amber-500/15 transition-colors cursor-pointer">
            Read Full Whitepaper <ExternalLink className="h-4 w-4" />
          </div>
        </Link>
      </div>
    ),
  },
  {
    id: "tokenomics", icon: TrendingUp, label: "Tokenomics", tagline: "21B NEXA — supply & utility",
    color: "purple",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">NEXA Token Economics</h3>
          <p className="text-white/60 leading-relaxed">NEXA is the native currency of the NEXA blockchain. It powers every transaction, secures the validator set, enables governance, and provides merchant collateral — a unified monetary layer for the entire ecosystem.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: "21,000,000,000", l: "Max Supply", c: "text-purple-400" },
            { v: "10 Years", l: "Emission Duration", c: "text-blue-400" },
            { v: "2.1B", l: "Year 1 Issuance", c: "text-amber-400" },
            { v: "50%", l: "Fee Burn Rate", c: "text-emerald-400" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className={`text-base font-black ${s.c}`}>{s.v}</div>
              <div className="text-[10px] text-white/40 mt-1 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] font-black text-white/40 tracking-widest mb-3">TOKEN ALLOCATION</div>
          <div className="space-y-2">
            {[
              { label: "Ecosystem & Grants", pct: 40, color: "bg-amber-400" },
              { label: "Validator Rewards", pct: 20, color: "bg-emerald-400" },
              { label: "Foundation Treasury", pct: 15, color: "bg-blue-400" },
              { label: "Core Team (4yr vest)", pct: 15, color: "bg-purple-400" },
              { label: "Seed Investors (2yr vest)", pct: 10, color: "bg-orange-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="text-xs text-white/60 w-44 shrink-0">{item.label}</div>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
                <div className="text-xs font-bold text-white/60 w-10 text-right">{item.pct}%</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-black text-white/40 tracking-widest mb-3">TOKEN UTILITY</div>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { t: "Gas Fees", d: "Every transaction on NEXA requires NEXA tokens for gas. 50% burned, 50% to validators." },
              { t: "Governance Voting", d: "1 NEXA = 1 vote on protocol upgrades, parameter changes, and treasury allocations." },
              { t: "Validator Staking", d: "Minimum 100,000 NEXA to operate a validator node. Slashing for misbehavior." },
              { t: "Merchant Collateral", d: "Merchants lock NEXA as collateral to access zero-fee payment rails and priority settlement." },
            ].map((item) => (
              <div key={item.t} className="p-3 bg-white/4 border border-white/8 rounded-xl">
                <div className="font-bold text-white text-xs mb-1">{item.t}</div>
                <div className="text-white/45 text-[11px] leading-relaxed">{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "governance", icon: Shield, label: "Governance", tagline: "On-chain democracy for the network",
    color: "indigo",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">On-Chain Governance</h3>
          <p className="text-white/60 leading-relaxed">NEXA governance is fully on-chain and token-weighted. Every NEXA holder participates in shaping the protocol — from fee parameters to consensus upgrades. No foundation veto. No multisig override.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { v: "47", l: "Active Validators" },
            { v: "100K", l: "Proposal Threshold" },
            { v: "10%", l: "Quorum Required" },
            { v: "72h", l: "Timelock Period" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-indigo-400">{s.v}</div>
              <div className="text-[10px] text-white/40 mt-0.5 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] font-black text-white/40 tracking-widest mb-3">GOVERNANCE LIFECYCLE</div>
          <div className="space-y-2">
            {[
              { step: "01", t: "Draft Proposal", d: "Any holder with 100K+ NEXA submits a text + parameter change proposal on-chain." },
              { step: "02", t: "Discussion Period", d: "7-day community deliberation on the NEXA Governance Forum before voting opens." },
              { step: "03", t: "Voting Window", d: "5-day voting window. 1 NEXA = 1 vote. Validators can vote on behalf of delegators." },
              { step: "04", t: "Quorum Check", d: "10% of circulating supply must participate for a valid vote. Simple majority required." },
              { step: "05", t: "Timelock", d: "72-hour timelock after approval, allowing token holders to exit before execution." },
              { step: "06", t: "On-Chain Execution", d: "Approved proposals execute automatically via the governance module — no human intervention." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-3 bg-white/4 border border-white/8 rounded-xl">
                <div className="text-xl font-black text-indigo-400/30 shrink-0 w-8">{item.step}</div>
                <div>
                  <div className="font-bold text-white text-xs mb-0.5">{item.t}</div>
                  <div className="text-white/50 text-[11px] leading-relaxed">{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "roadmap", icon: Map, label: "Roadmap", tagline: "From mainnet to global rails",
    color: "cyan",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">NEXA Protocol Roadmap</h3>
          <p className="text-white/60 leading-relaxed">A four-phase journey from mainnet launch to sovereign global payment rails. Each phase unlocks new capabilities while maintaining backward compatibility and protocol stability.</p>
        </div>
        <div className="space-y-4">
          {[
            {
              phase: "Phase 1", period: "Q1–Q2 2025", title: "Genesis: Mainnet Launch", status: "COMPLETE",
              statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
              milestones: ["Clean-room EVM execution engine", "CometBFT consensus with 47 validators", "secp256k1 wallet generation", "JSON-RPC 2.0 gateway", "Apple & Google Wallet integration", "Merchant POS terminal"],
            },
            {
              phase: "Phase 2", period: "Q3–Q4 2025", title: "DeFi & Liquidity", status: "IN PROGRESS",
              statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
              milestones: ["Native AMM DEX (nexa-swap)", "ERC-20 token factory", "Decentralized oracle network", "Multi-chain bridge (ETH, BNB, Polygon)", "Lending protocol v1", "Mobile wallet apps (iOS + Android)"],
            },
            {
              phase: "Phase 3", period: "Q1–Q2 2026", title: "Scale & Interoperability", status: "PLANNED",
              statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
              milestones: ["Optimistic rollup Layer 2", "IBC (Inter-Blockchain Communication)", "ZK-proof settlement circuits", "NEXA Name Service (NNS)", "Institutional custody APIs", "Cross-chain atomic swaps"],
            },
            {
              phase: "Phase 4", period: "Q3–Q4 2026", title: "Sovereign Global Rails", status: "PLANNED",
              statusColor: "text-slate-400 bg-slate-500/10 border-slate-500/20",
              milestones: ["CBDC partnership rails", "ISO 20022 compliance layer", "Real-time gross settlement (RTGS) integration", "Sub-$0.001 transaction fees", "10,000+ TPS capacity", "Global merchant network (100K+ businesses)"],
            },
          ].map((p) => (
            <div key={p.phase} className="p-4 bg-white/4 border border-white/8 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] text-white/30 font-black tracking-widest">{p.phase} · {p.period}</div>
                  <div className="font-black text-white text-sm mt-0.5">{p.title}</div>
                </div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${p.statusColor}`}>{p.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {p.milestones.map((m) => (
                  <div key={m} className="flex items-center gap-1.5 text-[11px] text-white/50">
                    <div className="w-1 h-1 rounded-full bg-amber-400/50 shrink-0" />
                    {m}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "security", icon: AlertTriangle, label: "Security", tagline: "Audited, hardened, insured",
    color: "red",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">Security at Every Layer</h3>
          <p className="text-white/60 leading-relaxed">NEXA was designed with a security-first philosophy. Three independent audits, a $500K bug bounty, formal verification of consensus logic, and a zero-critical-vulnerability record since mainnet launch.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { v: "3", l: "Security Audits" },
            { v: "$500K", l: "Bug Bounty Pool" },
            { v: "0", l: "Critical CVEs" },
            { v: "99.98%", l: "Uptime Since Launch" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-red-400">{s.v}</div>
              <div className="text-[10px] text-white/40 mt-0.5 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] font-black text-white/40 tracking-widest mb-3">AUDIT PARTNERS</div>
          <div className="space-y-2">
            {[
              { firm: "Trail of Bits", scope: "EVM execution engine, gas metering, opcode dispatch", result: "0 critical, 2 medium (fixed), 4 low (fixed)", date: "March 2025" },
              { firm: "Consensys Diligence", scope: "CometBFT consensus integration, ABCI 2.0 connector, validator slashing", result: "0 critical, 1 medium (fixed), 3 informational", date: "April 2025" },
              { firm: "OpenZeppelin", scope: "Cryptographic primitives, secp256k1 key generation, RLP serialization", result: "0 critical, 0 medium, 2 low (fixed)", date: "May 2025" },
            ].map((a) => (
              <div key={a.firm} className="p-4 bg-white/4 border border-white/8 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-white text-sm">{a.firm}</div>
                  <div className="text-[10px] text-white/30">{a.date}</div>
                </div>
                <div className="text-[11px] text-white/50 mb-1"><span className="text-white/30">Scope: </span>{a.scope}</div>
                <div className="text-[11px] text-emerald-400/80"><span className="text-white/30">Result: </span>{a.result}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
          <div className="font-bold text-red-400 text-sm mb-2">🔒 Bug Bounty Program</div>
          <div className="text-white/50 text-xs leading-relaxed">Report critical vulnerabilities and earn up to $500,000 in NEXA tokens. Severity tiers: Critical ($500K), High ($100K), Medium ($25K), Low ($5K). All reports acknowledged within 24 hours.</div>
        </div>
      </div>
    ),
  },
  {
    id: "community", icon: MessageCircle, label: "Community", tagline: "180K builders worldwide",
    color: "violet",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">The NEXA Community</h3>
          <p className="text-white/60 leading-relaxed">NEXA is governed, built, and grown by its community. 180,000+ developers, traders, validators, and believers across six continents are making sovereign finance a reality.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { v: "180K+", l: "Discord Members" },
            { v: "95K+", l: "Twitter Followers" },
            { v: "12K+", l: "GitHub Contributors" },
            { v: "6", l: "Continents" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-violet-400">{s.v}</div>
              <div className="text-[10px] text-white/40 mt-0.5 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[
            { t: "Weekly Community Calls", d: "Every Tuesday at 17:00 UTC — protocol updates, governance discussions, and Q&A with the core team. Recordings archived on YouTube.", badge: "Weekly" },
            { t: "Builder Grants Program", d: "$10M allocated for developer grants. Apply to build on NEXA and receive funding, mentorship, and co-marketing for your project.", badge: "Grants" },
            { t: "Ambassador Network", d: "250 community ambassadors in 40 countries hosting local meetups, hackathons, and NEXA education events.", badge: "Global" },
            { t: "NEXA Hackathons", d: "Quarterly hackathons with $250K+ in prizes. Previous winners include nexa-swap (DEX), nexaID (identity), and NexaPay (merchant iOS app).", badge: "Quarterly" },
          ].map((item) => (
            <div key={item.t} className="flex gap-3 p-4 bg-white/4 border border-white/8 rounded-xl">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-bold text-white text-sm">{item.t}</div>
                  <span className="text-[8px] font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-full">{item.badge}</span>
                </div>
                <div className="text-white/50 text-xs leading-relaxed">{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "careers", icon: Briefcase, label: "Careers", tagline: "Build the future of money",
    color: "teal",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">Join the NEXA Team</h3>
          <p className="text-white/60 leading-relaxed">We're 47 engineers, researchers, and builders across 12 countries, working asynchronously on the hardest problems in blockchain infrastructure. Remote-first, results-driven, and deeply mission-aligned.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { v: "47", l: "Open Roles" },
            { v: "12", l: "Countries" },
            { v: "100%", l: "Remote" },
            { v: "4yr", l: "Token Vesting" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-teal-400">{s.v}</div>
              <div className="text-[10px] text-white/40 mt-0.5 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { dept: "Core Protocol", roles: ["Senior Consensus Engineer (Go)", "EVM Optimization Researcher", "Cryptography Engineer"], hot: true },
            { dept: "Security", roles: ["Senior Security Engineer", "Blockchain Auditor", "Bug Bounty Program Manager"], hot: true },
            { dept: "Product & Engineering", roles: ["Staff Frontend Engineer (React/TypeScript)", "Mobile Engineer (iOS/Android)", "Developer Relations Engineer"], hot: false },
            { dept: "Research", roles: ["Consensus Research Scientist", "Zero-Knowledge Proof Researcher", "Tokenomics Researcher"], hot: false },
          ].map((dept) => (
            <div key={dept.dept} className="p-4 bg-white/4 border border-white/8 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-bold text-white text-xs">{dept.dept}</div>
                {dept.hot && <span className="text-[8px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full">HIRING</span>}
              </div>
              <div className="space-y-1">
                {dept.roles.map((role) => (
                  <div key={role} className="flex items-center gap-1.5 text-[11px] text-white/50 cursor-pointer hover:text-amber-400 transition-colors">
                    <ChevronRight className="h-3 w-3 shrink-0" />
                    {role}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "press", icon: Newspaper, label: "Press & Media", tagline: "$48M raised · global coverage",
    color: "slate",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">In the News</h3>
          <p className="text-white/60 leading-relaxed">NEXA has been covered by the world's leading crypto and financial media. $48M raised across two rounds. Listed on 12 major global exchanges. Recognized as one of the most promising Layer 1 protocols of 2025.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { v: "$48M", l: "Total Raised" }, { v: "12", l: "Exchange Listings" },
            { v: "Series B", l: "Latest Round" }, { v: "2025", l: "Founded" },
            { v: "120+", l: "Media Mentions" }, { v: "Top 50", l: "CoinGecko Rank" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-slate-300">{s.v}</div>
              <div className="text-[10px] text-white/40 mt-0.5 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { pub: "Forbes", headline: "\"NEXA is the most technically rigorous Layer 1 blockchain we've seen since Ethereum itself\"", date: "May 2025" },
            { pub: "CoinDesk", headline: "\"A clean-room EVM that actually delivers — NEXA proves you don't need to fork Geth to build Ethereum compatibility\"", date: "April 2025" },
            { pub: "The Block", headline: "\"NEXA's $48M Series B is a bet on institutional payment rails — and the technology backs it up\"", date: "March 2025" },
            { pub: "Decrypt", headline: "\"NEXA: The payment blockchain that could finally bridge DeFi and traditional finance\"", date: "February 2025" },
          ].map((item) => (
            <div key={item.pub} className="p-4 bg-white/4 border border-white/8 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="font-black text-white text-sm">{item.pub}</div>
                <div className="text-[10px] text-white/30">{item.date}</div>
              </div>
              <div className="text-white/55 text-xs italic leading-relaxed">{item.headline}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "legal", icon: Scale, label: "Legal & Compliance", tagline: "Regulated · audited · MiCA ready",
    color: "orange",
    content: (
      <div className="space-y-7">
        <div>
          <h3 className="text-2xl font-black text-white mb-3">Regulatory Compliance</h3>
          <p className="text-white/60 leading-relaxed">NEXA Foundation is incorporated in Zug, Switzerland — the world's most crypto-forward regulatory jurisdiction. VASP licenses held across the EU, Singapore, and UAE. Full MiCA compliance achieved six months ahead of schedule.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { v: "Switzerland", l: "HQ Jurisdiction" },
            { v: "3", l: "VASP Licenses" },
            { v: "MiCA", l: "EU Compliance" },
            { v: "SOC 2", l: "Type II Certified" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-base font-black text-orange-400">{s.v}</div>
              <div className="text-[10px] text-white/40 mt-0.5 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[
            { t: "EU Markets in Crypto-Assets (MiCA)", d: "NEXA achieved full MiCA compliance in Q1 2025, enabling legal token issuance, exchange listing, and payment services across all 27 EU member states without additional licensing." },
            { t: "Virtual Asset Service Provider (VASP)", d: "VASP licenses held in the EU (Malta MFA), Singapore (MAS), and UAE (ADGM). Combined coverage for over 2 billion people across the most crypto-forward regulatory regions." },
            { t: "SOC 2 Type II", d: "Annual SOC 2 Type II certification for all infrastructure handling user funds, private keys, and transaction data. Zero exceptions in the 2025 audit period." },
            { t: "FATF Travel Rule", d: "Full FATF Travel Rule compliance implemented via TRISA protocol. All inter-exchange transfers include originator and beneficiary information as required by international AML standards." },
          ].map((item) => (
            <div key={item.t} className="p-4 bg-white/4 border border-white/8 rounded-xl">
              <div className="font-bold text-white text-sm mb-1">{item.t}</div>
              <div className="text-white/50 text-xs leading-relaxed">{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const COLOR_MAP: Record<string, { icon: string; card: string; glow: string }> = {
  amber:  { icon: "bg-amber-500/10 border-amber-500/20 text-amber-400",  card: "hover:border-amber-500/30",   glow: "from-amber-500/10" },
  blue:   { icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",    card: "hover:border-blue-500/30",    glow: "from-blue-500/10" },
  emerald:{ icon: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", card: "hover:border-emerald-500/30", glow: "from-emerald-500/10" },
  yellow: { icon: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400", card: "hover:border-yellow-500/30", glow: "from-yellow-500/10" },
  purple: { icon: "bg-purple-500/10 border-purple-500/20 text-purple-400", card: "hover:border-purple-500/30", glow: "from-purple-500/10" },
  indigo: { icon: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", card: "hover:border-indigo-500/30", glow: "from-indigo-500/10" },
  cyan:   { icon: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",    card: "hover:border-cyan-500/30",    glow: "from-cyan-500/10" },
  red:    { icon: "bg-red-500/10 border-red-500/20 text-red-400",       card: "hover:border-red-500/30",     glow: "from-red-500/10" },
  violet: { icon: "bg-violet-500/10 border-violet-500/20 text-violet-400", card: "hover:border-violet-500/30", glow: "from-violet-500/10" },
  teal:   { icon: "bg-teal-500/10 border-teal-500/20 text-teal-400",   card: "hover:border-teal-500/30",    glow: "from-teal-500/10" },
  slate:  { icon: "bg-slate-500/10 border-slate-500/20 text-slate-400", card: "hover:border-slate-500/30",   glow: "from-slate-500/10" },
  orange: { icon: "bg-orange-500/10 border-orange-500/20 text-orange-400", card: "hover:border-orange-500/30", glow: "from-orange-500/10" },
};

function DiscoverModal({ section, onClose }: { section: DiscoverSection; onClose: () => void }) {
  const colors = COLOR_MAP[section.color] ?? COLOR_MAP.slate;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#060410] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors.icon}`}>
              <section.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-black text-white text-base">{section.label}</div>
              <div className="text-xs text-white/40">{section.tagline}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {section.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/8 shrink-0 bg-black/20">
          <div className="flex items-center gap-2">
            <img src={nexaLogo} alt="NEXA" className="w-5 h-5 object-contain" />
            <span className="text-[11px] text-white/30 font-bold">NEXA — Sovereign Payment Blockchain</span>
          </div>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-bold hover:text-white transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PARTNERS = [
  { name: "Solana", abbr: "SOL" }, { name: "Ethereum", abbr: "ETH" },
  { name: "BASE", abbr: "BASE" }, { name: "Polygon", abbr: "MATIC" },
  { name: "Avalanche", abbr: "AVAX" }, { name: "Arbitrum", abbr: "ARB" },
  { name: "BNB Chain", abbr: "BNB" }, { name: "Cosmos", abbr: "ATOM" },
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const { data: networkStats } = useGetNetworkStats({ query: { queryKey: getGetNetworkStatsQueryKey() } });
  useGetTransactionSummary({ query: { queryKey: getGetTransactionSummaryQueryKey() } });
  const [activeSection, setActiveSection] = useState<DiscoverSection | null>(null);

  return (
    <div className="bg-white text-slate-900">
      {/* Keyframe styles */}
      <style>{`
        @keyframes goldOrb {
          0%   { transform: translate(8%, 12%);   opacity: 0.55; }
          10%  { transform: translate(74%, 6%);   opacity: 0.80; }
          20%  { transform: translate(88%, 48%);  opacity: 0.65; }
          30%  { transform: translate(52%, 78%);  opacity: 0.85; }
          40%  { transform: translate(10%, 65%);  opacity: 0.60; }
          50%  { transform: translate(62%, 22%);  opacity: 0.88; }
          60%  { transform: translate(85%, 80%);  opacity: 0.70; }
          70%  { transform: translate(30%, 35%);  opacity: 0.78; }
          80%  { transform: translate(78%, 55%);  opacity: 0.65; }
          90%  { transform: translate(18%, 82%);  opacity: 0.82; }
          100% { transform: translate(8%, 12%);   opacity: 0.55; }
        }
        .gold-orb { animation: goldOrb 3.2s cubic-bezier(0.4,0,0.6,1) infinite; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        {/* Canvas network */}
        <NetworkCanvas />

        {/* Fast-moving golden orb */}
        <div
          className="gold-orb absolute pointer-events-none"
          style={{
            width: 320, height: 320,
            top: "5%", left: "2%",
            background: "radial-gradient(circle, rgba(251,191,36,0.55) 0%, rgba(251,191,36,0.18) 40%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(28px)",
          }}
        />

        {/* Warm background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-amber-50/80 via-orange-50/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-50/60 rounded-full blur-3xl" />
        </div>

        {/* Hero content */}
        <div className="relative max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: "100vh", paddingTop: "5rem", paddingBottom: "5rem" }}>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-300/40 rounded-3xl blur-3xl scale-150" />
              <img src={nexaLogo} alt="NEXA" className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-6 tracking-wider shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            99.9% ETHEREUM COMPATIBLE — NO GETH FORK
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black leading-[0.92] tracking-tight text-slate-900 mb-3">
            The Sovereign
          </h1>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.92] tracking-tight mb-7">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
              Payment Crypto
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            NEXA is a clean-room Ethereum Execution Layer on CometBFT — delivering EVM bytecode compatibility, real-time settlement, and institutional payments without forking Geth.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/login">
              <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-sm rounded-full shadow-xl shadow-amber-200/60 hover:shadow-2xl hover:shadow-amber-300/60 transition-all">
                Launch App <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/whitepaper">
              <button className="flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-700 font-semibold text-sm rounded-full shadow-sm hover:shadow-md transition-all">
                Read Whitepaper
              </button>
            </Link>
          </div>

          {/* Compat tools */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-xs text-slate-400 font-semibold mr-1">Works with:</span>
            {COMPAT_TOOLS.map((t) => (
              <div key={t} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-semibold text-slate-600 hover:border-amber-300 hover:text-amber-700 transition-all cursor-default shadow-sm">
                <CheckCircle className="h-3 w-3 text-amber-500" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE STATS BAR ───────────────────────────────────────────────── */}
      {networkStats && (
        <section className="py-8 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 shadow-xl">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Volume", value: `$${((networkStats.totalVolume ?? 0) / 1e9).toFixed(1)}B` },
              { label: "Transactions", value: (networkStats.totalTransactions ?? 0).toLocaleString() },
              { label: "Avg Settlement", value: `${networkStats.avgSettlementMs ?? 0}ms` },
              { label: "Network Uptime", value: `${networkStats.networkUptime ?? 99}%` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white drop-shadow-sm">{s.value}</div>
                <div className="text-[10px] text-white/75 font-semibold mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PARTNER NETWORKS ─────────────────────────────────────────────── */}
      <section className="py-14 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-7">Powering transactions across</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {PARTNERS.map((p) => (
              <div key={p.name} className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-amber-300 hover:bg-amber-50 transition-all cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
                  <span className="text-[7px] font-black text-white">{p.abbr.slice(0, 1)}</span>
                </div>
                <span className="font-semibold text-slate-600 group-hover:text-amber-700 text-sm transition-colors">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEXA CARD (only card) ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-400 rounded-3xl p-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden shadow-2xl shadow-amber-200">
            {/* Decorative glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/25 rounded-full blur-2xl" />

            <div className="relative flex-shrink-0 flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/40 rounded-3xl blur-xl scale-125" />
                <img src={nexaLogo} alt="NEXA" className="relative w-28 h-28 object-contain drop-shadow-2xl" />
              </div>
            </div>

            <div className="relative flex-1 text-center md:text-left">
              <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/60 mb-2">Start Building Today</div>
              <h2 className="font-black text-3xl md:text-4xl text-white mb-4 leading-tight">
                The world's most<br />capable payment blockchain
              </h2>
              <p className="text-white/75 text-sm leading-relaxed mb-7">
                Deploy Solidity contracts, integrate multi-chain wallets, and process payments on the sovereign Layer 1 protocol. Full EVM compatibility. Sub-500ms finality. Zero Geth dependency.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link href="/register">
                  <button className="relative flex items-center gap-2 px-6 py-3.5 bg-white text-amber-600 font-black text-sm rounded-full hover:bg-amber-50 transition-colors shadow-xl shadow-amber-900/20">
                    Create Free Account <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/docs">
                  <button className="flex items-center gap-2 px-6 py-3.5 bg-white/15 border border-white/30 text-white font-bold text-sm rounded-full hover:bg-white/25 transition-colors">
                    View API Docs
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-3">Technology</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Sovereign Layer 1 Architecture</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">Enterprise-grade multi-layer execution system — EVM-equivalent state machine, MPT state storage, and CometBFT BFT consensus working in unison.</p>
          </div>

          <div className="flex flex-col items-center gap-0 max-w-sm mx-auto">
            <div className="flex gap-3 mb-2">
              {["Native Web3 Apps", "External Wallets"].map((n) => (
                <div key={n} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-500">{n}</div>
              ))}
            </div>
            <div className="w-px h-5 bg-gradient-to-b from-slate-200 to-amber-300" />
            {ARCH_STACK.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center w-full">
                <div className={`w-full px-6 py-4 rounded-xl border text-center ${node.highlight ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 shadow-md shadow-amber-100" : node.light ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200"}`}>
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

          <div className="flex flex-wrap justify-center gap-2.5 mt-12">
            {["CometBFT Consensus", "Merkle Patricia Trie", "ABCI 2.0", "EIP-1559", "secp256k1 ECDSA", "BIP39 Wallets", "JSON-RPC 2.0", "Go 1.21", "BadgerDB v4"].map((t) => (
              <span key={t} className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-700 tracking-wide">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS COUNTER ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-3">By The Numbers</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-16">Infrastructure you can count on</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {STATS_DISPLAY.map((s) => (
              <div key={s.label}>
                <div className="text-4xl md:text-5xl font-black text-amber-500 mb-2">{s.value}</div>
                <div className="text-slate-600 font-semibold text-sm">{s.label}</div>
                <div className="text-slate-400 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
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

      {/* ── DISCOVER NEXA — Bottom section with modals ───────────────────── */}
      <section className="py-28 px-6 bg-[#04020c] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(251,191,36,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.9) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-amber-400/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-amber-400/4 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-xl scale-150" />
                <img src={nexaLogo} alt="NEXA" className="relative w-14 h-14 object-contain" />
              </div>
            </div>
            <p className="text-[10px] font-black text-amber-500/80 tracking-[0.5em] mb-3">EXPLORE THE PROTOCOL</p>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Discover NEXA
            </h2>
            <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Everything you need to know about the sovereign payment blockchain — from technical architecture to governance, careers, and compliance. Click any card to open a detailed window.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {DISCOVER.map((section, i) => {
              const colors = COLOR_MAP[section.color] ?? COLOR_MAP.slate;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section)}
                  className={`group text-left bg-white/3 border border-white/8 rounded-2xl p-5 transition-all hover:bg-white/6 hover:shadow-2xl ${colors.card} cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors.icon}`}>
                      <section.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-black text-white/20">#{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-black text-white text-sm mb-1 leading-snug">{section.label}</h3>
                  <p className="text-white/40 text-[11px] leading-relaxed mb-4">{section.tagline}</p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white/25 group-hover:text-amber-400/70 transition-colors">
                    Open window <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-20 pt-12 border-t border-white/8">
            <div className="flex items-center gap-3">
              <img src={nexaLogo} alt="NEXA" className="w-8 h-8 object-contain" />
              <div>
                <div className="text-white font-black text-sm">NEXA Foundation</div>
                <div className="text-white/30 text-[11px]">© 2025 — All rights reserved</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/30 font-semibold">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility", "nexaprotocol.network"].map((l) => (
                <span key={l} className="hover:text-amber-400/70 transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
            <Link href="/login">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-bold text-xs rounded-full transition-colors">
                Launch App <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeSection && <DiscoverModal section={activeSection} onClose={() => setActiveSection(null)} />}
    </div>
  );
}
