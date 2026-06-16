import { Router } from "express";
import { keccak256 } from "js-sha3";

const router = Router();

const PROPOSALS: {
  id: string;
  nip: string;
  title: string;
  summary: string;
  body: string;
  category: "Protocol" | "Treasury" | "Technical" | "Ecosystem";
  status: "active" | "passed" | "defeated" | "queued" | "executed";
  proposer: string;
  quorum: number;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  startBlock: number;
  endBlock: number;
  startDate: string;
  endDate: string;
  ipfsHash: string;
} [] = [
  {
    id: "0x" + keccak256("NIP-005").slice(0, 16),
    nip: "NIP-005",
    title: "Treasury Diversification: Allocate 15% to Real-World Assets",
    summary: "Diversify 15% of the Nexa DAO treasury (≈ $12.4M) into tokenized T-bills and investment-grade corporate bonds via a regulated RWA protocol.",
    body: "The Nexa treasury currently holds 100% in crypto assets, exposing the protocol to significant volatility. This proposal authorizes the Risk Committee to allocate up to 15% of the treasury NAV into tokenized real-world assets. Eligible instruments: (1) tokenized US T-bills (3–6 month duration), (2) investment-grade corporate bonds rated ≥ A-, (3) tokenized money-market funds. Yield generated is to be split: 60% reinvested, 25% distributed to xNEXA stakers, 15% burned. A 90-day review period applies.",
    category: "Treasury",
    status: "active",
    proposer: "0x" + keccak256("proposer-005").slice(0, 40),
    quorum: 4_000_000,
    votesFor: 6_120_000,
    votesAgainst: 890_000,
    votesAbstain: 340_000,
    startBlock: 9_989_100,
    endBlock: 9_993_500,
    startDate: "2026-06-10",
    endDate: "2026-06-17",
    ipfsHash: "Qm" + keccak256("ipfs-005").slice(0, 44),
  },
  {
    id: "0x" + keccak256("NIP-004").slice(0, 16),
    nip: "NIP-004",
    title: "Increase Staking Reward Rate by 25%",
    summary: "Raise the base staking reward from 0.1 NEXA/block to 0.125 NEXA/block to incentivize long-term holders and increase the staking ratio from 18% to a target of 30%.",
    body: "Current staking ratio of 18.2% is below the target range of 25–35% for optimal network security. Increasing the reward rate to 0.125 NEXA/block (annualized +25%) is estimated to attract an additional 5–6M NEXA into staking. The additional emission (≈ 591,750 NEXA/year) will be funded from the ecosystem allocation. An automatic ratchet mechanism will reduce the rate if the staking ratio exceeds 40% to prevent oversupply.",
    category: "Protocol",
    status: "passed",
    proposer: "0x" + keccak256("proposer-004").slice(0, 40),
    quorum: 4_000_000,
    votesFor: 9_870_000,
    votesAgainst: 1_230_000,
    votesAbstain: 450_000,
    startBlock: 9_960_000,
    endBlock: 9_964_400,
    startDate: "2026-05-28",
    endDate: "2026-06-04",
    ipfsHash: "Qm" + keccak256("ipfs-004").slice(0, 44),
  },
  {
    id: "0x" + keccak256("NIP-003").slice(0, 16),
    nip: "NIP-003",
    title: "Deploy Nexa Bridge on Base L2",
    summary: "Authorize deployment of the official Nexa canonical bridge on Base L2, enabling NEXA token bridging with a 7-day fraud-proof window and a $10M TVL cap in year 1.",
    body: "Base L2 adoption has grown to 4.2M daily active addresses. This proposal authorizes the engineering team to deploy a canonical bridge with: 7-day optimistic fraud-proof window, $10M TVL cap for year 1 (governance-upgradable), 0.05% bridge fee split between Nexa treasury and Base sequencer, multi-sig guardian (5-of-9) for emergency pause. A 6-month audit by two independent security firms is required before raising the TVL cap.",
    category: "Technical",
    status: "queued",
    proposer: "0x" + keccak256("proposer-003").slice(0, 40),
    quorum: 4_000_000,
    votesFor: 11_200_000,
    votesAgainst: 640_000,
    votesAbstain: 280_000,
    startBlock: 9_940_000,
    endBlock: 9_944_400,
    startDate: "2026-05-14",
    endDate: "2026-05-21",
    ipfsHash: "Qm" + keccak256("ipfs-003").slice(0, 44),
  },
  {
    id: "0x" + keccak256("NIP-002").slice(0, 16),
    nip: "NIP-002",
    title: "Add USDT as Collateral Asset in HelixCore",
    summary: "List Tether USDT as an eligible deposit collateral in the HelixCore vault with an 80% LTV ratio and a $5M initial cap.",
    body: "USDT is the highest-volume stablecoin by on-chain transaction count. Adding USDT support will expand the addressable depositor base by an estimated 35%. Parameters: 80% LTV ratio (matching USDC), $5M supply cap (governance-upgradable after 90 days), 0.05% stability fee, Chainlink USDT/USD price feed with 1-hour heartbeat, 4-hour TWAP override for circuit breaker. USDT exposure will be tracked separately from USDC in the protocol risk dashboard.",
    category: "Protocol",
    status: "executed",
    proposer: "0x" + keccak256("proposer-002").slice(0, 40),
    quorum: 4_000_000,
    votesFor: 13_450_000,
    votesAgainst: 320_000,
    votesAbstain: 190_000,
    startBlock: 9_900_000,
    endBlock: 9_904_400,
    startDate: "2026-04-22",
    endDate: "2026-04-29",
    ipfsHash: "Qm" + keccak256("ipfs-002").slice(0, 44),
  },
  {
    id: "0x" + keccak256("NIP-001").slice(0, 16),
    nip: "NIP-001",
    title: "Increase Protocol Performance Fee from 10% to 12%",
    summary: "Raise the performance fee charged on vault profits from 1000 BPS to 1200 BPS to fund ongoing protocol development and security audits.",
    body: "The current 10% performance fee generates approximately $342K/month at current TVL levels. Raising it to 12% would generate an additional $68K/month, earmarked for: 50% security audit budget, 30% developer grants, 20% marketing. Analysis of 12 comparable protocols shows a median performance fee of 15%, suggesting 12% remains competitive. The fee will be re-evaluated at 12M TVL.",
    category: "Protocol",
    status: "defeated",
    proposer: "0x" + keccak256("proposer-001").slice(0, 40),
    quorum: 4_000_000,
    votesFor: 2_890_000,
    votesAgainst: 7_440_000,
    votesAbstain: 610_000,
    startBlock: 9_860_000,
    endBlock: 9_864_400,
    startDate: "2026-04-01",
    endDate: "2026-04-08",
    ipfsHash: "Qm" + keccak256("ipfs-001").slice(0, 44),
  },
  {
    id: "0x" + keccak256("NIP-006").slice(0, 16),
    nip: "NIP-006",
    title: "Ecosystem Grant: DeFi Education Initiative (250K NEXA)",
    summary: "Allocate 250,000 NEXA from the Ecosystem Fund to a DAO-governed education initiative targeting 10,000 developers in emerging markets over 12 months.",
    body: "The Nexa Ecosystem Fund currently holds 8.25M NEXA. This proposal allocates 250K NEXA (~$617K at current price) to fund: online course creation (Solidity, EVM, NEXA SDK), developer bootcamps in Southeast Asia and Africa, a $50K hackathon prize pool, and translation of core documentation into 8 languages. A multisig committee of 5 community-elected members will administer grants. Quarterly progress reports are mandatory; unused funds revert to the Ecosystem Fund after 18 months.",
    category: "Ecosystem",
    status: "active",
    proposer: "0x" + keccak256("proposer-006").slice(0, 40),
    quorum: 4_000_000,
    votesFor: 3_210_000,
    votesAgainst: 450_000,
    votesAbstain: 180_000,
    startBlock: 9_989_400,
    endBlock: 9_993_800,
    startDate: "2026-06-11",
    endDate: "2026-06-18",
    ipfsHash: "Qm" + keccak256("ipfs-006").slice(0, 44),
  },
];

