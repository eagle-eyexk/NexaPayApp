import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface ReceiptData {
  transactionId: string;
  amount: string;
  currency: string;
  type: string;
  status: string;
  description: string | null;
  createdAt: string;
  recipientAddress?: string | null;
  senderAddress?: string | null;
  merchantName?: string;
  payerName?: string;
  payerEmail?: string;
}

export async function generateReceiptPdf(data: ReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([500, 700]);
  const { width, height } = page.getSize();

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const navy = rgb(0.05, 0.08, 0.2);
  const cyan = rgb(0.0, 0.85, 0.95);
  const gray = rgb(0.4, 0.4, 0.5);
  const white = rgb(1, 1, 1);
  const green = rgb(0.1, 0.75, 0.4);

  // Header background
  page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: navy });

  // Brand
  page.drawText("HELIX", { x: 30, y: height - 50, size: 28, font: boldFont, color: white });
  page.drawText("PROTOCOL", { x: 30, y: height - 72, size: 11, font: regularFont, color: cyan });
  page.drawText("PAYMENT RECEIPT", { x: width - 160, y: height - 55, size: 11, font: boldFont, color: cyan });

  // Reference line
  page.drawText(`REF: ${data.transactionId.slice(0, 8).toUpperCase()}`, {
    x: width - 160, y: height - 75, size: 8, font: regularFont, color: rgb(0.7, 0.7, 0.8),
  });

  // Status badge
  const statusColor = data.status === "completed" ? green : gray;
  page.drawRectangle({ x: 30, y: height - 180, width: 100, height: 24, color: statusColor, opacity: 0.15 });
  page.drawText(data.status.toUpperCase(), {
    x: 38, y: height - 172, size: 9, font: boldFont, color: statusColor,
  });

  // Amount
  page.drawText(`${data.amount} ${data.currency}`, {
    x: 30, y: height - 230, size: 36, font: boldFont, color: navy,
  });

  const dateStr = new Date(data.createdAt).toLocaleString("en-US", {
    dateStyle: "long", timeStyle: "short",
  });
  page.drawText(dateStr, { x: 30, y: height - 260, size: 10, font: regularFont, color: gray });

  // Divider
  page.drawLine({ start: { x: 30, y: height - 280 }, end: { x: width - 30, y: height - 280 }, thickness: 0.5, color: rgb(0.85, 0.87, 0.92) });

  // Fields
  const fields: [string, string][] = [
    ["Transaction ID", data.transactionId],
    ["Type", data.type.replace(/_/g, " ").toUpperCase()],
    ["Status", data.status.toUpperCase()],
    ...(data.description ? [["Description", data.description] as [string, string]] : []),
    ...(data.merchantName ? [["Merchant", data.merchantName] as [string, string]] : []),
    ...(data.payerName ? [["Paid by", data.payerName] as [string, string]] : []),
    ...(data.payerEmail ? [["Email", data.payerEmail] as [string, string]] : []),
    ...(data.senderAddress ? [["From", data.senderAddress] as [string, string]] : []),
    ...(data.recipientAddress ? [["To", data.recipientAddress] as [string, string]] : []),
  ];

  let y = height - 310;
  for (const [label, value] of fields) {
    page.drawText(label, { x: 30, y, size: 9, font: regularFont, color: gray });
    const displayValue = value.length > 50 ? value.slice(0, 48) + "…" : value;
    page.drawText(displayValue, { x: 200, y, size: 9, font: boldFont, color: navy });
    y -= 26;
  }

  // Footer
  page.drawRectangle({ x: 0, y: 0, width, height: 60, color: navy });
  page.drawText("Powered by Helix Protocol · helix.protocol", {
    x: 30, y: 25, size: 9, font: regularFont, color: rgb(0.5, 0.55, 0.7),
  });
  page.drawText("Finance, Evolved.", { x: width - 120, y: 25, size: 9, font: boldFont, color: cyan });

  return pdfDoc.save();
}

export async function generateCouponPdf(data: ReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 260]);
  const { width, height } = page.getSize();

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const navy = rgb(0.05, 0.08, 0.2);
  const cyan = rgb(0.0, 0.85, 0.95);
  const gray = rgb(0.4, 0.4, 0.5);
  const white = rgb(1, 1, 1);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: navy });

  // Dashed border effect
  page.drawRectangle({ x: 8, y: 8, width: width - 16, height: height - 16, borderColor: cyan, borderWidth: 1, opacity: 0.4 });

  // Brand
  page.drawText("HELIX PROTOCOL", { x: 20, y: height - 34, size: 12, font: boldFont, color: white });
  page.drawText("PAYMENT COUPON", { x: width - 140, y: height - 34, size: 10, font: boldFont, color: cyan });

  // Divider
  page.drawLine({ start: { x: 20, y: height - 45 }, end: { x: width - 20, y: height - 45 }, thickness: 0.5, color: rgb(0.3, 0.35, 0.5) });

  // Amount - large
  page.drawText(`${data.amount} ${data.currency}`, { x: 20, y: height - 95, size: 32, font: boldFont, color: white });
  page.drawText(data.description ?? "Payment", { x: 20, y: height - 115, size: 10, font: regularFont, color: rgb(0.6, 0.65, 0.8) });

  // Details
  const date = new Date(data.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  page.drawText(`Date: ${date}`, { x: 20, y: height - 150, size: 9, font: regularFont, color: rgb(0.6, 0.65, 0.8) });
  page.drawText(`Ref: ${data.transactionId.slice(0, 12).toUpperCase()}`, { x: 20, y: height - 166, size: 9, font: regularFont, color: rgb(0.6, 0.65, 0.8) });
  if (data.merchantName) {
    page.drawText(`Merchant: ${data.merchantName}`, { x: 20, y: height - 182, size: 9, font: regularFont, color: rgb(0.6, 0.65, 0.8) });
  }

  // Status badge
  page.drawRectangle({ x: width - 100, y: height - 165, width: 80, height: 22, color: rgb(0.0, 0.75, 0.5), opacity: 0.2 });
  page.drawText("PAID", { x: width - 80, y: height - 158, size: 10, font: boldFont, color: rgb(0.0, 0.9, 0.6) });

  // Footer
  page.drawLine({ start: { x: 20, y: 35 }, end: { x: width - 20, y: 35 }, thickness: 0.5, color: rgb(0.3, 0.35, 0.5) });
  page.drawText("Finance, Evolved. · Helix Protocol", { x: 20, y: 18, size: 8, font: regularFont, color: rgb(0.4, 0.45, 0.6) });

  return pdfDoc.save();
}
