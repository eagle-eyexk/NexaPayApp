/**
 * NEXA Portfolio Mathematics & Network Analytics
 *
 * Institutional-grade financial and statistical algorithms.
 * All formulas documented with mathematical definitions.
 *
 * ─────────────────────────────────────────────────────────────────
 * Risk-Return Metrics
 *   Sharpe  S  = (R_p - R_f) / σ_p × √252          annualised
 *   Sortino St = (R_p - R_f) / σ_d × √252          downside only
 *   Calmar  C  = CAGR / |MDD|
 *   Kelly   f* = (bp - q) / b                       half-Kelly applied
 *
 * Risk Metrics
 *   Parametric VaR = -(μ - z_α × σ) × V            Gaussian
 *   Historical VaR = -quantile_α(returns) × V        non-parametric
 *   MDD            = min((V_t - Peak_t) / Peak_t)
 *
 * Network Metrics
 *   Gini G = Σ|x_i - x_j| / (2n × ΣX)             load inequality
 *   Shannon H = -Σ p_i log₂ p_i                    distribution entropy
 * ─────────────────────────────────────────────────────────────────
 */

// ── Descriptive statistics ─────────────────────────────────────────────────

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function variance(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  return values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1);
}

export function stdDev(values: number[]): number {
  return Math.sqrt(variance(values));
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.max(0, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[idx];
}

// ── Return series ──────────────────────────────────────────────────────────

/** Log returns: r_t = ln(P_t / P_{t-1}) — time-additive, preferred for risk */
export function logReturns(prices: number[]): number[] {
  if (prices.length < 2) return [];
  return prices.slice(1).map((p, i) => Math.log(p / Math.max(prices[i], 1e-9)));
}

/** Simple (arithmetic) returns: r_t = (P_t - P_{t-1}) / P_{t-1} */
export function simpleReturns(prices: number[]): number[] {
  if (prices.length < 2) return [];
  return prices.slice(1).map((p, i) => (p - prices[i]) / Math.max(prices[i], 1e-9));
}

// ── Sharpe ratio ───────────────────────────────────────────────────────────

/**
 * Annualised Sharpe Ratio: S = (R_p - R_f) / σ_p × √T
 *   T = 252 trading days
 *   R_f = 5% annual / 252 days = 0.0198% daily (default)
 *
 * Interpretation: S > 1 = acceptable, S > 2 = very good, S > 3 = exceptional
 */
export function sharpeRatio(dailyReturns: number[], riskFreeAnnual = 0.05): number {
  if (dailyReturns.length < 2) return 0;
  const rfDaily = riskFreeAnnual / 252;
  const excess = dailyReturns.map((r) => r - rfDaily);
  const s = stdDev(excess);
  if (s === 0) return 0;
  return (mean(excess) / s) * Math.sqrt(252);
}

// ── Sortino ratio ──────────────────────────────────────────────────────────

/**
 * Sortino Ratio: St = (R_p - R_f) / σ_d × √252
 * Only penalises downside volatility (σ_d = std dev of negative excess returns).
 * More appropriate for asymmetric distributions (e.g. crypto).
 */
export function sortinoRatio(dailyReturns: number[], riskFreeAnnual = 0.05): number {
  if (dailyReturns.length < 2) return 0;
  const rfDaily = riskFreeAnnual / 252;
  const annReturn = mean(dailyReturns) * 252;
  const downside = dailyReturns.filter((r) => r < rfDaily);
  if (downside.length === 0) return 99;
  const σd = stdDev(downside) * Math.sqrt(252);
  if (σd === 0) return 99;
  return (annReturn - riskFreeAnnual) / σd;
}

// ── Value at Risk ──────────────────────────────────────────────────────────

/**
 * Parametric VaR (Gaussian):
 *   VaR_α = -(μ - z_α × σ) × V
 *   z-scores: 90% → 1.282, 95% → 1.645, 99% → 2.326
 */
export function parametricVaR(
  dailyReturns: number[],
  portfolioValue: number,
  confidence = 0.95,
): number {
  if (dailyReturns.length < 2) return 0;
  const zMap: Record<number, number> = { 0.9: 1.282, 0.95: 1.645, 0.99: 2.326, 0.999: 3.09 };
  const z = zMap[confidence] ?? 1.645;
  const m = mean(dailyReturns);
  const s = stdDev(dailyReturns);
  return Math.max(0, -(m - z * s) * portfolioValue);
}

/**
 * Historical (non-parametric) VaR — captures fat tails.
 *   VaR_α = -quantile_{1-α}(returns) × V
 */
export function historicalVaR(
  dailyReturns: number[],
  portfolioValue: number,
  confidence = 0.95,
): number {
  if (dailyReturns.length < 2) return 0;
  const sorted = [...dailyReturns].sort((a, b) => a - b);
  const idx = Math.floor((1 - confidence) * sorted.length);
  return Math.max(0, -(sorted[idx] ?? sorted[0]) * portfolioValue);
}

// ── Maximum Drawdown ───────────────────────────────────────────────────────

/**
 * Maximum Drawdown:
 *   MDD = min_{t} ((V_t - max_{s≤t}(V_s)) / max_{s≤t}(V_s))
 *
 * Returns the percentage decline from peak to trough, plus indices.
 */
export function maxDrawdown(portfolioValues: number[]): {
  mdd: number;
  peak: number;
  trough: number;
  peakIdx: number;
  troughIdx: number;
  recoveryIdx: number | null;
} {
  if (portfolioValues.length < 2) {
    return { mdd: 0, peak: portfolioValues[0] ?? 0, trough: portfolioValues[0] ?? 0, peakIdx: 0, troughIdx: 0, recoveryIdx: null };
  }

  let peak = portfolioValues[0];
  let peakIdx = 0;
  let mdd = 0;
  let troughIdx = 0;
  let mddPeakIdx = 0;

  for (let i = 1; i < portfolioValues.length; i++) {
    if (portfolioValues[i] > peak) {
      peak = portfolioValues[i];
      peakIdx = i;
    }
    const dd = (peak - portfolioValues[i]) / peak;
    if (dd > mdd) {
      mdd = dd;
      troughIdx = i;
      mddPeakIdx = peakIdx;
    }
  }

  let recoveryIdx: number | null = null;
  const peakVal = portfolioValues[mddPeakIdx];
  for (let i = troughIdx + 1; i < portfolioValues.length; i++) {
    if (portfolioValues[i] >= peakVal) { recoveryIdx = i; break; }
  }

  return {
    mdd,
    peak: portfolioValues[mddPeakIdx],
    trough: portfolioValues[troughIdx],
    peakIdx: mddPeakIdx,
    troughIdx,
    recoveryIdx,
  };
}

// ── Calmar ratio ───────────────────────────────────────────────────────────

/** Calmar Ratio: C = CAGR / |MDD|  (annualised return per unit of drawdown) */
export function calmarRatio(dailyReturns: number[], portfolioValues: number[]): number {
  if (!dailyReturns.length || !portfolioValues.length) return 0;
  const annReturn = mean(dailyReturns) * 252;
  const { mdd } = maxDrawdown(portfolioValues);
  return mdd === 0 ? 99 : annReturn / mdd;
}

// ── Kelly Criterion ────────────────────────────────────────────────────────

/**
 * Half-Kelly fraction: f* = 0.5 × (bp - q) / b
 *   b = avgWin / avgLoss   (odds ratio)
 *   p = win rate, q = 1 - p
 *
 * Half-Kelly applied for practical risk management (avoids ruin).
 * Returns optimal portfolio fraction for the given edge.
 */
export function kellyCriterion(winRate: number, avgWin: number, avgLoss: number): number {
  if (avgLoss === 0 || avgWin === 0) return 0;
  const b = avgWin / avgLoss;
  const p = Math.max(0, Math.min(1, winRate));
  const q = 1 - p;
  const f = (b * p - q) / b;
  return Math.max(0, Math.min(1, f * 0.5));
}

// ── Price analytics ────────────────────────────────────────────────────────

/**
 * TWAP: Σ(P_i × Δt_i) / Σ(Δt_i)
 * Time-weighted — eliminates volume manipulation bias.
 */
export function twap(prices: { price: number; timestamp: number }[]): number {
  if (prices.length < 2) return prices[0]?.price ?? 0;
  let totalWeighted = 0;
  let totalTime = 0;
  for (let i = 1; i < prices.length; i++) {
    const dt = prices[i].timestamp - prices[i - 1].timestamp;
    totalWeighted += prices[i - 1].price * dt;
    totalTime += dt;
  }
  return totalTime > 0 ? totalWeighted / totalTime : prices[0].price;
}

/**
 * VWAP: Σ(P_i × V_i) / Σ(V_i)
 * Volume-weighted — institutional benchmark for execution quality.
 */
export function vwap(trades: { price: number; volume: number }[]): number {
  const totalVol = trades.reduce((s, t) => s + t.volume, 0);
  if (totalVol === 0) return 0;
  return trades.reduce((s, t) => s + t.price * t.volume, 0) / totalVol;
}

/**
 * Exponential Moving Average: EMA_t = α × P_t + (1 - α) × EMA_{t-1}
 * α = 2 / (period + 1)
 */
export function ema(values: number[], period: number): number[] {
  if (values.length === 0) return [];
  const α = 2 / (period + 1);
  const result = [values[0]];
  for (let i = 1; i < values.length; i++) {
    result.push(α * values[i] + (1 - α) * result[i - 1]);
  }
  return result;
}

/**
 * Bollinger Bands: Upper/Lower = SMA ± k × σ_window
 * Standard: period = 20, k = 2 (covers ~95% of values under normality).
 */
export function bollingerBands(
  values: number[],
  period = 20,
  k = 2,
): { upper: number[]; middle: number[]; lower: number[] } {
  const upper: number[] = [];
  const middle: number[] = [];
  const lower: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const window = values.slice(Math.max(0, i - period + 1), i + 1);
    const m = mean(window);
    const s = stdDev(window);
    middle.push(m);
    upper.push(m + k * s);
    lower.push(m - k * s);
  }
  return { upper, middle, lower };
}

