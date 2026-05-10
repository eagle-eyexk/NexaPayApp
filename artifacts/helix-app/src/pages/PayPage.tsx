import { useState } from "react";
import { useRoute } from "wouter";
import { useGetPaymentLinkByCode, usePayLink, getGetPaymentLinkByCodeQueryKey } from "@workspace/api-client-react";
import { CheckCircle2, Zap, Download, AlertCircle, Clock } from "lucide-react";

export default function PayPage() {
  const [, params] = useRoute("/pay/:code");
  const code = params?.code ?? "";

  const { data: link, isLoading, error: fetchError } = useGetPaymentLinkByCode(code, {
    query: { queryKey: getGetPaymentLinkByCodeQueryKey(code), enabled: !!code, retry: false },
  });

  const payLink = usePayLink();

  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [result, setResult] = useState<{ receiptUrl: string; couponPdfUrl: string } | null>(null);
  const [error, setError] = useState("");

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    payLink.mutate(
      { code, data: { payerName, payerEmail } },
      {
        onSuccess: (res) => setResult({ receiptUrl: res.receiptUrl, couponPdfUrl: res.couponPdfUrl }),
        onError: (err: any) => setError(err?.message ?? "Payment failed"),
      }
    );
  }

  if (isLoading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading payment…</p>
        </div>
      </div>
    );
  }

  if (fetchError || !link) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3 max-w-sm">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Link Not Found</h2>
          <p className="text-muted-foreground text-sm">This payment link doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (link.status !== "active") {
    const icons: Record<string, string> = { paid: "✅", expired: "⏰", cancelled: "❌" };
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border/50 rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="text-5xl">{icons[link.status] ?? "⚠️"}</div>
          <h2 className="text-xl font-bold capitalize">{link.status}</h2>
          <p className="text-muted-foreground text-sm">
            {link.status === "paid" ? "This payment has already been completed." :
             link.status === "expired" ? "This payment link has expired." :
             "This payment link has been cancelled."}
          </p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-emerald-500/30 rounded-2xl p-10 max-w-md w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.1)] space-y-5">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
            <p className="text-muted-foreground text-sm mt-1">Thank you, {payerName}</p>
          </div>
          <div className="bg-muted rounded-xl p-5 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-emerald-400">{parseFloat(link.amount).toFixed(2)} {link.currency}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span className="text-foreground truncate ml-4">{link.description}</span></div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => window.open(result.couponPdfUrl, "_blank")} className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              <Download className="h-4 w-4" /> Download Payment Coupon
            </button>
            <button onClick={() => window.open(result.receiptUrl, "_blank")} className="flex items-center justify-center gap-2 w-full py-2.5 bg-muted border border-border/50 rounded-lg text-sm font-medium hover:border-primary/40 transition-colors">
              <Download className="h-4 w-4" /> Download Receipt PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">
        {/* Helix branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 border border-primary/30 rounded-xl mb-3">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div className="text-xs text-muted-foreground tracking-widest">HELIX PROTOCOL · SECURE PAYMENT</div>
        </div>

        {/* Payment card */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-5">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">You're paying</div>
            <div className="text-3xl font-bold text-primary">{parseFloat(link.amount).toFixed(2)} <span className="text-lg">{link.currency}</span></div>
            <div className="text-sm text-muted-foreground mt-1">{link.description}</div>
            {link.expiresAt && (
              <div className="flex items-center gap-1 text-xs text-yellow-400 mt-2">
                <Clock className="h-3 w-3" /> Expires {new Date(link.expiresAt).toLocaleString()}
              </div>
            )}
          </div>

          <div className="border-t border-border/40" />

          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Your Name</label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Alex Johnson"
                required
                className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">{error}</div>}

            <button
              type="submit"
              disabled={payLink.isPending}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] disabled:opacity-60"
            >
              {payLink.isPending ? "Processing…" : `Pay ${parseFloat(link.amount).toFixed(2)} ${link.currency}`}
            </button>
          </form>

          <div className="text-xs text-muted-foreground text-center">
            🔒 Secured by Helix Protocol · End-to-end encrypted
          </div>
        </div>
      </div>
    </div>
  );
}
