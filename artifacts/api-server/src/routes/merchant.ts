import { Router } from "express";
import { eq, and, desc, gte, lte, sum, count } from "drizzle-orm";
import { db, paymentLinksTable, transactionsTable, walletsTable } from "@workspace/db";
import { requireMerchant } from "../middlewares/auth";
import { nanoid } from "nanoid";

const router = Router();

// GET /merchant/stats
router.get("/merchant/stats", requireMerchant, async (req, res) => {
  const merchantId = req.session.userId!;

  const allTxs = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.recipientId, merchantId));

  const activeLinks = await db
    .select()
    .from(paymentLinksTable)
    .where(and(eq(paymentLinksTable.merchantId, merchantId), eq(paymentLinksTable.status, "active")));

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalRevenue = allTxs.reduce((s, tx) => s + parseFloat(tx.amount), 0);
  const todayRevenue = allTxs
    .filter((tx) => new Date(tx.createdAt) >= todayStart)
    .reduce((s, tx) => s + parseFloat(tx.amount), 0);
  const monthRevenue = allTxs
    .filter((tx) => new Date(tx.createdAt) >= monthStart)
    .reduce((s, tx) => s + parseFloat(tx.amount), 0);
  const avgTx = allTxs.length > 0 ? totalRevenue / allTxs.length : 0;

  res.json({
    totalRevenue: totalRevenue.toFixed(2),
    totalTransactions: allTxs.length,
    activeLinks: activeLinks.length,
    avgTransactionValue: avgTx.toFixed(2),
    todayRevenue: todayRevenue.toFixed(2),
    monthRevenue: monthRevenue.toFixed(2),
  });
});

// GET /merchant/transactions
router.get("/merchant/transactions", requireMerchant, async (req, res) => {
  const merchantId = req.session.userId!;
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const txs = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.recipientId, merchantId))
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

// GET /merchant/payment-links
router.get("/merchant/payment-links", requireMerchant, async (req, res) => {
  const merchantId = req.session.userId!;

  const links = await db
    .select()
    .from(paymentLinksTable)
    .where(eq(paymentLinksTable.merchantId, merchantId))
    .orderBy(desc(paymentLinksTable.createdAt));

  const host = req.get("host") ?? "localhost";
  const protocol = req.secure ? "https" : "http";

  res.json(links.map((l) => ({
    id: l.id,
    merchantId: l.merchantId,
    amount: l.amount,
    currency: l.currency,
    description: l.description,
    linkCode: l.linkCode,
    status: l.status,
    payerId: l.payerId,
    paidAt: l.paidAt?.toISOString() ?? null,
    expiresAt: l.expiresAt?.toISOString() ?? null,
    createdAt: l.createdAt.toISOString(),
    url: `${protocol}://${host}/pay/${l.linkCode}`,
  })));
});

// POST /merchant/payment-links
router.post("/merchant/payment-links", requireMerchant, async (req, res) => {
  const merchantId = req.session.userId!;
  const { amount, currency, description, expiresInHours } = req.body as {
    amount: number;
    currency: string;
    description: string;
    expiresInHours?: number;
  };

  if (!amount || !currency || !description) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const linkCode = nanoid(12);
  const expiresAt = expiresInHours
    ? new Date(Date.now() + expiresInHours * 3600 * 1000)
    : null;

  const [link] = await db
    .insert(paymentLinksTable)
    .values({
      merchantId,
      amount: amount.toFixed(8),
      currency,
      description,
      linkCode,
      status: "active",
      expiresAt,
    })
    .returning();

  const host = req.get("host") ?? "localhost";
  const protocol = req.secure ? "https" : "http";

  res.status(201).json({
    id: link.id,
    merchantId: link.merchantId,
    amount: link.amount,
    currency: link.currency,
    description: link.description,
    linkCode: link.linkCode,
    status: link.status,
    payerId: link.payerId,
    paidAt: link.paidAt?.toISOString() ?? null,
    expiresAt: link.expiresAt?.toISOString() ?? null,
    createdAt: link.createdAt.toISOString(),
    url: `${protocol}://${host}/pay/${link.linkCode}`,
  });
});

// DELETE /merchant/payment-links/:id
router.delete("/merchant/payment-links/:id", requireMerchant, async (req, res) => {
  const merchantId = req.session.userId!;

  const [link] = await db
    .select()
    .from(paymentLinksTable)
    .where(and(eq(paymentLinksTable.id, req.params.id as string), eq(paymentLinksTable.merchantId, merchantId)))
    .limit(1);

  if (!link) {
    res.status(404).json({ error: "Payment link not found" });
    return;
  }

  await db
    .update(paymentLinksTable)
    .set({ status: "cancelled" })
    .where(eq(paymentLinksTable.id, req.params.id as string));

  res.json({ success: true, message: "Payment link cancelled" });
});

// POST /merchant/pos/charge
router.post("/merchant/pos/charge", requireMerchant, async (req, res) => {
  const merchantId = req.session.userId!;
  const { amount, currency, description, customerEmail } = req.body as {
    amount: number;
    currency: string;
    description: string;
    customerEmail?: string;
  };

  if (!amount || !currency || !description) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Get merchant's wallet to credit
  const [merchantWallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.userId, merchantId), eq(walletsTable.currency, currency)))
    .limit(1);

  if (merchantWallet) {
    await db
      .update(walletsTable)
      .set({ balance: (parseFloat(merchantWallet.balance) + amount).toFixed(8) })
      .where(eq(walletsTable.id, merchantWallet.id));
  }

  const [tx] = await db
    .insert(transactionsTable)
    .values({
      senderId: null,
      recipientId: merchantId,
      senderAddress: customerEmail ?? "pos-terminal",
      recipientAddress: merchantWallet?.address ?? null,
      amount: amount.toFixed(8),
      currency,
      type: "pos",
      status: "completed",
      description,
      metadata: customerEmail ? { customerEmail } : null,
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

export default router;
