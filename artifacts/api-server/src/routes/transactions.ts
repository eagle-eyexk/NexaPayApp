import { Router } from "express";

const router = Router();

const CHAINS = ["Solana", "Ethereum", "Base", "Polygon", "Avalanche", "Arbitrum"];
const STATUSES = ["Completed", "Completed", "Completed", "Settling", "Routing", "Failed", "Disputed"] as const;
const CURRENCIES = ["USDC", "USDT", "ETH", "SOL", "MATIC", "AVAX", "ARB"];

function shortAddress() {
  const chars = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * chars.length)];
  return addr;
}

function generateTransactions() {
  const txs = [];
  const now = Date.now();

  const seeds = [
    { id: "tx-8a4f2c", amount: 14820.5, currency: "USDC", chain: "Solana", status: "Completed", trustScore: 0.97, latencyMs: 241 },
    { id: "tx-3bc91d", amount: 2100.0, currency: "ETH", chain: "Ethereum", status: "Failed", trustScore: 0.12, latencyMs: 502 },
    { id: "tx-9fe44a", amount: 8450000.0, currency: "USDT", chain: "Polygon", status: "Completed", trustScore: 0.99, latencyMs: 189 },
    { id: "tx-2ad71f", amount: 4800000.0, currency: "USDC", chain: "Ethereum", status: "Completed", trustScore: 0.98, latencyMs: 312 },
    { id: "tx-c7e83b", amount: 63200.0, currency: "AVAX", chain: "Avalanche", status: "Completed", trustScore: 0.95, latencyMs: 271 },
    { id: "tx-f1b29e", amount: 892.3, currency: "USDC", chain: "Base", status: "Settling", trustScore: 0.91, latencyMs: 0 },
    { id: "tx-a72c4d", amount: 331400.0, currency: "ARB", chain: "Arbitrum", status: "Routing", trustScore: 0.88, latencyMs: 0 },
    { id: "tx-d84e1a", amount: 7100.0, currency: "SOL", chain: "Solana", status: "Completed", trustScore: 0.96, latencyMs: 198 },
    { id: "tx-5c3f8b", amount: 22000.0, currency: "USDT", chain: "Ethereum", status: "Disputed", trustScore: 0.43, latencyMs: 891 },
    { id: "tx-b19d2f", amount: 1492.5, currency: "MATIC", chain: "Polygon", status: "Completed", trustScore: 0.94, latencyMs: 224 },
    { id: "tx-e62a7c", amount: 500000.0, currency: "USDC", chain: "Base", status: "Completed", trustScore: 0.99, latencyMs: 167 },
    { id: "tx-4f8c1d", amount: 12780.0, currency: "AVAX", chain: "Avalanche", status: "Completed", trustScore: 0.97, latencyMs: 252 },
    { id: "tx-8e3b6a", amount: 88900.0, currency: "USDT", chain: "Arbitrum", status: "Completed", trustScore: 0.93, latencyMs: 301 },
    { id: "tx-1a9d4e", amount: 443.0, currency: "ETH", chain: "Ethereum", status: "Failed", trustScore: 0.21, latencyMs: 412 },
    { id: "tx-7c2f5b", amount: 19200.0, currency: "SOL", chain: "Solana", status: "Completed", trustScore: 0.98, latencyMs: 219 },
    { id: "tx-3e8a1d", amount: 6750000.0, currency: "USDC", chain: "Polygon", status: "Completed", trustScore: 0.99, latencyMs: 281 },
    { id: "tx-9b4c7f", amount: 2890.0, currency: "USDT", chain: "Base", status: "Settling", trustScore: 0.87, latencyMs: 0 },
    { id: "tx-6d1e3a", amount: 112000.0, currency: "AVAX", chain: "Avalanche", status: "Completed", trustScore: 0.96, latencyMs: 242 },
    { id: "tx-2c7b9e", amount: 44100.0, currency: "ARB", chain: "Arbitrum", status: "Completed", trustScore: 0.95, latencyMs: 289 },
    { id: "tx-5f3d8c", amount: 1831.0, currency: "MATIC", chain: "Polygon", status: "Routing", trustScore: 0.89, latencyMs: 0 },
  ];

  return seeds.map((seed, i) => ({
    id: seed.id,
    timestamp: new Date(now - i * 47000 - Math.floor(Math.random() * 10000)).toISOString(),
    sourceAddress: shortAddress(),
    destinationAddress: shortAddress(),
    amount: seed.amount,
    currency: seed.currency,
    chain: seed.chain,
    status: seed.status,
    trustScore: seed.trustScore,
    fraudProbability: 1 - seed.trustScore + Math.random() * 0.05,
    estimatedFee: seed.amount * 0.0008,
    latencyMs: seed.latencyMs,
    route: [`node-us-east-1`, `node-eu-central-1`, `node-ap-east-1`].slice(0, Math.floor(Math.random() * 2) + 1),
  }));
}

const TRANSACTIONS = generateTransactions();

router.get("/transactions/summary", (req, res) => {
  const completed = TRANSACTIONS.filter((t) => t.status === "Completed").length;
  const pending = TRANSACTIONS.filter((t) => t.status === "Settling" || t.status === "Routing").length;
  const failed = TRANSACTIONS.filter((t) => t.status === "Failed").length;
  const totalVolume = TRANSACTIONS.reduce((s, t) => s + t.amount, 0);

  res.json({
    totalCount: TRANSACTIONS.length,
    completedCount: completed,
    pendingCount: pending,
    failedCount: failed,
    totalVolume,
    avgAmount: totalVolume / TRANSACTIONS.length,
    successRate: completed / TRANSACTIONS.length,
  });
});

router.get("/transactions/:id", (req, res) => {
  const tx = TRANSACTIONS.find((t) => t.id === req.params.id);
  if (!tx) return res.status(404).json({ error: "Transaction not found" });
  return res.json(tx);
});

router.get("/transactions", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const status = req.query.status as string | undefined;
  let txs = TRANSACTIONS;
  if (status) txs = txs.filter((t) => t.status.toLowerCase() === status.toLowerCase());
  res.json(txs.slice(0, limit));
});

export default router;
