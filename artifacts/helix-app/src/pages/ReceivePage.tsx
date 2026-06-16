import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetReceiveInfo, getGetReceiveInfoQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import QRCode from "react-qr-code";
import { Copy, Check, QrCode, ArrowLeft } from "lucide-react";

const CURRENCIES = ["USD", "ETH", "SOL", "USDC", "BTC"];

export default function ReceivePage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [currency, setCurrency] = useState("ETH");
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (!isLoading && !user) setLocation("/login"); }, [user, isLoading]);

  const { data: info } = useGetReceiveInfo(currency, {
    query: { queryKey: getGetReceiveInfoQueryKey(currency), enabled: !!currency },
  });

  function copyAddress() {
    if (!info?.address) return;
    navigator.clipboard.writeText(info.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button onClick={() => setLocation("/dashboard")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      <div>
        <h1 className="text-xl font-bold">Receive / Tap to Pay</h1>
        <p className="text-muted-foreground text-sm mt-1">Share your QR code or address to receive funds</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CURRENCIES.map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currency === c ? "bg-primary/15 text-primary border border-primary/40" : "bg-muted text-muted-foreground border border-transparent hover:border-border"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border/60 rounded-2xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <QrCode className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">TAP TO PAY</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Receiving <span className="text-primary font-bold">{currency}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="p-5 bg-white rounded-2xl shadow-md border border-border/40">
            {info?.qrData ? (
              <QRCode value={info.qrData} size={200} level="M" fgColor="#0f172a" bgColor="#ffffff" />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center text-slate-400 text-sm">Loading…</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Your {currency} Address</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-xs text-foreground break-all select-all border border-border/40">
              {info?.address ?? "Loading…"}
            </div>
            <button
              onClick={copyAddress}
              className={`shrink-0 p-3 rounded-lg border transition-all ${copied ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700" : "bg-muted border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary"}`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center bg-muted/50 rounded-lg px-4 py-3">
          Only send <strong className="text-foreground">{currency}</strong> to this address. Sending other assets may result in permanent loss.
        </div>
      </div>
    </div>
  );
}
