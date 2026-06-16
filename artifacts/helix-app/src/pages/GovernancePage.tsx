import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface GovernanceStats {
  totalProposals: number;
  passed: number;
  defeated: number;
  queued: number;
  executed: number;
  active: number;
  avgParticipation: number;
  quorum: number;
  timelockDelay: string;
  votingPeriod: string;
  proposalThreshold: number;
  uniqueVoters: number;
  treasury: { nexa: number; usdc: number; eth: number };
}

interface Proposal {
  id: string;
  nip: string;
  title: string;
  summary: string;
  body: string;
  category: "Protocol" | "Treasury" | "Technical" | "Ecosystem";
  status: "active" | "passed" | "defeated" | "queued" | "executed";
  proposer: string;
  quorum: number;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  startBlock: number;
  endBlock: number;
  startDate: string;
  endDate: string;
  ipfsHash: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
  passed: "bg-blue-400/15 text-blue-400 border-blue-400/20",
  defeated: "bg-rose-400/15 text-rose-400 border-rose-400/20",
  queued: "bg-amber-400/15 text-amber-400 border-amber-400/20",
  executed: "bg-violet-400/15 text-violet-400 border-violet-400/20",
};

const CAT_COLORS: Record<string, string> = {
  Protocol: "bg-amber-400/10 text-amber-400",
  Treasury: "bg-emerald-400/10 text-emerald-400",
  Technical: "bg-blue-400/10 text-blue-400",
  Ecosystem: "bg-violet-400/10 text-violet-400",
};

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function fmtUsd(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toLocaleString();
}

function VoteBar({ proposal }: { proposal: Proposal }) {
  const total = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  if (total === 0) return null;
  const forPct = (proposal.votesFor / total) * 100;
  const againstPct = (proposal.votesAgainst / total) * 100;
  const abstainPct = (proposal.votesAbstain / total) * 100;
  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-2 gap-0.5">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${forPct}%` }} />
        <div className="h-full bg-rose-500 transition-all" style={{ width: `${againstPct}%` }} />
        <div className="h-full bg-slate-600 transition-all" style={{ width: `${abstainPct}%` }} />
      </div>
      <div className="flex gap-4 text-xs text-slate-500 mt-1.5">
        <span><span className="text-emerald-400 font-bold">{forPct.toFixed(1)}%</span> For</span>
        <span><span className="text-rose-400 font-bold">{againstPct.toFixed(1)}%</span> Against</span>
        <span><span className="text-slate-400 font-bold">{abstainPct.toFixed(1)}%</span> Abstain</span>
        <span className="ml-auto">{fmt(total)} votes cast</span>
      </div>
    </div>
  );
}

