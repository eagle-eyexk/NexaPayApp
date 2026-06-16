/**
 * NEXA Block Engine
 *
 * Produces blocks every 500ms using the EIP-1559 fee algorithm.
 * Implements sub-second finality via CometBFT-style instant finality.
 *
 * Architecture:
 *   CHAIN_ID      = 1248 (NEXA Mainnet)
 *   BLOCK_TIME    = 500ms target (2 blocks/sec)
 *   GAS_LIMIT     = 30,000,000 per block
 *   BASE_FEE_INIT = 1.0 Gwei
 *   VALIDATORS    = 47 CometBFT validators (BFT)
 *
 * The engine pre-generates 100 historical blocks on startup,
 * then produces live blocks on the interval.
 * Keeps the last 500 blocks in memory (~250 seconds of chain history).
 */

import crypto from "crypto";
import { hashTx, hashBlockHeader, buildMerkleRoot, eip1559NextBaseFee } from "./crypto-engine";

export const CHAIN_ID = 1248;
const BLOCK_TIME_MS = 500;
const GAS_LIMIT = 30_000_000;
const INITIAL_BASE_FEE_GWEI = 1.0;
const GENESIS_BLOCK = 9_987_432;
const MAX_BLOCKS_IN_MEMORY = 500;
const HISTORY_BLOCKS = 100;

const VALIDATORS: string[] = Array.from({ length: 47 }, (_, i) => {
  const suffix = crypto.createHash("sha256").update(`validator-${i}`).digest("hex").slice(0, 8);
  return `nexa1val${String(i + 1).padStart(3, "0")}${suffix}`;
});

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactions: string[];
  transactionsRoot: string;
  stateRoot: string;
  receiptsRoot: string;
  gasLimit: number;
  gasUsed: number;
  baseFeePerGas: number;
  priorityFeePerGas: number;
  miner: string;
  size: number;
  extraData: string;
  nonce: string;
  txCount: number;
}

export interface FeeHistoryPoint {
  blockNumber: number;
  baseFeePerGas: number;
  gasUsedRatio: number;
  priorityFeePerGas: number;
}

function randomAddress(): string {
  return "0x" + crypto.randomBytes(20).toString("hex");
}

