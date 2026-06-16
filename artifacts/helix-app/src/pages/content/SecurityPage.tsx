import { Link } from "wouter";
import PublicLayout from "@/components/layout/PublicLayout";
import { Shield, Lock, Eye, AlertCircle, CheckCircle, Server, ArrowRight } from "lucide-react";

const LAYERS = [
  {
    icon: Shield,
    title: "AI-Powered Fraud Detection Engine",
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    desc: "Nexa's Fraud Detection Engine runs a real-time ML pipeline trained on billions of on-chain events. Every transaction is scored in under 10ms — flagging suspicious patterns and quarantining high-risk activity before block inclusion.",
    points: ["Behavioral fingerprinting of wallet addresses via Identity Mesh", "Real-time velocity and pattern analysis per epoch", "Automatic transaction quarantine above configurable risk threshold", "Continuous model updates from on-chain fraud evidence submissions"],
  },
  {
    icon: Lock,
    title: "Cryptographic Auditability",
    color: "bg-violet-50 text-violet-700 border-violet-100",
    desc: "Every block, transaction, and state update on Nexa is hashed with Blake3 and signed with Ed25519. The resulting chain of cryptographic proofs is publicly verifiable and tamper-proof at the protocol level.",
    points: ["Blake3 hashing for block headers, state roots, and tx trees", "Ed25519 signatures on all validator messages and tx authorizations", "Merkle-rooted transaction and receipt trees per block", "Governance proposals stored on-chain with full vote auditability"],
  },
  {
    icon: Eye,
    title: "Non-Custodial by Protocol",
    color: "bg-blue-50 text-blue-700 border-blue-100",
    desc: "Nexa's protocol never holds private keys or takes custody of user funds. All assets are controlled by user wallet addresses at all times. Nexa is a routing and settlement layer — not a custodian, never.",
    points: ["Zero counterparty risk from Nexa holding user funds", "Users retain full ownership of wallet private keys", "WASM smart contracts enforce non-custodial logic at execution time", "Hardware wallet and MPC wallet compatible via standard Ed25519"],
  },
  {
    icon: Server,
    title: "Trust Engine & Identity Mesh",
    color: "bg-cyan-50 text-cyan-700 border-cyan-100",
    desc: "The Trust Engine continuously updates reputation scores for all active addresses based on on-chain behavior, validator attestations, and Identity Mesh proofs. Validators must maintain a reputation ≥ 0.70 to participate in consensus.",
    points: ["Reputation scores updated every epoch via on-chain evidence", "Identity Mesh supports DID (Decentralized Identity) registration", "Reputation threshold of 0.70 required for ValidatorNode eligibility", "Fraud Engine penalties reduce reputation and trigger stake slashing"],
  },
  {
    icon: Shield,
    title: "Hybrid Consensus Security",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    desc: "Nexa's Hybrid PoS + Reputation consensus dynamically selects the safest consensus mode (BFT, Probabilistic, Optimistic, or Edge) based on network conditions, validator count, and transaction risk level.",
    points: ["BFT mode for high-value or high-risk transactions", "Min 21-day unbonding period to prevent validator churn attacks", "Max 100 validators — Sybil-resistant via staking + reputation", "Aggregated threshold signatures for compact block finalization"],
  },
];

const AUDITS = [
  { firm: "Trail of Bits", date: "Q1 2025", scope: "Core Protocol, AER Engine & Consensus Layer", status: "Passed — 0 Critical" },
  { firm: "Consensys Diligence", date: "Q3 2024", scope: "WASM Runtime & Smart Contract Layer", status: "Passed — 0 Critical" },
  { firm: "Halborn Security", date: "Q2 2024", scope: "JSON-RPC API & Authentication Layer", status: "Passed — 2 Medium (Resolved)" },
  { firm: "OpenZeppelin", date: "Q4 2023", scope: "Token Contracts & Trust Engine", status: "Passed — 0 Critical" },
];

export default function SecurityPage() {
  return (
    <PublicLayout>
      <div className="bg-white text-slate-900">
        <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-indigo-50/60 to-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
              <Shield className="h-3.5 w-3.5" /> Security
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-5">Security is not a feature. It's the foundation.</h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Every layer of the Nexa stack is designed with adversarial conditions in mind — from Blake3 cryptographic proofs at the protocol level to AI-powered fraud detection in the mempool.
            </p>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {LAYERS.map((layer) => (
              <div key={layer.title} className={`border rounded-2xl p-8 ${layer.color}`}>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${layer.color}`}>
                        <layer.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-black text-xl text-slate-900">{layer.title}</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{layer.desc}</p>
                  </div>
                  <div className="space-y-3">
                    {layer.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Third-Party Audits</p>
              <h2 className="text-3xl font-black text-slate-900">Independently verified security</h2>
              <p className="text-slate-500 mt-3">All Nexa protocol components are regularly audited by leading security research firms.</p>
            </div>
            <div className="space-y-3">
              {AUDITS.map((a) => (
                <div key={a.firm} className="bg-white border border-slate-100 rounded-xl px-6 py-5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{a.firm}</div>
                    <div className="text-sm text-slate-500">{a.scope}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-emerald-700">{a.status}</div>
                    <div className="text-xs text-slate-400">{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-indigo-700 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <AlertCircle className="h-10 w-10 mx-auto mb-5 text-indigo-300" />
            <h2 className="text-3xl font-black mb-4">Responsible Disclosure</h2>
            <p className="text-indigo-100 mb-8 leading-relaxed">
              We operate a public bug bounty program. Security researchers who responsibly disclose vulnerabilities in the Nexa protocol, AER engine, or WASM runtime are eligible for rewards up to $250,000 depending on severity.
            </p>
            <Link href="/company/contact">
              <button className="flex items-center gap-2 mx-auto px-7 py-3.5 bg-white text-indigo-700 font-bold rounded-full hover:bg-indigo-50 transition-all">
                Report a Vulnerability <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
