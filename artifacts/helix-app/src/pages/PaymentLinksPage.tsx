import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useCreatePaymentLink, useCancelPaymentLink, useListPaymentLinks,
  getListPaymentLinksQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import QRCode from "react-qr-code";
import { Plus, Copy, Check, X, Link2, Clock } from "lucide-react";

const CURRENCIES = ["USD", "USDC", "ETH", "SOL", "BTC"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    paid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    expired: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}>{status}</span>;
}

export default function PaymentLinksPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const qc = useQueryClient();
  const createLink = useCreatePaymentLink();
  const cancelLink = useCancelPaymentLink();
  const { data: links, refetch } = useListPaymentLinks({ query: { queryKey: getListPaymentLinksQueryKey() } });

  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [desc, setDesc] = useState("");
  const [expires, setExpires] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading) {
      if (!user) setLocation("/login");
      else if (user.role !== "merchant") setLocation("/dashboard");
    }
  }, [user, isLoading]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    createLink.mutate(
      { data: { amount: parseFloat(amount), currency, description: desc, expiresInHours: expires ? parseInt(expires) : undefined } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListPaymentLinksQueryKey() });
          setShowForm(false);
          setAmount(""); setDesc(""); setExpires("");
        },
        onError: () => setError("Failed to create payment link"),
      }
    );
  }

  function handleCancel(id: string) {
    cancelLink.mutate({ id }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListPaymentLinksQueryKey() }),
    });
  }

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Payment Links</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Create shareable payment requests</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary text-sm font-semibold transition-all"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "New Link"}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Create Payment Link</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Amount</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="any" min="0" required className="w-full bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
              <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What is this payment for?" required className="w-full bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Expires in (hours) <span className="text-muted-foreground/60">– optional</span></label>
              <input type="number" value={expires} onChange={(e) => setExpires(e.target.value)} placeholder="e.g. 24" min="1" className="w-full bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={createLink.isPending} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60">
              {createLink.isPending ? "Creating…" : "Create Link"}
            </button>
          </form>
        </div>
      )}

      {!links || links.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card border border-border/60 rounded-xl">
          <Link2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <div className="font-medium">No payment links yet</div>
          <div className="text-sm mt-1">Create your first link to start accepting payments</div>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className={`bg-card border rounded-xl p-5 shadow-sm transition-colors ${link.status === "active" ? "border-primary/25" : "border-border/60"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm truncate">{link.description}</span>
                    <StatusBadge status={link.status} />
                  </div>
                  <div className="text-2xl font-bold text-primary">{parseFloat(link.amount).toFixed(2)} <span className="text-sm">{link.currency}</span></div>
                  {link.expiresAt && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" /> Expires {new Date(link.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                  {link.paidAt && (
                    <div className="text-xs text-emerald-700 mt-1">Paid on {new Date(link.paidAt).toLocaleString()}</div>
                  )}
                </div>

                <div className="shrink-0 p-2 bg-white rounded-lg shadow-sm border border-border/40">
                  <QRCode value={link.url} size={64} level="L" fgColor="#0f172a" bgColor="#ffffff" />
                </div>
              </div>

              {link.status === "active" && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 font-mono text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 truncate border border-border/40">{link.url}</div>
                  <button
                    onClick={() => copyUrl(link.url, link.id)}
                    className={`p-2 rounded-lg border transition-all ${copiedId === link.id ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700" : "bg-muted border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary"}`}
                  >
                    {copiedId === link.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleCancel(link.id)}
                    disabled={cancelLink.isPending}
                    className="p-2 rounded-lg border border-border/60 bg-muted text-muted-foreground hover:border-red-500/40 hover:text-red-600 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
