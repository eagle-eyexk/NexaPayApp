import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  useGetUserWallets, useGetUserCard, useGetUserTransactions,
  getGetUserWalletsQueryKey, getGetUserCardQueryKey, getGetUserTransactionsQueryKey
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Send, QrCode, ArrowUpRight, ArrowDownLeft, Clock,
  CheckCircle2, XCircle, Wifi, ChevronRight, Wallet, Settings, History
} from "lucide-react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

const CURRENCY_ICONS: Record<string, string> = { BTC: "₿", ETH: "Ξ", SOL: "◎", USDC: "$", NEXA: "N" };
const CURRENCY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  BTC: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ETH: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  SOL: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  USDC: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  NEXA: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
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
  const { data: txs } = useGetUserTransactions({ limit: 6 }, { query: { queryKey: getGetUserTransactionsQueryKey({ limit: 6 }), retry: false } });

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
  }, [user, isLoading]);

  if (!user) return null;

  const nexaWallet = wallets?.find((w) => w.currency === "NEXA");
  const otherWallets = wallets?.filter((w) => w.currency !== "NEXA") ?? [];
  const totalNexaBalance = parseFloat(nexaWallet?.balance ?? "0");

  return (
    <div className="space-y-5 pb-28">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}, {user.fullName.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Your Nexa wallet overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
          <Wifi className="h-3 w-3" /> Live
        </div>
      </div>

      {/* ── NEXA Featured Wallet Card ── */}
      <Link href="/dashboard/nexa">
        <div className="relative overflow-hidden rounded-2xl cursor-pointer group" style={{ background: "linear-gradient(135deg, #0f0a00 0%, #1a1000 40%, #0d0800 100%)" }}>
          {/* Gold grid lines */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.4) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-amber-400/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-600/5 rounded-full blur-2xl" />

          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-amber-400/20 rounded-xl blur-sm" />
                  <img src={nexaLogo} alt="Nexa" className="relative w-10 h-10 object-contain rounded-xl" />
                </div>
                <div>
                  <div className="text-[10px] font-black tracking-[0.3em] text-amber-400/80">NEXA</div>
                  <div className="text-[9px] text-amber-400/40 font-bold tracking-[0.2em] -mt-0.5">CRYPTO WALLET</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] font-bold text-amber-400">secp256k1</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-[10px] text-amber-400/40 font-semibold tracking-widest mb-1">NEXA BALANCE</div>
              <div className="text-4xl font-black text-white">
                {totalNexaBalance.toFixed(4)}
                <span className="text-lg text-amber-400 ml-2 font-bold">NEXA</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] text-amber-400/40 font-bold tracking-widest mb-0.5">WALLET ADDRESS</div>
                <div className="text-xs font-mono text-amber-400/70">
                  {nexaWallet ? `${nexaWallet.address.slice(0, 14)}…${nexaWallet.address.slice(-6)}` : "Generating…"}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400/60 group-hover:text-amber-400 transition-colors">
                <span className="text-xs font-semibold">View Wallet</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* ── Virtual Card ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1b3e] via-[#0a2050] to-[#06152a] border border-primary/20 p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-10 translate-x-10 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-[0.3em] text-primary/80">NEXA</div>
              <div className="text-[9px] text-muted-foreground tracking-widest mt-0.5">VIRTUAL CARD</div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-yellow-400/80" />
              <div className="w-5 h-5 rounded-full bg-orange-400/60 -ml-2" />
            </div>
          </div>
          <div className="w-10 h-7 bg-gradient-to-br from-yellow-300/40 to-yellow-600/20 rounded-md border border-yellow-400/30 flex items-center justify-center">
            <div className="w-7 h-4 border border-yellow-400/40 rounded-sm" />
          </div>
          <div className="font-mono text-sm tracking-[0.25em] text-white/90">
            {card?.cardNumberMasked ?? "**** **** **** ****"}
          </div>
          <div className="flex items-end justify-between">
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
              <div className="text-sm font-bold text-primary">{parseFloat(card?.balance ?? "0").toFixed(2)} <span className="text-xs">{card?.currency ?? "USD"}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Other Wallets ── */}
      <div>
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Multi-Chain Wallets</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {otherWallets.map((w) => {
            const colors = CURRENCY_COLORS[w.currency] ?? { text: "text-foreground", bg: "bg-muted", border: "border-border" };
            return (
              <div key={w.id} className={`flex items-center justify-between bg-card border ${colors.border} rounded-xl px-4 py-3 hover:border-primary/20 transition-colors`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center text-base font-black ${colors.text}`}>
                    {CURRENCY_ICONS[w.currency] ?? w.currency[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{w.currency}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{w.address.slice(0, 8)}…{w.address.slice(-4)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm ${colors.text}`}>{parseFloat(w.balance).toFixed(4)}</div>
                  <div className="text-xs text-muted-foreground">{w.currency}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-base">Recent Transactions</h3>
          <Link href="/dashboard/transactions">
            <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
        {(txs ?? []).length === 0 ? (
          <div className="text-center py-10 text-muted-foreground bg-card border border-border/40 rounded-xl">
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

      {/* ── Bottom Action Bar (fixed) ── */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-around gap-2">
          {[
            { icon: Send, label: "Send", href: "/dashboard/send", color: "text-amber-400" },
            { icon: QrCode, label: "Receive", href: "/dashboard/receive", color: "text-blue-400" },
            { icon: Wallet, label: "NEXA", href: "/dashboard/nexa", color: "text-amber-400" },
            { icon: History, label: "History", href: "/dashboard/transactions", color: "text-purple-400" },
            { icon: Settings, label: "Settings", href: "/dashboard/settings", color: "text-slate-400" },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <div className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted cursor-pointer transition-colors group">
                <action.icon className={`h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[10px] font-semibold text-muted-foreground">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
