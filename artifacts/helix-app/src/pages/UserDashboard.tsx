import { useEffect, useMemo } from "react";
import { useLocation, Link } from "wouter";
import {
  useGetUserWallets, useGetUserCard, useGetUserTransactions,
  getGetUserWalletsQueryKey, getGetUserCardQueryKey, getGetUserTransactionsQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Send, QrCode, ArrowUpRight, ArrowDownLeft, Clock,
  CheckCircle2, XCircle, Wifi, TrendingUp, TrendingDown,
  CreditCard, Zap, Plus, Settings, Eye, EyeOff,
} from "lucide-react";
import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import CoinLogo, { COIN_PRICES, COIN_SPARKLINES } from "@/components/CoinLogo";

const DONUT_COLORS = ["#6366F1", "#8B5CF6", "#06B6D4", "#22C55E", "#F59E0B", "#EF4444"];

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
  if (status === "completed") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
  if (status === "failed") return <XCircle className="h-3.5 w-3.5 text-red-500" />;
  return <Clock className="h-3.5 w-3.5 text-amber-500" />;
}

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    v: ((v - min) / range) * 28,
    i,
  }));
  const path = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${(p.i / (data.length - 1)) * 60} ${28 - p.v}`)
    .join(" ");
  return (
    <svg width={60} height={30} viewBox="0 0 60 30">
      <path d={path} fill="none" stroke={up ? "#22C55E" : "#EF4444"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalletCard({ w, rank }: { w: any; rank: number }) {
  const price = COIN_PRICES[w.currency] ?? 1;
  const sparkData = COIN_SPARKLINES[w.currency] ?? [1, 1, 1, 1, 1, 1, 1];
  const balance = parseFloat(w.balance);
  const usdValue = balance * price;
  const startPrice = sparkData[0];
  const endPrice = sparkData[sparkData.length - 1];
  const pct = ((endPrice - startPrice) / startPrice) * 100;
  const up = pct >= 0;

  return (
    <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-5 py-4 hover:shadow-md hover:border-indigo-100 transition-all group">
      <div className="flex items-center gap-4">
        <div className="relative">
          <CoinLogo currency={w.currency} size={44} />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-100 border border-white rounded-full flex items-center justify-center text-[9px] font-bold text-slate-500">
            #{rank}
          </div>
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm">{w.currency}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{w.address.slice(0, 6)}…{w.address.slice(-4)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            1 {w.currency} = ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Sparkline data={sparkData} up={up} />
        <div className="text-right min-w-[90px]">
          <div className="font-bold text-slate-900 text-sm">{balance.toFixed(balance > 100 ? 2 : 6)}</div>
          <div className="text-xs text-slate-500">${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 mt-0.5 ${up ? "text-emerald-600" : "text-red-500"}`}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {up ? "+" : ""}{pct.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function buildWeekChart(txs: any[]) {
  const now = new Date();
  return WEEK_DAYS.map((day, i) => {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - (6 - i));
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    const vol = (txs ?? [])
      .filter((t) => {
        const d = new Date(t.createdAt);
        return d >= dayStart && d <= dayEnd;
      })
      .reduce((s, t) => s + parseFloat(t.amount), 0);
    return { day, vol: parseFloat(vol.toFixed(2)) || 0 };
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <div className="font-bold text-slate-700">{label}</div>
        <div className="text-indigo-600 font-semibold">${payload[0].value.toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [hideBalance, setHideBalance] = useState(false);

  const { data: wallets } = useGetUserWallets({ query: { queryKey: getGetUserWalletsQueryKey() } });
  const { data: card } = useGetUserCard({ query: { queryKey: getGetUserCardQueryKey() } });
  const { data: txs } = useGetUserTransactions({ limit: 30 }, { query: { queryKey: getGetUserTransactionsQueryKey({ limit: 30 }), retry: false } });

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
  }, [user, isLoading]);

  const totalUSD = useMemo(() => {
    return (wallets ?? []).reduce((sum, w) => {
      const price = COIN_PRICES[w.currency] ?? 1;
      return sum + parseFloat(w.balance) * price;
    }, 0);
  }, [wallets]);

  const donutData = useMemo(() => {
    return (wallets ?? [])
      .map((w) => {
        const price = COIN_PRICES[w.currency] ?? 1;
        const val = parseFloat(w.balance) * price;
        return { name: w.currency, value: parseFloat(val.toFixed(2)) };
      })
      .filter((d) => d.value > 0);
  }, [wallets]);

  const weekChart = useMemo(() => buildWeekChart(txs ?? []), [txs]);
  const recentTxs = (txs ?? []).slice(0, 8);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (!user) return null;

  return (
    <div className="space-y-6">

      {/* ── TOP GREETING + STATS ─────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-7 text-white shadow-xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-20 -translate-x-20" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">Live</span>
            </div>
            <h1 className="text-2xl font-black mb-1">
              {greeting}, {user.fullName.split(" ")[0]}
            </h1>
            <p className="text-indigo-200 text-sm">Your portfolio at a glance · Nexa Wallet</p>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="text-indigo-200 text-xs font-medium uppercase tracking-wider">Total Balance</span>
              <button onClick={() => setHideBalance((h) => !h)} className="text-indigo-300 hover:text-white transition-colors">
                {hideBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="text-4xl font-black tracking-tight">
              {hideBalance ? "••••••" : `$${totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <div className="flex items-center justify-end gap-1 mt-1 text-emerald-300 text-sm font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+2.41% (24h)</span>
            </div>
          </div>
        </div>

        {/* Quick actions inside banner */}
        <div className="relative z-10 flex gap-3 mt-6">
          {[
            { label: "Send", icon: Send, href: "/dashboard/send" },
            { label: "Receive", icon: QrCode, href: "/dashboard/receive" },
            { label: "Top Up", icon: Plus, href: "#" },
            { label: "Card", icon: CreditCard, href: "#" },
          ].map((a) => (
            <Link key={a.label} href={a.href}>
              <button className="flex flex-col items-center gap-1.5 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white text-xs font-semibold backdrop-blur transition-all">
                <a.icon className="h-4 w-4" />
                {a.label}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* ── DIGITAL CARD + DONUT ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* PREMIUM DIGITAL CARD */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-3xl shadow-2xl min-h-[210px]"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0c1a3a 80%, #061528 100%)" }}>

          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-60px] right-[-60px] w-56 h-56 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)" }} />
            <div className="absolute bottom-[-40px] left-[-40px] w-44 h-44 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }} />
            {/* Subtle grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="card-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#card-grid)" />
            </svg>
          </div>

          <div className="relative z-10 p-7 h-full flex flex-col">
            {/* Top row */}
            <div className="flex items-start justify-between mb-7">
              <div>
                <div className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">NEXA</div>
                <div className="text-[9px] font-medium tracking-[0.2em] text-white/30 mt-0.5 uppercase">Virtual Card</div>
              </div>
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full" style={{ background: "radial-gradient(circle, #FCD34D, #F97316)" }} />
                <div className="w-7 h-7 rounded-full -ml-3 opacity-80" style={{ background: "radial-gradient(circle, #FB923C, #EF4444)" }} />
              </div>
            </div>

            {/* EMV Chip */}
            <div className="mb-5">
              <div className="w-11 h-8 rounded-md border border-yellow-500/30 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #78716C 0%, #D6C89A 40%, #A09060 100%)" }}>
                <div className="w-8 h-5 rounded-sm border border-yellow-700/40 grid grid-cols-3 gap-px p-0.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-[1px]" style={{ background: "rgba(180,140,60,0.4)" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card number */}
            <div className="font-mono text-[15px] tracking-[0.28em] text-white/90 mb-5 flex gap-3">
              {["•••• ••••", "••••", card?.cardNumberMasked?.slice(-4) ?? "4721"].map((g, i) => (
                <span key={i} className={i === 2 ? "text-white" : "text-white/50"}>{g}</span>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between mt-auto">
              <div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Card Holder</div>
                <div className="text-sm font-bold text-white tracking-wide">{card?.cardholderName ?? user.fullName.toUpperCase()}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Expires</div>
                <div className="text-sm font-bold text-white">
                  {card ? `${String(card.expiryMonth).padStart(2, "0")}/${String(card.expiryYear).slice(-2)}` : "12/28"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Balance</div>
                <div className="text-xl font-black text-indigo-300">
                  {hideBalance ? "••••" : `${card?.balance ?? "0.00"}`}
                  <span className="text-sm ml-1 text-indigo-400/70">{card?.currency ?? "USD"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom glow strip */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-cyan-500 to-purple-600 opacity-60" />
        </div>

        {/* PORTFOLIO DONUT */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Portfolio</div>
              <div className="font-black text-slate-900 text-lg mt-0.5">Allocation</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Net Worth</div>
              <div className="font-black text-indigo-700 text-base">
                {hideBalance ? "••••" : `$${totalUSD.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              </div>
            </div>
          </div>

          {donutData.length > 0 ? (
            <>
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                      paddingAngle={3} dataKey="value" stroke="none">
                      {donutData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Value"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-3">
                {donutData.slice(0, 5).map((d, i) => {
                  const pct = totalUSD > 0 ? (d.value / totalUSD) * 100 : 0;
                  return (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        <span className="font-semibold text-slate-700">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        </div>
                        <span className="text-slate-500 w-10 text-right">{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">No assets yet</div>
          )}
        </div>
      </div>

      {/* ── CURRENCY WALLETS ─────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Assets</div>
            <h3 className="font-black text-slate-900 text-lg">My Wallets</h3>
          </div>
          <Link href="/dashboard/receive">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-full border border-indigo-200 transition-all">
              <Plus className="h-3.5 w-3.5" /> Add Asset
            </button>
          </Link>
        </div>
        <div className="space-y-2.5">
          {(wallets ?? []).length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 text-sm">No wallets found</div>
          ) : (
            (wallets ?? []).map((w, i) => <WalletCard key={w.id} w={w} rank={i + 1} />)
          )}
        </div>
      </div>

      {/* ── 7-DAY ACTIVITY CHART ─────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Analytics</div>
            <h3 className="font-black text-slate-900 text-lg">7-Day Activity</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span>Transaction Volume (USD)</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekChart} barSize={28}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)", radius: 8 }} />
            <Bar dataKey="vol" fill="#6366F1" radius={[6, 6, 2, 2]}>
              {weekChart.map((entry, i) => (
                <Cell key={i} fill={entry.vol > 0 ? "#6366F1" : "#E2E8F0"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
          {[
            { label: "Total Volume", value: `$${weekChart.reduce((s, d) => s + d.vol, 0).toFixed(2)}` },
            { label: "Transactions", value: (txs ?? []).length.toString() },
            { label: "Avg per Day", value: `$${(weekChart.reduce((s, d) => s + d.vol, 0) / 7).toFixed(2)}` },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-black text-slate-900 text-base">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RECENT TRANSACTIONS ──────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">History</div>
            <h3 className="font-black text-slate-900 text-lg">Recent Transactions</h3>
          </div>
          <span className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer transition-colors">View all →</span>
        </div>

        {recentTxs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-4xl mb-4">💸</div>
            <div className="font-bold text-slate-700 text-base">No transactions yet</div>
            <div className="text-sm mt-1">Send or receive funds to get started</div>
            <Link href="/dashboard/send">
              <button className="mt-5 px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-full hover:bg-indigo-700 transition-all">
                Send Funds
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTxs.map((tx) => {
              const isOut = tx.senderId === user.id;
              return (
                <div key={tx.id} className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-5 py-3.5 hover:border-indigo-100 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                      isOut
                        ? "bg-red-50 border border-red-100"
                        : "bg-emerald-50 border border-emerald-100"
                    }`}>
                      {isOut
                        ? <ArrowUpRight className="h-4 w-4 text-red-500" />
                        : <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                      }
                    </div>
                    <div className="flex items-center gap-3">
                      <CoinLogo currency={tx.currency} size={28} />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm capitalize">
                          {tx.type.replace(/_/g, " ")}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <StatusIcon status={tx.status} />
                          <span className="capitalize">{tx.status}</span>
                          <span>·</span>
                          <span>{timeAgo(tx.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${isOut ? "text-red-500" : "text-emerald-600"}`}>
                      {isOut ? "−" : "+"}
                      {parseFloat(tx.amount).toFixed(parseFloat(tx.amount) > 100 ? 2 : 6)} {tx.currency}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      ≈ ${(parseFloat(tx.amount) * (COIN_PRICES[tx.currency] ?? 1)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
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
