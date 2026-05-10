import { Router } from "express";

const router = Router();

function generateActivity(limit: number) {
  const events = [
    { id: "act-001", type: "settlement", message: "Cross-chain settlement completed: SOL → ETH in 241ms", timestamp: new Date(Date.now() - 15000).toISOString(), severity: "success", txId: "tx-8a4f2c", chain: "Solana" },
    { id: "act-002", type: "fraud_blocked", message: "Suspicious transaction pattern detected and blocked — probability 97.3%", timestamp: new Date(Date.now() - 42000).toISOString(), severity: "warning", txId: "tx-3bc91d", chain: "Ethereum" },
    { id: "act-003", type: "route_optimized", message: "AER engine rerouted 847 transactions via EU Central due to US East congestion", timestamp: new Date(Date.now() - 89000).toISOString(), severity: "info", txId: null, chain: null },
    { id: "act-004", type: "liquidity", message: "Liquidity pool replenishment triggered on Base — $12.4M injected", timestamp: new Date(Date.now() - 134000).toISOString(), severity: "info", txId: null, chain: "Base" },
    { id: "act-005", type: "settlement", message: "Institutional batch transfer settled: 1,200 txns in 1.4s", timestamp: new Date(Date.now() - 198000).toISOString(), severity: "success", txId: "tx-9fe44a", chain: "Polygon" },
    { id: "act-006", type: "node_alert", message: "Asia Pacific EdgeNode performance degraded — failover activated", timestamp: new Date(Date.now() - 251000).toISOString(), severity: "error", txId: null, chain: null },
    { id: "act-007", type: "settlement", message: "High-value transfer $4.8M completed — MPC security verified", timestamp: new Date(Date.now() - 314000).toISOString(), severity: "success", txId: "tx-2ad71f", chain: "Ethereum" },
    { id: "act-008", type: "route_optimized", message: "Dynamic fee adjustment saved network $2.1M in routing costs this hour", timestamp: new Date(Date.now() - 392000).toISOString(), severity: "info", txId: null, chain: null },
    { id: "act-009", type: "fraud_blocked", message: "Coordinated attack pattern neutralized across 14 wallets", timestamp: new Date(Date.now() - 451000).toISOString(), severity: "warning", txId: null, chain: "Arbitrum" },
    { id: "act-010", type: "settlement", message: "Cross-chain DeFi swap finalized: AVAX → SOL via 3-hop route", timestamp: new Date(Date.now() - 523000).toISOString(), severity: "success", txId: "tx-c7e83b", chain: "Avalanche" },
  ];
  return events.slice(0, limit);
}

router.get("/activity/feed", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  res.json(generateActivity(limit));
});

export default router;
