import { Router } from "express";

const router = Router();

const NODES = [
  { id: "node-us-east-1", nodeType: "ValidatorNode", region: "US East", capacity: 10000, currentLoad: 7821, health: 0.99, status: "Healthy", transactionsHandled: 874291 },
  { id: "node-us-west-1", nodeType: "EdgeNode", region: "US West", capacity: 8000, currentLoad: 5102, health: 0.97, status: "Healthy", transactionsHandled: 612449 },
  { id: "node-eu-west-1", nodeType: "ValidatorNode", region: "EU West", capacity: 10000, currentLoad: 8934, health: 0.96, status: "Healthy", transactionsHandled: 923811 },
  { id: "node-eu-central-1", nodeType: "LiquidityPool", region: "EU Central", capacity: 15000, currentLoad: 11241, health: 0.98, status: "Healthy", transactionsHandled: 1041223 },
  { id: "node-ap-east-1", nodeType: "EdgeNode", region: "Asia Pacific", capacity: 8000, currentLoad: 6441, health: 0.94, status: "Degraded", transactionsHandled: 549012 },
  { id: "node-ap-south-1", nodeType: "Bridge", region: "Asia South", capacity: 6000, currentLoad: 2891, health: 0.99, status: "Healthy", transactionsHandled: 322081 },
  { id: "node-sa-east-1", nodeType: "EdgeNode", region: "South America", capacity: 5000, currentLoad: 1823, health: 0.95, status: "Healthy", transactionsHandled: 189441 },
  { id: "node-af-south-1", nodeType: "EdgeNode", region: "Africa", capacity: 4000, currentLoad: 921, health: 0.91, status: "Degraded", transactionsHandled: 78443 },
];

router.get("/nodes", (req, res) => {
  res.json(NODES);
});

export default router;
