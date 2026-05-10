import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable, walletsTable, cardsTable } from "@workspace/db";

const router = Router();

function generateAddress(currency: string): string {
  const chars = "0123456789abcdef";
  const prefix = currency === "ETH" || currency === "USDC" ? "0x" : "";
  let addr = prefix;
  const len = prefix ? 40 : 44;
  for (let i = 0; i < len; i++) addr += chars[Math.floor(Math.random() * chars.length)];
  return addr;
}

function generateCardNumber(): { full: string; masked: string } {
  const segments = Array.from({ length: 4 }, () =>
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const full = segments.join(" ");
  const masked = `**** **** **** ${segments[3]}`;
  return { full, masked };
}

async function createDefaultWalletsAndCard(userId: string, fullName: string) {
  const currencies = ["USD", "ETH", "SOL", "USDC", "BTC"];
  for (const currency of currencies) {
    await db.insert(walletsTable).values({
      userId,
      currency,
      balance: "0",
      address: generateAddress(currency),
    });
  }

  const { full, masked } = generateCardNumber();
  const now = new Date();
  const expiryYear = now.getFullYear() + 4;
  const expiryMonth = now.getMonth() + 1;
  const cvv = Math.floor(100 + Math.random() * 900).toString();

  await db.insert(cardsTable).values({
    userId,
    cardNumberFull: full,
    cardNumberMasked: masked,
    expiryMonth,
    expiryYear,
    cvv,
    cardholderName: fullName.toUpperCase(),
    balance: "1000",
    currency: "USD",
    status: "active",
  });
}

// POST /auth/register
router.post("/auth/register", async (req, res) => {
  const { email, password, fullName, role, businessName } = req.body as {
    email: string;
    password: string;
    fullName: string;
    role: "user" | "merchant";
    businessName?: string;
  };

  if (!email || !password || !fullName || !role) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(usersTable)
    .values({ email, passwordHash, fullName, role, businessName: businessName ?? null })
    .returning();

  await createDefaultWalletsAndCard(user.id, fullName);

  req.session.userId = user.id;
  req.session.userRole = user.role;
  req.session.userEmail = user.email;
  req.session.userFullName = user.fullName;

  res.status(201).json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    businessName: user.businessName,
    createdAt: user.createdAt.toISOString(),
  });
});

// POST /auth/login
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: "Missing email or password" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session.userId = user.id;
  req.session.userRole = user.role;
  req.session.userEmail = user.email;
  req.session.userFullName = user.fullName;

  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    businessName: user.businessName,
    createdAt: user.createdAt.toISOString(),
  });
});

// POST /auth/logout
router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out" });
  });
});

// GET /auth/me
router.get("/auth/me", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    businessName: user.businessName,
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;
