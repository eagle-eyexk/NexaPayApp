import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { Zap, Globe, Shield, Cpu, TrendingUp, QrCode, Link2, FileText, BarChart3, Wallet, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    category: "Payments",
    color: "text-cyan-700 bg-cyan-50",
    items: [
      { icon: Zap, title: "Real-Time Settlement", desc: "Sub-second finality on every transaction. Nexa confirms and settles payments faster than any traditional processor — powered by adaptive consensus routing." },
      { icon: QrCode, title: "Tap to Pay / QR Receive", desc: "Generate per-currency QR codes instantly. Customers scan and pay directly to your wallet address — no intermediaries, no delays." },
      { icon: Link2, title: "Shareable Payment Links", desc: "Create payment requests with a single click. Share a link or QR code and get paid in any supported currency. Links can be time-limited and trackable." },
    ],
  },
  {
    category: "Routing & Infrastructure",
    color: "text-indigo-700 bg-indigo-50",
    items: [
      { icon: Globe, title: "Cross-Chain Routing", desc: "Nexa evaluates hundreds of routing paths across 150+ networks in real time — selecting the optimal path for each transaction by balancing speed, cost, and security." },
      { icon: Cpu, title: "Adaptive Execution Engine", desc: "Our proprietary execution layer dynamically adjusts to network congestion, fee spikes, and validator latency. You always get the best available route." },
      { icon: TrendingUp, title: "Fee Optimization", desc: "Intelligent batching and gas modeling reduce transaction costs by 60–80% compared to naïve routing — putting more value in the hands of recipients." },
    ],
  },
  {
    category: "Security & Compliance",
    color: "text-violet-700 bg-violet-50",
    items: [
      { icon: Shield, title: "AI-Powered Threat Detection", desc: "Machine learning models trained on billions of transactions monitor every event in real time — surfacing anomalies and blocking threats before they escalate." },
      { icon: Shield, title: "Cryptographic Auditability", desc: "Every action on the Nexa protocol produces a tamper-proof, cryptographically signed audit trail. Compliance teams get full visibility with zero overhead." },
      { icon: Shield, title: "Non-Custodial Architecture", desc: "Nexa never holds your funds. All assets remain in user-controlled wallets — reducing counterparty risk to zero." },
    ],
  },
  {
    category: "Analytics & Reporting",
    color: "text-emerald-700 bg-emerald-50",
    items: [
      { icon: BarChart3, title: "Revenue Dashboard", desc: "Real-time merchant analytics: total revenue, transaction volume, daily and monthly trends, and per-currency breakdowns — all in one clean interface." },
      { icon: FileText, title: "PDF Receipt Generation", desc: "Server-side PDF receipts and payment coupons generated instantly for every transaction. Branded, professional, and ready to share." },
      { icon: Wallet, title: "Multi-Currency Wallet", desc: "Manage BTC, ETH, SOL, USDC, and USD from a single dashboard. Real-time balances, transaction history, and wallet addresses per currency." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <PublicLayout>
      <div className="bg-white text-slate-900">
        <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-indigo-50/60 to-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
              Product Features
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-5">Everything you need to move money at scale</h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              From individual wallets to enterprise settlement rails — every Nexa feature is purpose-built for performance, reliability, and ease of use.
            </p>
          </div>
        </section>

        {FEATURES.map((group) => (
          <section key={group.category} className="py-16 px-6 border-t border-slate-100">
            <div className="max-w-6xl mx-auto">
              <div className="mb-10">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${group.color}`}>{group.category}</span>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {group.items.map((f) => (
                  <div key={f.title} className="border border-slate-100 rounded-2xl p-7 hover:shadow-lg hover:border-slate-200 transition-all">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${group.color} mb-5`}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="py-24 px-6 bg-gradient-to-br from-indigo-700 to-blue-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-black mb-5">See every feature live</h2>
            <p className="text-indigo-100 text-lg mb-8">Create a free account and explore the full Nexa product — no credit card, no commitment.</p>
            <Link href="/register">
              <button className="flex items-center gap-2 mx-auto px-8 py-4 bg-white text-indigo-700 font-bold rounded-full hover:bg-indigo-50 transition-all shadow-xl">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