function QuorumBar({ proposal }: { proposal: Proposal }) {
  const total = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const pct = Math.min((total / proposal.quorum) * 100, 100);
  const met = total >= proposal.quorum;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full transition-all ${met ? "bg-emerald-400" : "bg-amber-400/60"}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold ${met ? "text-emerald-400" : "text-amber-400"}`}>
        {met ? "✓ Quorum met" : `${pct.toFixed(0)}% of quorum`}
      </span>
    </div>
  );
}

export default function GovernancePage() {
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const qc = useQueryClient();

  const { data: govStats } = useQuery<GovernanceStats>({
    queryKey: ["governance-stats"],
    queryFn: () => fetch("/api/governance/stats").then((r) => r.json()),
    refetchInterval: 15000,
  });

  const { data: proposalsData } = useQuery<{ proposals: Proposal[] }>({
    queryKey: ["governance-proposals"],
    queryFn: () => fetch("/api/governance/proposals").then((r) => r.json()),
    refetchInterval: 10000,
  });

  const voteMutation = useMutation({
    mutationFn: ({ id, vote }: { id: string; vote: "for" | "against" | "abstain" }) =>
      fetch(`/api/governance/proposals/${encodeURIComponent(id)}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote, weight: 1000 + Math.floor(Math.random() * 5000) }),
      }).then((r) => r.json()),
    onSuccess: (data, vars) => {
      setVoted((prev) => new Set([...prev, vars.id]));
      if (selected?.id === vars.id) {
        setSelected((p) => p ? {
          ...p,
          votesFor: data.newTotals.for,
          votesAgainst: data.newTotals.against,
          votesAbstain: data.newTotals.abstain,
        } : null);
      }
      qc.invalidateQueries({ queryKey: ["governance-proposals"] });
    },
  });

  const proposals = proposalsData?.proposals ?? [];
  const filtered = filter === "all" ? proposals : proposals.filter((p) => p.status === filter);

  return (
    <div className="min-h-screen bg-[#07070d] text-white font-[Inter,sans-serif]">
      {/* Hero */}
      <div className="border-b border-amber-400/10 bg-gradient-to-b from-violet-400/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-violet-400 text-xs font-bold tracking-[0.35em]">NEXA DAO</span>
            <span className="w-1 h-1 rounded-full bg-violet-400/40" />
            <span className="text-slate-500 text-xs">Governance</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Protocol Governance</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Decentralized on-chain governance. Token holders vote on protocol upgrades, treasury allocations, and parameter changes via time-locked execution.
          </p>

          {govStats && (
            <div className="flex flex-wrap gap-8 mt-8">
              {[
                { label: "Total Proposals", val: govStats.totalProposals.toString(), color: "text-white" },
                { label: "Passed", val: govStats.passed.toString(), color: "text-blue-400" },
                { label: "Active", val: govStats.active.toString(), color: "text-emerald-400" },
                { label: "Avg Participation", val: `${govStats.avgParticipation}%`, color: "text-amber-400" },
                { label: "Unique Voters", val: govStats.uniqueVoters.toLocaleString(), color: "text-violet-400" },
                { label: "Voting Period", val: govStats.votingPeriod, color: "text-white" },
              ].map((s) => (
                <div key={s.label}>
                  <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — proposal list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {["all", "active", "passed", "queued", "executed", "defeated"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${
                    filter === f
                      ? "bg-amber-400 text-black border-amber-400"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {f} {f !== "all" && `(${proposals.filter((p) => p.status === f).length})`}
                </button>
              ))}
            </div>

            {/* Proposals */}
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className={`bg-white/[0.02] border rounded-xl p-5 cursor-pointer transition-all hover:border-amber-400/30 hover:bg-white/[0.04] ${
                  selected?.id === p.id ? "border-amber-400/50 bg-white/[0.04]" : "border-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-500 text-xs font-mono">{p.nip}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${CAT_COLORS[p.category]}`}>
                      {p.category}
                    </span>
                  </div>
                  <span className="text-slate-600 text-xs whitespace-nowrap">{p.endDate}</span>
                </div>

                <h3 className="text-white font-bold text-sm mb-2 leading-snug">{p.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{p.summary}</p>

                <VoteBar proposal={p} />
                <div className="mt-3">
                  <QuorumBar proposal={p} />
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center text-slate-600 py-12">No proposals found.</div>
            )}
          </div>

          {/* Right — detail / stats */}
          <div className="space-y-4">
            {/* Treasury */}
            {govStats && (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                <div className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-widest">DAO Treasury</div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">NEXA</span>
                    <span className="text-amber-400 font-bold text-sm">{fmt(govStats.treasury.nexa)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">USDC</span>
                    <span className="text-white font-bold text-sm">{fmtUsd(govStats.treasury.usdc)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">ETH</span>
                    <span className="text-blue-400 font-bold text-sm">{govStats.treasury.eth.toLocaleString()} ETH</span>
                  </div>
                </div>
              </div>
            )}

            {/* Parameters */}
            {govStats && (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                <div className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-widest">Parameters</div>
                <div className="space-y-2.5 text-sm">
                  {[
                    { label: "Quorum", val: fmt(govStats.quorum) + " NEXA" },
                    { label: "Proposal Threshold", val: fmt(govStats.proposalThreshold) + " NEXA" },
                    { label: "Voting Period", val: govStats.votingPeriod },
                    { label: "Timelock Delay", val: govStats.timelockDelay },
                  ].map((p) => (
                    <div key={p.label} className="flex justify-between items-center py-1.5 border-b border-white/[0.03] last:border-0">
                      <span className="text-slate-500">{p.label}</span>
                      <span className="text-white font-semibold">{p.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected proposal detail */}
            {selected && (
              <div className="bg-white/[0.02] border border-amber-400/20 rounded-xl p-5">
                <div className="text-amber-400 text-xs font-semibold mb-1 uppercase tracking-widest">{selected.nip}</div>
                <h3 className="text-white font-bold text-sm mb-3 leading-snug">{selected.title}</h3>

                <p className="text-slate-400 text-xs leading-relaxed mb-4">{selected.body.slice(0, 320)}…</p>

                <div className="text-xs text-slate-600 mb-4 space-y-1">
                  <div>Proposer: <span className="font-mono text-slate-400">{selected.proposer.slice(0, 14)}…</span></div>
                  <div>Blocks: <span className="text-slate-300">{selected.startBlock.toLocaleString()} → {selected.endBlock.toLocaleString()}</span></div>
                  <div>IPFS: <span className="font-mono text-slate-400 text-[10px]">{selected.ipfsHash.slice(0, 20)}…</span></div>
                </div>

                {selected.status === "active" && !voted.has(selected.id) && (
                  <div>
                    <div className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Cast Your Vote</div>
                    <div className="flex gap-2">
                      {(["for", "against", "abstain"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={(e) => { e.stopPropagation(); voteMutation.mutate({ id: selected.id, vote: v }); }}
                          disabled={voteMutation.isPending}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border capitalize transition-all
                            ${v === "for" ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-400/10" : ""}
                            ${v === "against" ? "border-rose-500/40 text-rose-400 hover:bg-rose-400/10" : ""}
                            ${v === "abstain" ? "border-slate-500/40 text-slate-400 hover:bg-white/5" : ""}
                            disabled:opacity-50`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {voted.has(selected.id) && (
                  <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-2.5 text-xs text-emerald-400 font-semibold text-center">
                    ✓ Vote recorded on-chain
                  </div>
                )}
              </div>
            )}

            {!selected && (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center text-slate-600 text-sm py-10">
                Select a proposal to view details and vote
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