const VOTES: Record<string, { for: number; against: number; abstain: number }> = {};

router.get("/governance/stats", (_req, res) => {
  const total = PROPOSALS.length;
  const passed = PROPOSALS.filter((p) => p.status === "passed" || p.status === "executed").length;
  const defeated = PROPOSALS.filter((p) => p.status === "defeated").length;
  const active = PROPOSALS.filter((p) => p.status === "active").length;
  const totalVotescast = PROPOSALS.reduce((a, p) => a + p.votesFor + p.votesAgainst + p.votesAbstain, 0);
  res.json({
    totalProposals: total,
    passed,
    defeated,
    queued: PROPOSALS.filter((p) => p.status === "queued").length,
    executed: PROPOSALS.filter((p) => p.status === "executed").length,
    active,
    avgParticipation: +((totalVotescast / (total * 4_000_000)) * 100).toFixed(1),
    quorum: 4_000_000,
    timelockDelay: "48 hours",
    votingPeriod: "7 days",
    proposalThreshold: 100_000,
    uniqueVoters: 14_283,
    treasury: {
      nexa: 8_250_000,
      usdc: 12_430_000,
      eth: 1_240,
    },
  });
});

router.get("/governance/proposals", (_req, res) => {
  res.json({ proposals: PROPOSALS });
});

router.get("/governance/proposals/:id", (req, res) => {
  const proposal = PROPOSALS.find((p) => p.id === req.params.id || p.nip === req.params.id);
  if (!proposal) { res.status(404).json({ error: "Proposal not found" }); return; }
  res.json(proposal);
});

router.post("/governance/proposals/:id/vote", (req, res) => {
  const proposal = PROPOSALS.find((p) => p.id === req.params.id || p.nip === req.params.id);
  if (!proposal) { res.status(404).json({ error: "Proposal not found" }); return; }
  if (proposal.status !== "active") { res.status(400).json({ error: "Proposal is not active" }); return; }
  const { vote, weight = 1000 } = req.body as { vote: "for" | "against" | "abstain"; weight?: number };
  if (!["for", "against", "abstain"].includes(vote)) {
    res.status(400).json({ error: "Invalid vote option" });
    return;
  }
  const key = proposal.id;
  if (!VOTES[key]) VOTES[key] = { for: 0, against: 0, abstain: 0 };
  VOTES[key][vote] += weight;
  proposal.votesFor += vote === "for" ? weight : 0;
  proposal.votesAgainst += vote === "against" ? weight : 0;
  proposal.votesAbstain += vote === "abstain" ? weight : 0;
  res.json({
    success: true,
    txHash: "0x" + keccak256(`vote-${key}-${Date.now()}`),
    vote,
    weight,
    newTotals: { for: proposal.votesFor, against: proposal.votesAgainst, abstain: proposal.votesAbstain },
  });
});

export default router;
