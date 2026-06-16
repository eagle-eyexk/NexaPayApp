/**
 * NEXA Analytics Routes
 *
 *   GET /analytics/portfolio   — Institutional portfolio metrics (authenticated)
 */

import { Router } from "express";
import { eq, or } from "drizzle-orm";
import { db, transactionsTable, walletsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { computePortfolioMetrics } from "../lib/portfolio-math";
import { blockEngine } from "../lib/block-engine";
import { estimateGasCost } from "../lib/crypto-engine";

const router = Router();

/**
 * GET /analytics/portfolio
 *
 * Computes institutional-grade portfolio risk/return metrics from the
 * authenticated user's complete transaction history.
 *
 * Metrics returned:
 *   sharpe           Annualised Sharpe ratio      S = (R_p - R_f) / σ × √252
 *   sortino          Sortino ratio                St = (R_p - R_f) / σ_d × √252
 *   volatilityAnn    Annualised volatility        σ_ann = σ_daily × √252
 *   var95            1-day historical VaR (95%)   non-parametric
 *   maxDrawdownPct   Maximum drawdown             MDD = (Peak - Trough) / Peak
 *   calmar           Calmar ratio                 C = CAGR / |MDD|
 *   winRate          Win rate                     wins / total trades
 *   kellyFraction    Half-Kelly fraction          f* = 0.5 × (bp − q) / b
 */
router.get("/analytics/portfolio", requireAuth, async (req, res) => {
  const userId = req.session.userId!;

  const [txs, wallets] = await Promise.all([
    db
      .select()
      .from(transactionsTable)
      .where(or(eq(transactionsTable.senderId, userId), eq(transactionsTable.recipientId, userId))),
    db.select().from(walletsTable).where(eq(walletsTable.userId, userId)),
  ]);

  const currentBalance = wallets.reduce((s, w) => s + parseFloat(w.balance ?? "0"), 0);
  const transactions = txs.map((tx) => ({
    amount: parseFloat(tx.amount),
    type: (tx.recipientId === userId ? "in" : "out") as "in" | "out",
    timestamp: tx.createdAt.getTime(),
  }));

  const metrics = computePortfolioMetrics(transactions, currentBalance);
  const baseFee = blockEngine.getCurrentBaseFee();
  const gasEst = estimateGasCost(baseFee, 21_000);
  const latest = blockEngine.getLatestBlock();

  res.json({
    // Portfolio risk/return metrics
    ...metrics,
    // Wallet summary
    currentBalance: parseFloat(currentBalance.toFixed(8)),
    walletCount: wallets.length,
    // Live blockchain context
    currentBaseFeeGwei: parseFloat(baseFee.toFixed(6)),
    gasEstimateNexa: parseFloat(gasEst.estimatedCostNexa.toFixed(8)),
    maxFeePerGas: parseFloat(gasEst.maxFeePerGas.toFixed(6)),
    latestBlockNumber: latest?.number ?? 0,
    tps: parseFloat(blockEngine.getTPS().toFixed(2)),
  });
});

export default router;
