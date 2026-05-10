import { Router } from "express";
import { eq, and, or, desc } from "drizzle-orm";
import { db, walletsTable, cardsTable, transactionsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// GET /user/wallets
router.get("/user/wallets", requireAuth, async (req, res) => {
  const wallets = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.userId, req.session.userId!));

  res.json(wallets.map((w) => ({
    id: w.id,
    currency: w.currency,
    balance: w.balance,
    address: w.address,
  })));
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

  // Find recipient by address
  const [recipientWallet] = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.address, recipientAddress))
    .limit(1);

  // Deduct from sender
  await db
    .update(walletsTable)
    .set({ balance: (parseFloat(senderWallet.balance) - amount).toFixed(8) })
    .where(eq(walletsTable.id, senderWallet.id));

  // Credit recipient if internal
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
    qrData: `helix:${wallet.address}?currency=${currency}`,
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

  const chars = "0123456789abcdef";
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
      balance: "1000",
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
