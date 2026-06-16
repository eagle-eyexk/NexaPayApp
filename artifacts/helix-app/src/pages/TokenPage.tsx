import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

interface TokenStats {
  maxSupply: number;
  initialSupply: number;
  circulatingSupply: number;
  burned: number;
  price: number;
  marketCap: number;
  fullyDilutedValuation: number;
  staking: {
    totalStaked: number;
    stakingRatio: number;
    apy: number;
    rewardRatePerBlock: number;
    validators: number;
    avgLockPeriod: string;
    slashingEvents: number;
  };
  protocolRevenue: { allTime: number; last30d: number; last7d: number };
  feeDistribution: { stakers: number; treasury: number; burned: number };
}

interface Distribution {
  distribution: {
    category: string;
    allocation: number;
    amount: number;
    color: string;
    vesting: string;
    unlocked: number;
  }[];
  totalAllocated: number;
  circulatingSupply: number;
  lockedSupply: number;
}

interface Vesting {
  schedules: {
    label: string;
    total: number;
    cliff: string;
    duration: string;
    startDate: string;
    cliffDate: string;
    endDate: string;
    claimed: number;
    remaining: number;
    pct: number;
  }[];
  nextUnlockDate: string;
  nextUnlockAmount: number;
}

interface Holders {
  holders: {
    rank: number;
    address: string;
    balance: number;
    pct: number;
    type: string;
  }[];
  totalHolders: number;
}

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function fmtUsd(n: number) {
  if (n >= 1_000_000_000) return "$" + (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toLocaleString();
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -90;
  const cx = 80, cy = 80, r = 60, innerR = 36;

  const slices = data.map((d) => {
    const angle = (d.value / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const ix1 = cx + innerR * Math.cos(toRad(startAngle));
    const iy1 = cy + innerR * Math.sin(toRad(startAngle));
    const ix2 = cx + innerR * Math.cos(toRad(endAngle));
    const iy2 = cy + innerR * Math.sin(toRad(endAngle));
    const large = angle > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`;
    return { ...d, path, angle };
  });

  return (
    <svg viewBox="0 0 160 160" className="w-44 h-44">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity={0.9} />
      ))}
      <circle cx={cx} cy={cy} r={innerR - 2} fill="#0f0f18" />
      <image href={nexaLogo} x={cx - 14} y={cy - 14} width={28} height={28} />
    </svg>
  );
}

export default function TokenPage() {
  const [tab, setTab] = useState<"overview" | "distribution" | "vesting" | "holders">("overview");

  const { data: stats } = useQuery<TokenStats>({
    queryKey: ["token-stats"],
    queryFn: () => fetch("/api/token/stats").then((r) => r.json()),
    refetchInterval: 8000,
  });

  const { data: dist } = useQuery<Distribution>({
    queryKey: ["token-distribution"],
    queryFn: () => fetch("/api/token/distribution").then((r) => r.json()),
    refetchInterval: 30000,
  });

  const { data: vesting } = useQuery<Vesting>({
    queryKey: ["token-vesting"],
    queryFn: () => fetch("/api/token/vesting").then((r) => r.json()),
  });

  const { data: holders } = useQuery<Holders>({
    queryKey: ["token-holders"],
    queryFn: () => fetch("/api/token/holders").then((r) => r.json()),
    refetchInterval: 15000,
  });

  const TABS = ["overview", "distribution", "vesting", "holders"] as const;

  return (
    <div className="min-h-screen bg-[#07070d] text-white font-[Inter,sans-serif]">
      {/* Hero */}
      <div className="border-b border-amber-400/10 bg-gradient-to-b from-amber-400/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-center gap-3 mb-3">
            <img src={nexaLogo} alt="NEXA" className="w-8 h-8 object-contain" />
            <span className="text-amber-400 text-xs font-bold tracking-[0.35em]">NEXA TOKEN</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Token Economics</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            100M fixed supply. EIP-20 compliant governance and utility token powering the Nexa payment network, staking rewards, and DAO voting.
          </p>

          {/* Price bar */}
          {stats && (
            <div className="flex flex-wrap gap-8 mt-8">
              {[
                { label: "Price", value: `$${stats.price.toFixed(4)}`, color: "text-amber-400" },
                { label: "Market Cap", value: fmtUsd(stats.marketCap), color: "text-white" },
                { label: "FDV", value: fmtUsd(stats.fullyDilutedValuation), color: "text-white" },
                { label: "Circulating", value: fmt(stats.circulatingSupply), color: "text-emerald-400" },
                { label: "Staking APY", value: `${stats.staking.apy.toFixed(1)}%`, color: "text-violet-400" },
                { label: "Burned", value: fmt(stats.burned), color: "text-rose-400" },
              ].map((s) => (
                <div key={s.label}>
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1 border-b border-white/5 mt-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 ${
                tab === t ? "border-amber-400 text-amber-400" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && stats && (
          <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Supply breakdown */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-white font-bold text-sm uppercase tracking-widest">Supply Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Max Supply", val: fmt(stats.maxSupply), sub: "Fixed forever", color: "border-amber-400/30" },
                  { label: "Circulating", val: fmt(stats.circulatingSupply), sub: `${((stats.circulatingSupply / stats.maxSupply) * 100).toFixed(1)}% of max`, color: "border-emerald-400/30" },
                  { label: "Total Staked", val: fmt(stats.staking.totalStaked), sub: `${(stats.staking.stakingRatio * 100).toFixed(1)}% of circ.`, color: "border-violet-400/30" },
                  { label: "Burned", val: fmt(stats.burned), sub: "Deflationary", color: "border-rose-400/30" },
                ].map((c) => (
                  <div key={c.label} className={`bg-white/[0.03] border ${c.color} rounded-xl p-4`}>
                    <div className="text-slate-500 text-xs mb-1">{c.label}</div>
                    <div className="text-white font-bold text-lg">{c.val}</div>
                    <div className="text-slate-600 text-xs mt-0.5">{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* Supply bar */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <div className="text-slate-400 text-xs font-semibold mb-3 uppercase tracking-widest">Supply Utilisation</div>
                <div className="relative h-5 rounded-full bg-white/5 overflow-hidden flex">
                  <div className="h-full bg-amber-400/80" style={{ width: `${(stats.circulatingSupply / stats.maxSupply) * 100}%` }} />
                  <div className="h-full bg-violet-500/60" style={{ width: `${(stats.staking.totalStaked / stats.maxSupply) * 100}%` }} />
                  <div className="h-full bg-rose-500/60" style={{ width: `${(stats.burned / stats.maxSupply) * 100}%` }} />
                </div>
                <div className="flex gap-5 mt-3 text-xs text-slate-500">
                  <span><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5" />Circulating</span>
                  <span><span className="inline-block w-2 h-2 rounded-full bg-violet-500 mr-1.5" />Staked</span>
                  <span><span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5" />Burned</span>
                </div>
              </div>

              {/* Staking */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <div className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-widest">Staking Metrics</div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "APY", val: `${stats.staking.apy.toFixed(2)}%`, color: "text-violet-400" },
                    { label: "Validators", val: stats.staking.validators.toString(), color: "text-amber-400" },
                    { label: "Avg Lock", val: stats.staking.avgLockPeriod, color: "text-emerald-400" },
                    { label: "Reward/Block", val: `${stats.staking.rewardRatePerBlock} NEXA`, color: "text-white" },
                    { label: "Slashing Events", val: stats.staking.slashingEvents.toString(), color: "text-rose-400" },
                    { label: "Staking Ratio", val: `${(stats.staking.stakingRatio * 100).toFixed(1)}%`, color: "text-white" },
                  ].map((m) => (
                    <div key={m.label} className="bg-white/[0.03] rounded-lg p-3">
                      <div className="text-slate-500 text-xs">{m.label}</div>
                      <div className={`font-bold text-base mt-0.5 ${m.color}`}>{m.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Protocol Revenue */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <div className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-widest">Protocol Revenue</div>
                {[
                  { label: "All Time", val: fmtUsd(stats.protocolRevenue.allTime) },
                  { label: "Last 30 days", val: fmtUsd(stats.protocolRevenue.last30d) },
                  { label: "Last 7 days", val: fmtUsd(stats.protocolRevenue.last7d) },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-slate-400 text-sm">{r.label}</span>
                    <span className="text-white font-bold text-sm">{r.val}</span>
                  </div>
                ))}
              </div>

              {/* Fee Distribution */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <div className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-widest">Fee Distribution</div>
                {[
                  { label: "xNEXA Stakers", pct: stats.feeDistribution.stakers, color: "bg-violet-500" },
                  { label: "Treasury", pct: stats.feeDistribution.treasury, color: "bg-amber-400" },
                  { label: "Burned", pct: stats.feeDistribution.burned, color: "bg-rose-500" },
                ].map((f) => (
                  <div key={f.label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{f.label}</span>
                      <span className="text-white font-bold">{f.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${f.color}`} style={{ width: `${f.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DISTRIBUTION */}
        {tab === "distribution" && dist && (
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Token Allocation</h2>
                <div className="flex items-center gap-8">
                  <DonutChart
                    data={dist.distribution.map((d) => ({ label: d.category, value: d.allocation, color: d.color }))}
                  />
                  <div className="space-y-2.5">
                    {dist.distribution.map((d) => (
                      <div key={d.category} className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className="text-slate-300 text-sm">{d.category}</span>
                        <span className="text-slate-500 text-sm ml-auto pl-4 font-bold">{d.allocation}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Unlock Progress</h2>
                <div className="space-y-4">
                  {dist.distribution.map((d) => (
                    <div key={d.category} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white text-sm font-semibold">{d.category}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{d.vesting}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 font-bold text-sm">{fmt(d.amount)}</div>
                          <div className="text-slate-500 text-xs">{d.allocation}% of supply</div>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400/70 transition-all" style={{ width: `${d.unlocked * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 mt-1.5">
                        <span>{(d.unlocked * 100).toFixed(0)}% unlocked</span>
                        <span>{fmt(d.amount * d.unlocked)} / {fmt(d.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VESTING */}
        {tab === "vesting" && vesting && (
          <div className="py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-sm uppercase tracking-widest">Vesting Schedules</h2>
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-2 text-xs">
                <span className="text-slate-400">Next unlock: </span>
                <span className="text-amber-400 font-bold">{vesting.nextUnlockDate}</span>
                <span className="text-slate-400 ml-2">— </span>
                <span className="text-white font-bold">{fmt(vesting.nextUnlockAmount)} NEXA</span>
              </div>
            </div>
            <div className="space-y-4">
              {vesting.schedules.map((s) => {
                const progress = s.pct;
                return (
                  <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="text-white font-bold">{s.label}</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {s.duration} total · {s.cliff} cliff
                        </div>
                      </div>
                      <div className="flex gap-6 text-xs">
                        <div><div className="text-slate-500">Total</div><div className="text-white font-bold">{fmt(s.total)} NEXA</div></div>
                        <div><div className="text-slate-500">Claimed</div><div className="text-emerald-400 font-bold">{fmt(s.claimed)} NEXA</div></div>
                        <div><div className="text-slate-500">Remaining</div><div className="text-amber-400 font-bold">{fmt(s.remaining)} NEXA</div></div>
                      </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 mt-2">
                      <span>Start: {s.startDate}</span>
                      <span className="text-amber-400">{progress}% vested</span>
                      <span>End: {s.endDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* HOLDERS */}
        {tab === "holders" && holders && (
          <div className="py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-sm uppercase tracking-widest">Top Holders</h2>
              <div className="text-slate-500 text-xs">{holders.totalHolders.toLocaleString()} total holders</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Rank</th>
                    <th className="text-left px-5 py-3">Address</th>
                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-right px-5 py-3">Balance</th>
                    <th className="text-right px-5 py-3">% Supply</th>
                    <th className="text-left px-5 py-3 hidden md:table-cell">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {holders.holders.map((h) => (
                    <tr key={h.rank} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-amber-400 font-bold">#{h.rank}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-300 text-xs">{h.address.slice(0, 12)}…{h.address.slice(-8)}</td>
                      <td className="px-5 py-3.5">
                        <span className="bg-amber-400/10 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full">{h.type}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-white font-bold">{fmt(h.balance)}</td>
                      <td className="px-5 py-3.5 text-right text-slate-300">{h.pct}%</td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400/60" style={{ width: `${Math.min(h.pct * 5, 100)}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="h-20" />
    </div>
  );
}
