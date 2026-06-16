import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Cpu, Zap, Activity, Clock, ChevronRight, X, CheckCircle, Shield, Layers, ArrowRight } from "lucide-react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BlockSummary {
  number: number; hash: string; parentHash: string; timestamp: number;
  txCount: number; gasUsed: number; gasLimit: number; gasUsedPct: number;
  baseFeePerGas: number; priorityFeePerGas: number; miner: string; size: number;
  transactionsRoot: string; ageMs: number;
}

interface BlockDetail extends BlockSummary {
  transactions: string[];
  stateRoot: string; receiptsRoot: string; extraData: string; nonce: string;
  burnedFeeGwei: number; validatorRewardGwei: number;
}

interface TxDetail {
  hash: string; blockNumber: number; blockHash: string; timestamp: number;
  transactionIndex: number; gasUsed: number; gasPriceGwei: number;
  baseFeePerGas: number; maxPriorityFeePerGas: number; transactionFeeGwei: number;
  status: string; confirmations: number;
  merkleProof: string[]; merkleRoot: string; merkleVerified: boolean; ageMs: number;
}

interface ExplorerStats {
  latestBlockNumber: number; latestBlockHash: string; currentBaseFeeGwei: number;
  tps: number; avgBlockTimeMs: number; networkUtilizationPct: number;
  networkHealthScore: number; loadGiniCoefficient: number; networkEntropy: number;
  feeHistory: { blockNumber: number; baseFeePerGas: number; gasUsedRatio: number }[];
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function truncate(h: string, n = 8): string {
  return h ? `${h.slice(0, n + 2)}…${h.slice(-6)}` : "";
}
function ageStr(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

// ── Mini fee chart ────────────────────────────────────────────────────────────
function FeeChart({ data }: { data: { baseFeePerGas: number }[] }) {
  if (data.length < 2) return null;
  const vals = data.map((d) => d.baseFeePerGas).reverse();
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 0.001;
  const W = 300, H = 50;
  const pts = vals.map((v, i) =>
    `${((i / (vals.length - 1)) * W).toFixed(1)},${(H - ((v - min) / range) * H).toFixed(1)}`
  ).join(" ");
  const area = `0,${H} ${pts} ${W},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 50 }}>
      <defs>
        <linearGradient id="fee-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#fee-g)" />
      <polyline points={pts} fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ── Block detail modal ────────────────────────────────────────────────────────
function BlockModal({ block, onClose }: { block: BlockDetail; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#04020c] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Layers className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <div className="text-white font-black text-sm">Block #{block.number.toLocaleString()}</div>
              <div className="text-white/40 text-[10px] font-mono">{block.hash}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-5">
          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: "Transactions", v: block.txCount.toString() },
              { l: "Gas Used", v: `${block.gasUsedPct.toFixed(1)}%` },
              { l: "Base Fee", v: `${block.baseFeePerGas.toFixed(4)} Gwei` },
              { l: "Size", v: `${(block.size / 1000).toFixed(1)} KB` },
            ].map((m) => (
              <div key={m.l} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                <div className="text-white font-black text-lg">{m.v}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{m.l}</div>
              </div>
            ))}
          </div>

          {/* Gas utilisation bar */}
          <div>
            <div className="flex justify-between text-[10px] text-white/40 mb-1">
              <span>Gas Utilisation</span>
              <span>{block.gasUsed.toLocaleString()} / {block.gasLimit.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${block.gasUsedPct}%` }}
              />
            </div>
          </div>

