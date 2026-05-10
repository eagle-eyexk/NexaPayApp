import { Router } from "express";

const router = Router();

router.get("/stats/network", (req, res) => {
  res.json({
    totalTransactions: 3248971,
    totalVolume: 24813500000,
    activeWallets: 1203847,
    networkUptime: 99.98,
    countriesCount: 152,
    avgSettlementMs: 248,
    fraudPreventionRate: 99.97,
    crossChainTransfers: 12,
  });
});

const CHAINS = [
  { chain: "Solana", symbol: "SOL", volume: 8200000000, transactions: 1104291, color: "#9945FF" },
  { chain: "Ethereum", symbol: "ETH", volume: 7400000000, transactions: 893442, color: "#627EEA" },
  { chain: "Base", symbol: "BASE", volume: 3100000000, transactions: 524819, color: "#0052FF" },
  { chain: "Polygon", symbol: "MATIC", volume: 2800000000, transactions: 391224, color: "#8247E5" },
  { chain: "Avalanche", symbol: "AVAX", volume: 2100000000, transactions: 233861, color: "#E84142" },
  { chain: "Arbitrum", symbol: "ARB", volume: 1213500000, transactions: 101334, color: "#28A0F0" },
];

router.get("/stats/chains", (req, res) => {
  res.json(CHAINS);
});

export default router;
