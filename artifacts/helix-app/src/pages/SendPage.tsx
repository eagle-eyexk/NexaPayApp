import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSendFunds, useGetUserWallets, getGetUserWalletsQueryKey, getGetUserTransactionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Send, CheckCircle2, ArrowLeft } from "lucide-react";

export default function SendPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const qc = useQueryClient();
  const { data: wallets } = useGetUserWallets({ query: { queryKey: getGetUserWalletsQueryKey() } });
  const sendFunds = useSendFunds();

  const [currency, setCurrency] = useState("USD");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (!isLoading && !user) setLocation("/login"); }, [user, isLoading]);

  const selectedWallet = wallets?.find((w) => w.currency === currency);
  const balance = selectedWallet ? parseFloat(selectedWallet.balance) : 0;
  const amountNum = parseFloat(amount) || 0;
  const insufficient = amountNum > balance;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (insufficient) { setError("Insufficient balance"); return; }
    sendFunds.mutate(
      { data: { recipientAddress, amount: amountNum, currency, description: description || undefined } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetUserWalletsQueryKey() });
          qc.invalidateQueries({ queryKey: getGetUserTransactionsQueryKey() });
          setSuccess(true);
        },
        onError: (err: any) => setError(err?.message ?? "Transfer failed"),
      }
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Sent!</h2>
          <p className="text-muted-foreground">
            <span className="text-emerald-700 font-semibold">{amount} {currency}</span> sent successfully.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSuccess(false); setAmount(""); setRecipientAddress(""); setDescription(""); }} className="px-5 py-2.5 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80 transition-colors border border-border/60">Send Another</button>
            <button onClick={() => setLocation("/dashboard")} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button onClick={() => setLocation("/dashboard")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      <div>
        <h1 className="text-xl font-bold">Send Funds</h1>
        <p className="text-muted-foreground text-sm mt-1">Transfer crypto to any wallet address</p>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-5 shadow-sm">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">Currency</label>
          <div className="flex flex-wrap gap-2">
            {(wallets ?? []).map((w) => (
              <button
                key={w.currency}
                type="button"
                onClick={() => setCurrency(w.currency)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currency === w.currency ? "bg-primary/15 text-primary border border-primary/40" : "bg-muted text-muted-foreground border border-transparent hover:border-border"}`}
              >
                {w.currency}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Available: <span className="text-foreground font-medium">{balance.toFixed(8)} {currency}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Recipient Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x... or wallet address"
              required
              className="w-full bg-muted border border-border/60 rounded-lg px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="any"
                min="0"
                required
                className={`w-full bg-muted border rounded-lg px-4 py-3 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${insufficient ? "border-red-500/50 focus:ring-red-500/30" : "border-border/60"}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">{currency}</span>
            </div>
            {amount && (
              <div className="mt-1 flex justify-between text-xs">
                <span className={insufficient ? "text-red-600" : "text-muted-foreground"}>
                  {insufficient ? "⚠ Insufficient balance" : "✓ Amount valid"}
                </span>
                <button type="button" onClick={() => setAmount(balance.toFixed(8))} className="text-primary hover:text-primary/80 transition-colors">Max</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Memo / Description <span className="text-muted-foreground/60">(optional)</span></label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Payment for services..."
              className="w-full bg-muted border border-border/60 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={sendFunds.isPending || insufficient || !amount || !recipientAddress}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            {sendFunds.isPending ? "Sending…" : `Send ${amount || "0"} ${currency}`}
          </button>
        </form>
      </div>
    </div>
  );
}