          {/* Fee breakdown */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Burned Fees", v: `${block.burnedFeeGwei.toFixed(0)} Gwei`, c: "text-red-400" },
              { l: "Validator Reward", v: `${block.validatorRewardGwei.toFixed(0)} Gwei`, c: "text-emerald-400" },
              { l: "Priority Fee", v: `${block.priorityFeePerGas.toFixed(4)} Gwei`, c: "text-amber-400" },
            ].map((m) => (
              <div key={m.l} className="bg-white/4 border border-white/8 rounded-xl p-3">
                <div className={`font-black text-sm ${m.c}`}>{m.v}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{m.l}</div>
              </div>
            ))}
          </div>

          {/* Header hashes */}
          <div className="space-y-2">
            {[
              { l: "Block Hash", v: block.hash },
              { l: "Parent Hash", v: block.parentHash },
              { l: "Transactions Root (Merkle)", v: block.transactionsRoot },
              { l: "State Root", v: block.stateRoot },
              { l: "Receipts Root", v: block.receiptsRoot },
              { l: "Validator", v: block.miner },
            ].map((h) => (
              <div key={h.l} className="flex gap-3 p-3 bg-white/4 border border-white/8 rounded-xl">
                <div className="text-[10px] text-white/30 font-bold shrink-0 w-44">{h.l}</div>
                <div className="text-[10px] text-white/60 font-mono break-all">{h.v}</div>
              </div>
            ))}
          </div>

          {/* Transaction list */}
          <div>
            <div className="text-[10px] text-white/30 font-black tracking-widest mb-2">
              TRANSACTIONS ({block.transactions.length})
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {block.transactions.map((tx, i) => (
                <div key={tx} className="flex items-center gap-2 px-3 py-2 bg-white/3 rounded-lg text-[10px] font-mono">
                  <span className="text-white/20 w-5">{i}</span>
                  <span className="text-amber-400/70">{tx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tx detail modal ───────────────────────────────────────────────────────────
function TxModal({ tx, onClose }: { tx: TxDetail; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#04020c] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.status === "success" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
              {tx.status === "success" ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-red-400" />}
            </div>
            <div>
              <div className="text-white font-black text-sm">Transaction</div>
              <div className="text-white/40 text-[10px] font-mono">{truncate(tx.hash, 20)}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Block", v: `#${tx.blockNumber.toLocaleString()}` },
              { l: "Confirmations", v: tx.confirmations.toString() },
              { l: "Gas Used", v: tx.gasUsed.toLocaleString() },
              { l: "Total Fee", v: `${tx.transactionFeeGwei.toFixed(2)} Gwei` },
            ].map((m) => (
              <div key={m.l} className="bg-white/5 border border-white/8 rounded-xl p-3">
                <div className="text-white font-black text-base">{m.v}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{m.l}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {[
              { l: "Transaction Hash", v: tx.hash },
              { l: "Block Hash", v: tx.blockHash },
              { l: "Merkle Root", v: tx.merkleRoot },
            ].map((h) => (
              <div key={h.l} className="flex gap-3 p-3 bg-white/4 border border-white/8 rounded-xl">
                <div className="text-[10px] text-white/30 font-bold shrink-0 w-36">{h.l}</div>
                <div className="text-[10px] text-emerald-400/80 font-mono break-all">{h.v}</div>
              </div>
            ))}
          </div>

          {/* Fee breakdown */}
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <div className="text-[10px] text-amber-400 font-black tracking-widest mb-3">EIP-1559 FEE BREAKDOWN</div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-white/30">Base Fee</div>
                <div className="text-white font-bold">{tx.baseFeePerGas.toFixed(4)} Gwei</div>
                <div className="text-white/20 text-[9px]">burned by protocol</div>
              </div>
              <div>
                <div className="text-white/30">Priority Fee</div>
                <div className="text-white font-bold">{tx.maxPriorityFeePerGas.toFixed(4)} Gwei</div>
                <div className="text-white/20 text-[9px]">validator tip</div>
              </div>
              <div>
                <div className="text-white/30">Total Fee</div>
                <div className="text-amber-400 font-bold">{tx.transactionFeeGwei.toFixed(2)} Gwei</div>
                <div className="text-white/20 text-[9px]">paid by sender</div>
              </div>
            </div>
          </div>

          {/* Merkle proof */}
          <div className="p-4 bg-white/3 border border-white/8 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-emerald-400" />
              <div className="text-[10px] text-white/40 font-black tracking-widest">MERKLE INCLUSION PROOF</div>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ml-auto ${tx.merkleVerified ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>
                {tx.merkleVerified ? "✓ VERIFIED" : "✗ INVALID"}
              </span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {tx.merkleProof.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-white/20 w-4">{i}</span>
                  <span className="text-white/40">{p}</span>
                </div>
              ))}
              {tx.merkleProof.length === 0 && (
                <div className="text-white/30 text-[11px]">Genesis transaction — no proof path needed.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ExplorerPage() {
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<BlockDetail | null>(null);
  const [selectedTx, setSelectedTx] = useState<TxDetail | null>(null);
  const [loadingTx, setLoadingTx] = useState<string | null>(null);
  const [loadingBlock, setLoadingBlock] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const { data: blocks = [] } = useQuery<BlockSummary[]>({
    queryKey: ["explorer", "blocks"],
    queryFn: () => fetch("/api/explorer/blocks?count=20").then((r) => r.json()),
    refetchInterval: 600,
  });

  const { data: stats } = useQuery<ExplorerStats>({
    queryKey: ["explorer", "stats"],
    queryFn: () => fetch("/api/explorer/stats").then((r) => r.json()),
    refetchInterval: 1000,
  });

  const openBlock = async (number: number) => {
    setLoadingBlock(number);
    try {
      const res = await fetch(`/api/explorer/block/${number}`);
      const data = await res.json();
      setSelectedBlock(data);
    } finally {
      setLoadingBlock(null);
    }
  };

  const openTx = async (hash: string) => {
    setLoadingTx(hash);
    try {
      const res = await fetch(`/api/explorer/tx/${encodeURIComponent(hash)}`);
      if (!res.ok) return;
      const data = await res.json();
      setSelectedTx(data);
    } finally {
      setLoadingTx(null);
    }
  };

  const filteredBlocks = blocks.filter(
    (b) =>
      !search ||
      b.number.toString().includes(search) ||
      b.hash.toLowerCase().includes(search.toLowerCase()) ||
      b.miner.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#04020c] text-white">
      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div className="relative border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-amber-400/4 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <div className="flex items-center gap-3 mb-6">
            <img src={nexaLogo} alt="NEXA" className="w-10 h-10 object-contain" />
            <div>
              <div className="text-[10px] text-amber-400/60 font-black tracking-[0.5em]">NEXA BLOCKCHAIN</div>
              <h1 className="text-2xl font-black text-white leading-none">Block Explorer</h1>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by block number, hash, or validator address…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40 transition-colors"
            />
          </div>

          {/* Live stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { icon: Layers, label: "Latest Block", value: stats ? `#${stats.latestBlockNumber.toLocaleString()}` : "…", color: "text-amber-400" },
              { icon: Zap, label: "TPS", value: stats ? `${stats.tps.toFixed(1)}` : "…", color: "text-emerald-400" },
              { icon: Activity, label: "Base Fee", value: stats ? `${stats.currentBaseFeeGwei.toFixed(4)} Gwei` : "…", color: "text-blue-400" },
              { icon: Cpu, label: "Network Health", value: stats ? `${stats.networkHealthScore.toFixed(0)}/100` : "…", color: "text-violet-400" },
              { icon: Clock, label: "Block Time", value: stats ? `${stats.avgBlockTimeMs.toFixed(0)}ms` : "…", color: "text-orange-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <div>
                  <div className={`text-sm font-black ${s.color}`}>{s.value}</div>
                  <div className="text-[9px] text-white/30 font-semibold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Latest Blocks ─────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-white">Latest Blocks</h2>
              {stats && (
                <div className="text-[10px] text-white/30">
                  {stats.networkUtilizationPct.toFixed(1)}% avg utilisation
                </div>
              )}
            </div>

            <div className="space-y-2">
              {filteredBlocks.map((block) => (
                <div
                  key={block.number}
                  onClick={() => openBlock(block.number)}
                  className="group flex items-center gap-4 p-4 bg-white/3 border border-white/6 rounded-xl hover:bg-white/6 hover:border-amber-500/20 transition-all cursor-pointer"
                >
                  {/* Block number */}
                  <div className="text-center shrink-0 w-16">
                    <div className="text-amber-400 font-black text-sm">{block.number.toLocaleString()}</div>
                    <div className="text-[9px] text-white/25 mt-0.5">{ageStr(block.ageMs)}</div>
                  </div>

                  {/* Hash + miner */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-mono text-white/60 truncate">{truncate(block.hash, 16)}</div>
                    <div className="text-[9px] text-white/25 mt-0.5 truncate">{block.miner}</div>
                  </div>

                  {/* Gas bar */}
                  <div className="w-20 shrink-0">
                    <div className="flex justify-between text-[9px] text-white/30 mb-1">
                      <span>{block.txCount} txs</span>
                      <span>{block.gasUsedPct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${block.gasUsedPct > 80 ? "bg-red-400" : block.gasUsedPct > 50 ? "bg-amber-400" : "bg-emerald-400"}`}
                        style={{ width: `${block.gasUsedPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="text-right shrink-0 w-20">
                    <div className="text-[11px] font-mono text-white/50">{block.baseFeePerGas.toFixed(4)}</div>
                    <div className="text-[9px] text-white/25">Gwei</div>
                  </div>

                  {loadingBlock === block.number ? (
                    <div className="w-4 h-4 border border-amber-400/40 border-t-amber-400 rounded-full animate-spin shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-amber-400/60 transition-colors shrink-0" />
                  )}
                </div>
              ))}

              {filteredBlocks.length === 0 && (
                <div className="text-center py-12 text-white/25 text-sm">No blocks match your search.</div>
              )}
            </div>
          </div>

          {/* ── Fee market + tx explorer ──────────────────────── */}
          <div className="space-y-6">
            {/* Fee market chart */}
            <div className="bg-white/3 border border-white/8 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-black text-white">EIP-1559 Fee Market</div>
                <div className="text-[9px] text-white/30">last 50 blocks</div>
              </div>
              <div className="text-2xl font-black text-amber-400 mb-1">
                {stats?.currentBaseFeeGwei.toFixed(4)} <span className="text-sm font-semibold text-white/40">Gwei</span>
              </div>
              <FeeChart data={stats?.feeHistory ?? []} />
              <div className="text-[9px] text-white/25 mt-2">
                Base fee adjusts ±12.5% per block via EIP-1559 algorithm.
                Blocks above 50% target → fee increases. Below → fee decreases.
              </div>
            </div>

            {/* Network metrics */}
            <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3">
              <div className="text-xs font-black text-white mb-2">Network Metrics</div>
              {stats && [
                { l: "Gini Coefficient", v: stats.loadGiniCoefficient.toFixed(4), hint: "0=equal 1=uneven", c: "text-blue-400" },
                { l: "Shannon Entropy", v: `${stats.networkEntropy.toFixed(4)} bits`, hint: "higher = more distributed", c: "text-purple-400" },
                { l: "Utilisation", v: `${stats.networkUtilizationPct.toFixed(1)}%`, hint: "avg gas per block", c: "text-emerald-400" },
                { l: "Avg Block Time", v: `${stats.avgBlockTimeMs.toFixed(0)}ms`, hint: "target: 500ms", c: "text-amber-400" },
              ].map((m) => (
                <div key={m.l} className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-white/50">{m.l}</div>
                    <div className="text-[9px] text-white/20">{m.hint}</div>
                  </div>
                  <div className={`text-sm font-black ${m.c}`}>{m.v}</div>
                </div>
              ))}
            </div>

            {/* Quick tx search */}
            <div className="bg-white/3 border border-white/8 rounded-xl p-4">
              <div className="text-xs font-black text-white mb-3">Lookup Transaction</div>
              <p className="text-[10px] text-white/30 mb-3">
                Click any transaction hash in a block detail view to see its full details, including Merkle inclusion proof.
              </p>
              {blocks[0]?.transactionsRoot && (
                <div>
                  <div className="text-[9px] text-white/20 mb-1">Latest Merkle Root</div>
                  <div className="text-[10px] font-mono text-amber-400/60 break-all">
                    {blocks[0]?.transactionsRoot}
                  </div>
                </div>
              )}
            </div>

            {/* Chain ID */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
              <div className="text-[10px] text-amber-400/60 font-black tracking-widest mb-2">NETWORK INFO</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-white/40">Chain ID</span><span className="text-white font-mono font-bold">1248</span></div>
                <div className="flex justify-between"><span className="text-white/40">Consensus</span><span className="text-white font-bold">CometBFT</span></div>
                <div className="flex justify-between"><span className="text-white/40">Algorithm</span><span className="text-white font-bold">keccak-256</span></div>
                <div className="flex justify-between"><span className="text-white/40">Fee Model</span><span className="text-white font-bold">EIP-1559</span></div>
                <div className="flex justify-between"><span className="text-white/40">Finality</span><span className="text-emerald-400 font-bold">Instant</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center border-t border-white/6 pt-8">
          <p className="text-white/30 text-xs mb-4">
            Every block hash is computed using keccak-256. Every transaction is Merkle-anchored.
            Every base fee change follows the exact EIP-1559 specification.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/analytics"><span className="flex items-center gap-1.5 text-sm text-amber-400/70 hover:text-amber-400 transition-colors cursor-pointer font-semibold">
              Network Analytics <ArrowRight className="h-3.5 w-3.5" />
            </span></Link>
            <Link href="/docs"><span className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors cursor-pointer">
              API Reference <ArrowRight className="h-3.5 w-3.5" />
            </span></Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedBlock && <BlockModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />}
      {selectedTx && <TxModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  );
}
