import { useState } from "react";
import { X, Download, ChevronRight, FileText, Shield, Zap, Globe, Cpu, TrendingUp, Users, Scale, Map, Lock } from "lucide-react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

interface Section {
  id: string;
  icon: React.ElementType;
  label: string;
  badge: string;
  tagline: string;
  preview: string;
  content: string;
}

const SECTIONS: Section[] = [
  {
    id: "abstract",
    icon: FileText,
    label: "Abstract",
    badge: "Overview",
    tagline: "The Sovereign Payment Protocol",
    preview: "NEXA is a purpose-built sovereign Layer 1 blockchain engineered for high-frequency global payment settlement, delivering 99.9% Ethereum Virtual Machine compatibility without inheriting the technical debt of a Geth fork.",
    content: `## Abstract

NEXA is a purpose-built sovereign Layer 1 blockchain protocol engineered for high-frequency global payment settlement. At its core, NEXA delivers 99.9% Ethereum Virtual Machine (EVM) bytecode compatibility through a clean-room execution engine — constructed entirely from first principles against the Ethereum Yellow Paper specification — while maintaining the low-latency consensus guarantees of the CometBFT Byzantine Fault Tolerant engine.

Unlike conventional EVM-compatible chains that inherit Geth's technical debt through forking, NEXA implements the full Ethereum execution specification independently: a bespoke Merkle Patricia Trie (MPT) state model for cryptographic state commitment, hand-rolled RLP transaction encoding and decoding for LegacyTx and DynamicFeeTx (EIP-1559) structures, and a complete opcode-level execution environment with precise gas metering per the Yellow Paper schedules.

The NEXA payment network bridges institutional settlement rails with retail consumer payment experiences, offering merchants a fully-integrated POS terminal infrastructure, shareable payment links, and a native mobile wallet system — all settled on-chain in milliseconds. By anchoring the off-chain merchant ecosystem to the NEXA Layer 1, every transaction achieves the cryptographic finality and auditability of a distributed ledger without requiring merchants or consumers to possess specialist blockchain knowledge.

**Key Commitments:**
— Sovereign Layer 1: No dependency on Ethereum mainnet for block production or finality
— EVM Native: Deploy Solidity contracts without modification; MetaMask, Foundry, and Hardhat integrate out of the box
— Sub-Second Settlement: CometBFT's Byzantine consensus engine delivers deterministic block finality in under 500 milliseconds
— Real-World Payments: Native POS, payment link, and mobile wallet infrastructure built directly into the protocol layer
— Cryptographic Ownership: Every user account is backed by a secp256k1 key pair — no custodial trust required`,
  },
  {
    id: "problem",
    icon: Shield,
    label: "Problem Statement",
    badge: "The Challenge",
    tagline: "Global Payments Are Broken",
    preview: "The global payments industry processes over $240 trillion annually yet remains plagued by settlement delays of 1–5 business days, cross-border fees averaging 6.4%, and systemic exclusion of 1.4 billion unbanked adults.",
    content: `## The Problem: Fragmented, Expensive, and Exclusionary Payment Infrastructure

The global payments industry processes over $240 trillion in transactions annually. Yet despite this scale, the foundational infrastructure has changed little since the 1970s. The following structural failures define the current landscape:

### Settlement Latency
Traditional interbank settlement networks such as SWIFT, ACH, and SEPA operate on T+1 to T+5 clearing cycles. In practice, a merchant receiving a cross-border wire transfer may wait five business days for funds to reach their account — capital that is inaccessible, unloanable, and undeployable during that window.

### Prohibitive Cross-Border Fees
The World Bank estimates global average remittance costs at 6.4% per transaction. For businesses and individuals transacting across borders, this fee burden constitutes a direct tax on global commerce. In Sub-Saharan Africa and Southeast Asia, corridor fees routinely exceed 10%.

### Financial Exclusion
1.4 billion adults globally remain without access to basic financial accounts. Traditional banking KYC requirements, minimum balance thresholds, and geographic branch scarcity structurally exclude vast populations from the formal economy.

### Blockchain Fragmentation
Existing blockchain payment solutions suffer from a different class of problems. First-generation smart contract platforms such as Ethereum mainnet deliver block finality in 12–15 seconds — insufficient for retail point-of-sale environments. Layer 2 rollup solutions introduce complexity, bridging risk, and custody assumptions incompatible with a sovereign payment network. Proof-of-Work chains sacrifice throughput for security in ways that price out micropayment use cases.

### The Developer Fragmentation Tax
The Ethereum ecosystem has accumulated tremendous tooling — MetaMask, Foundry, Hardhat, ethers.js, viem — representing hundreds of thousands of developer-hours. Every non-EVM compatible chain requires this tooling to be rebuilt or abandoned. NEXA eliminates this tax entirely.

**The market requires a protocol that is simultaneously:**
— Fast enough for retail (sub-second finality)
— Cheap enough for micropayments (sub-cent gas costs)
— Compatible enough for developers (full EVM equivalence)
— Accessible enough for everyone (no bank account required)`,
  },
  {
    id: "market",
    icon: TrendingUp,
    label: "Market Analysis",
    badge: "Opportunity",
    tagline: "$240 Trillion Addressable Market",
    preview: "The global payments market is valued at $240 trillion annually. Digital payment volumes are projected to exceed $20 trillion by 2026 as blockchain-native settlement rails capture share from legacy intermediaries.",
    content: `## Market Analysis: The Addressable Payment Economy

### Total Addressable Market

The global payments market processes approximately $240 trillion in annual transaction volume across retail, wholesale, cross-border, and interbank channels. Within this universe, NEXA targets the following addressable segments:

**Retail Payments (TAM: $48T/year)**
Consumer point-of-sale transactions, e-commerce checkouts, and peer-to-peer money transfers constitute the largest segment by transaction count. Blockchain-native rails can capture share from card network interchange fees (typically 1.5–3.5%) by settling directly on-chain at sub-cent cost.

**Cross-Border Remittances (TAM: $860B/year)**
The World Bank estimates $860 billion in formal remittance flows annually, with an additional estimated $250 billion transmitted through informal channels. At an average cost of 6.4%, this segment represents $55 billion in annual fee extraction — a direct opportunity for NEXA's fee-minimized settlement rails.

**Merchant Settlement (TAM: $9.4T/year)**
Small and medium enterprises constitute 90% of global businesses yet are systematically disadvantaged by slow settlement cycles and high payment processing fees. NEXA's integrated merchant infrastructure — POS terminals, payment links, and PDF invoicing — targets this segment with instant, fee-minimized settlement.

**DeFi and Institutional Settlement (TAM: $3.2T/year)**
Institutional demand for programmable settlement rails, tokenized assets, and automated compliance continues to accelerate. NEXA's full EVM compatibility positions it as a natural destination for institutional DeFi protocols.

### Market Growth Drivers

— **Digital payments penetration**: Global cashless transaction volumes are growing at 15% CAGR, driven by smartphone proliferation in emerging markets
— **Developer adoption**: The Ethereum developer ecosystem exceeds 4 million active developers — all immediately compatible with NEXA through EVM equivalence
— **Regulatory tailwinds**: MiCA (EU), DOGE (US), and equivalent frameworks are establishing legal clarity for blockchain payment operators
— **Stablecoin growth**: Stablecoin on-chain settlement exceeded $10 trillion in 2023, establishing institutional comfort with blockchain-native money movement

### NEXA's Competitive Moat

NEXA's differentiation lies not in any single technical feature, but in the deliberate architectural integration of three pillars that no single competitor currently offers together: sovereign Layer 1 security, full EVM tooling compatibility, and native real-world payment infrastructure.`,
  },
  {
    id: "protocol",
    icon: Globe,
    label: "The NEXA Protocol",
    badge: "Solution",
    tagline: "Sovereign. Compatible. Instant.",
    preview: "NEXA introduces a tripartite architecture: a clean-room EVM execution layer, CometBFT BFT consensus for sub-second block finality, and a native payment application layer serving merchants, consumers, and developers.",
    content: `## The NEXA Protocol: Architecture Philosophy

NEXA was designed around a single governing principle: **sovereign infrastructure should not require trust**. Every layer of the NEXA stack is designed to be independently verifiable, cryptographically bounded, and free from external custodial dependency.

### Tripartite Architecture

**Layer 1: Execution Engine**
The NEXA Execution Engine is a clean-room implementation of the Ethereum Virtual Machine specification. Built in Go for memory safety and high-throughput concurrency, it executes EVM bytecode with exact opcode semantics — every gas schedule, stack depth limit, and memory expansion formula mirrors the Ethereum Yellow Paper precisely.

This is not an approximation. NEXA implements:
— All 140+ EVM opcodes including PUSH1–PUSH32, DUP1–DUP16, SWAP1–SWAP16
— Exact 256-bit unsigned arithmetic with overflow semantics
— SLOAD at 2,100 gas (cold access), SSTORE at 100 gas (warm minimum)
— Native precompiles at addresses 0x01 (ecrecover), 0x02 (SHA-256), 0x03 (RIPEMD-160), 0x04 (identity)

**Layer 2: Consensus Engine (CometBFT)**
CometBFT — the battle-tested Byzantine Fault Tolerant consensus engine powering the Cosmos ecosystem — provides NEXA's block ordering and finality guarantees. CometBFT achieves deterministic, single-slot finality in under 500 milliseconds under normal network conditions — a requirement for retail payment environments.

The ABCI 2.0 interface bridges CometBFT's consensus layer to the NEXA execution engine. CheckTx validates incoming transactions (balance sufficiency, nonce correctness, signature validity) without state mutation. DeliverTx executes the full state transition atomically. Commit flushes the updated Merkle Patricia Trie root to the BadgerDB persistent store.

**Layer 3: Payment Application Layer**
Built directly on the NEXA RPC API, the payment application layer serves three personas:

*Merchants*: POS terminal for in-person card-style payments, shareable payment links for e-commerce, full transaction ledger with CSV export, and server-side PDF receipt generation.

*Consumers*: Multi-chain wallet dashboard (ETH, BTC, SOL, USDC, native NEXA), digital virtual card, QR-code receive flow, and Apple/Google Wallet pass integration for balance at a glance.

*Developers*: JSON-RPC 2.0 endpoint fully compatible with ethers.js, viem, wagmi, and web3.js. Deploy any Solidity contract from any EVM toolchain with zero modifications.

### The Sovereign Guarantee
Every NEXA wallet is backed by a secp256k1 key pair generated client-side. The network never has custody of private keys. Balances are committed to the Merkle Patricia Trie on every block, producing a cryptographic state root verifiable by any network participant without trust in any central authority.`,
  },
  {
    id: "technology",
    icon: Cpu,
    label: "Technology Architecture",
    badge: "Deep Dive",
    tagline: "Built from First Principles",
    preview: "The NEXA execution engine implements the Ethereum Yellow Paper from scratch — Merkle Patricia Trie, RLP encoding, secp256k1 ECDSA, and 140+ EVM opcodes — without forking Geth or any third-party EVM library.",
    content: `## Technology Architecture: The Clean-Room Execution Engine

### Merkle Patricia Trie (State Model)

NEXA uses a full Merkle Patricia Trie (MPT) implementation to store global account state. The MPT is a cryptographic data structure that combines the prefix compression of a Patricia Trie with the cryptographic commitment properties of a Merkle tree.

**Node Types:**
— LeafNode: A terminal node pairing compact-encoded nibble path with an account state value (RLP-encoded StateAccount)
— ExtensionNode: A shared-prefix optimization node that compresses common path segments
— BranchNode: A 16-child branching node representing hexadecimal branching at each nibble position
— EmptyNode: The null sentinel value for empty subtrees

**Hash Function:** Each non-trivial node is Keccak-256 hashed to produce its 32-byte reference key. Nodes whose RLP encoding is fewer than 32 bytes are inlined directly, matching the Ethereum specification exactly and ensuring identical stateRoot values for any given account state.

### Transaction Encoding (RLP)

NEXA implements a bespoke Recursive Length Prefix (RLP) parser — the binary serialization format underpinning all Ethereum data structures — without dependency on the go-ethereum library.

The RLP implementation handles:
— Byte strings of arbitrary length (short: 0x80–0xb7, long: 0xb8–0xbf prefix families)
— Lists of arbitrary depth (short: 0xc0–0xf7, long: 0xf8–0xff)
— Big integer encoding for uint256 values (NEXA natively handles 256-bit arithmetic)
— EIP-1559 DynamicFeeTx: ChainID, Nonce, GasTipCap, GasFeeCap, Gas, To, Value, Data, AccessList, V, R, S

### Cryptography

**Key Generation:** secp256k1 ECDSA — the same elliptic curve used by Bitcoin and Ethereum. Each wallet generates a 256-bit private key from a cryptographically secure random source.

**Address Derivation:** compressed public key (33 bytes) → SHA-256 hash → first 20 bytes → hex-encoded with "nexa1" prefix.

**Transaction Signing:** ECDSA signature over the Keccak-256 hash of the RLP-encoded transaction body. The ecrecover precompile (0x01) enables smart contracts to verify transaction authorship natively.

### Consensus: CometBFT + ABCI 2.0

CometBFT achieves safety under asynchronous network conditions provided fewer than ⅓ of validators are Byzantine. The ABCI 2.0 socket protocol separates consensus logic from application logic, allowing the NEXA execution engine to be upgraded independently of the consensus layer.

**Block production cycle:**
1. Proposer collects transactions from the mempool, ordered by gas price (EIP-1559 priority fee)
2. CheckTx validates each transaction: recover signer via ecrecover, verify nonce, verify balance ≥ gas_limit × gas_fee_cap + value
3. DeliverTx executes each transaction against the EVM state machine; failed transactions are included but state changes reverted
4. Commit hashes the post-execution MPT root and writes AppHash to the CometBFT block header

### Storage: BadgerDB

State persistence uses BadgerDB v4, an LSM-Tree (Log-Structured Merge Tree) storage engine optimized for write-heavy workloads. Each Commit operation performs an atomic batch write of all modified MPT nodes — ensuring no intermediate state is observable between blocks.`,
  },
  {
    id: "evm",
    icon: Zap,
    label: "EVM Compatibility",
    badge: "Developer Tools",
    tagline: "Zero-Migration Ethereum Tooling",
    preview: "Deploy Solidity contracts without modification. NEXA's JSON-RPC 2.0 endpoint is wire-compatible with MetaMask, Foundry, Hardhat, ethers.js, viem, wagmi, Truffle, and Remix IDE.",
    content: `## EVM Compatibility: The Developer Experience Promise

### The Compatibility Guarantee

NEXA commits to 99.9% Ethereum bytecode compatibility. This is not a marketing claim — it is a technical obligation enforced at the opcode level. Every deployed EVM contract that executes correctly on Ethereum mainnet will execute identically on NEXA, including:

— Gas metering at the Yellow Paper-specified costs per opcode
— Storage access patterns (SLOAD cold: 2,100 gas; SSTORE new value: 20,000 gas)
— Revert semantics: unused gas is refunded, state changes are atomically rolled back
— Call depth limit: 1,024 stack frames maximum
— Contract deployment via CREATE and CREATE2 with address derivation

### Tooling Compatibility Matrix

| Tool | Compatibility | Notes |
|------|-------------|-------|
| MetaMask | ✓ Full | Add NEXA via JSON-RPC custom network |
| Foundry / Forge | ✓ Full | forge create, forge test, forge script |
| Hardhat | ✓ Full | hardhat.config.ts network entry |
| ethers.js v6 | ✓ Full | JsonRpcProvider pointing to NEXA RPC |
| viem | ✓ Full | createPublicClient + createWalletClient |
| wagmi | ✓ Full | defineChain configuration |
| Remix IDE | ✓ Full | Injected provider via MetaMask |
| Truffle | ✓ Full | truffle-config.js network addition |

### JSON-RPC 2.0 Endpoint

NEXA exposes the standard Ethereum JSON-RPC interface:

\`\`\`
nexa_getBalance(address, blockTag)       → uint256
nexa_getTransactionCount(address)        → uint64 (nonce)
nexa_sendRawTransaction(signedTxHex)    → txHash
nexa_call(callObject, blockTag)          → returnData
nexa_estimateGas(callObject)             → uint64
nexa_getTransactionReceipt(txHash)      → receipt
eth_chainId()                            → 9999 (NEXA Chain ID)
\`\`\`

All eth_ namespace methods are aliased to their nexa_ counterparts to ensure full MetaMask compatibility.

### Deploying on NEXA

\`\`\`solidity
// Any standard Solidity contract — no changes required
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NexaPayment {
    mapping(address => uint256) public balances;
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
\`\`\`

Deploy with Foundry:
\`\`\`bash
forge create NexaPayment \\
  --rpc-url https://rpc.nexaprotocol.network \\
  --private-key $PRIVATE_KEY
\`\`\`

No bridges. No wrappers. No migrations. Your existing Ethereum contracts run on NEXA on day one.`,
  },
  {
    id: "tokenomics",
    icon: Scale,
    label: "Token Economics",
    badge: "NEXA Token",
    tagline: "21 Billion Maximum Supply",
    preview: "NEXA has a fixed maximum supply of 21,000,000,000 tokens. Block rewards of 50 NEXA halve every four years. The token serves as gas currency, governance instrument, and merchant collateral across the network.",
    content: `## Token Economics: The NEXA Native Asset

### Supply Parameters

| Parameter | Value |
|-----------|-------|
| Maximum Supply | 21,000,000,000 NEXA |
| Genesis Supply | 0 NEXA (no pre-mine) |
| Block Reward | 50 NEXA per block |
| Block Time | ~500ms (CometBFT) |
| Halving Interval | Every 4 years |
| Smallest Unit | 1 Satoshi (10⁻⁸ NEXA) |
| Chain ID | 9999 |

### Emission Schedule

Year 1–4: 50 NEXA/block → ~3.15 billion NEXA minted
Year 5–8: 25 NEXA/block → ~1.58 billion NEXA minted
Year 9–12: 12.5 NEXA/block → ~0.79 billion NEXA minted
...continuing through 21 billion cap (reached approximately year 2099)

This supply schedule mirrors Bitcoin's deflationary emission model while providing sufficient early-stage liquidity for network bootstrapping and DeFi protocol seeding.

### Token Distribution

**40% — Validator Block Rewards (Progressive)**
Distributed to network validators proportional to stake weight and uptime. No single entity may control more than 10% of total staked supply in the genesis validator set.

**20% — Ecosystem Development Fund**
Governed by the NEXA Foundation DAO. Deployed via on-chain governance proposals for: protocol grants, developer incentives, liquidity mining programs, and exchange listings. 4-year linear unlock from genesis.

**15% — Core Team & Contributors**
1-year cliff, 3-year linear vest. Locked until 12 months post-mainnet launch. Aligned with long-term protocol success.

**15% — Strategic Partners & Early Backers**
6-month cliff, 2-year linear vest. Reserved for institutional infrastructure partners, cross-chain bridge operators, and anchor DeFi protocol integrations.

**10% — NEXA Foundation Reserve**
Held in a 5-of-9 multi-signature treasury. Emergency deployment only, subject to 72-hour governance timelock. Intended for regulatory compliance, insurance fund, and black-swan event response.

### Token Utility

**Gas Currency:** All NEXA network transaction fees are denominated and paid in NEXA. EIP-1559 base fees are burned; priority tips are distributed to the block proposer validator.

**Governance:** NEXA holders participate in on-chain governance — proposing and voting on protocol parameter changes, treasury deployments, and validator set modifications. 1 NEXA = 1 vote (quadratic voting available for DAO sub-modules).

**Validator Staking:** Validators must stake a minimum of 100,000 NEXA to participate in block production. Slashing conditions apply for double-signing or extended downtime.

**Merchant Collateral:** NEXA-accepting merchants may optionally post NEXA as collateral to unlock higher payment limits, preferential settlement terms, and access to the NEXA Merchant Credit facility.`,
  },
  {
    id: "governance",
    icon: Users,
    label: "Governance",
    badge: "Decentralization",
    tagline: "On-Chain, Trustless, Transparent",
    preview: "NEXA governance is conducted entirely on-chain. NEXA holders propose and vote on protocol changes, treasury deployments, and validator set modifications through a time-locked DAO with Sybil resistance.",
    content: `## Governance: The NEXA DAO

### Governance Philosophy

NEXA governance is grounded in the principle that protocol changes affecting all network participants must be approved by all network participants. There is no privileged multi-signature group capable of unilaterally upgrading the protocol. Every change — from gas parameter adjustments to emergency security patches — is subject to the on-chain governance lifecycle.

### Governance Actors

**NEXA Token Holders**
Any address holding ≥ 1,000 NEXA may participate in governance. Token holders submit proposals, vote, and delegate voting power to technical representatives ("Delegates") with expertise in specific domains.

**Validators**
The active validator set (initially capped at 100 validators, expanding to 300 by Year 2) participates in block production and holds special veto rights over consensus parameter changes that could destabilize block production. Validators must disclose their identity to the NEXA Foundation for KYB (Know Your Business) verification.

**NEXA Foundation**
A Cayman Islands foundation company acting as the steward — not controller — of the protocol. The Foundation holds no unilateral governance power. Its mandate is legal representation, regulatory engagement, and emergency response coordination.

### Proposal Lifecycle

**Stage 1: Forum Discussion (7 days)**
All governance proposals begin as off-chain discussions in the NEXA governance forum. Community feedback shapes the final proposal parameters. A minimum quorum of 50 validators must acknowledge the discussion before Stage 2.

**Stage 2: On-Chain Proposal (10 days voting)**
Proposals are submitted on-chain with a 1,000,000 NEXA deposit (slashed if proposal fails quorum). Voting: APPROVE, REJECT, ABSTAIN. Quorum: 10% of circulating supply must vote. Pass threshold: 66.7% of voting weight must APPROVE.

**Stage 3: Timelock (48–168 hours)**
Approved proposals enter a mandatory timelock period before execution. The timelock duration is proportional to the risk classification of the change:
— Parameter changes: 48-hour timelock
— Contract upgrades: 72-hour timelock
— Treasury deployments >$1M: 168-hour timelock

**Stage 4: Execution**
Any address may trigger execution after timelock expiry. The proposal executes atomically on-chain.

### Emergency Protocol
In the event of a critical security vulnerability, the NEXA Security Council (7 of 9 multi-signature of pre-elected security researchers) may pause specific protocol modules for up to 72 hours while the community deliberates a remedy. The Security Council cannot upgrade contracts or move treasury funds — only pause.`,
  },
  {
    id: "roadmap",
    icon: Map,
    label: "Roadmap",
    badge: "Milestones",
    tagline: "From Testnet to Global Infrastructure",
    preview: "NEXA's four-phase roadmap progresses from genesis network launch through institutional DeFi, mobile wallet integration, and finally cross-chain atomic swap infrastructure and global merchant network expansion.",
    content: `## Roadmap: Building Sovereign Financial Infrastructure

### Phase 1: Genesis — Foundation (Q1–Q2 2025)
**Status: Launching**

The genesis phase establishes the core network infrastructure and bootstraps the initial validator set.

**Milestones:**
— Testnet launch with 21 genesis validators
— NEXA EVM execution engine v1.0 (full opcode suite, EIP-1559 support)
— CometBFT consensus integration with ABCI 2.0 connector
— Block explorer deployment (nexa.scan)
— JSON-RPC 2.0 endpoint serving MetaMask, Foundry, and Hardhat
— Native NEXA wallet web application (send, receive, multi-chain)
— Merchant POS terminal and payment link infrastructure
— NEXA Foundation legal entity established (Cayman Islands)

---

### Phase 2: Growth — DeFi & Ecosystem (Q3–Q4 2025)
**Status: Planned**

Phase 2 activates the DeFi ecosystem and expands bridge connectivity to the broader EVM universe.

**Milestones:**
— Mainnet upgrade to 100 active validators
— NEXA DEX: Automated Market Maker (constant product formula, Uniswap V2-compatible ABI)
— NEXA Bridge: Trustless message-passing bridge to Ethereum mainnet (optimistic verification, 7-day challenge window)
— Stablecoin integration: USDC, USDT native on NEXA via bridge
— Governance module activation: on-chain DAO goes live
— Ecosystem Fund Round 1: $5M in grants to qualifying DeFi protocols
— First centralized exchange listing
— NEXA Lending Protocol: Overcollateralized NEXA-backed loans

---

### Phase 3: Scale — Mobile & Merchants (Q1–Q2 2026)
**Status: In Development**

Phase 3 brings NEXA to the physical world through mobile wallet integration and the NEXA merchant network.

**Milestones:**
— Apple Wallet & Google Wallet native pass integration (NEXA balance on mobile lock screen)
— NEXA mobile application (iOS + Android) via Expo React Native
— Merchant Network Launch: 10,000 merchant onboarding target
— NFC/Tap-to-Pay support via mobile wallet passes
— NEXA Pay SDK: Drop-in payment widget for e-commerce (Shopify, WooCommerce plugins)
— Validator set expansion to 200 active validators
— Cross-border payment corridors: US, EU, Southeast Asia, Sub-Saharan Africa

---

### Phase 4: Sovereignty — Institutional & Cross-Chain (Q3–Q4 2026)
**Status: Research**

Phase 4 completes the sovereign financial infrastructure vision with institutional APIs and cross-chain atomic settlement.

**Milestones:**
— Cross-chain atomic swaps: NEXA ↔ ETH ↔ BTC without bridge custodians (HTLC implementation)
— Institutional API suite: FIX-compatible order management, settlement attestations, compliance reporting
— NEXA Compliance Layer: Zero-knowledge proof-based KYC credential system (privacy-preserving AML)
— Validator set at 300 validators across 50+ countries
— ISO 20022 compatibility module for traditional bank interoperability
— NEXA Central Bank API: Protocol-level interface for CBDC integration experiments`,
  },
  {
    id: "security",
    icon: Lock,
    label: "Security & Compliance",
    badge: "Trust",
    tagline: "Cryptographically Enforced, Legally Sound",
    preview: "NEXA's security model is grounded in secp256k1 cryptographic guarantees, CometBFT BFT safety proofs, and an independent security audit program. Regulatory compliance frameworks are implemented at the protocol layer.",
    content: `## Security & Compliance

### Cryptographic Security Model

**Key Generation**
All NEXA private keys are generated from cryptographically secure pseudorandom number generators (CSPRNG) using the operating system entropy pool (getrandom() on Linux, CryptGenRandom on Windows). The secp256k1 elliptic curve provides 128-bit security — equivalent to AES-128 — against both classical and known quantum attack classes.

**Transaction Signing**
Every state transition on NEXA requires a valid ECDSA signature over the RLP-encoded transaction body. The ecrecover precompile (0x01) enables on-chain verification of transaction authorship without exposing private keys. Signature malleability is mitigated by requiring canonical low-S form (per EIP-2).

**Session Security**
The NEXA web application uses encrypted, HTTPOnly session cookies backed by a PostgreSQL session store. Session identifiers are 128-bit random values generated by the operating system CSPRNG. bcrypt (cost factor 12) is used for password hashing — computationally expensive enough to resist GPU-based dictionary attacks.

### Network Security

**Byzantine Fault Tolerance**
CometBFT's consensus algorithm guarantees safety (no two validators commit conflicting blocks) provided fewer than ⅓ of total voting power is Byzantine. Liveness (the network continues producing blocks) is guaranteed provided fewer than ⅓ of voting power is offline. This makes NEXA resilient to coordinated attacks on up to 33% of the validator set.

**Slashing**
Validators that double-sign (attempt to finalize conflicting blocks) have 5% of their staked NEXA slashed and are permanently jailed. Validators with >12 hours consecutive downtime in a 24-hour window have 0.01% of stake slashed and are temporarily jailed.

**Smart Contract Security**
NEXA's execution engine does not modify EVM opcode semantics. Any smart contract security audit conducted for Ethereum mainnet applies equally to NEXA deployment. Developers are encouraged to use Foundry's fuzzing and formal verification tooling prior to deployment.

### Audit Program

NEXA commits to independent security audits at each major protocol milestone:

— **Execution Engine Audit**: Third-party review of EVM opcode implementation, RLP encoding, and MPT state transitions prior to mainnet launch. Conducted by a qualified blockchain security firm.
— **Consensus Integration Audit**: Review of ABCI 2.0 connector logic and CometBFT integration surface.
— **Bridge Audit**: Comprehensive review of cross-chain message passing and fraud-proof logic prior to Phase 2 bridge deployment.
— **Smart Contract Audits**: All protocol-owned contracts (DEX, lending, governance) audited prior to activation.
— **Continuous Bug Bounty**: Immunefi-hosted bounty program offering up to $500,000 USD for critical execution engine or consensus vulnerabilities.

### Regulatory Compliance

NEXA operates within a compliance-first design philosophy:

**MiCA Compliance (EU)**: NEXA's infrastructure qualifies as a Distributed Ledger Technology (DLT) settlement system under MiCA Article 2. The NEXA Foundation is preparing for CASP (Crypto Asset Service Provider) registration in the EU.

**Travel Rule**: NEXA payment APIs implement FATF Travel Rule data collection for transactions exceeding $1,000 USD equivalent, facilitating compliance for regulated NEXA-integrated service providers.

**KYC/AML**: The Phase 4 Zero-Knowledge KYC module enables service providers to verify regulatory compliance credentials without exposing personal data to the NEXA base layer — privacy-preserving compliance.

**Sanctions Screening**: NEXA node software includes an optional OFAC/EU sanctions list screening module that regulated operators can activate at the RPC level.`,
  },
  {
    id: "legal",
    icon: Scale,
    label: "Legal Notice",
    badge: "Disclaimer",
    tagline: "Important Regulatory Information",
    preview: "This whitepaper is published for informational purposes only and does not constitute an offer to sell, or a solicitation to purchase, any NEXA tokens or any other financial instrument.",
    content: `## Legal Notice & Regulatory Disclaimer

### Important Notice

This whitepaper ("Document") has been prepared by the NEXA Foundation (the "Foundation") and is published for informational and educational purposes only. This Document does not constitute, and should not be construed as, an offer to sell or the solicitation of an offer to buy any securities, tokens, financial instruments, investment products, or any other regulated product in any jurisdiction.

### Forward-Looking Statements

This Document contains forward-looking statements, projections, and technical descriptions regarding the development, deployment, and operation of the NEXA protocol. These statements are subject to significant risks, uncertainties, and assumptions that may cause actual results, performance, or achievements to differ materially from those expressed or implied.

The Foundation makes no representation or warranty, express or implied, regarding the accuracy, completeness, or suitability of any information contained in this Document. The Foundation expressly disclaims any liability for decisions made based on this Document.

### Risk Factors

Participation in blockchain networks and holding of cryptographic tokens involves significant risks, including but not limited to:

**Technical Risks:** Smart contract vulnerabilities, consensus mechanism failures, cryptographic protocol weaknesses, software bugs, and network attacks may result in partial or total loss of funds.

**Regulatory Risk:** The regulatory treatment of cryptographic tokens, decentralized finance, and blockchain-based payment systems varies by jurisdiction and is subject to rapid change. Participation may become restricted or prohibited in your jurisdiction.

**Market Risk:** Cryptographic token values are highly volatile. The value of NEXA tokens may decrease substantially or become zero. Past performance of other tokens is not indicative of future NEXA token performance.

**Liquidity Risk:** NEXA tokens may have limited or no secondary market liquidity. There is no guarantee that token holders will be able to sell their holdings at any price.

**Development Risk:** The NEXA protocol is in active development. Planned features described in this Document may be delayed, modified, or abandoned. There is no guarantee that the roadmap milestones will be achieved.

### Jurisdiction-Specific Notice

This Document is not directed at persons in jurisdictions where the distribution or publication of this Document would be contrary to applicable law or regulation. The Foundation makes no representation that this Document complies with the laws of any jurisdiction.

Persons resident in the United States of America, the People's Republic of China, and any OFAC-sanctioned jurisdiction should not rely on or act upon this Document.

### No Investment Advice

Nothing in this Document constitutes professional legal, financial, tax, or investment advice. Recipients should consult independent professional advisors before making any decisions based on this Document.

© 2025 NEXA Foundation. All rights reserved. NEXA, the NEXA logo, and all associated trademarks are the property of the NEXA Foundation.`,
  },
];

