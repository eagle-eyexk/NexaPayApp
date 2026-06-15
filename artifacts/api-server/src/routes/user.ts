import { Router } from "express";
import { eq, and, or, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, walletsTable, cardsTable, transactionsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { generateNexaKeypair } from "./auth";

const router = Router();

async function ensureNexaWallet(userId: string) {
  const existing = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.userId, userId), eq(walletsTable.currency, "NEXA")))
    .limit(1);

  if (existing.length === 0) {
    const { privateKey, publicKey, address } = generateNexaKeypair();
    await db.insert(walletsTable).values({
      userId,
      currency: "NEXA",
      balance: "0",
      address,
      publicKey,
      privateKey,
    });
    return;
  }

  const wallet = existing[0];
  if (!wallet.privateKey || !wallet.publicKey) {
    const { privateKey, publicKey, address } = generateNexaKeypair();
    await db
      .update(walletsTable)
      .set({ privateKey, publicKey, address })
      .where(eq(walletsTable.id, wallet.id));
  }
}

// GET /user/wallets
router.get("/user/wallets", requireAuth, async (req, res) => {
  await ensureNexaWallet(req.session.userId!);

  const wallets = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.userId, req.session.userId!));

  res.json(wallets.map((w) => ({
    id: w.id,
    currency: w.currency,
    balance: w.balance,
    address: w.address,
    publicKey: w.publicKey ?? null,
  })));
});

// GET /user/nexa-wallet/key
router.get("/user/nexa-wallet/key", requireAuth, async (req, res) => {
  await ensureNexaWallet(req.session.userId!);

  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.userId, req.session.userId!), eq(walletsTable.currency, "NEXA")))
    .limit(1);

  if (!wallet || !wallet.privateKey || !wallet.publicKey) {
    res.status(404).json({ error: "NEXA wallet not found" });
    return;
  }

  res.json({
    address: wallet.address,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey,
    currency: "NEXA",
  });
});

// PUT /user/settings
router.put("/user/settings", requireAuth, async (req, res) => {
  const { fullName, email } = req.body as { fullName: string; email: string };

  if (!fullName || !email) {
    res.status(400).json({ error: "Full name and email are required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing.length > 0 && existing[0].id !== req.session.userId) {
    res.status(400).json({ error: "Email already in use by another account" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ fullName, email })
    .where(eq(usersTable.id, req.session.userId!))
    .returning();

  req.session.userFullName = user.fullName;
  req.session.userEmail = user.email;

  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    businessName: user.businessName,
    createdAt: user.createdAt.toISOString(),
  });
});

// POST /user/settings/password
router.post("/user/settings/password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Both current and new password are required" });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId!))
    .limit(1);

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400).json({ error: "Current password is incorrect" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db
    .update(usersTable)
    .set({ passwordHash })
    .where(eq(usersTable.id, req.session.userId!));

  res.json({ success: true, message: "Password updated successfully" });
});

// POST /user/wallets/send
router.post("/user/wallets/send", requireAuth, async (req, res) => {
  const { recipientAddress, amount, currency, description } = req.body as {
    recipientAddress: string;
    amount: number;
    currency: string;
    description?: string;
  };

  if (!recipientAddress || !amount || !currency) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [senderWallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.userId, req.session.userId!), eq(walletsTable.currency, currency)))
    .limit(1);

  if (!senderWallet) {
    res.status(400).json({ error: "Wallet not found for this currency" });
    return;
  }

  if (parseFloat(senderWallet.balance) < amount) {
    res.status(400).json({ error: "Insufficient balance" });
    return;
  }

  const [recipientWallet] = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.address, recipientAddress))
    .limit(1);

  await db
    .update(walletsTable)
    .set({ balance: (parseFloat(senderWallet.balance) - amount).toFixed(8) })
    .where(eq(walletsTable.id, senderWallet.id));

  if (recipientWallet) {
    await db
      .update(walletsTable)
      .set({ balance: (parseFloat(recipientWallet.balance) + amount).toFixed(8) })
      .where(eq(walletsTable.id, recipientWallet.id));
  }

  const [tx] = await db
    .insert(transactionsTable)
    .values({
      senderId: req.session.userId!,
      recipientId: recipientWallet?.userId ?? null,
      senderAddress: senderWallet.address,
      recipientAddress,
      amount: amount.toFixed(8),
      currency,
      type: "send",
      status: "completed",
      description: description ?? null,
    })
    .returning();

  res.json({
    id: tx.id,
    senderId: tx.senderId,
    recipientId: tx.recipientId,
    senderAddress: tx.senderAddress,
    recipientAddress: tx.recipientAddress,
    amount: tx.amount,
    currency: tx.currency,
    type: tx.type,
    status: tx.status,
    description: tx.description,
    chain: tx.chain,
    createdAt: tx.createdAt.toISOString(),
  });
});

