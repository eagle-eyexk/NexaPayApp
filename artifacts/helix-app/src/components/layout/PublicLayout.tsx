import { type ReactNode } from "react";
import { Link } from "wouter";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07070d] text-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#07070d]/90 backdrop-blur-xl border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-9 h-9 shrink-0">
                <div className="absolute inset-0 bg-amber-400/20 rounded-xl blur-md group-hover:bg-amber-400/35 transition-all" />
                <img src={nexaLogo} alt="Nexa" className="relative w-9 h-9 object-contain rounded-xl" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-widest">NEXA</span>
                <div className="text-[9px] text-amber-400/70 font-semibold tracking-[0.3em] -mt-0.5">PAYMENT CRYPTO</div>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white/50">
            {["Home","Technology","Ecosystem","Developers","Resources","About"].map((item, i) => (
              <span key={item} className={`hover:text-amber-400 cursor-pointer transition-colors ${i === 0 ? "text-amber-400" : ""}`}>{item}</span>
            ))}
          </nav>

          <Link href="/login">
            <button
              data-testid="btn-launch-app"
              className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-sm font-bold px-5 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]"
            >
              Launch App →
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#050509] border-t border-amber-500/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 shrink-0">
                <div className="absolute inset-0 bg-amber-400/15 rounded-xl blur-md" />
                <img src={nexaLogo} alt="Nexa" className="relative w-9 h-9 object-contain rounded-xl" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-widest">NEXA</span>
                <div className="text-[9px] text-amber-400/60 font-semibold tracking-[0.3em] -mt-0.5">PAYMENT CRYPTO</div>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">Building the sovereign financial infrastructure for a decentralized future.</p>
            <div className="flex gap-4 mt-5">
              {["X","Discord","Telegram","GitHub","LinkedIn"].map((s) => (
                <span key={s} className="text-white/30 hover:text-amber-400 cursor-pointer text-xs transition-colors font-medium">{s}</span>
              ))}
            </div>
          </div>
          {[
            { title: "Product", links: ["Overview","Features","Ecosystem","Security"] },
            { title: "Developers", links: ["Docs","API Reference","SDKs","GitHub"] },
            { title: "Company", links: ["About","Blog","Careers","Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-white/80 mb-4 text-xs uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => <li key={l} className="text-white/40 hover:text-amber-400 text-sm cursor-pointer transition-colors">{l}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/25">
          <span>© {new Date().getFullYear()} Nexa Payment Crypto. All rights reserved.</span>
          <div className="flex gap-5">
            {["Privacy Policy","Terms of Service","Legal","Compliance"].map((l) => (
              <span key={l} className="hover:text-amber-400 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
