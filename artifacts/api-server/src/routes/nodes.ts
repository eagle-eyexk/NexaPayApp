/**
 * NEXA Network Nodes
 * Returns real-time node analytics using Gini coefficient, Shannon entropy,
 * and network health scoring.
 */

import { Router } from "express";
import { giniCoefficient, networkHealthScore, mean, stdDev, shannonEntropy } from "../lib/portfolio-math";

const router = Router();

const BASE_NODES = [
  { id: "node-us-east-1",  nodeType: "ValidatorNode", region: "US East",      capacity: 10000, currentLoad: 7821,  health: 0.99, status: "Healthy",  transactionsHandled: 874291 },
  { id: "node-us-west-1",  nodeType: "EdgeNode",      region: "US West",      capacity: 8000,  currentLoad: 5102,  health: 0.97, status: "Healthy",  transactionsHandled: 612449 },
  { id: "node-eu-west-1",  nodeType: "ValidatorNode", region: "EU West",      capacity: 10000, currentLoad: 8934,  health: 0.96, status: "Healthy",  transactionsHandled: 923811 },
  { id: "node-eu-central-1", nodeType: "LiquidityPool", region: "EU Central", capacity: 15000, currentLoad: 11241, health: 0.98, status: "Healthy",  transactionsHandled: 1041223 },
  { id: "node-ap-east-1",  nodeType: "EdgeNode",      region: "Asia Pacific", capacity: 8000,  currentLoad: 6441,  health: 0.94, status: "Degraded", transactionsHandled: 549012 },
  { id: "node-ap-south-1", nodeType: "Bridge",        region: "Asia South",   capacity: 6000,  currentLoad: 2891,  health: 0.99, status: "Healthy",  transactionsHandled: 322081 },
  { id: "node-sa-east-1",  nodeType: "EdgeNode",      region: "South America",capacity: 5000,  currentLoad: 1823,  health: 0.95, status: "Healthy",  transactionsHandled: 189441 },
  { id: "node-af-south-1", nodeType: "EdgeNode",      region: "Africa",       capacity: 4000,  currentLoad: 921,   health: 0.91, status: "Degraded", transactionsHandled: 78443 },
];

let driftPhase = 0;

router.get("/nodes", (_req, res) => {
  driftPhase += 0.012;

  // Apply slow, organic load drift
  const nodes = BASE_NODES.map((n, i) => {
    const driftedLoad = Math.min(
      n.capacity,
      Math.max(0, Math.round(n.currentLoad + Math.sin(driftPhase + i * 0.9) * n.capacity * 0.04)),
    );
    const loadPct = parseFloat(((driftedLoad / n.capacity) * 100).toFixed(1));
    // Efficiency: how close to optimal 75% utilisation
    const efficiency = parseFloat(Math.max(0, 1 - Math.abs(loadPct / 100 - 0.75) * 2).toFixed(3));

    return { ...n, currentLoad: driftedLoad, loadPct, efficiency };
  });

  // Network-wide analytics
  const loads = nodes.map((n) => n.currentLoad);
  const ratios = nodes.map((n) => n.currentLoad / n.capacity);
  const healthScore = networkHealthScore(nodes);
  const gini = giniCoefficient(loads);
  const entropy = shannonEntropy(loads);
  const avgUtil = mean(ratios);
  const stdUtil = stdDev(ratios);

  // Per-type aggregates
  const byType: Record<string, { count: number; avgHealth: number; totalLoad: number; totalCapacity: number }> = {};
  for (const n of nodes) {
    if (!byType[n.nodeType]) byType[n.nodeType] = { count: 0, avgHealth: 0, totalLoad: 0, totalCapacity: 0 };
    byType[n.nodeType].count++;
    byType[n.nodeType].avgHealth += n.health;
    byType[n.nodeType].totalLoad += n.currentLoad;
    byType[n.nodeType].totalCapacity += n.capacity;
  }
  for (const t of Object.keys(byType)) {
    byType[t].avgHealth = parseFloat((byType[t].avgHealth / byType[t].count).toFixed(3));
  }

  res.json({
    nodes,
    analytics: {
      healthScore: parseFloat(healthScore.toFixed(2)),
      loadGini: parseFloat(gini.toFixed(4)),
      networkEntropy: parseFloat(entropy.toFixed(4)),
      avgUtilization: parseFloat((avgUtil * 100).toFixed(2)),
      stdDevUtilization: parseFloat((stdUtil * 100).toFixed(2)),
      totalCapacity: nodes.reduce((s, n) => s + n.capacity, 0),
      totalLoad: nodes.reduce((s, n) => s + n.currentLoad, 0),
      healthyCount: nodes.filter((n) => n.status === "Healthy").length,
      degradedCount: nodes.filter((n) => n.status === "Degraded").length,
      byType,
    },
  });
});

export default router;