// GET /user/wallets/receive/:currency
router.get("/user/wallets/receive/:currency", requireAuth, async (req, res) => {
  const { currency } = req.params;

  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.userId, req.session.userId!), eq(walletsTable.currency, currency as string)))
    .limit(1);

  if (!wallet) {
    res.status(404).json({ error: "Wallet not found" });
    return;
  }

  res.json({
    currency: wallet.currency,
    address: wallet.address,
    qrData: `nexa:${wallet.address}?currency=${currency}`,
  });
});

// GET /user/card
router.get("/user/card", requireAuth, async (req, res) => {
  const [card] = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.userId, req.session.userId!))
    .limit(1);

  if (!card) {
    res.status(404).json({ error: "No card issued" });
    return;
  }

  res.json({
    id: card.id,
    cardNumberMasked: card.cardNumberMasked,
    cardholderName: card.cardholderName,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    cvv: card.cvv,
    balance: card.balance,
    currency: card.currency,
    status: card.status,
  });
});

// POST /user/card (issue card if none)
router.post("/user/card", requireAuth, async (req, res) => {
  const existing = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.userId, req.session.userId!))
    .limit(1);

  if (existing.length > 0) {
    res.status(400).json({ error: "Card already issued" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId!))
    .limit(1);

  const segments = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000).toString());
  const now = new Date();

  const [card] = await db
    .insert(cardsTable)
    .values({
      userId: req.session.userId!,
      cardNumberFull: segments.join(" "),
      cardNumberMasked: `**** **** **** ${segments[3]}`,
      expiryMonth: now.getMonth() + 1,
      expiryYear: now.getFullYear() + 4,
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      cardholderName: user.fullName.toUpperCase(),
      balance: "0",
      currency: "USD",
      status: "active",
    })
    .returning();

  res.status(201).json({
    id: card.id,
    cardNumberMasked: card.cardNumberMasked,
    cardholderName: card.cardholderName,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    cvv: card.cvv,
    balance: card.balance,
    currency: card.currency,
    status: card.status,
  });
});

// GET /user/transactions
router.get("/user/transactions", requireAuth, async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const txs = await db
    .select()
    .from(transactionsTable)
    .where(
      or(
        eq(transactionsTable.senderId, req.session.userId!),
        eq(transactionsTable.recipientId, req.session.userId!)
      )
    )
    .orderBy(desc(transactionsTable.createdAt))
    .limit(limit);

  res.json(txs.map((tx) => ({
    id: tx.id,
    senderId: tx.senderId,
    recipientId: tx.recipientId,
    senderAddress: tx.senderAddress,
    recipientAddress: tx.recipientAddress,
    amount: tx.amount,
    currency: tx.currency,
    type: tx.type,
    status: tx.status,
    description: tx.description,
    chain: tx.chain,
    createdAt: tx.createdAt.toISOString(),
  })));
});

// GET /user/transactions/:id
router.get("/user/transactions/:id", requireAuth, async (req, res) => {
  const [tx] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.id, req.params.id as string))
    .limit(1);

  if (!tx) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  if (tx.senderId !== req.session.userId && tx.recipientId !== req.session.userId) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  res.json({
    id: tx.id,
    senderId: tx.senderId,
    recipientId: tx.recipientId,
    senderAddress: tx.senderAddress,
    recipientAddress: tx.recipientAddress,
    amount: tx.amount,
    currency: tx.currency,
    type: tx.type,
    status: tx.status,
    description: tx.description,
    chain: tx.chain,
    createdAt: tx.createdAt.toISOString(),
  });
});

export default router;