const BADGE_COLORS: Record<string, string> = {
  "Overview": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "The Challenge": "bg-red-500/10 text-red-400 border-red-500/20",
  "Opportunity": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Solution": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Deep Dive": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Developer Tools": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "NEXA Token": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Decentralization": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Milestones": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Trust": "bg-slate-500/10 text-slate-400 border-slate-500/20",
  "Disclaimer": "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

function SectionModal({ section, onClose }: { section: Section; onClose: () => void }) {
  const paragraphs = section.content.split("\n\n");

  const renderLine = (line: string, i: number) => {
    if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-black text-white mb-6 mt-8 first:mt-0">{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-bold text-amber-400 mb-3 mt-6">{line.slice(4)}</h3>;
    if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      return <p key={i} className="font-bold text-white/90 text-sm mb-2">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith("— ")) {
      const items = line.split("\n").map(l => l.replace(/^— /, ""));
      return (
        <ul key={i} className="space-y-1.5 mb-4">
          {items.map((item, j) => <li key={j} className="flex items-start gap-2 text-sm text-white/65 leading-relaxed"><span className="text-amber-400/60 mt-1 shrink-0">—</span>{item}</li>)}
        </ul>
      );
    }
    if (line.startsWith("| ")) {
      const rows = line.split("\n").filter(r => !r.match(/^\|[-| ]+\|$/));
      return (
        <div key={i} className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <tbody>
              {rows.map((row, j) => {
                const cells = row.split("|").filter(c => c.trim());
                return <tr key={j} className={j === 0 ? "border-b border-amber-400/20" : "border-b border-white/5"}>
                  {cells.map((c, k) => <td key={k} className={`py-2 px-3 ${j === 0 ? "font-bold text-amber-400" : "text-white/60"}`}>{c.trim()}</td>)}
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      );
    }
    if (line.startsWith("```")) {
      const code = paragraphs.slice(paragraphs.indexOf(line)).find((p, pi) => pi > 0 && p.endsWith("```"));
      if (code) {
        return (
          <div key={i} className="bg-black/60 border border-white/8 rounded-xl p-4 font-mono text-[11px] text-amber-400/70 mb-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {line.replace(/^```\w*/, "").trim()}
          </div>
        );
      }
    }
    if (line.includes("**") || line.includes("*")) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-sm text-white/65 leading-relaxed mb-4">
          {parts.map((part, j) => part.startsWith("**") ? <strong key={j} className="font-bold text-white/90">{part.slice(2, -2)}</strong> : part)}
        </p>
      );
    }
    if (line.startsWith("---")) return <hr key={i} className="border-white/10 my-6" />;
    return <p key={i} className="text-sm text-white/65 leading-relaxed mb-4">{line}</p>;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0a08] border border-amber-400/15 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <section.icon className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-widest mb-1 ${BADGE_COLORS[section.badge] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                {section.badge.toUpperCase()}
              </div>
              <h2 className="font-black text-xl text-white">{section.label}</h2>
              <p className="text-amber-400/70 text-xs font-medium mt-0.5">{section.tagline}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1">
          {paragraphs.map((para, i) => renderLine(para, i))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/8 shrink-0 bg-black/20">
          <span className="text-xs text-white/30">NEXA Foundation — Whitepaper v1.0 — June 2025</span>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors">
            Close Section
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WhitepaperPage() {
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 pt-20 pb-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-amber-400/4 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-xl" />
              <img src={nexaLogo} alt="Nexa" className="relative w-20 h-20 object-contain drop-shadow-2xl" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black mb-6 tracking-[0.3em]">
            OFFICIAL WHITEPAPER v1.0 — JUNE 2025
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            NEXA Protocol
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-amber-400 mb-6">
            The Sovereign Payment Blockchain
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            A technical and economic treatise on the NEXA sovereign Layer 1 blockchain — its architecture, token economics, governance model, and roadmap toward becoming the definitive settlement layer for global payments.
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {[
              { label: "Authors", value: "NEXA Foundation Research" },
              { label: "Version", value: "1.0.0" },
              { label: "Date", value: "June 2025" },
              { label: "Chain ID", value: "9999" },
              { label: "Max Supply", value: "21B NEXA" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-[9px] text-white/30 font-bold tracking-widest">{m.label.toUpperCase()}</div>
                <div className="text-xs font-bold text-amber-400">{m.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-bold text-sm rounded-full shadow-lg shadow-amber-400/20 hover:from-amber-600 hover:to-amber-500 transition-all">
              <Download className="h-4 w-4" /> Download PDF
            </button>
            <button
              onClick={() => setActiveSection(SECTIONS[0])}
              className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-semibold text-sm rounded-full transition-all"
            >
              Read Online <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Contents grid */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black text-amber-600 tracking-[0.4em] mb-3">TABLE OF CONTENTS</p>
            <h2 className="text-4xl font-black text-slate-900">Sections</h2>
            <p className="text-slate-500 text-sm mt-3">Click any section to open in a dedicated reading window</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section)}
                className="group text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <section.icon className="h-4.5 w-4.5 h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-black tracking-wider ${BADGE_COLORS[section.badge] ?? ""}`}>
                        {section.badge.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-300 group-hover:text-amber-400 transition-colors">§{String(index + 1).padStart(2, "0")}</span>
                </div>

                <h3 className="font-black text-slate-900 text-base mb-1">{section.label}</h3>
                <p className="text-[11px] font-semibold text-amber-600 mb-3">{section.tagline}</p>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{section.preview}</p>

                <div className="flex items-center gap-1.5 mt-4 text-amber-600 group-hover:text-amber-700 transition-colors">
                  <span className="text-xs font-bold">Read full section</span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Summary stats */}
      <section className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "21B", label: "Max NEXA Supply" },
              { value: "500ms", label: "Block Finality" },
              { value: "140+", label: "EVM Opcodes" },
              { value: "9999", label: "Chain ID" },
            ].map((s) => (
              <div key={s.label} className="group">
                <div className="text-3xl font-black text-amber-500 mb-1">{s.value}</div>
                <div className="text-slate-500 text-xs font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeSection && (
        <SectionModal section={activeSection} onClose={() => setActiveSection(null)} />
      )}
    </div>
  );
}
