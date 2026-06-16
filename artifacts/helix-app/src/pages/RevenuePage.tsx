import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetMerchantTransactions, useGetMerchantStats, getGetMerchantTransactionsQueryKey, getGetMerchantStatsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Filter, TrendingUp, DollarSign } from "lucide-react";

const CURRENCIES = ["All", "USD", "USDC", "ETH", "SOL", "BTC"];

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(d).toLocaleDateString();
}

export default function RevenuePage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [filterCurrency, setFilterCurrency] = useState("All");

  const { data: stats } = useGetMerchantStats({ query: { queryKey: getGetMerchantStatsQueryKey() } });
  const { data: allTxs } = useGetMerchantTransactions({ limit: 100 }, { query: { queryKey: getGetMerchantTransactionsQueryKey({ limit: 100 }) } });

  useEffect(() => {
    if (!isLoading) {
      if (!user) setLocation("/login");
      else if (user.role !== "merchant") setLocation("/dashboard");
    }
  }, [user, isLoading]);

  const txs = (allTxs ?? []).filter((t) => filterCurrency === "All" || t.currency === filterCurrency);
  const totalFiltered = txs.reduce((s, t) => s + parseFloat(t.amount), 0);

  function downloadCSV() {
    const header = "ID,Date,Amount,Currency,Type,Status,Description\n";
    const rows = txs.map((t) => [
      t.id, new Date(t.createdAt).toISOString(), t.amount, t.currency, t.type, t.status, `"${(t.description ?? "").replace(/"/g, '""')}"`
    ].join(",")).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexa-revenue-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Revenue</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Full transaction history & reports</p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-muted border border-border/60 rounded-lg text-sm font-medium hover:border-primary/40 hover:text-primary transition-all"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${parseFloat(stats?.totalRevenue ?? "0").toLocaleString()}`, icon: DollarSign, color: "text-cyan-700", bg: "bg-cyan-50" },
          { label: "Transactions", value: (stats?.totalTransactions ?? 0).toString(), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "This Month", value: `$${parseFloat(stats?.monthRevenue ?? "0").toFixed(2)}`, icon: DollarSign, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Today", value: `$${parseFloat(stats?.todayRevenue ?? "0").toFixed(2)}`, icon: TrendingUp, color: "text-purple-700", bg: "bg-purple-50" },
        ].map((c) => (
          <div key={c.label} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.bg}`}>
                <c.icon className={`h-3.5 w-3.5 ${c.color}`} />
              </div>
            </div>
            <div className={`text-xl font-bold ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filter by currency:</span>
        <div className="flex gap-2 flex-wrap">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCurrency(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCurrency === c ? "bg-primary/15 text-primary border border-primary/40" : "bg-muted text-muted-foreground border border-transparent hover:border-border"}`}
            >
              {c}
            </button>
          ))}
        </div>
        {filterCurrency !== "All" && (
          <span className="text-xs text-muted-foreground ml-2">Filtered total: <strong className="text-emerald-700">{totalFiltered.toFixed(4)} {filterCurrency}</strong></span>
        )}
      </div>

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        {!txs || txs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-3xl mb-3">📈</div>
            <div className="font-medium">No transactions found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-xs text-muted-foreground bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-center font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{tx.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{timeAgo(tx.createdAt)}</td>
                    <td className="px-4 py-3 text-xs max-w-[180px] truncate text-foreground">{tx.description ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{tx.type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-700">+{parseFloat(tx.amount).toFixed(4)} {tx.currency}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${tx.status === "completed" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/40"}`}>{tx.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => window.open(`/api/user/transactions/${tx.id}/receipt`, "_blank")} className="text-xs text-primary hover:text-primary/80 transition-colors underline">PDF</button>
                    </td>
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
