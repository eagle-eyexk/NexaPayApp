import { type ReactNode } from "react";
import { Link } from "wouter";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

const NAV_GROUPS = [
  {
    label: "Product",
    items: [
      { label: "Overview", href: "/product/overview" },
      { label: "Features", href: "/product/features" },
      { label: "Ecosystem", href: "/product/ecosystem" },
      { label: "Security", href: "/product/security" },
    ],
  },
  {
    label: "Developers",
    items: [
      { label: "Developers", href: "/developers" },
      { label: "Docs", href: "/docs" },
      { label: "API Reference", href: "/docs/api" },
      { label: "SDKs", href: "/docs/sdks" },
      { label: "GitHub", href: "https://github.com", external: true },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/company/about" },
      { label: "Blog", href: "/company/blog" },
      { label: "Careers", href: "/company/careers" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
];

function NavGroup({ group }: { group: (typeof NAV_GROUPS)[0] }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-slate-600 hover:text-amber-600 font-medium text-sm transition-colors py-2">
        {group.label}
        <svg className="h-3.5 w-3.5 mt-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
        <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-2 min-w-[180px]">
          {group.items.map((item) =>
            item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                {item.label}
                <svg className="h-3 w-3 opacity-50 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            ) : (
              <Link key={item.label} href={item.href}>
                <div className="px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-amber-50 hover:text-amber-700 cursor-pointer transition-colors">
                  {item.label}
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function PublicLayout({ children, noWrap }: { children: ReactNode; noWrap?: boolean }) {
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

          <nav className="hidden md:flex items-center gap-1">
            {NAV_GROUPS.map((g) => <NavGroup key={g.label} group={g} />)}
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
      {!noWrap && (
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
                {["X", "Discord", "Telegram", "GitHub", "LinkedIn"].map((s) => (
                  <span key={s} className="text-slate-500 hover:text-amber-400 cursor-pointer text-xs transition-colors font-medium">{s}</span>
                ))}
              </div>
            </div>
            {[
              {
                title: "Product",
                links: [
                  { label: "Overview", href: "/product/overview" },
                  { label: "Features", href: "/product/features" },
                  { label: "Ecosystem", href: "/product/ecosystem" },
                  { label: "Security", href: "/product/security" },
                ],
              },
              {
                title: "Developers",
                links: [
                  { label: "Developers", href: "/developers" },
                  { label: "API Reference", href: "/docs/api" },
                  { label: "SDKs", href: "/docs/sdks" },
                  { label: "GitHub", href: "https://github.com", external: true },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About", href: "/company/about" },
                  { label: "Blog", href: "/company/blog" },
                  { label: "Careers", href: "/company/careers" },
                  { label: "Contact", href: "/company/contact" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white/80 mb-4 text-xs uppercase tracking-widest">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) =>
                    (l as any).external ? (
                      <li key={l.label}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 text-sm transition-colors">{l.label}</a>
                      </li>
                    ) : (
                      <li key={l.label}>
                        <Link href={l.href}><span className="text-slate-400 hover:text-amber-400 text-sm cursor-pointer transition-colors">{l.label}</span></Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
            <div>
              <h4 className="font-bold text-white/80 mb-4 text-xs uppercase tracking-widest">Research</h4>
              <ul className="space-y-2.5">
                <li><Link href="/whitepaper"><span className="text-slate-400 hover:text-amber-400 text-sm cursor-pointer transition-colors">Whitepaper</span></Link></li>
                <li><Link href="/docs"><span className="text-slate-400 hover:text-amber-400 text-sm cursor-pointer transition-colors">API Reference</span></Link></li>
                <li><Link href="/explorer"><span className="text-slate-400 hover:text-amber-400 text-sm cursor-pointer transition-colors">Block Explorer</span></Link></li>
                <li><Link href="/analytics"><span className="text-slate-400 hover:text-amber-400 text-sm cursor-pointer transition-colors">Analytics</span></Link></li>
                {["Tokenomics", "Roadmap"].map((l) => (
                  <li key={l} className="text-slate-400 hover:text-amber-400 text-sm cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Nexa Payment Crypto. All rights reserved.</span>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service", "Legal", "Compliance"].map((l) => (
                <span key={l} className="hover:text-amber-400 cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
