import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

import logoText from "@assets/BC0D0C1A-2EF9-48F4-8A63-1CB79AB59BA4_1778441808722.png";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans dark">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="h-8 cursor-pointer">
                <img src={logoText} alt="Helix Protocol" className="h-full object-contain" />
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="cursor-not-allowed hover:text-primary transition-colors">Technology</span>
            <span className="cursor-not-allowed hover:text-primary transition-colors">Ecosystem</span>
            <span className="cursor-not-allowed hover:text-primary transition-colors">Developers</span>
            <span className="cursor-not-allowed hover:text-primary transition-colors">Resources</span>
            <span className="cursor-not-allowed hover:text-primary transition-colors">About</span>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/app">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-card py-12 mt-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logoText} alt="Helix Protocol" className="h-6 object-contain mb-4 opacity-70" />
            <p className="text-sm text-muted-foreground">
              Finance, Evolved. The next-generation decentralized financial infrastructure.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Protocol</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Technology</li>
              <li>Network</li>
              <li>Security</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Developers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>GitHub</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Helix Protocol. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
