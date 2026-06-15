import { useState } from "react";
import { useLocation } from "wouter";
import { useGetUserWallets, useGetNexaWalletKey, useGetUserTransactions, getGetUserWalletsQueryKey, getGetNexaWalletKeyQueryKey, getGetUserTransactionsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Copy, Eye, EyeOff, Send, QrCode, Shield, CheckCircle2,
  ArrowUpRight, ArrowDownLeft, AlertTriangle, Key, Hexagon, Check, Smartphone, ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-amber-400/60 hover:text-amber-400" />}
    </button>
  );
}

export default function NexaWalletPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [showKey, setShowKey] = useState(false);
  const [keyRequested, setKeyRequested] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);

  const { data: wallets } = useGetUserWallets({ query: { queryKey: getGetUserWalletsQueryKey() } });
  const { data: keyData, refetch: fetchKey } = useGetNexaWalletKey({
    query: {
      queryKey: getGetNexaWalletKeyQueryKey(),
      enabled: keyRequested,
      retry: false,
    }
  });
  const { data: txs } = useGetUserTransactions(
    { limit: 20 },
    { query: { queryKey: getGetUserTransactionsQueryKey({ limit: 20 }), retry: false } }
  );

  if (!user && !isLoading) { setLocation("/login"); return null; }
  if (!user) return null;

  const nexaWallet = wallets?.find((w) => w.currency === "NEXA");
  const nexaTxs = (txs ?? []).filter((tx) => tx.currency === "NEXA");
  const balance = parseFloat(nexaWallet?.balance ?? "0");

  const handleRevealKey = async () => {
    setKeyRequested(true);
    await fetchKey();
    setShowKey(true);
    setConfirmReveal(false);
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg, #0f0a00 0%, #1a1000 40%, #0d0800 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.4) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-400/6 rounded-full blur-3xl" />

        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-amber-400/25 rounded-2xl blur-sm" />
                <img src={nexaLogo} alt="Nexa" className="relative w-12 h-12 object-contain rounded-2xl" />
              </div>
              <div>
                <div className="text-[11px] font-black tracking-[0.35em] text-amber-400">NEXA WALLET</div>
                <div className="text-[9px] text-amber-400/40 font-bold tracking-[0.2em]">SOVEREIGN CRYPTO</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
              <Hexagon className="h-3 w-3 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400">secp256k1</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-[10px] text-amber-400/40 font-bold tracking-widest mb-1">CURRENT BALANCE</div>
            <div className="text-5xl font-black text-white">
              {balance.toFixed(4)}
              <span className="text-xl text-amber-400 ml-3 font-bold">NEXA</span>
            </div>
          </div>

          {/* Address */}
          <div className="bg-black/30 border border-amber-400/15 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] text-amber-400/50 font-bold tracking-widest">WALLET ADDRESS</div>
              {nexaWallet && <CopyButton text={nexaWallet.address} />}
            </div>
            <div className="text-xs font-mono text-amber-400/80 break-all leading-relaxed">
              {nexaWallet?.address ?? "Generating…"}
            </div>
          </div>

          {/* Public Key */}
          {nexaWallet?.publicKey && (
            <div className="bg-black/30 border border-amber-400/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] text-amber-400/40 font-bold tracking-widest">PUBLIC KEY (secp256k1 compressed)</div>
                <CopyButton text={nexaWallet.publicKey} />
              </div>
              <div className="text-[10px] font-mono text-amber-400/50 break-all leading-relaxed">
                {nexaWallet.publicKey}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/send">
          <div className="flex items-center justify-center gap-2 py-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/15 transition-all cursor-pointer">
            <Send className="h-4 w-4 text-amber-400" />
            <span className="font-semibold text-sm text-amber-400">Send NEXA</span>
          </div>
        </Link>
        <Link href="/dashboard/receive">
          <div className="flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/15 transition-all cursor-pointer">
            <QrCode className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-sm text-blue-400">Receive NEXA</span>
          </div>
        </Link>
      </div>

      {/* Private Key Section */}
      <div className="bg-card border border-border/40 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Key className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <div className="font-semibold text-sm">Private Key</div>
            <div className="text-xs text-muted-foreground">Your cryptographic signing key</div>
          </div>
        </div>

        {!confirmReveal && !showKey && (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-xs text-yellow-400/80 leading-relaxed">
                Never share your private key. Anyone with this key has full control of your NEXA wallet. Store it securely offline.
              </p>
            </div>
            <button
              onClick={() => setConfirmReveal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/15 text-amber-400 font-semibold text-sm transition-all"
            >
              <Eye className="h-4 w-4" /> Reveal Private Key
            </button>
          </div>
        )}

        {confirmReveal && !showKey && (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <Shield className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400/80 leading-relaxed">
                Are you sure? Make sure no one is watching your screen. This key gives complete access to your funds.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setConfirmReveal(false)} className="py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-semibold hover:border-primary/30 transition-colors">
                Cancel
              </button>
              <button onClick={handleRevealKey} className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold transition-colors">
                I understand, show
              </button>
            </div>
          </div>
        )}

        {showKey && keyData && (
          <div className="space-y-3">
            <div className="bg-black/40 border border-amber-400/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] text-amber-400/50 font-bold tracking-widest">PRIVATE KEY (hex)</div>
                <div className="flex items-center gap-1">
                  <CopyButton text={keyData.privateKey} />
                  <button onClick={() => setShowKey(false)} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="text-[10px] font-mono text-amber-400 break-all leading-relaxed bg-amber-400/5 rounded-lg p-3">
                {keyData.privateKey}
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-400/80">Copy and store this key in a secure password manager or write it down offline.</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Wallet Passes */}
      <div className="bg-card border border-border/40 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Smartphone className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <div className="font-semibold text-sm">Mobile Wallet Passes</div>
            <div className="text-xs text-muted-foreground">Add your NEXA balance to Apple or Google Wallet</div>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* Apple Wallet */}
          <a
            href="/api/user/wallet/apple-pass"
            download
            className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/8 hover:border-white/15 hover:bg-black/60 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-sm">
                🍎
              </div>
              <div>
                <div className="font-semibold text-sm text-white">Add to Apple Wallet</div>
                <div className="text-[10px] text-muted-foreground">Downloads a .pkpass file</div>
              </div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white transition-colors" />
          </a>

          {/* Google Wallet */}
          <button
            onClick={async () => {
              const res = await fetch("/api/user/wallet/google-pass", { credentials: "include" });
              const data = await res.json() as { url: string };
              if (data.url) window.open(data.url, "_blank");
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/15 hover:border-blue-500/30 hover:bg-blue-950/60 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 border border-blue-500/20 flex items-center justify-center text-sm">
                G
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm text-white">Add to Google Wallet</div>
                <div className="text-[10px] text-muted-foreground">Opens Google Pay save flow</div>
              </div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-blue-400 transition-colors" />
          </button>
        </div>

        <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
          <Shield className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-blue-400/70 leading-relaxed">
            Passes show your NEXA balance and wallet address. Your private key is never included. Production passes require Apple Developer & Google service account certificates.
          </p>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Algorithm", value: "secp256k1" },
          { label: "Network", value: "NEXA L1" },
          { label: "Standard", value: "EIP-55" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border/40 rounded-xl p-3 text-center">
            <div className="text-[10px] text-muted-foreground font-semibold tracking-wide mb-1">{item.label}</div>
            <div className="text-xs font-bold text-amber-400">{item.value}</div>
          </div>
        ))}
      </div>

      {/* NEXA Transaction History */}
      <div>
        <h3 className="font-semibold text-base mb-3">NEXA Transactions</h3>
        {nexaTxs.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground bg-card border border-border/40 rounded-xl">
            <div className="text-3xl mb-3">₦</div>
            <div className="font-medium">No NEXA transactions yet</div>
            <div className="text-sm mt-1">Send or receive NEXA to see transactions here</div>
          </div>
        ) : (
          <div className="space-y-2">
            {nexaTxs.map((tx) => {
              const isOutgoing = tx.senderId === user.id;
              return (
                <div key={tx.id} className="flex items-center justify-between bg-card border border-amber-500/10 rounded-xl px-4 py-3 hover:border-amber-500/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isOutgoing ? "bg-red-500/10 border border-red-500/20" : "bg-emerald-500/10 border border-emerald-500/20"}`}>
                      {isOutgoing ? <ArrowUpRight className="h-4 w-4 text-red-400" /> : <ArrowDownLeft className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm capitalize">{tx.type.replace(/_/g, " ")}</div>
                      <div className="text-xs text-muted-foreground">{timeAgo(tx.createdAt)}</div>
                    </div>
                  </div>
                  <div className={`font-semibold text-sm ${isOutgoing ? "text-red-400" : "text-emerald-400"}`}>
                    {isOutgoing ? "-" : "+"}{parseFloat(tx.amount).toFixed(4)} NEXA
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-around gap-2">
          {[
            { icon: Send, label: "Send", href: "/dashboard/send", color: "text-amber-400" },
            { icon: QrCode, label: "Receive", href: "/dashboard/receive", color: "text-blue-400" },
            { icon: ArrowUpRight, label: "Dashboard", href: "/dashboard", color: "text-slate-400" },
            { icon: Key, label: "Key", href: "#key", color: "text-amber-400" },
          ].map((action) => (
            action.href.startsWith("#") ? (
              <button key={action.label} onClick={() => setConfirmReveal(true)} className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted cursor-pointer transition-colors group">
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-[10px] font-semibold text-muted-foreground">{action.label}</span>
              </button>
            ) : (
              <Link key={action.label} href={action.href}>
                <div className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted cursor-pointer transition-colors group">
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-[10px] font-semibold text-muted-foreground">{action.label}</span>
                </div>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
