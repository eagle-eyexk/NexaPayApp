import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useGetMerchantStats, useGetMerchantTransactions, getGetMerchantStatsQueryKey, getGetMerchantTransactionsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, DollarSign, Activity, Link2, Plus, CheckCircle2, Clock, XCircle } from "lucide-react";

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${map[status] ?? "bg-muted text-muted-foreground border-border/40"}`}>
      {status === "completed" ? <CheckCircle2 className="h-2.5 w-2.5" /> : status === "failed" ? <XCircle className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
      {status}
    </span>
  );
}

export default function MerchantDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  const { data: stats } = useGetMerchantStats({ query: { queryKey: getGetMerchantStatsQueryKey() } });
  const { data: txs } = useGetMerchantTransactions({ limit: 10 }, { query: { queryKey: getGetMerchantTransactionsQueryKey({ limit: 10 }) } });

  useEffect(() => {
    if (!isLoading) {
      if (!user) setLocation("/login");
      else if (user.role !== "merchant") setLocation("/dashboard");
    }
  }, [user, isLoading]);

  if (!user) return null;

  const statCards = [
    { label: "Total Revenue", value: `$${parseFloat(stats?.totalRevenue ?? "0").toLocaleString()}`, icon: DollarSign, color: "text-cyan-400", glow: "shadow-[0_0_20px_rgba(0,255,255,0.1)]" },
    { label: "Total Transactions", value: stats?.totalTransactions?.toLocaleString() ?? "0", icon: Activity, color: "text-blue-400", glow: "" },
    { label: "Active Links", value: stats?.activeLinks?.toLocaleString() ?? "0", icon: Link2, color: "text-purple-400", glow: "" },
    { label: "Avg. Transaction", value: `$${parseFloat(stats?.avgTransactionValue ?? "0").toFixed(2)}`, icon: TrendingUp, color: "text-emerald-400", glow: "" },
    { label: "Today", value: `$${parseFloat(stats?.todayRevenue ?? "0").toFixed(2)}`, icon: TrendingUp, color: "text-yellow-400", glow: "" },
    { label: "This Month", value: `$${parseFloat(stats?.monthRevenue ?? "0").toLocaleString()}`, icon: DollarSign, color: "text-orange-400", glow: "" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{user.businessName ?? user.fullName}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Merchant Overview</p>
        </div>
        <Link href="/merchant/links">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary text-sm font-semibold transition-all">
            <Plus className="h-4 w-4" /> Create Link
          </button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`bg-card border border-border/40 rounded-xl p-5 ${card.glow}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</span>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base">Recent Payments</h3>
          <Link href="/merchant/revenue">
            <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">View all</span>
          </Link>
        </div>
        {!txs || txs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border/40 rounded-xl">
            <div className="text-3xl mb-3">📊</div>
            <div className="font-medium">No payments yet</div>
            <div className="text-sm mt-1">Create a payment link or use the POS to start accepting payments</div>
            <div className="flex gap-3 justify-center mt-4">
              <Link href="/merchant/pos"><button className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm font-medium">POS Terminal</button></Link>
              <Link href="/merchant/links"><button className="px-4 py-2 bg-muted border border-border/50 rounded-lg text-sm font-medium">Payment Links</button></Link>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border/40 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-xs text-muted-foreground">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{tx.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-xs text-foreground max-w-[180px] truncate">{tx.description ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-400">+{parseFloat(tx.amount).toFixed(2)} {tx.currency}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={tx.status} /></td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">{timeAgo(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
