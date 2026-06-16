import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { BookOpen, Code2, Terminal, Zap, Shield, Globe, ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    icon: Zap,
    title: "Getting Started",
    color: "bg-indigo-50 text-indigo-700",
    links: ["Introduction to Helix", "Authentication & API Keys", "Your First API Call", "Sandbox Environment", "Going to Production"],
  },
  {
    icon: Globe,
    title: "Core Concepts",
    color: "bg-blue-50 text-blue-700",
    links: ["Wallets & Addresses", "Transactions & Settlement", "Payment Links", "Cross-Chain Routing", "Fee Model"],
  },
  {
    icon: Code2,
    title: "API Reference",
    color: "bg-violet-50 text-violet-700",
    links: ["Authentication", "Wallets API", "Transactions API", "Merchant API", "Network API"],
  },
  {
    icon: Terminal,
    title: "SDKs & Libraries",
    color: "bg-cyan-50 text-cyan-700",
    links: ["TypeScript / JavaScript", "Python", "Go", "Rust", "Java & Kotlin"],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    color: "bg-emerald-50 text-emerald-700",
    links: ["Webhook Signatures", "API Key Best Practices", "Compliance Overview", "Audit Logs", "Data Retention Policy"],
  },
  {
    icon: BookOpen,
    title: "Guides & Tutorials",
    color: "bg-orange-50 text-orange-700",
    links: ["Build a Payment Page", "Merchant POS Integration", "Cross-Chain Swap Flow", "Webhook Event Handling", "CSV Reporting Automation"],
  },
];

export default function DocsPage() {
  return (
    <PublicLayout>
      <div className="bg-white text-slate-900">
        <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
                <BookOpen className="h-3.5 w-3.5" /> Documentation
              </div>
              <h1 className="text-5xl font-black text-slate-900 mb-5">Helix Documentation</h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
                Everything you need to integrate, build, and ship with Helix Protocol — from API references to end-to-end integration guides.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/developers">
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all">
                  Quick Start <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/docs/api">
                <button className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-full hover:border-indigo-300 transition-all">
                  API Reference
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {SECTIONS.map((s) => (
                <div key={s.title} className="border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-slate-900">{s.title}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {s.links.map((l) => (
                      <li key={l} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors">
                        <ArrowRight className="h-3 w-3 shrink-0" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Popular Guides</h2>
            <div className="space-y-3">
              {[
                { title: "Build a Merchant Payment Page in 10 Minutes", time: "10 min read", tag: "Tutorial" },
                { title: "Cross-Chain Swap Integration Guide", time: "15 min read", tag: "Guide" },
                { title: "Webhook Event Handling — Best Practices", time: "8 min read", tag: "Best Practice" },
                { title: "Production Checklist: Before You Go Live", time: "5 min read", tag: "Checklist" },
                { title: "Multi-Currency Wallet Architecture", time: "12 min read", tag: "Deep Dive" },
              ].map((g) => (
                <div key={g.title} className="bg-white border border-slate-100 rounded-xl px-6 py-4 flex items-center justify-between hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span className="font-medium text-slate-800 text-sm">{g.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">{g.tag}</span>
                    <span className="text-xs text-slate-400">{g.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
