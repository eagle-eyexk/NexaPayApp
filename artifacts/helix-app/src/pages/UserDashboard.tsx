import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetUserWallets, useGetUserCard, useGetUserTransactions, getGetUserWalletsQueryKey, getGetUserCardQueryKey, getGetUserTransactionsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Send, QrCode, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Wifi } from "lucide-react";
import { Link } from "wouter";

const CURRENCY_ICONS: Record<string, string> = { BTC: "₿", ETH: "Ξ", SOL: "◎", USDC: "$", USD: "$" };
const CURRENCY_COLORS: Record<string, string> = {
  BTC: "text-orange-400", ETH: "text-indigo-400", SOL: "text-purple-400", USDC: "text-emerald-400", USD: "text-cyan-400",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
  if (status === "failed") return <XCircle className="h-3.5 w-3.5 text-red-400" />;
  return <Clock className="h-3.5 w-3.5 text-yellow-400" />;
}

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  const { data: wallets } = useGetUserWallets({ query: { queryKey: getGetUserWalletsQueryKey() } });
  const { data: card } = useGetUserCard({ query: { queryKey: getGetUserCardQueryKey() } });
  const { data: txs } = useGetUserTransactions({ limit: 8 }, { query: { queryKey: getGetUserTransactionsQueryKey({ limit: 8 }), retry: false } });

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
  }, [user, isLoading]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user.fullName.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Your wallet at a glance</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
          <Wifi className="h-3 w-3" /> Live
        </div>
      </div>

      {/* Digital Card + Wallets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1b3e] via-[#0a2a50] to-[#061528] border border-primary/20 shadow-[0_0_40px_rgba(0,255,255,0.1)] p-6 min-h-[200px]">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full translate-y-8 -translate-x-8 blur-2xl" />

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-[10px] font-bold tracking-[0.3em] text-primary/80">HELIX PROTOCOL</div>
                <div className="text-[9px] text-muted-foreground tracking-widest mt-0.5">VIRTUAL CARD</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-yellow-400/80" />
                <div className="w-5 h-5 rounded-full bg-orange-400/60 -ml-2" />
              </div>
            </div>

            {/* Chip */}
            <div className="w-10 h-7 bg-gradient-to-br from-yellow-300/40 to-yellow-600/20 rounded-md border border-yellow-400/30 mb-4 flex items-center justify-center">
              <div className="w-7 h-4 border border-yellow-400/40 rounded-sm" />
            </div>

            <div className="font-mono text-sm tracking-[0.25em] text-white/90 mb-4">
              {card?.cardNumberMasked ?? "**** **** **** ****"}
            </div>

            <div className="flex items-end justify-between mt-auto">
              <div>
                <div className="text-[9px] text-muted-foreground mb-0.5">CARD HOLDER</div>
                <div className="text-xs font-medium text-white tracking-wide">{card?.cardholderName ?? user.fullName.toUpperCase()}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-muted-foreground mb-0.5">EXPIRES</div>
                <div className="text-xs font-medium text-white">
                  {card ? `${String(card.expiryMonth).padStart(2, "0")}/${String(card.expiryYear).slice(-2)}` : "--/--"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-muted-foreground mb-0.5">BALANCE</div>
                <div className="text-sm font-bold text-primary">{card?.balance ?? "0.00"} <span className="text-xs">{card?.currency ?? "USD"}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallets */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">My Wallets</div>
          <div className="space-y-2.5">
            {(wallets ?? []).map((w) => (
              <div key={w.id} className="flex items-center justify-between bg-card border border-border/40 rounded-xl px-4 py-3 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg font-bold ${CURRENCY_COLORS[w.currency] ?? "text-foreground"}`}>
                    {CURRENCY_ICONS[w.currency] ?? w.currency[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{w.currency}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{w.address.slice(0, 8)}…{w.address.slice(-4)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm ${CURRENCY_COLORS[w.currency] ?? ""}`}>{parseFloat(w.balance).toFixed(4)}</div>
                  <div className="text-xs text-muted-foreground">{w.currency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Send", icon: Send, href: "/dashboard/send", color: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60 text-primary" },
          { label: "Receive / QR", icon: QrCode, href: "/dashboard/receive", color: "from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-500/60 text-blue-400" },
          { label: "Top Up", icon: ArrowDownLeft, href: "#", color: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400" },
          { label: "Card Settings", icon: ArrowUpRight, href: "#", color: "from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40 text-purple-400" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <div className={`flex flex-col items-center justify-center gap-2 py-5 rounded-xl border bg-gradient-to-b ${action.color} cursor-pointer transition-all hover:shadow-lg`}>
              <action.icon className="h-5 w-5" />
              <span className="text-xs font-semibold">{action.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base">Recent Transactions</h3>
          <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">View all</span>
        </div>
        {(txs ?? []).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border/40 rounded-xl">
            <div className="text-3xl mb-3">💸</div>
            <div className="font-medium">No transactions yet</div>
            <div className="text-sm mt-1">Send or receive funds to get started</div>
          </div>
        ) : (
          <div className="space-y-2">
            {(txs ?? []).map((tx) => {
              const isOutgoing = tx.senderId === user.id;
              return (
                <div key={tx.id} className="flex items-center justify-between bg-card border border-border/40 rounded-xl px-4 py-3 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isOutgoing ? "bg-red-500/10 border border-red-500/20" : "bg-emerald-500/10 border border-emerald-500/20"}`}>
                      {isOutgoing ? <ArrowUpRight className="h-4 w-4 text-red-400" /> : <ArrowDownLeft className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm capitalize">{tx.type.replace(/_/g, " ")}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <StatusIcon status={tx.status} />
                        <span className="capitalize">{tx.status}</span>
                        <span>·</span>
                        <span>{timeAgo(tx.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold text-sm ${isOutgoing ? "text-red-400" : "text-emerald-400"}`}>
                    {isOutgoing ? "-" : "+"}{parseFloat(tx.amount).toFixed(4)} {tx.currency}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
