import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, paymentLinksTable, transactionsTable, walletsTable, usersTable } from "@workspace/db";
import { generateCouponPdf, generateReceiptPdf } from "../lib/pdf";

const router = Router();

// GET /pay/:code — public, anyone can view
router.get("/pay/:code", async (req, res) => {
  const [link] = await db
    .select()
    .from(paymentLinksTable)
    .where(eq(paymentLinksTable.linkCode, req.params.code))
    .limit(1);

  if (!link) {
    res.status(404).json({ error: "Payment link not found" });
    return;
  }

  const host = req.get("host") ?? "localhost";
  const protocol = req.secure ? "https" : "http";

  res.json({
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

// POST /pay/:code — submit payment
router.post("/pay/:code", async (req, res) => {
  const { payerEmail, payerName, currency } = req.body as {
    payerEmail: string;
    payerName: string;
    currency?: string;
  };

  if (!payerEmail || !payerName) {
    res.status(400).json({ error: "Payer email and name are required" });
    return;
  }

  const [link] = await db
    .select()
    .from(paymentLinksTable)
    .where(eq(paymentLinksTable.linkCode, req.params.code))
    .limit(1);

  if (!link) {
    res.status(404).json({ error: "Payment link not found" });
    return;
  }

  if (link.status !== "active") {
    res.status(400).json({ error: `Payment link is ${link.status}` });
    return;
  }

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    await db.update(paymentLinksTable).set({ status: "expired" }).where(eq(paymentLinksTable.id, link.id));
    res.status(400).json({ error: "Payment link has expired" });
    return;
  }

  // Get merchant wallet to credit
  const [merchantWallet] = await db
    .select()
    .from(walletsTable)
    .where(and(eq(walletsTable.userId, link.merchantId), eq(walletsTable.currency, link.currency)))
    .limit(1);

  if (merchantWallet) {
    await db
      .update(walletsTable)
      .set({ balance: (parseFloat(merchantWallet.balance) + parseFloat(link.amount)).toFixed(8) })
      .where(eq(walletsTable.id, merchantWallet.id));
  }

  // Get merchant info
  const [merchant] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, link.merchantId))
    .limit(1);

  // Create transaction
  const [tx] = await db
    .insert(transactionsTable)
    .values({
      senderId: null,
      recipientId: link.merchantId,
      senderAddress: payerEmail,
      recipientAddress: merchantWallet?.address ?? null,
      amount: link.amount,
      currency: link.currency,
      type: "payment_link",
      status: "completed",
      description: link.description,
      paymentLinkId: link.id,
      metadata: { payerEmail, payerName },
      receiptIssued: true,
    })
    .returning();

  // Mark link as paid
  await db
    .update(paymentLinksTable)
    .set({ status: "paid", paidAt: new Date() })
    .where(eq(paymentLinksTable.id, link.id));

  const host = req.get("host") ?? "localhost";
  const protocol = req.secure ? "https" : "http";

  const receiptData = {
    transactionId: tx.id,
    amount: tx.amount,
    currency: tx.currency,
    type: tx.type,
    status: tx.status,
    description: tx.description,
    createdAt: tx.createdAt.toISOString(),
    merchantName: merchant?.businessName ?? merchant?.fullName,
    payerName,
    payerEmail,
  };

  res.json({
    transaction: {
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
    },
    receiptUrl: `${protocol}://${host}/api/user/transactions/${tx.id}/receipt?token=${tx.id}`,
    couponPdfUrl: `${protocol}://${host}/api/user/transactions/${tx.id}/coupon?token=${tx.id}`,
  });
});

// GET /user/transactions/:id/receipt — PDF download
router.get("/user/transactions/:id/receipt", async (req, res) => {
  const [tx] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.id, req.params.id))
    .limit(1);

  if (!tx) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  const meta = tx.metadata as Record<string, string> | null;

  const pdfBytes = await generateReceiptPdf({
    transactionId: tx.id,
    amount: tx.amount,
    currency: tx.currency,
    type: tx.type,
    status: tx.status,
    description: tx.description,
    createdAt: tx.createdAt.toISOString(),
    senderAddress: tx.senderAddress,
    recipientAddress: tx.recipientAddress,
    payerName: meta?.payerName,
    payerEmail: meta?.payerEmail,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="helix-receipt-${tx.id.slice(0, 8)}.pdf"`);
  res.send(Buffer.from(pdfBytes));
});

// GET /user/transactions/:id/coupon — Coupon PDF
router.get("/user/transactions/:id/coupon", async (req, res) => {
  const [tx] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.id, req.params.id))
    .limit(1);

  if (!tx) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  const meta = tx.metadata as Record<string, string> | null;

  let merchantName: string | undefined;
  if (tx.recipientId) {
    const [merchant] = await db.select().from(usersTable).where(eq(usersTable.id, tx.recipientId)).limit(1);
    merchantName = merchant?.businessName ?? merchant?.fullName;
  }

  const pdfBytes = await generateCouponPdf({
    transactionId: tx.id,
    amount: tx.amount,
    currency: tx.currency,
    type: tx.type,
    status: tx.status,
    description: tx.description,
    createdAt: tx.createdAt.toISOString(),
    merchantName,
    payerName: meta?.payerName,
    payerEmail: meta?.payerEmail,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="helix-coupon-${tx.id.slice(0, 8)}.pdf"`);
  res.send(Buffer.from(pdfBytes));
});

export default router;
