import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { Code2, Terminal, Zap, Globe, Shield, ArrowRight, CheckCircle } from "lucide-react";

const TOOLS = [
  { icon: Code2, title: "REST API", color: "bg-indigo-50 text-indigo-700", desc: "A fully typed, OpenAPI 3.1-compliant REST API covering wallets, transactions, payments, users, and network data. Rate-limited fairly, documented exhaustively." },
  { icon: Terminal, title: "WebSocket Streams", color: "bg-blue-50 text-blue-700", desc: "Real-time event streams for transaction state changes, wallet balance updates, and network health signals. Perfect for live dashboards and alerting systems." },
  { icon: Globe, title: "SDKs in 12 Languages", color: "bg-cyan-50 text-cyan-700", desc: "Idiomatic client libraries for TypeScript, Python, Go, Rust, Java, Ruby, PHP, Swift, Kotlin, C#, Elixir, and Haskell. Auto-generated from our OpenAPI spec." },
  { icon: Shield, title: "Webhooks", color: "bg-violet-50 text-violet-700", desc: "Push-based event delivery for all payment and transaction lifecycle events. HMAC-signed payloads, configurable retry logic, and a webhook test console." },
  { icon: Zap, title: "Sandbox Environment", color: "bg-emerald-50 text-emerald-700", desc: "A full-fidelity testnet environment with simulated balances, test wallets, and mock payment flows. Build and test without any real funds." },
  { icon: Code2, title: "CLI Toolchain", color: "bg-orange-50 text-orange-700", desc: "A powerful command-line interface for managing API keys, triggering test payments, inspecting webhooks, and querying network state — all from your terminal." },
];

const QUICKSTART = [
  { step: "01", title: "Get your API key", desc: "Create a free Helix account and generate an API key from the developer portal. Sandbox keys are provisioned instantly." },
  { step: "02", title: "Install the SDK", desc: 'Add the Helix SDK to your project: npm install @helix/sdk or pip install helix-sdk. Fully typed, zero config.' },
  { step: "03", title: "Make your first call", desc: "Query your test wallet balance, create a payment link, or trigger a test transaction — all in under five minutes." },
  { step: "04", title: "Go live", desc: "Switch your API key to production, pass a quick compliance check, and you're live — processing real transactions in minutes." },
];

export default function DevelopersPage() {
  return (
    <PublicLayout>
      <div className="bg-white text-slate-900">
        <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6">
              <Code2 className="h-3.5 w-3.5" /> Developer Platform
            </div>
            <h1 className="text-5xl font-black mb-5">Build on Helix in hours, not months.</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              A complete developer platform with APIs, SDKs, webhooks, and a full sandbox — designed to get you from zero to production as fast as possible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/docs">
                <button className="flex items-center gap-2 px-7 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full transition-all">
                  Read the Docs <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/register">
                <button className="px-7 py-3.5 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                  Get API Key
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Developer Tools</p>
              <h2 className="text-3xl font-black text-slate-900">Everything you need to integrate Helix</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {TOOLS.map((t) => (
                <div key={t.title} className="border border-slate-100 rounded-2xl p-7 hover:shadow-lg transition-all">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${t.color} mb-5`}>
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{t.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Quickstart</p>
              <h2 className="text-3xl font-black text-slate-900">From zero to live in four steps</h2>
            </div>
            <div className="space-y-5">
              {QUICKSTART.map((q) => (
                <div key={q.step} className="bg-white border border-slate-100 rounded-2xl p-6 flex items-start gap-5">
                  <div className="text-3xl font-black text-indigo-100 shrink-0 w-10">{q.step}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{q.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{q.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-5">Developer-friendly by design</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-left mt-8">
              {[
                "OpenAPI 3.1 spec — always up to date",
                "Auto-generated type-safe SDKs",
                "Exhaustive error codes with plain-language messages",
                "Interactive API explorer in the dashboard",
                "Idiomatic examples in every language",
                "Dedicated developer Slack community",
                "P1 support SLA for production issues",
                "Public changelog and deprecation policy",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span className="text-slate-700 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
