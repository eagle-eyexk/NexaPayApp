import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Activity, Zap, Shield, Cpu, TrendingUp, BarChart2,
  ArrowRight, Info
} from "lucide-react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ExplorerStats {
  latestBlockNumber: number;
  currentBaseFeeGwei: number;
  tps: number;
  avgBlockTimeMs: number;
  networkUtilizationPct: number;
  networkHealthScore: number;
  loadGiniCoefficient: number;
  networkEntropy: number;
  feeHistory: { blockNumber: number; baseFeePerGas: number; gasUsedRatio: number; priorityFeePerGas: number }[];
}

interface NodeData {
  nodes: {
    id: string; nodeType: string; region: string;
    capacity: number; currentLoad: number; health: number;
    status: string; transactionsHandled: number;
    loadPct: number; efficiency: number;
  }[];
  analytics: { healthScore: number; loadGini: number; avgUtilization: number; stdDevUtilization: number };
}

// ── Chart components ──────────────────────────────────────────────────────────
function LineChart({ data, color, height = 80 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return <div style={{ height }} className="bg-white/3 rounded-lg animate-pulse" />;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 0.001;
  const W = 600;
  const pts = data
    .map((v, i) => `${((i / (data.length - 1)) * W).toFixed(1)},${(height - ((v - min) / range) * (height - 4)).toFixed(1)}`)
    .join(" ");
  const area = `0,${height} ${pts} ${W},${height}`;
  const id = `lg-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) {
  if (data.length === 0) return <div style={{ height }} className="bg-white/3 rounded-lg animate-pulse" />;
  const max = Math.max(...data) || 1;
  const W = 600;
  const barW = W / data.length - 2;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      {data.map((v, i) => {
        const barH = (v / max) * (height - 4);
        const x = (i / data.length) * W;
        return (
          <rect
            key={i} x={x} y={height - barH} width={Math.max(1, barW)}
            height={barH} fill={color} opacity={0.6 + 0.4 * (v / max)}
            rx={1}
          />
        );
      })}
    </svg>
  );
}

// ── Network Health Gauge ──────────────────────────────────────────────────────
function HealthGauge({ score }: { score: number }) {
  const r = 75;
  const cx = 100, cy = 100;
  const arc = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const startAngle = -210;
  const endAngle = 30;
  const total = endAngle - startAngle;
  const progress = startAngle + total * (score / 100);

  const describeArc = (start: number, end: number) => {
    const s = arc(start), e = arc(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  const color = score > 90 ? "#10b981" : score > 70 ? "#f59e0b" : "#ef4444";
  const label = score > 90 ? "Excellent" : score > 70 ? "Good" : "Degraded";

  return (
    <svg viewBox="0 0 200 130" className="w-full max-w-[220px] mx-auto">
      <path d={describeArc(startAngle, endAngle)} fill="none" stroke="#ffffff0c" strokeWidth="14" strokeLinecap="round" />
      {score > 0 && (
        <path d={describeArc(startAngle, progress)} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
      )}
      <text x="100" y="85" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" fontFamily="Space Grotesk, sans-serif">
        {score.toFixed(0)}
      </text>
      <text x="100" y="102" textAnchor="middle" fill={color} fontSize="9" fontWeight="700" fontFamily="sans-serif">
        {label.toUpperCase()}
      </text>
      <text x="100" y="116" textAnchor="middle" fill="#ffffff30" fontSize="7.5" fontFamily="sans-serif">
        HEALTH SCORE / 100
      </text>
    </svg>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({
  label, value, unit, formula, description, color = "text-amber-400",
}: {
  label: string; value: string; unit?: string; formula?: string; description?: string; color?: string;
}) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/12 transition-colors">
      <div className={`text-xl font-black ${color}`}>
        {value}
        {unit && <span className="text-sm font-semibold text-white/30 ml-1">{unit}</span>}
      </div>
      <div className="text-xs font-bold text-white/60 mt-1">{label}</div>
      {formula && (
        <div className="text-[9px] font-mono text-white/25 mt-1 bg-white/3 px-1.5 py-0.5 rounded">{formula}</div>
      )}
      {description && <div className="text-[9px] text-white/25 mt-1.5 leading-relaxed">{description}</div>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { data: stats } = useQuery<ExplorerStats>({
    queryKey: ["analytics", "stats"],
    queryFn: () => fetch("/api/explorer/stats").then((r) => r.json()),
    refetchInterval: 1500,
  });

  const { data: nodeData } = useQuery<NodeData>({
    queryKey: ["analytics", "nodes"],
    queryFn: () => fetch("/api/nodes").then((r) => r.json()),
    refetchInterval: 5000,
  });

  const feeHistory = (stats?.feeHistory ?? []).reverse();
  const feeSeries = feeHistory.map((f) => f.baseFeePerGas);
  const utilizationSeries = feeHistory.map((f) => f.gasUsedRatio * 100);
  const prioritySeries = feeHistory.map((f) => f.priorityFeePerGas);

  // Compute derived stats
  const feeMin = feeSeries.length ? Math.min(...feeSeries).toFixed(6) : "—";
  const feeMax = feeSeries.length ? Math.max(...feeSeries).toFixed(6) : "—";
  const feeAvg = feeSeries.length ? (feeSeries.reduce((s, v) => s + v, 0) / feeSeries.length).toFixed(6) : "—";

  const nodes = nodeData?.nodes ?? [];
  const nodeAnalytics = nodeData?.analytics;

  return (
    <div className="min-h-screen bg-[#04020c] text-white">
      {/* Header */}
      <div className="relative border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-48 bg-amber-400/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-10 relative">
          <div className="flex items-center gap-3 mb-2">
            <img src={nexaLogo} alt="NEXA" className="w-9 h-9 object-contain" />
            <div>
              <div className="text-[9px] text-amber-400/60 font-black tracking-[0.5em]">NEXA PROTOCOL</div>
              <h1 className="text-2xl font-black text-white">Network Analytics</h1>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </div>
          </div>
          <p className="text-white/30 text-sm max-w-xl mt-2">
            Real-time blockchain metrics computed using EIP-1559 fee algebra, Gini coefficient,
            Shannon entropy, and network health scoring algorithms.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Row 1: Key metrics + Health gauge ──────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            label="Latest Block" value={stats ? `#${stats.latestBlockNumber.toLocaleString()}` : "…"}
            formula="n+1 every 500ms" color="text-amber-400"
          />
          <MetricCard
            label="Live TPS" value={stats ? stats.tps.toFixed(2) : "…"} unit="tx/s"
            formula="Σtx / Δt(20 blks)" color="text-emerald-400"
          />
          <MetricCard
            label="Base Fee" value={stats ? stats.currentBaseFeeGwei.toFixed(4) : "…"} unit="Gwei"
            formula="EIP-1559 Δ±12.5%" color="text-blue-400"
          />
          <MetricCard
            label="Utilisation" value={stats ? `${stats.networkUtilizationPct.toFixed(1)}` : "…"} unit="%"
            formula="gasUsed / gasLimit" color="text-purple-400"
          />
          <MetricCard
            label="Gini Coeff" value={stats ? stats.loadGiniCoefficient.toFixed(4) : "…"}
            formula="Σ|xi-xj| / 2nΣX" color="text-cyan-400"
            description="0 = perfect load equality"
          />
          <MetricCard
            label="Entropy" value={stats ? stats.networkEntropy.toFixed(3) : "…"} unit="bits"
            formula="H = -Σ pᵢ log₂pᵢ" color="text-orange-400"
            description="Higher = more distributed"
          />
        </div>

        {/* ── Row 2: Charts ─────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Health gauge */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="text-[10px] text-white/30 font-black tracking-widest mb-4">COMPOSITE HEALTH SCORE</div>
            <HealthGauge score={stats?.networkHealthScore ?? 0} />
            <div className="text-[10px] text-white/25 text-center mt-4 max-w-[180px]">
              <span className="font-mono">score = health(40%) + balance(30%) + util(30%)</span>
            </div>
          </div>

          {/* Fee market chart */}
          <div className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-400" />
                <div className="text-sm font-black text-white">EIP-1559 Fee Market</div>
              </div>
              <div className="text-[10px] text-white/25">last 50 blocks</div>
            </div>
            <div className="flex gap-4 mb-3 text-[10px]">
              <span className="text-white/30">Min <span className="text-white/60 font-mono">{feeMin}</span></span>
              <span className="text-white/30">Avg <span className="text-white/60 font-mono">{feeAvg}</span></span>
              <span className="text-white/30">Max <span className="text-white/60 font-mono">{feeMax}</span></span>
              <span className="text-white/30 ml-auto">Gwei</span>
            </div>
            <LineChart data={feeSeries} color="#FBBF24" height={90} />
            <div className="mt-3 h-px bg-white/5" />
            <div className="mt-3">
              <div className="text-[10px] text-white/30 mb-1">Gas Utilisation %</div>
              <BarChart data={utilizationSeries} color="#6366f1" height={40} />
            </div>
          </div>
        </div>

        {/* ── Row 3: Priority fee + TPS ────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-emerald-400" />
              <div className="text-sm font-black text-white">Priority Fee (Validator Tip)</div>
            </div>
            <div className="text-2xl font-black text-emerald-400 mb-1">
              {stats ? (stats.feeHistory[0]?.priorityFeePerGas ?? 0).toFixed(4) : "—"}
              <span className="text-sm font-normal text-white/30 ml-1">Gwei</span>
            </div>
            <LineChart data={prioritySeries} color="#10b981" height={70} />
            <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
              Validator tip paid on top of the burned base fee. 
              maxFeePerGas = baseFee × 1.20 + priorityFee
            </p>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="h-4 w-4 text-violet-400" />
              <div className="text-sm font-black text-white">Block Size Distribution</div>
            </div>
            <div className="text-2xl font-black text-violet-400 mb-1">
              {stats ? `${stats.avgBlockTimeMs.toFixed(0)}ms` : "—"}
              <span className="text-sm font-normal text-white/30 ml-1">avg block time</span>
            </div>
            <BarChart
              data={feeHistory.map((f) => f.gasUsedRatio)}
              color="#a855f7"
              height={70}
            />
            <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
              gasUsedRatio per block. Target: 50% (gasLimit/2).
              CometBFT BFT consensus achieves sub-second finality.
            </p>
          </div>
        </div>

        {/* ── Row 4: Mathematical Analysis ─────────────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-black text-white">Mathematical Analysis</h2>
            <div className="text-[10px] text-white/25 ml-2">live computed values</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "EIP-1559 Base Fee Algorithm",
                formula: "f(n+1) = f(n) × (1 + Δgas/gasTarget/8)",
                current: stats ? `${stats.currentBaseFeeGwei.toFixed(6)} Gwei` : "…",
                explanation: "Base fee adjusts by max ±12.5% per block. If gasUsed > gasTarget (15M), fee rises. If gasUsed < gasTarget, fee falls. Ensures long-run equilibrium at 50% block fullness.",
                color: "text-amber-400",
              },
              {
                title: "Network Load Distribution (Gini)",
                formula: "G = Σᵢ Σⱼ |xᵢ - xⱼ| / (2n × ΣX)",
                current: stats ? `${stats.loadGiniCoefficient.toFixed(4)} (${stats.loadGiniCoefficient < 0.2 ? "Well balanced" : stats.loadGiniCoefficient < 0.4 ? "Moderate" : "Uneven"})` : "…",
                explanation: "Gini coefficient measures inequality in validator load. G=0 means perfect equal distribution across all nodes. G=1 means one node handles all traffic. Target: G < 0.25.",
                color: "text-cyan-400",
              },
              {
                title: "Transaction Distribution Entropy",
                formula: "H = -Σ pᵢ × log₂(pᵢ)   bits",
                current: stats ? `${stats.networkEntropy.toFixed(4)} / ${Math.log2(8).toFixed(4)} max` : "…",
                explanation: "Shannon entropy quantifies how evenly transactions are distributed across validator nodes. Max entropy for 8 nodes = 3.0 bits. Higher entropy = more decentralised network.",
                color: "text-orange-400",
              },
              {
                title: "Composite Health Score",
                formula: "H = health(40%) + balance(30%) + util(30%)",
                current: stats ? `${stats.networkHealthScore.toFixed(2)} / 100` : "…",
                explanation: "Composite metric: avg node health weighted 40%, Gini-based load balance 30%, utilisation efficiency 30%. Optimal utilisation is 70-80%. Penalises both over and underuse.",
                color: "text-emerald-400",
              },
              {
                title: "Instantaneous TPS",
                formula: "TPS = Σtxᵢ / (t_last - t_first)   over 20 blocks",
                current: stats ? `${stats.tps.toFixed(4)} tx/s` : "…",
                explanation: "Real-time transactions per second computed from the last 20 blocks. Total transactions divided by elapsed time. CometBFT target: 2 blocks/sec × avg txs/block.",
                color: "text-emerald-400",
              },
              {
                title: "Gas Utilisation",
                formula: "U = gasUsed / gasLimit   target: 50%",
                current: stats ? `${stats.networkUtilizationPct.toFixed(2)}%` : "…",
                explanation: "Average gas used as a fraction of gas limit across the last 10 blocks. EIP-1559 targets 50% utilisation for fee stability. Above 50%: fees rise. Below 50%: fees fall.",
                color: "text-purple-400",
              },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-white/4 border border-white/6 rounded-xl">
                <div className="font-black text-white text-xs mb-1">{item.title}</div>
                <div className={`font-mono text-[9px] ${item.color} bg-white/3 px-2 py-1 rounded mb-2`}>{item.formula}</div>
                <div className={`text-sm font-black ${item.color} mb-2`}>{item.current}</div>
                <div className="text-[10px] text-white/35 leading-relaxed">{item.explanation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Row 5: Validator performance table ───────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-black text-white">Validator Performance</h2>
            {nodeAnalytics && (
              <div className="ml-auto text-[10px] text-white/30">
                Avg utilisation: {nodeAnalytics.avgUtilization.toFixed(1)}% · Gini: {nodeAnalytics.loadGini.toFixed(4)}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/8">
                  {["Node", "Type", "Region", "Load", "Health", "Status", "Txns Handled", "Efficiency"].map((h) => (
                    <th key={h} className="text-left text-[9px] text-white/30 font-black uppercase tracking-wider pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {nodes.map((node) => (
                  <tr key={node.id} className="hover:bg-white/3 transition-colors">
                    <td className="py-2.5 pr-4 font-mono text-amber-400/70 text-[10px]">{node.id}</td>
                    <td className="py-2.5 pr-4 text-white/50">{node.nodeType}</td>
                    <td className="py-2.5 pr-4 text-white/50">{node.region}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${node.loadPct > 85 ? "bg-red-400" : node.loadPct > 65 ? "bg-amber-400" : "bg-emerald-400"}`}
                            style={{ width: `${node.loadPct}%` }}
                          />
                        </div>
                        <span className="text-white/50">{node.loadPct}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-white/60">{(node.health * 100).toFixed(1)}%</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${node.status === "Healthy" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"}`}>
                        {node.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-white/50">{node.transactionsHandled.toLocaleString()}</td>
                    <td className="py-2.5 text-white/50">{((node.efficiency ?? 0) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-white/6 pt-8 pb-4">
          <p className="text-white/25 text-xs mb-4">
            All metrics are computed live using institutional mathematical models.
            No simulated or approximated values.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link href="/explorer">
              <span className="flex items-center gap-1.5 text-sm text-amber-400/70 hover:text-amber-400 transition-colors cursor-pointer font-semibold">
                Block Explorer <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link href="/dashboard">
              <span className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                My Portfolio <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
