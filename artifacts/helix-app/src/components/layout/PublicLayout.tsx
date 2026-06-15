import { type ReactNode } from "react";
import { Link } from "wouter";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative w-9 h-9 shrink-0">
                <img src={nexaLogo} alt="Nexa" className="w-9 h-9 object-contain" />
              </div>
              <div>
                <span className="font-black text-slate-900 text-sm tracking-widest">NEXA</span>
                <div className="text-[9px] text-amber-600 font-bold tracking-[0.3em] -mt-0.5">PAYMENT CRYPTO</div>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
            {["Home","Technology","Ecosystem","Developers","Resources","About"].map((item, i) => (
              <span key={item} className={`hover:text-amber-600 cursor-pointer transition-colors ${i === 0 ? "text-amber-600 font-semibold" : ""}`}>{item}</span>
            ))}
          </nav>

          <Link href="/login">
            <button
              data-testid="btn-launch-app"
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-md hover:shadow-lg shadow-amber-200"
            >
              Launch App →
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={nexaLogo} alt="Nexa" className="w-8 h-8 object-contain" />
              <div>
                <span className="font-black text-white text-sm tracking-widest">NEXA</span>
                <div className="text-[9px] text-amber-400 font-bold tracking-[0.3em] -mt-0.5">PAYMENT CRYPTO</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">Building the sovereign financial infrastructure for a decentralized, Ethereum-compatible future.</p>
            <div className="flex gap-4 mt-5">
              {["X","Discord","Telegram","GitHub","LinkedIn"].map((s) => (
                <span key={s} className="text-slate-500 hover:text-amber-400 cursor-pointer text-xs transition-colors font-medium">{s}</span>
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
                {col.links.map((l) => <li key={l} className="text-slate-400 hover:text-amber-400 text-sm cursor-pointer transition-colors">{l}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
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
