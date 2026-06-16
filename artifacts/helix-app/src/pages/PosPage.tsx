import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { usePosCharge, getGetMerchantStatsQueryKey, getGetMerchantTransactionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, X, Delete, Download } from "lucide-react";

const CURRENCIES = ["USD", "EUR", "USDC", "ETH", "BTC", "SOL"];

export default function PosPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const qc = useQueryClient();
  const charge = usePosCharge();

  const [amount, setAmount] = useState("0");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [result, setResult] = useState<{ id: string; amount: string; currency: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading) {
      if (!user) setLocation("/login");
      else if (user.role !== "merchant") setLocation("/dashboard");
    }
  }, [user, isLoading]);

  function pressDigit(d: string) {
    setAmount((prev) => {
      if (d === "." && prev.includes(".")) return prev;
      if (prev === "0" && d !== ".") return d;
      const next = prev + d;
      const parts = next.split(".");
      if (parts[1] && parts[1].length > 2) return prev;
      return next;
    });
  }

  function clearLast() {
    setAmount((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  }

  function clearAll() {
    setAmount("0");
    setDescription("");
    setCustomerEmail("");
    setError("");
  }

  function handleCharge() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError("Enter an amount greater than 0"); return; }
    if (!description) { setError("Please enter a description / item name"); return; }
    setError("");
    charge.mutate(
      { data: { amount: amt, currency, description, customerEmail: customerEmail || undefined } },
      {
        onSuccess: (tx) => {
          qc.invalidateQueries({ queryKey: getGetMerchantStatsQueryKey() });
          qc.invalidateQueries({ queryKey: getGetMerchantTransactionsQueryKey() });
          setResult({ id: tx.id, amount: tx.amount, currency: tx.currency });
        },
        onError: (err: any) => setError(err?.message ?? "Charge failed"),
      }
    );
  }

  if (result) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-card border border-emerald-500/30 rounded-2xl p-10 max-w-md w-full text-center shadow-sm space-y-5">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <CheckCircle2 className="h-10 w-10 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Payment Accepted!</h2>
            <p className="text-muted-foreground text-sm mt-1">Transaction recorded successfully</p>
          </div>
          <div className="bg-muted rounded-xl p-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-emerald-700 text-lg">{parseFloat(result.amount).toFixed(2)} {result.currency}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ref</span><span className="font-mono text-xs">{result.id.slice(0, 12).toUpperCase()}</span></div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.open(`/api/user/transactions/${result.id}/receipt`, "_blank")}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-muted border border-border/60 rounded-lg text-sm font-medium hover:border-primary/40 transition-colors"
            >
              <Download className="h-4 w-4" /> Receipt PDF
            </button>
            <button
              onClick={() => { setResult(null); clearAll(); }}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              New Charge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold">POS Terminal</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Charge customers directly</p>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        {/* Display — kept dark to simulate a terminal screen */}
        <div className="bg-gradient-to-b from-[#0d1b3e] to-[#061528] px-6 py-8 text-center">
          <div className="text-xs text-white/50 uppercase tracking-widest mb-2">Amount to Charge</div>
          <div className="text-5xl font-bold text-white tabular-nums">
            {parseFloat(amount).toFixed(2)}
          </div>
          <div className="text-primary font-medium mt-1 text-sm">{currency}</div>
        </div>

        {/* Currency selector */}
        <div className="border-b border-border/40 px-4 py-3 flex gap-2 overflow-x-auto">
          {CURRENCIES.map((c) => (
            <button key={c} onClick={() => setCurrency(c)} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${currency === c ? "bg-primary/15 text-primary border border-primary/40" : "bg-muted text-muted-foreground"}`}>{c}</button>
          ))}
        </div>

        {/* Description */}
        <div className="px-4 py-3 border-b border-border/40">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item / Description *"
            className="w-full bg-muted border border-border/40 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        <div className="px-4 py-3 border-b border-border/40">
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Customer email (optional)"
            className="w-full bg-muted border border-border/40 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        {/* Numpad */}
        <div className="p-4 grid grid-cols-3 gap-2">
          {["1","2","3","4","5","6","7","8","9",".","0"].map((d) => (
            <button key={d} onClick={() => pressDigit(d)} className="h-14 rounded-xl bg-muted hover:bg-muted/70 active:scale-95 text-lg font-semibold text-foreground transition-all border border-border/30">
              {d}
            </button>
          ))}
          <button onClick={clearLast} className="h-14 rounded-xl bg-muted hover:bg-muted/70 active:scale-95 text-foreground transition-all flex items-center justify-center border border-border/30">
            <Delete className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mx-4 mb-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-600">{error}</div>}

        <div className="p-4 pt-0 flex gap-3">
          <button onClick={clearAll} className="p-3 rounded-xl bg-muted border border-border/60 hover:border-border transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            onClick={handleCharge}
            disabled={charge.isPending}
            className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl transition-all shadow-sm disabled:opacity-60"
          >
            {charge.isPending ? "Processing…" : `Charge ${parseFloat(amount).toFixed(2)} ${currency}`}
          </button>
        </div>
      </div>
    </div>
  );
}