// ── Network analytics ───────────────────────────────────────────────────────

/**
 * Gini Coefficient (efficient O(n log n)):
 *   G = (2 × Σ (i × x_i)) / (n × ΣX) - (n+1)/n
 *
 * G = 0: perfect equality (ideal load distribution)
 * G = 1: maximum inequality (one node handles all traffic)
 */
export function giniCoefficient(values: number[]): number {
  if (values.length === 0) return 0;
  const total = values.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;
  const n = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const numerator = sorted.reduce((s, v, i) => s + (2 * (i + 1) - n - 1) * v, 0);
  return Math.abs(numerator) / (n * total);
}

/**
 * Shannon Entropy: H = -Σ p_i log₂(p_i)
 * Measures unpredictability/diversity of transaction distribution.
 * Max entropy for n nodes = log₂(n) bits.
 * Higher entropy = more decentralised network.
 */
export function shannonEntropy(values: number[]): number {
  const total = values.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;
  return -values
    .map((v) => v / total)
    .filter((p) => p > 0)
    .reduce((s, p) => s + p * Math.log2(p), 0);
}

/**
 * Network Health Score (0–100)
 * Composite: avgHealth (40%) + loadBalance (30%) + utilisation (30%)
 *
 * Optimal utilisation ≈ 70–80%.
 * Penalises both under-use (capacity waste) and over-use (latency risk).
 */
