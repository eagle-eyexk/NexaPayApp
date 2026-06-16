import { Router } from "express";
import { keccak256 } from "js-sha3";

const router = Router();

const MAX_SUPPLY = 100_000_000;
const INITIAL_SUPPLY = 10_000_000;

const DISTRIBUTION = [
  { category: "Community Rewards", allocation: 40, amount: 40_000_000, color: "#FBBF24", vesting: "Linear over 4 years", unlocked: 0.31 },
  { category: "Team & Core", allocation: 20, amount: 20_000_000, color: "#F59E0B", vesting: "4-year vest, 1-year cliff", unlocked: 0.08 },
  { category: "Investors", allocation: 15, amount: 15_000_000, color: "#D97706", vesting: "2-year vest, 6-month cliff", unlocked: 0.22 },
  { category: "Ecosystem Fund", allocation: 15, amount: 15_000_000, color: "#92400E", vesting: "Governance-controlled", unlocked: 0.55 },
  { category: "Advisors", allocation: 10, amount: 10_000_000, color: "#78350F", vesting: "2-year vest, 3-month cliff", unlocked: 0.18 },
];

const now = Date.now();
const GENESIS = now - 18 * 30 * 24 * 3600 * 1000;

function circulatingSupply(): number {
  return DISTRIBUTION.reduce((acc, d) => acc + d.amount * d.unlocked, 0);
}

function computeVestingSchedules() {
  return [
    {
      label: "Team & Core",
      total: 20_000_000,
      cliff: "12 months",
      duration: "48 months",
      startDate: new Date(GENESIS).toISOString().slice(0, 10),
      cliffDate: new Date(GENESIS + 365 * 86400000).toISOString().slice(0, 10),
      endDate: new Date(GENESIS + 4 * 365 * 86400000).toISOString().slice(0, 10),
      claimed: 1_600_000,
      remaining: 18_400_000,
      pct: 8,
    },
    {
      label: "Investors (Series A)",
      total: 8_000_000,
      cliff: "6 months",
      duration: "24 months",
      startDate: new Date(GENESIS).toISOString().slice(0, 10),
      cliffDate: new Date(GENESIS + 180 * 86400000).toISOString().slice(0, 10),
      endDate: new Date(GENESIS + 2 * 365 * 86400000).toISOString().slice(0, 10),
      claimed: 2_200_000,
      remaining: 5_800_000,
      pct: 27.5,
    },
    {
      label: "Investors (Seed)",
      total: 7_000_000,
      cliff: "3 months",
      duration: "24 months",
      startDate: new Date(GENESIS - 90 * 86400000).toISOString().slice(0, 10),
      cliffDate: new Date(GENESIS - 90 * 86400000 + 90 * 86400000).toISOString().slice(0, 10),
      endDate: new Date(GENESIS - 90 * 86400000 + 2 * 365 * 86400000).toISOString().slice(0, 10),
      claimed: 1_120_000,
      remaining: 5_880_000,
      pct: 16,
    },
    {
      label: "Advisors",
      total: 10_000_000,
      cliff: "3 months",
      duration: "24 months",
      startDate: new Date(GENESIS).toISOString().slice(0, 10),
      cliffDate: new Date(GENESIS + 90 * 86400000).toISOString().slice(0, 10),
      endDate: new Date(GENESIS + 2 * 365 * 86400000).toISOString().slice(0, 10),
      claimed: 1_800_000,
      remaining: 8_200_000,
      pct: 18,
    },
  ];
}

function stakingData() {
  const totalStaked = 8_543_210 + Math.floor(Math.sin(Date.now() / 100000) * 12000);
  const circ = circulatingSupply();
  const stakingRatio = totalStaked / circ;
  const rewardRate = 0.1;
  const annualEmission = rewardRate * 6300 * 365;
  const apy = (annualEmission / totalStaked) * 100;
  return {
    totalStaked,
    stakingRatio: +stakingRatio.toFixed(4),
    apy: +apy.toFixed(2),
    rewardRatePerBlock: rewardRate,
    validators: 47,
    avgLockPeriod: "127 days",
    slashingEvents: 2,
  };
}

router.get("/token/stats", (_req, res) => {
  const circ = circulatingSupply();
  const staking = stakingData();
  const burned = 453_120 + Math.floor(Date.now() / 10000000);
  const price = 2.47 + Math.sin(Date.now() / 200000) * 0.12;
  const marketCap = circ * price;
  const fdv = MAX_SUPPLY * price;

  res.json({
    maxSupply: MAX_SUPPLY,
    initialSupply: INITIAL_SUPPLY,
    circulatingSupply: Math.floor(circ),
    burned,
    price: +price.toFixed(4),
    marketCap: Math.floor(marketCap),
    fullyDilutedValuation: Math.floor(fdv),
    staking,
    protocolRevenue: {
      allTime: 4_812_330,
      last30d: 342_100,
      last7d: 87_440,
    },
    feeDistribution: {
      stakers: 60,
      treasury: 25,
      burned: 15,
    },
  });
});

router.get("/token/distribution", (_req, res) => {
  const circ = circulatingSupply();
  res.json({
    distribution: DISTRIBUTION,
    totalAllocated: MAX_SUPPLY,
    circulatingSupply: Math.floor(circ),
    lockedSupply: Math.floor(MAX_SUPPLY - circ),
  });
});

router.get("/token/vesting", (_req, res) => {
  res.json({
    schedules: computeVestingSchedules(),
    nextUnlockDate: new Date(GENESIS + 365 * 86400000).toISOString().slice(0, 10),
    nextUnlockAmount: 416_667,
  });
});

router.get("/token/holders", (_req, res) => {
  const seed = Math.floor(Date.now() / 30000);
  const holders = Array.from({ length: 10 }, (_, i) => {
    const h = keccak256(`holder-${i}-${seed}`);
    const balances = [4_120_000, 3_870_000, 2_990_000, 2_450_000, 1_980_000, 1_540_000, 1_230_000, 980_000, 720_000, 590_000];
    return {
      rank: i + 1,
      address: `0x${h.slice(0, 40)}`,
      balance: balances[i],
      pct: +((balances[i] / circulatingSupply()) * 100).toFixed(2),
      type: i < 3 ? "Protocol Treasury" : i < 5 ? "Ecosystem Fund" : "Whale Wallet",
    };
  });
  res.json({ holders, totalHolders: 48_291 + seed % 100 });
});

export default router;
