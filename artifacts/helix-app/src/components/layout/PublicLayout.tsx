import { type ReactNode } from "react";
import { Link } from "wouter";
import logoFull from "@assets/BC0D0C1A-2EF9-48F4-8A63-1CB79AB59BA4_1778441808722.png";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-[#0d1117] rounded-lg p-1.5 h-9 w-9 flex items-center justify-center overflow-hidden">
                <img src={logoFull} alt="Helix" className="h-6 w-6 object-contain" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm tracking-wide">HELIX</span>
                <div className="text-[9px] text-slate-500 font-medium tracking-widest -mt-0.5">PROTOCOL</div>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {["Home","Technology","Ecosystem","Developers","Resources","About"].map((item, i) => (
              <span key={item} className={`hover:text-indigo-600 cursor-pointer transition-colors ${i === 0 ? "text-indigo-600 border-b-2 border-indigo-600 pb-0.5" : ""}`}>{item}</span>
            ))}
          </nav>

          <Link href="/login">
            <button
              data-testid="btn-launch-app"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
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
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#0d1117] border border-slate-700 rounded-lg p-1.5 h-9 w-9 flex items-center justify-center">
                <img src={logoFull} alt="Helix" className="h-6 w-6 object-contain" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">HELIX</span>
                <div className="text-[9px] text-slate-400 tracking-widest">PROTOCOL</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">Building the financial infrastructure for a decentralized future.</p>
            <div className="flex gap-3 mt-4">
              {["X","Discord","Telegram","GitHub","LinkedIn"].map((s) => (
                <span key={s} className="text-slate-500 hover:text-white cursor-pointer text-xs transition-colors">{s}</span>
              ))}
            </div>
          </div>
          {[
            { title: "Product", links: ["Overview","Features","Ecosystem","Security"] },
            { title: "Developers", links: ["Docs","API Reference","SDKs","GitHub"] },
            { title: "Company", links: ["About","Blog","Careers","Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => <li key={l} className="text-slate-400 hover:text-white text-sm cursor-pointer transition-colors">{l}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Helix Protocol. All rights reserved.</span>
          <div className="flex gap-5">
            {["Privacy Policy","Terms of Service","Legal","Compliance"].map((l) => (
              <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