export function networkHealthScore(
  nodes: { health: number; currentLoad: number; capacity: number }[],
): number {
  if (nodes.length === 0) return 0;
  const avgHealth = mean(nodes.map((n) => n.health));
  const ratios = nodes.map((n) => n.currentLoad / n.capacity);
  const loadBalance = 1 - giniCoefficient(ratios);
  const avgUtil = mean(ratios);
  const utilScore = avgUtil < 0.85 ? 1 - Math.abs(avgUtil - 0.75) * 2 : 1 - (avgUtil - 0.85) * 10;
  return Math.min(100, Math.max(0, avgHealth * 40 + loadBalance * 30 + Math.max(0, utilScore) * 30));
}

// ── Portfolio analytics ─────────────────────────────────────────────────────

export interface PortfolioMetrics {
  totalIn: number;
  totalOut: number;
  netFlow: number;
  txCount: number;
  avgTxSize: number;
  largestTx: number;
  sharpe: number;
  sortino: number;
  volatilityAnnualised: number;
  var95: number;
  maxDrawdownPct: number;
  winRate: number;
  kellyFraction: number;
  calmar: number;
}

/**
 * Compute institutional-grade portfolio metrics from a user's transaction history.
 * Uses historical VaR (non-parametric) for crypto's fat-tailed distribution.
 */
export function computePortfolioMetrics(
  transactions: { amount: number; type: "in" | "out"; timestamp: number }[],
  currentBalance: number,
): PortfolioMetrics {
  const ins = transactions.filter((t) => t.type === "in");
  const outs = transactions.filter((t) => t.type === "out");
  const totalIn = ins.reduce((s, t) => s + t.amount, 0);
  const totalOut = outs.reduce((s, t) => s + t.amount, 0);
  const amounts = transactions.map((t) => t.amount);

  // Build portfolio value series
  let balance = Math.max(currentBalance - totalIn + totalOut, 0);
  const series = transactions
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((t) => {
      balance += t.type === "in" ? t.amount : -t.amount;
      return Math.max(0, balance);
    });

  const returns = series.length > 1 ? simpleReturns(series) : [];
  const winReturns = returns.filter((r) => r > 0);
  const lossReturns = returns.filter((r) => r < 0);
  const winRate = returns.length > 0 ? winReturns.length / returns.length : 0;

  return {
    totalIn,
    totalOut,
    netFlow: totalIn - totalOut,
    txCount: transactions.length,
    avgTxSize: amounts.length > 0 ? mean(amounts) : 0,
    largestTx: amounts.length > 0 ? Math.max(...amounts) : 0,
    sharpe: returns.length > 1 ? sharpeRatio(returns) : 0,
    sortino: returns.length > 1 ? sortinoRatio(returns) : 0,
    volatilityAnnualised: returns.length > 1 ? stdDev(returns) * Math.sqrt(252) : 0,
    var95: returns.length > 1 ? historicalVaR(returns, currentBalance) : 0,
    maxDrawdownPct: series.length > 1 ? maxDrawdown(series).mdd : 0,
    winRate,
    kellyFraction:
      winRate > 0 && winReturns.length > 0 && lossReturns.length > 0
        ? kellyCriterion(winRate, mean(winReturns), Math.abs(mean(lossReturns)))
        : 0,
    calmar: series.length > 1 ? calmarRatio(returns, series) : 0,
  };
}
