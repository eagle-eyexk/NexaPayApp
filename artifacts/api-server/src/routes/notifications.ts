import { Router } from "express";
import webpush from "web-push";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Generate or use VAPID keys
let vapidPublicKey: string;
let vapidPrivateKey: string;

if (process.env["VAPID_PUBLIC_KEY"] && process.env["VAPID_PRIVATE_KEY"]) {
  vapidPublicKey = process.env["VAPID_PUBLIC_KEY"];
  vapidPrivateKey = process.env["VAPID_PRIVATE_KEY"];
} else {
  const keys = webpush.generateVAPIDKeys();
  vapidPublicKey = keys.publicKey;
  vapidPrivateKey = keys.privateKey;
}

webpush.setVapidDetails(
  "mailto:notifications@nexaprotocol.network",
  vapidPublicKey,
  vapidPrivateKey,
);

// In-memory subscription store (userId → subscription)
// In production: store in DB with a subscriptions table
const subscriptions = new Map<string, webpush.PushSubscription[]>();

// ─── GET /notifications/vapid-public-key ─────────────────────────────────────
router.get("/notifications/vapid-public-key", (_req, res) => {
  res.json({ publicKey: vapidPublicKey });
});

// ─── POST /notifications/subscribe ───────────────────────────────────────────
router.post("/notifications/subscribe", requireAuth, (req, res) => {
  const userId = req.session.userId!;
  const subscription = req.body as webpush.PushSubscription;

  if (!subscription?.endpoint) {
    res.status(400).json({ error: "Invalid subscription object" });
    return;
  }

  const existing = subscriptions.get(userId) ?? [];
  // Deduplicate by endpoint
  const deduped = existing.filter((s) => s.endpoint !== subscription.endpoint);
  subscriptions.set(userId, [...deduped, subscription]);

  res.json({ success: true, message: "Subscribed to NEXA push notifications" });
});

// ─── POST /notifications/unsubscribe ─────────────────────────────────────────
router.post("/notifications/unsubscribe", requireAuth, (req, res) => {
  const userId = req.session.userId!;
  const { endpoint } = req.body as { endpoint: string };

  const existing = subscriptions.get(userId) ?? [];
  subscriptions.set(userId, existing.filter((s) => s.endpoint !== endpoint));

  res.json({ success: true });
});

// ─── POST /notifications/test ─────────────────────────────────────────────────
router.post("/notifications/test", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const userSubs = subscriptions.get(userId) ?? [];

  if (userSubs.length === 0) {
    res.status(400).json({ error: "No push subscriptions found for this user" });
    return;
  }

  const payload = JSON.stringify({
    title: "🌟 NEXA Network",
    body: "Your NEXA push notifications are active. The sovereign blockchain is watching over your assets.",
    url: "/dashboard",
    type: "info",
  });

  const results = await Promise.allSettled(
    userSubs.map((sub) => webpush.sendNotification(sub, payload))
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  res.json({ success: true, sent, total: userSubs.length });
});

// ─── Internal: send notification to a user (called from other routes) ─────────
export async function sendPushNotification(
  userId: string,
  payload: { title: string; body: string; url?: string; type?: string }
) {
  const userSubs = subscriptions.get(userId) ?? [];
  if (userSubs.length === 0) return;

  const data = JSON.stringify({ type: "info", url: "/dashboard", ...payload });
  await Promise.allSettled(userSubs.map((sub) => webpush.sendNotification(sub, data)));
}

export default router;
