/**
 * NEXA Block Explorer API
 *
 * Endpoints:
 *   GET /explorer/blocks?count=20         Latest N blocks
 *   GET /explorer/block/:id               Block by hash (0x…) or number
 *   GET /explorer/tx/:hash                Transaction by keccak256 hash
 *   GET /explorer/stats                   Live network stats
 *   GET /explorer/fee-history?blocks=50   EIP-1559 fee history
 */

import { Router } from "express";
import { blockEngine } from "../lib/block-engine";
import { getMerkleProof, verifyMerkleProof, estimateGasCost } from "../lib/crypto-engine";
import { networkHealthScore, giniCoefficient, shannonEntropy, mean } from "../lib/portfolio-math";

const router = Router();

const BASE_NODES = [
  { health: 0.99, currentLoad: 7821, capacity: 10000 },
  { health: 0.97, currentLoad: 5102, capacity: 8000 },
  { health: 0.96, currentLoad: 8934, capacity: 10000 },
  { health: 0.98, currentLoad: 11241, capacity: 15000 },
  { health: 0.94, currentLoad: 6441, capacity: 8000 },
  { health: 0.99, currentLoad: 2891, capacity: 6000 },
  { health: 0.95, currentLoad: 1823, capacity: 5000 },
  { health: 0.91, currentLoad: 921, capacity: 4000 },
];

// GET /explorer/blocks
router.get("/explorer/blocks", (req, res) => {
  const count = Math.min(Number(req.query.count) || 20, 100);
  const blocks = blockEngine.getLatestBlocks(count).map((b) => ({
    number: b.number,
    hash: b.hash,
    parentHash: b.parentHash,
    timestamp: b.timestamp,
    txCount: b.txCount,
    gasUsed: b.gasUsed,
    gasLimit: b.gasLimit,
    gasUsedPct: parseFloat(((b.gasUsed / b.gasLimit) * 100).toFixed(2)),
    baseFeePerGas: parseFloat(b.baseFeePerGas.toFixed(6)),
    priorityFeePerGas: parseFloat(b.priorityFeePerGas.toFixed(4)),
    miner: b.miner,
    size: b.size,
    transactionsRoot: b.transactionsRoot,
    ageMs: Date.now() - b.timestamp,
  }));
  res.json(blocks);
});

// GET /explorer/block/:identifier
router.get("/explorer/block/:identifier", (req, res) => {
  const { identifier } = req.params;
  const block = /^\d+$/.test(identifier)
    ? blockEngine.getBlock(parseInt(identifier, 10))
    : blockEngine.getBlock(identifier);

  if (!block) return res.status(404).json({ error: "Block not found" });

  const burnedFeeGwei = block.baseFeePerGas * block.gasUsed;
  const validatorRewardGwei = block.priorityFeePerGas * block.gasUsed;

  res.json({
    number: block.number,
    hash: block.hash,
    parentHash: block.parentHash,
    timestamp: block.timestamp,
    transactions: block.transactions,
    transactionsRoot: block.transactionsRoot,
    stateRoot: block.stateRoot,
    receiptsRoot: block.receiptsRoot,
    gasLimit: block.gasLimit,
    gasUsed: block.gasUsed,
    gasUsedPct: parseFloat(((block.gasUsed / block.gasLimit) * 100).toFixed(2)),
    baseFeePerGas: parseFloat(block.baseFeePerGas.toFixed(6)),
    priorityFeePerGas: parseFloat(block.priorityFeePerGas.toFixed(4)),
    burnedFeeGwei: parseFloat(burnedFeeGwei.toFixed(2)),
    validatorRewardGwei: parseFloat(validatorRewardGwei.toFixed(2)),
    miner: block.miner,
    size: block.size,
    txCount: block.txCount,
    extraData: block.extraData,
    nonce: block.nonce,
    ageMs: Date.now() - block.timestamp,
  });
});

// GET /explorer/tx/:hash
router.get("/explorer/tx/:hash", (req, res) => {
  const result = blockEngine.getTxLocation(req.params.hash);
  if (!result) return res.status(404).json({ error: "Transaction not found" });

  const { block, txIndex } = result;
  const proof = getMerkleProof(block.transactions, txIndex);
  const verified = verifyMerkleProof(req.params.hash, proof, block.transactionsRoot);
  const gasPrice = block.baseFeePerGas + block.priorityFeePerGas;

  res.json({
    hash: req.params.hash,
    blockNumber: block.number,
    blockHash: block.hash,
    timestamp: block.timestamp,
    transactionIndex: txIndex,
    gasUsed: 21000,
    gasPriceGwei: parseFloat(gasPrice.toFixed(6)),
    baseFeePerGas: parseFloat(block.baseFeePerGas.toFixed(6)),
    maxPriorityFeePerGas: parseFloat(block.priorityFeePerGas.toFixed(4)),
    transactionFeeGwei: parseFloat((gasPrice * 21000).toFixed(2)),
    status: "success",
    confirmations: (blockEngine.getLatestBlock()?.number ?? block.number) - block.number + 1,
    merkleProof: proof,
    merkleRoot: block.transactionsRoot,
    merkleVerified: verified,
    ageMs: Date.now() - block.timestamp,
  });
});

// GET /explorer/stats
router.get("/explorer/stats", (req, res) => {
  const latest = blockEngine.getLatestBlock();
  const tps = blockEngine.getTPS();
  const baseFee = blockEngine.getCurrentBaseFee();
  const utilization = blockEngine.getNetworkUtilization();
  const feeHistory = blockEngine.getFeeHistory(20);
  const gasEst = estimateGasCost(baseFee, 21000);

  const healthScore = networkHealthScore(BASE_NODES);
  const loads = BASE_NODES.map((n) => n.currentLoad);
  const gini = giniCoefficient(loads);
  const entropy = shannonEntropy(loads);
  const avgUtil = mean(BASE_NODES.map((n) => n.currentLoad / n.capacity));

  res.json({
    latestBlockNumber: latest?.number ?? 0,
    latestBlockHash: latest?.hash ?? null,
    latestBlockTimestamp: latest?.timestamp ?? 0,
    currentBaseFeeGwei: parseFloat(baseFee.toFixed(6)),
    priorityFeeGwei: parseFloat((latest?.priorityFeePerGas ?? 1).toFixed(4)),
    gasCostEstimateGwei: parseFloat(gasEst.estimatedCostGwei.toFixed(4)),
    tps: parseFloat(tps.toFixed(2)),
    avgBlockTimeMs: parseFloat(blockEngine.getAvgBlockTime().toFixed(1)),
    networkUtilizationPct: parseFloat((utilization * 100).toFixed(2)),
    networkHealthScore: parseFloat(healthScore.toFixed(2)),
    loadGiniCoefficient: parseFloat(gini.toFixed(4)),
    networkEntropy: parseFloat(entropy.toFixed(4)),
    avgNodeUtilizationPct: parseFloat((avgUtil * 100).toFixed(2)),
    feeHistory,
  });
});

// GET /explorer/fee-history
router.get("/explorer/fee-history", (req, res) => {
  const count = Math.min(Number(req.query.blocks) || 50, 200);
  res.json(blockEngine.getFeeHistory(count));
});

export default router;
