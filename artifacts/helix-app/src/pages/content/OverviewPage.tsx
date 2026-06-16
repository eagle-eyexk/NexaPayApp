import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { Zap, Globe, Shield, Cpu, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

const PILLARS = [
  { icon: Zap, title: "Instant Settlement", color: "bg-cyan-50 text-cyan-700 border-cyan-100", desc: "Nexa resolves and settles transactions in under one second across any supported chain. No confirmation delays, no waiting windows — just immediate value transfer." },
  { icon: Globe, title: "Universal Reach", color: "bg-blue-50 text-blue-700 border-blue-100", desc: "Our protocol bridges 150+ blockchain networks and traditional payment rails into a single unified interface. One integration, limitless reach." },
  { icon: Shield, title: "Security by Design", color: "bg-indigo-50 text-indigo-700 border-indigo-100", desc: "Every layer of Nexa is built with defense in depth — from AI-powered anomaly detection to cryptographic auditability at the protocol level." },
  { icon: Cpu, title: "Intelligent Routing", color: "bg-violet-50 text-violet-700 border-violet-100", desc: "The Nexa execution engine evaluates hundreds of routing paths in real time, selecting the optimal combination of cost, speed, and security for every transaction." },
  { icon: TrendingUp, title: "Institutional Scale", color: "bg-emerald-50 text-emerald-700 border-emerald-100", desc: "Purpose-built for high-throughput environments. Nexa handles millions of transactions per day without compromising latency or finality guarantees." },
];

export default function OverviewPage() {
  return (
    <PublicLayout>
      <div className="bg-white text-slate-900">
        <section className="relative overflow-hidden pt-24 pb-20 px-6 bg-gradient-to-b from-indigo-50/60 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
              Product Overview
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              What is{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Nexa?
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
              Nexa is a next-generation financial infrastructure layer that unifies cross-chain payments, real-time settlement, and intelligent routing into a single, composable protocol.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/product/features">
                <button className="px-7 py-3.5 border border-slate-200 text-slate-700 font-semibold rounded-full hover:border-indigo-300 transition-all">
                  Explore Features →
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Our Mission</p>
              <h2 className="text-3xl font-black text-slate-900 mb-5">Finance should move at the speed of the internet.</h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                Traditional payment infrastructure was built for a world of batch processing and siloed networks. Nexa reimagines the financial stack from scratch — optimizing for composability, interoperability, and real-time execution.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Whether you're sending $5 across town or settling $50M across three blockchain networks, Nexa provides the same guarantee: instant, secure, and cost-efficient value transfer.
              </p>
            </div>
            <div className="space-y-3">
              {["Sub-second settlement finality", "150+ connected networks", "60–80% lower fees vs legacy routing", "AI-powered threat detection", "Enterprise-grade uptime SLA", "Open, auditable protocol"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Core Pillars</p>
              <h2 className="text-4xl font-black text-slate-900">The five foundations of Nexa</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PILLARS.map((p) => (
                <div key={p.title} className="bg-white border border-slate-100 rounded-2xl p-7 hover:shadow-lg transition-all">
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${p.color} mb-5`}>
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-5">Ready to see it in action?</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">Create a free account and explore the full Nexa dashboard — no credit card required.</p>
          <Link href="/register">
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all">
              Start for Free
            </button>
          </Link>
        </section>
      </div>
    </PublicLayout>
  );
}