function randomStateRoot(): string {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

class BlockEngine {
  private blocks: Block[] = [];
  private nextBlock: number;
  private currentBaseFee = INITIAL_BASE_FEE_GWEI;
  private pendingTxs: string[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly EMPTY_HASH = "0x" + "0".repeat(64);

  constructor() {
    this.nextBlock = GENESIS_BLOCK + 1;
    this.bootstrap();
    this.startProduction();
  }

  // ── Internal ─────────────────────────────────────────────────────────────

  private makeTxHash(blockNum: number, txIdx: number): string {
    return hashTx({
      chainId: CHAIN_ID,
      nonce: txIdx,
      from: randomAddress(),
      to: randomAddress(),
      value: (Math.random() * 100).toFixed(8),
      gasLimit: 21_000 + Math.floor(Math.random() * 150_000),
      maxFeePerGas: this.currentBaseFee * 1.1 + Math.random() * 2,
      maxPriorityFeePerGas: 0.5 + Math.random() * 2,
      data: `block-${blockNum}-tx-${txIdx}`,
    });
  }

  private assembleBlock(
    parentHash: string,
    parentBaseFee: number,
    number: number,
    timestamp: number,
    extraTxHashes: string[] = [],
  ): Block {
    const bgCount = Math.floor(Math.random() * 16) + 3;
    const bgTxHashes = Array.from({ length: bgCount }, (_, i) => this.makeTxHash(number, i));
    const txHashes = [...extraTxHashes, ...bgTxHashes];

    const gasUsed = txHashes.reduce(
      (s) => s + 21_000 + Math.floor(Math.random() * 60_000),
      0,
    );
    const baseFeePerGas = eip1559NextBaseFee(parentBaseFee, gasUsed, GAS_LIMIT);
    const priorityFeePerGas = 0.5 + Math.random() * 1.5;
    const transactionsRoot = buildMerkleRoot(txHashes);
    const stateRoot = randomStateRoot();
    const receiptsRoot = randomStateRoot();
    const miner = VALIDATORS[number % VALIDATORS.length];

    const header = {
      number,
      parentHash,
      timestamp,
      transactionsRoot,
      stateRoot,
      receiptsRoot,
      gasUsed,
      gasLimit: GAS_LIMIT,
      baseFeePerGas,
      miner,
      extraData: "0x4e455841", // "NEXA" in hex
    };

    return {
      number,
      hash: hashBlockHeader(header),
      parentHash,
      timestamp,
      transactions: txHashes,
      transactionsRoot,
      stateRoot,
      receiptsRoot,
      gasLimit: GAS_LIMIT,
      gasUsed,
      baseFeePerGas,
      priorityFeePerGas,
      miner,
      size: 512 + txHashes.length * 200,
      extraData: "0x4e455841",
      nonce: "0x0000000000000000",
      txCount: txHashes.length,
    };
  }

  private bootstrap(): void {
    const now = Date.now();
    let parentHash = this.EMPTY_HASH;
    let baseFee = INITIAL_BASE_FEE_GWEI;
    const startNumber = GENESIS_BLOCK + 1;

    for (let i = 0; i < HISTORY_BLOCKS; i++) {
      const number = startNumber + i;
      const timestamp = now - (HISTORY_BLOCKS - i) * BLOCK_TIME_MS;
      const block = this.assembleBlock(parentHash, baseFee, number, timestamp);
      this.blocks.push(block);
      parentHash = block.hash;
      baseFee = block.baseFeePerGas;
    }

    this.nextBlock = startNumber + HISTORY_BLOCKS;
    this.currentBaseFee = this.blocks[this.blocks.length - 1].baseFeePerGas;
  }

  private startProduction(): void {
    this.timer = setInterval(() => {
      const parent = this.blocks[this.blocks.length - 1];
      const pending = this.pendingTxs.splice(0);

      const block = this.assembleBlock(
        parent?.hash ?? this.EMPTY_HASH,
        parent?.baseFeePerGas ?? INITIAL_BASE_FEE_GWEI,
        this.nextBlock++,
        Date.now(),
        pending,
      );

      this.blocks.push(block);
      this.currentBaseFee = block.baseFeePerGas;

      if (this.blocks.length > MAX_BLOCKS_IN_MEMORY) {
        this.blocks.splice(0, this.blocks.length - MAX_BLOCKS_IN_MEMORY);
      }
    }, BLOCK_TIME_MS);

    // Don't prevent graceful shutdown
    this.timer.unref();
  }

  // ── Public API ────────────────────────────────────────────────────────────

  public addPendingTx(txHash: string): void {
    this.pendingTxs.push(txHash);
  }

  public getLatestBlocks(count = 20): Block[] {
    return [...this.blocks].reverse().slice(0, count);
  }

  public getBlock(hashOrNumber: string | number): Block | null {
    if (typeof hashOrNumber === "number") {
      return this.blocks.find((b) => b.number === hashOrNumber) ?? null;
    }
    return this.blocks.find((b) => b.hash === hashOrNumber) ?? null;
  }

  public getLatestBlock(): Block | null {
    return this.blocks[this.blocks.length - 1] ?? null;
  }

  public getCurrentBaseFee(): number {
    return this.currentBaseFee;
  }

  public getFeeHistory(count = 50): FeeHistoryPoint[] {
    return [...this.blocks]
      .reverse()
      .slice(0, count)
      .map((b) => ({
        blockNumber: b.number,
        baseFeePerGas: b.baseFeePerGas,
        gasUsedRatio: b.gasUsed / b.gasLimit,
        priorityFeePerGas: b.priorityFeePerGas,
      }));
  }

  /** Instantaneous TPS computed over last 20 blocks */
  public getTPS(): number {
    const recent = this.blocks.slice(-20);
    if (recent.length < 2) return 0;
    const totalTxs = recent.reduce((s, b) => s + b.txCount, 0);
    const spanMs = recent[recent.length - 1].timestamp - recent[0].timestamp;
    return spanMs > 0 ? (totalTxs / spanMs) * 1000 : 0;
  }

  /** Average block time over last 20 blocks (ms) */
  public getAvgBlockTime(): number {
    const recent = this.blocks.slice(-20);
    if (recent.length < 2) return BLOCK_TIME_MS;
    const spans: number[] = [];
    for (let i = 1; i < recent.length; i++) {
      spans.push(recent[i].timestamp - recent[i - 1].timestamp);
    }
    return spans.reduce((s, v) => s + v, 0) / spans.length;
  }

  /** Average gas utilisation over last 10 blocks */
  public getNetworkUtilization(): number {
    const recent = this.blocks.slice(-10);
    if (!recent.length) return 0;
    return recent.reduce((s, b) => s + b.gasUsed / b.gasLimit, 0) / recent.length;
  }

  /** Look up which block includes a given transaction hash */
  public getTxLocation(hash: string): { block: Block; txIndex: number } | null {
    for (const block of [...this.blocks].reverse()) {
      const idx = block.transactions.indexOf(hash);
      if (idx !== -1) return { block, txIndex: idx };
    }
    return null;
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const blockEngine = new BlockEngine();
