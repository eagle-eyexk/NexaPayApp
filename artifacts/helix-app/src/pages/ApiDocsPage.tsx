import { useState } from "react";
import { X, ChevronRight, Code2, Shield, Wallet, CreditCard, Store, Bell, Activity, Key, Send, Link2 } from "lucide-react";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  auth: boolean;
  description: string;
  params?: { name: string; type: string; required: boolean; desc: string }[];
  body?: { name: string; type: string; required: boolean; desc: string }[];
  response: string;
  curl: string;
  js: string;
}

interface DocSection {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  tagline: string;
  description: string;
  endpoints: Endpoint[];
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
  PATCH: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const SECTIONS: DocSection[] = [
  {
    id: "auth",
    icon: Shield,
    label: "Authentication",
    color: "emerald",
    tagline: "Session-based auth with bcrypt",
    description: "All authenticated endpoints require an active session cookie. Sessions are stored in PostgreSQL via connect-pg-simple. Passwords are hashed with bcrypt at cost factor 12.",
    endpoints: [
      {
        method: "POST", path: "/api/auth/register", auth: false,
        description: "Create a new user account. Generates a NEXA secp256k1 wallet automatically.",
        body: [
          { name: "fullName", type: "string", required: true, desc: "User's full name" },
          { name: "email", type: "string", required: true, desc: "Unique email address" },
          { name: "password", type: "string", required: true, desc: "Minimum 6 characters" },
          { name: "role", type: "'personal' | 'merchant'", required: true, desc: "Account type" },
          { name: "businessName", type: "string", required: false, desc: "Required if role=merchant" },
        ],
        response: `{ "id": "uuid", "fullName": "Alice Smith", "email": "alice@example.com", "role": "personal", "createdAt": "2025-06-15T..." }`,
        curl: `curl -X POST https://nexaprotocol.network/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"fullName":"Alice Smith","email":"alice@example.com","password":"secure123","role":"personal"}'`,
        js: `const res = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ fullName: 'Alice', email: 'alice@example.com', password: 'secure123', role: 'personal' })
});
const user = await res.json();`,
      },
      {
        method: "POST", path: "/api/auth/login", auth: false,
        description: "Authenticate and create a session. Returns the user profile and sets a session cookie.",
        body: [
          { name: "email", type: "string", required: true, desc: "Registered email" },
          { name: "password", type: "string", required: true, desc: "Account password" },
        ],
        response: `{ "id": "uuid", "fullName": "Alice Smith", "email": "alice@example.com", "role": "personal" }`,
        curl: `curl -X POST https://nexaprotocol.network/api/auth/login \\
  -c cookies.txt \\
  -H "Content-Type: application/json" \\
  -d '{"email":"alice@example.com","password":"secure123"}'`,
        js: `const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: 'alice@example.com', password: 'secure123' })
});`,
      },
      {
        method: "POST", path: "/api/auth/logout", auth: true,
        description: "Destroy the current session and clear the session cookie.",
        response: `{ "success": true }`,
        curl: `curl -X POST https://nexaprotocol.network/api/auth/logout \\
  -b cookies.txt`,
        js: `await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });`,
      },
      {
        method: "GET", path: "/api/auth/me", auth: true,
        description: "Get the currently authenticated user's profile.",
        response: `{ "id": "uuid", "fullName": "Alice Smith", "email": "alice@example.com", "role": "personal", "businessName": null, "createdAt": "2025-06-15T..." }`,
        curl: `curl https://nexaprotocol.network/api/auth/me -b cookies.txt`,
        js: `const user = await fetch('/api/auth/me', { credentials: 'include' }).then(r => r.json());`,
      },
    ],
  },
  {
    id: "wallets",
    icon: Wallet,
    label: "Wallets & Assets",
    color: "amber",
    tagline: "Multi-chain balances and transfers",
    description: "The NEXA wallet system supports multiple currencies (USD, ETH, BTC, SOL, USDC, NEXA). Each wallet is identified by a cryptographically derived address. NEXA wallets use real secp256k1 key pairs.",
    endpoints: [
      {
        method: "GET", path: "/api/user/wallets", auth: true,
        description: "List all wallets for the authenticated user. Automatically creates a NEXA wallet with real secp256k1 keys if one doesn't exist.",
        response: `[
  { "id": "uuid", "currency": "NEXA", "address": "nexa1a2b3c...", "balance": "0.0000", "publicKey": "02abc..." },
  { "id": "uuid", "currency": "ETH",  "address": "0x1234...",   "balance": "0.0000" },
  { "id": "uuid", "currency": "BTC",  "address": "bc1q...",     "balance": "0.0000" }
]`,
        curl: `curl https://nexaprotocol.network/api/user/wallets -b cookies.txt`,
        js: `const wallets = await fetch('/api/user/wallets', { credentials: 'include' }).then(r => r.json());
const nexaBalance = wallets.find(w => w.currency === 'NEXA')?.balance;`,
      },
      {
        method: "POST", path: "/api/user/wallets/send", auth: true,
        description: "Send funds from the authenticated user's wallet to any address.",
        body: [
          { name: "currency", type: "string", required: true, desc: "Currency code: NEXA, ETH, BTC, SOL, USDC, USD" },
          { name: "recipientAddress", type: "string", required: true, desc: "Destination wallet address" },
          { name: "amount", type: "string", required: true, desc: "Amount to send (decimal string)" },
          { name: "description", type: "string", required: false, desc: "Optional transaction memo" },
        ],
        response: `{ "id": "tx-uuid", "amount": "10.0000", "currency": "NEXA", "status": "completed", "createdAt": "..." }`,
        curl: `curl -X POST https://nexaprotocol.network/api/user/wallets/send \\
  -b cookies.txt \\
  -H "Content-Type: application/json" \\
  -d '{"currency":"NEXA","recipientAddress":"nexa1abc...","amount":"10.5","description":"Payment"}'`,
        js: `await fetch('/api/user/wallets/send', {
  method: 'POST', credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ currency: 'NEXA', recipientAddress: 'nexa1abc...', amount: '10.5' })
});`,
      },
      {
        method: "GET", path: "/api/user/wallets/receive/:currency", auth: true,
        description: "Get the receive address for a specific currency. Use this to generate QR codes.",
        params: [{ name: "currency", type: "string", required: true, desc: "Currency code (NEXA, ETH, BTC, etc.)" }],
        response: `{ "currency": "NEXA", "address": "nexa1a2b3c4d5e6f...", "qrData": "nexa1a2b3c..." }`,
        curl: `curl https://nexaprotocol.network/api/user/wallets/receive/NEXA -b cookies.txt`,
        js: `const { address } = await fetch('/api/user/wallets/receive/NEXA', { credentials: 'include' }).then(r => r.json());`,
      },
    ],
  },
  {
    id: "nexa",
    icon: Key,
    label: "NEXA Blockchain",
    color: "yellow",
    tagline: "secp256k1 keys, Apple & Google Wallet",
    description: "NEXA wallets are backed by real secp256k1 key pairs — the same cryptographic curve as Bitcoin and Ethereum. The private key is stored server-side (encrypted) and returned only on explicit request. Apple Wallet .pkpass and Google Wallet JWT are generated on-demand.",
    endpoints: [
      {
        method: "GET", path: "/api/user/nexa-wallet/key", auth: true,
        description: "Retrieve the secp256k1 private and public key for the user's NEXA wallet. Treat this response like a seed phrase — never expose it.",
        response: `{
  "address": "nexa1a2b3c4d5e6f7g8h9...",
  "publicKey": "02a1b2c3d4e5f6...",
  "privateKey": "a1b2c3d4e5f6..."
}`,
        curl: `curl https://nexaprotocol.network/api/user/nexa-wallet/key -b cookies.txt`,
        js: `const keys = await fetch('/api/user/nexa-wallet/key', { credentials: 'include' }).then(r => r.json());
// ⚠️ Never log or expose keys.privateKey`,
      },
      {
        method: "GET", path: "/api/user/wallet/apple-pass", auth: true,
        description: "Download an Apple Wallet .pkpass file containing your NEXA balance, wallet address, and QR barcode. The file is a proper pkpass ZIP with pass.json, manifest.json, and cryptographic signature.",
        response: `Binary .pkpass file\nContent-Type: application/vnd.apple.pkpass\nContent-Disposition: attachment; filename="nexa-[address].pkpass"`,
        curl: `curl https://nexaprotocol.network/api/user/wallet/apple-pass \\
  -b cookies.txt -o nexa-wallet.pkpass`,
        js: `const res = await fetch('/api/user/wallet/apple-pass', { credentials: 'include' });
const blob = await res.blob();
const url = URL.createObjectURL(blob);
// Trigger download or open in Apple Wallet`,
      },
      {
        method: "GET", path: "/api/user/wallet/google-pass", auth: true,
        description: "Get a Google Wallet save URL. Redirect the user to this URL to add their NEXA wallet card to Google Wallet.",
        response: `{
  "url": "https://pay.google.com/gp/v/save/eyJ...",
  "objectId": "3388000000022795.nexa_[address]",
  "balance": "0.0000",
  "address": "nexa1..."
}`,
        curl: `curl https://nexaprotocol.network/api/user/wallet/google-pass -b cookies.txt`,
        js: `const { url } = await fetch('/api/user/wallet/google-pass', { credentials: 'include' }).then(r => r.json());
window.open(url, '_blank'); // Opens Google Pay save flow`,
      },
    ],
  },
  {
    id: "transactions",
    icon: Activity,
    label: "Transactions",
    color: "blue",
    tagline: "Full transaction ledger with filters",
    description: "Every send, receive, and payment is recorded as a transaction. Transactions are immutable once created. The ledger supports pagination and currency filtering.",
    endpoints: [
      {
        method: "GET", path: "/api/user/transactions", auth: true,
        description: "List all transactions for the authenticated user (sent and received), ordered by most recent first.",
        params: [
          { name: "limit", type: "number", required: false, desc: "Max results (default: 50)" },
          { name: "offset", type: "number", required: false, desc: "Pagination offset" },
          { name: "currency", type: "string", required: false, desc: "Filter by currency" },
        ],
        response: `[
  {
    "id": "tx-uuid", "senderId": "user-uuid", "recipientId": "user-uuid",
    "senderAddress": "nexa1...", "recipientAddress": "nexa1...",
    "amount": "10.0000", "currency": "NEXA", "type": "transfer",
    "status": "completed", "description": "Payment", "createdAt": "..."
  }
]`,
        curl: `curl "https://nexaprotocol.network/api/user/transactions?limit=20" -b cookies.txt`,
        js: `const txs = await fetch('/api/user/transactions?limit=20', { credentials: 'include' }).then(r => r.json());`,
      },
      {
        method: "GET", path: "/api/user/transactions/:id", auth: true,
        description: "Get a single transaction by ID. Returns 403 if the transaction doesn't belong to the authenticated user.",
        params: [{ name: "id", type: "string", required: true, desc: "Transaction UUID" }],
        response: `{ "id": "tx-uuid", "amount": "10.0000", "currency": "NEXA", "status": "completed", ... }`,
        curl: `curl https://nexaprotocol.network/api/user/transactions/tx-uuid -b cookies.txt`,
        js: `const tx = await fetch('/api/user/transactions/tx-uuid', { credentials: 'include' }).then(r => r.json());`,
      },
    ],
  },
  {
    id: "card",
    icon: CreditCard,
    label: "Virtual Card",
    color: "purple",
    tagline: "Digital payment card",
    description: "Each user can hold one virtual payment card. Cards have a masked number, CVV, expiry, and cardholder name. Card data is stored encrypted and returned only to authenticated owners.",
    endpoints: [
      {
        method: "GET", path: "/api/user/card", auth: true,
        description: "Get the user's virtual card details. Returns 404 if no card exists.",
        response: `{
  "id": "card-uuid", "maskedNumber": "**** **** **** 4242",
  "cardholderName": "Alice Smith", "expiryMonth": 12, "expiryYear": 2028,
  "cvv": "***", "balance": "0.00", "currency": "USD", "status": "active"
}`,
        curl: `curl https://nexaprotocol.network/api/user/card -b cookies.txt`,
        js: `const card = await fetch('/api/user/card', { credentials: 'include' }).then(r => r.json());`,
      },
      {
        method: "POST", path: "/api/user/card", auth: true,
        description: "Issue a new virtual card for the authenticated user. Only one card per user.",
        response: `{ "id": "card-uuid", "maskedNumber": "**** **** **** 8832", "status": "active" }`,
        curl: `curl -X POST https://nexaprotocol.network/api/user/card -b cookies.txt`,
        js: `const card = await fetch('/api/user/card', { method: 'POST', credentials: 'include' }).then(r => r.json());`,
      },
    ],
  },
  {
    id: "settings",
    icon: Shield,
    label: "Settings",
    color: "slate",
    tagline: "Profile and security management",
    description: "Users can update their profile information and change their password. Password changes require the current password for verification. All changes are applied immediately.",
    endpoints: [
      {
        method: "PUT", path: "/api/user/settings", auth: true,
        description: "Update the authenticated user's profile information.",
        body: [
          { name: "fullName", type: "string", required: false, desc: "New full name" },
          { name: "email", type: "string", required: false, desc: "New email address (must be unique)" },
        ],
        response: `{ "id": "uuid", "fullName": "Alice Updated", "email": "new@example.com", "role": "personal" }`,
        curl: `curl -X PUT https://nexaprotocol.network/api/user/settings \\
  -b cookies.txt -H "Content-Type: application/json" \\
  -d '{"fullName":"Alice Updated"}'`,
        js: `await fetch('/api/user/settings', {
  method: 'PUT', credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fullName: 'Alice Updated' })
});`,
      },
      {
        method: "POST", path: "/api/user/settings/password", auth: true,
        description: "Change the authenticated user's password. Requires the current password.",
        body: [
          { name: "currentPassword", type: "string", required: true, desc: "Existing password for verification" },
          { name: "newPassword", type: "string", required: true, desc: "New password (minimum 8 characters)" },
        ],
        response: `{ "success": true, "message": "Password updated successfully" }`,
        curl: `curl -X POST https://nexaprotocol.network/api/user/settings/password \\
  -b cookies.txt -H "Content-Type: application/json" \\
  -d '{"currentPassword":"old123","newPassword":"newSecure456"}'`,
        js: `await fetch('/api/user/settings/password', {
  method: 'POST', credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ currentPassword: 'old123', newPassword: 'newSecure456' })
});`,
      },
    ],
  },
  {
    id: "merchant",
    icon: Store,
    label: "Merchant API",
    color: "indigo",
    tagline: "POS, payment links, and revenue",
    description: "The merchant API is accessible only to accounts registered with role=merchant. It provides POS payment processing, shareable payment link management, and full revenue reporting with CSV export.",
    endpoints: [
      {
        method: "GET", path: "/api/merchant/overview", auth: true,
        description: "Get merchant revenue statistics: total revenue, transaction count, recent payments.",
        response: `{ "totalRevenue": "4250.00", "currency": "NEXA", "transactionCount": 47, "recentPayments": [...] }`,
        curl: `curl https://nexaprotocol.network/api/merchant/overview -b cookies.txt`,
        js: `const stats = await fetch('/api/merchant/overview', { credentials: 'include' }).then(r => r.json());`,
      },
      {
        method: "POST", path: "/api/merchant/pos/charge", auth: true,
        description: "Process a POS payment. Creates a transaction and returns a PDF receipt URL.",
        body: [
          { name: "amount", type: "string", required: true, desc: "Charge amount" },
          { name: "currency", type: "string", required: true, desc: "Currency code" },
          { name: "description", type: "string", required: false, desc: "Item description" },
        ],
        response: `{ "transactionId": "tx-uuid", "receiptUrl": "/api/payment/receipt/tx-uuid.pdf", "status": "completed" }`,
        curl: `curl -X POST https://nexaprotocol.network/api/merchant/pos/charge \\
  -b cookies.txt -H "Content-Type: application/json" \\
  -d '{"amount":"49.99","currency":"NEXA","description":"Coffee x2"}'`,
        js: `const charge = await fetch('/api/merchant/pos/charge', {
  method: 'POST', credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: '49.99', currency: 'NEXA', description: 'Coffee x2' })
}).then(r => r.json());`,
      },
      {
        method: "POST", path: "/api/merchant/links", auth: true,
        description: "Create a shareable payment link. Returns a short code that resolves to /pay/:code.",
        body: [
          { name: "amount", type: "string", required: true, desc: "Fixed amount to charge" },
          { name: "currency", type: "string", required: true, desc: "Currency code" },
          { name: "description", type: "string", required: true, desc: "Payment description shown to payer" },
          { name: "expiresAt", type: "string", required: false, desc: "ISO 8601 expiry datetime" },
        ],
        response: `{ "id": "link-uuid", "code": "abc123", "url": "https://nexaprotocol.network/pay/abc123", "amount": "25.00" }`,
        curl: `curl -X POST https://nexaprotocol.network/api/merchant/links \\
  -b cookies.txt -H "Content-Type: application/json" \\
  -d '{"amount":"25.00","currency":"NEXA","description":"Invoice #1042"}'`,
        js: `const link = await fetch('/api/merchant/links', {
  method: 'POST', credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: '25.00', currency: 'NEXA', description: 'Invoice #1042' })
}).then(r => r.json());`,
      },
      {
        method: "GET", path: "/api/merchant/revenue", auth: true,
        description: "Full revenue transaction history with optional CSV export.",
        params: [
          { name: "format", type: "'json' | 'csv'", required: false, desc: "Response format (default: json)" },
          { name: "from", type: "string", required: false, desc: "ISO date filter start" },
          { name: "to", type: "string", required: false, desc: "ISO date filter end" },
        ],
        response: `[{ "id": "tx-uuid", "amount": "49.99", "currency": "NEXA", "status": "completed", "createdAt": "..." }]`,
        curl: `curl "https://nexaprotocol.network/api/merchant/revenue?format=csv" -b cookies.txt -o revenue.csv`,
        js: `const revenue = await fetch('/api/merchant/revenue', { credentials: 'include' }).then(r => r.json());`,
      },
    ],
  },
  {
    id: "notifications",
    icon: Bell,
    label: "Push Notifications",
    color: "orange",
    tagline: "Web Push API with NEXA branding",
    description: "NEXA uses the W3C Web Push API for device notifications. Register a browser push subscription to receive real-time alerts for incoming payments, security events, and network updates — all branded with the NEXA logo.",
    endpoints: [
      {
        method: "GET", path: "/api/notifications/vapid-public-key", auth: false,
        description: "Get the VAPID public key required to create a push subscription in the browser.",
        response: `{ "publicKey": "BNFzjl9-..." }`,
        curl: `curl https://nexaprotocol.network/api/notifications/vapid-public-key`,
        js: `const { publicKey } = await fetch('/api/notifications/vapid-public-key').then(r => r.json());
const sub = await swRegistration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: publicKey
});`,
      },
      {
        method: "POST", path: "/api/notifications/subscribe", auth: true,
        description: "Register a browser push subscription. The subscription object comes from the browser's PushManager API.",
        body: [
          { name: "endpoint", type: "string", required: true, desc: "Push service endpoint URL" },
          { name: "keys.p256dh", type: "string", required: true, desc: "P-256 public key (base64url)" },
          { name: "keys.auth", type: "string", required: true, desc: "Auth secret (base64url)" },
        ],
        response: `{ "success": true, "message": "Subscribed to NEXA push notifications" }`,
        curl: `curl -X POST https://nexaprotocol.network/api/notifications/subscribe \\
  -b cookies.txt -H "Content-Type: application/json" \\
  -d '{"endpoint":"https://...","keys":{"p256dh":"...","auth":"..."}}'`,
        js: `const sub = await swReg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey });
await fetch('/api/notifications/subscribe', {
  method: 'POST', credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(sub.toJSON())
});`,
      },
      {
        method: "POST", path: "/api/notifications/test", auth: true,
        description: "Send a test push notification to all registered devices for the authenticated user.",
        response: `{ "success": true, "sent": 1, "total": 1 }`,
        curl: `curl -X POST https://nexaprotocol.network/api/notifications/test -b cookies.txt`,
        js: `await fetch('/api/notifications/test', { method: 'POST', credentials: 'include' });`,
      },
    ],
  },
  {
    id: "network",
    icon: Activity,
    label: "Network & Stats",
    color: "cyan",
    tagline: "Live blockchain network data",
    description: "Public endpoints for NEXA network health, live statistics, and validator node data. No authentication required.",
    endpoints: [
      {
        method: "GET", path: "/api/healthz", auth: false,
        description: "Health check endpoint. Returns 200 OK when the API server is running.",
        response: `{ "status": "ok", "timestamp": "2025-06-15T..." }`,
        curl: `curl https://nexaprotocol.network/api/healthz`,
        js: `const { status } = await fetch('/api/healthz').then(r => r.json());`,
      },
      {
        method: "GET", path: "/api/stats", auth: false,
        description: "Live NEXA network statistics: transaction volume, active wallets, block height, TPS.",
        response: `{ "totalTransactions": 1284729, "activeWallets": 48291, "blockHeight": 9912847, "tps": 12.4, "totalVolume": "48291000.00" }`,
        curl: `curl https://nexaprotocol.network/api/stats`,
        js: `const stats = await fetch('/api/stats').then(r => r.json());`,
      },
      {
        method: "GET", path: "/api/nodes", auth: false,
        description: "List of active NEXA validator nodes with geographic distribution and status.",
        response: `[{ "id": "node-uuid", "name": "NEXA-Node-01", "location": "Frankfurt", "status": "online", "latency": 12 }]`,
        curl: `curl https://nexaprotocol.network/api/nodes`,
        js: `const nodes = await fetch('/api/nodes').then(r => r.json());`,
      },
      {
        method: "GET", path: "/api/activity", auth: false,
        description: "Recent public network activity feed: latest transactions and block events.",
        response: `[{ "type": "transaction", "amount": "12.50", "currency": "NEXA", "timestamp": "..." }]`,
        curl: `curl https://nexaprotocol.network/api/activity`,
        js: `const feed = await fetch('/api/activity').then(r => r.json());`,
      },
    ],
  },
  {
    id: "payments",
    icon: Link2,
    label: "Payment Links",
    color: "pink",
    tagline: "Public payment page — no login required",
    description: "Payment links are publicly accessible — anyone with the link can pay without creating an account. On payment, a PDF receipt and coupon are generated server-side with pdf-lib.",
    endpoints: [
      {
        method: "GET", path: "/api/payment/link/:code", auth: false,
        description: "Get details for a payment link by its short code.",
        params: [{ name: "code", type: "string", required: true, desc: "6-character payment link code" }],
        response: `{ "code": "abc123", "amount": "25.00", "currency": "NEXA", "description": "Invoice #1042", "merchantName": "NEXA Store" }`,
        curl: `curl https://nexaprotocol.network/api/payment/link/abc123`,
        js: `const link = await fetch('/api/payment/link/abc123').then(r => r.json());`,
      },
      {
        method: "POST", path: "/api/payment/pay/:code", auth: false,
        description: "Process payment for a link. Returns a PDF receipt and coupon download URL.",
        params: [{ name: "code", type: "string", required: true, desc: "Payment link code" }],
        body: [
          { name: "payerName", type: "string", required: true, desc: "Payer's name for the receipt" },
          { name: "payerEmail", type: "string", required: false, desc: "Email to send receipt to" },
        ],
        response: `{ "success": true, "transactionId": "tx-uuid", "receiptUrl": "/api/payment/receipt/tx-uuid.pdf", "couponUrl": "/api/payment/coupon/tx-uuid.pdf" }`,
        curl: `curl -X POST https://nexaprotocol.network/api/payment/pay/abc123 \\
  -H "Content-Type: application/json" \\
  -d '{"payerName":"Bob Jones","payerEmail":"bob@example.com"}'`,
        js: `const result = await fetch('/api/payment/pay/abc123', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ payerName: 'Bob Jones', payerEmail: 'bob@example.com' })
}).then(r => r.json());`,
      },
    ],
  },
];

const COLOR_CLASSES: Record<string, { badge: string; icon: string; card: string; tab: string }> = {
  emerald: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", card: "hover:border-emerald-500/30", tab: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  amber:   { badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",   icon: "bg-amber-500/10 border-amber-500/20 text-amber-400",   card: "hover:border-amber-500/30",   tab: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  yellow:  { badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400", card: "hover:border-yellow-500/30", tab: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
  blue:    { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",       icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",       card: "hover:border-blue-500/30",   tab: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  purple:  { badge: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: "bg-purple-500/10 border-purple-500/20 text-purple-400", card: "hover:border-purple-500/30", tab: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
  slate:   { badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",   icon: "bg-slate-500/10 border-slate-500/20 text-slate-400",   card: "hover:border-slate-500/30",   tab: "bg-slate-500/10 border-slate-500/20 text-slate-400" },
  indigo:  { badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", card: "hover:border-indigo-500/30", tab: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" },
  orange:  { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: "bg-orange-500/10 border-orange-500/20 text-orange-400", card: "hover:border-orange-500/30", tab: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
  cyan:    { badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",       icon: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",       card: "hover:border-cyan-500/30",   tab: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
  pink:    { badge: "bg-pink-500/10 text-pink-400 border-pink-500/20",       icon: "bg-pink-500/10 border-pink-500/20 text-pink-400",       card: "hover:border-pink-500/30",   tab: "bg-pink-500/10 border-pink-500/20 text-pink-400" },
};

function EndpointModal({ section, onClose }: { section: DocSection; onClose: () => void }) {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [activeTab, setActiveTab] = useState<"curl" | "js">("curl");
  const ep = section.endpoints[activeEndpoint];
  const colors = COLOR_CLASSES[section.color] ?? COLOR_CLASSES.slate;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#08060e] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colors.icon}`}>
              <section.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="font-black text-white text-base">{section.label}</div>
              <div className="text-xs text-white/40">{section.tagline}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Endpoint list (sidebar) */}
          <div className="w-56 shrink-0 border-r border-white/8 p-3 space-y-1 overflow-y-auto">
            <div className="text-[9px] text-white/30 font-black tracking-widest px-2 mb-3">ENDPOINTS</div>
            {section.endpoints.map((e, i) => (
              <button
                key={i}
                onClick={() => setActiveEndpoint(i)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${activeEndpoint === i ? "bg-white/8 border border-white/10" : "hover:bg-white/4"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${METHOD_COLORS[e.method]}`}>{e.method}</span>
                  {e.auth && <span className="text-[8px] text-amber-400/60 font-bold">🔒</span>}
                </div>
                <div className="text-[10px] font-mono text-white/60 truncate">{e.path.replace(/^\/api/, "")}</div>
              </button>
            ))}

            <div className="pt-3 px-2 border-t border-white/5">
              <div className="text-[9px] text-white/20 leading-relaxed">{section.description}</div>
            </div>
          </div>

          {/* Endpoint detail */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Method + Path */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
                {ep.auth && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400/70 font-bold border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded-full">
                    🔒 Auth Required
                  </span>
                )}
              </div>
              <div className="font-mono text-lg text-white font-bold bg-white/5 border border-white/8 rounded-xl px-4 py-3 break-all">
                {ep.path}
              </div>
              <p className="text-sm text-white/55 mt-3 leading-relaxed">{ep.description}</p>
            </div>

            {/* Params */}
            {ep.params && ep.params.length > 0 && (
              <div>
                <div className="text-[10px] font-black text-white/40 tracking-widest mb-2">PATH / QUERY PARAMETERS</div>
                <div className="border border-white/8 rounded-xl overflow-hidden">
                  {ep.params.map((p, i) => (
                    <div key={p.name} className={`flex items-start gap-3 px-4 py-3 ${i < ep.params!.length - 1 ? "border-b border-white/5" : ""}`}>
                      <div className="font-mono text-xs text-amber-400 font-bold min-w-[120px]">{p.name}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono text-blue-400">{p.type}</span>
                          {p.required && <span className="text-[9px] text-red-400 font-bold">required</span>}
                        </div>
                        <div className="text-[11px] text-white/45">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {ep.body && ep.body.length > 0 && (
              <div>
                <div className="text-[10px] font-black text-white/40 tracking-widest mb-2">REQUEST BODY (JSON)</div>
                <div className="border border-white/8 rounded-xl overflow-hidden">
                  {ep.body.map((b, i) => (
                    <div key={b.name} className={`flex items-start gap-3 px-4 py-3 ${i < ep.body!.length - 1 ? "border-b border-white/5" : ""}`}>
                      <div className="font-mono text-xs text-emerald-400 font-bold min-w-[140px]">{b.name}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono text-blue-400">{b.type}</span>
                          {b.required && <span className="text-[9px] text-red-400 font-bold">required</span>}
                        </div>
                        <div className="text-[11px] text-white/45">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Response */}
            <div>
              <div className="text-[10px] font-black text-white/40 tracking-widest mb-2">RESPONSE</div>
              <pre className="bg-black/50 border border-white/8 rounded-xl p-4 text-[11px] font-mono text-emerald-400/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">{ep.response}</pre>
            </div>

            {/* Code examples */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                {(["curl", "js"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === tab ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    {tab === "curl" ? "cURL" : "JavaScript"}
                  </button>
                ))}
              </div>
              <pre className="bg-black/60 border border-white/8 rounded-xl p-4 text-[11px] font-mono text-amber-400/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {activeTab === "curl" ? ep.curl : ep.js}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/8 shrink-0 bg-black/20">
          <div className="flex items-center gap-2">
            <img src={nexaLogo} alt="NEXA" className="w-5 h-5 object-contain" />
            <span className="text-xs text-white/30 font-bold">NEXA API v1 — Base URL: https://nexaprotocol.network</span>
          </div>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-bold hover:text-white transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState<DocSection | null>(null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#04020c] pt-20 pb-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(251,191,36,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.8) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
          <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-amber-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/25 rounded-2xl blur-xl scale-150" />
              <img src={nexaLogo} alt="NEXA" className="relative w-16 h-16 object-contain" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 tracking-[0.3em]">
            <Code2 className="h-3 w-3" /> API REFERENCE v1.0
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            NEXA API
          </h1>
          <h2 className="text-xl font-bold text-amber-400 mb-5">
            JSON-RPC & REST Reference
          </h2>
          <p className="text-white/45 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            The complete NEXA API reference — authentication, wallets, transactions, NEXA blockchain, merchant POS, push notifications, and network stats. Every endpoint documented with live curl and JavaScript examples.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {[
              { v: "REST + JSON", l: "Protocol" },
              { v: "Session Cookies", l: "Auth Method" },
              { v: "HTTPS / mTLS", l: "Transport" },
              { v: "9 Categories", l: "API Sections" },
              { v: "25+ Endpoints", l: "Total Endpoints" },
            ].map((m) => (
              <div key={m.l} className="text-center">
                <div className="text-sm font-black text-amber-400">{m.v}</div>
                <div className="text-[9px] text-white/30 font-bold tracking-widest mt-0.5">{m.l.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Base URL */}
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-black/40 border border-white/10 rounded-xl font-mono text-sm text-white/70">
            <span className="text-white/30 text-xs">Base URL</span>
            <span className="text-amber-400">https://nexaprotocol.network</span>
          </div>
        </div>
      </section>

      {/* Auth header info */}
      <section className="border-b border-slate-100 bg-slate-50 py-8 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            { icon: Shield, title: "Session Authentication", desc: "Send credentials once via POST /api/auth/login. The response sets an HTTPOnly session cookie that is sent automatically on subsequent requests.", color: "emerald" },
            { icon: Key, title: "NEXA Cryptographic Keys", desc: "Every NEXA wallet is backed by a real secp256k1 key pair generated at registration. Your private key is never transmitted except on explicit request.", color: "amber" },
            { icon: Activity, title: "Real-Time Settlement", desc: "Transactions are finalized in under 500ms via CometBFT consensus. No pending states — every transfer is either completed or rejected atomically.", color: "blue" },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center ${COLOR_CLASSES[item.color].icon}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sections grid */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-black text-amber-600 tracking-[0.4em] mb-2">API REFERENCE</p>
            <h2 className="text-3xl font-black text-slate-900 mb-3">All API Sections</h2>
            <p className="text-slate-500 text-sm">Click any section to open the full endpoint reference</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((section, i) => {
              const colors = COLOR_CLASSES[section.color] ?? COLOR_CLASSES.slate;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section)}
                  className={`group text-left bg-white border border-slate-200 rounded-2xl p-5 transition-all hover:shadow-xl ${colors.card}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors.icon}`}>
                      <section.icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black text-slate-300">§{String(i + 1).padStart(2, "0")}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${colors.badge}`}>
                        {section.endpoints.length} endpoints
                      </span>
                    </div>
                  </div>

                  <h3 className="font-black text-slate-900 text-base mb-1">{section.label}</h3>
                  <p className="text-[11px] font-semibold text-slate-400 mb-3">{section.tagline}</p>

                  {/* Endpoint pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {section.endpoints.slice(0, 3).map((ep) => (
                      <span key={ep.path} className={`text-[9px] font-black px-2 py-0.5 rounded border ${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
                    ))}
                    {section.endpoints.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-bold">+{section.endpoints.length - 3}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-amber-600 transition-colors">
                    Open reference <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Code sample */}
      <section className="py-16 px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <img src={nexaLogo} alt="NEXA" className="w-10 h-10 object-contain" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Quick Start</h2>
            <p className="text-white/45 text-sm">Go from zero to sending NEXA in 4 API calls</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { step: "01", title: "Register", code: `POST /api/auth/register\n{\n  "fullName": "Alice",\n  "email": "alice@example.com",\n  "password": "secure123",\n  "role": "personal"\n}` },
              { step: "02", title: "Get Wallets", code: `GET /api/user/wallets\n\n// Response includes your auto-generated\n// NEXA wallet with secp256k1 keys:\n// nexa1a2b3c4d5e6f7g8h...` },
              { step: "03", title: "Send NEXA", code: `POST /api/user/wallets/send\n{\n  "currency": "NEXA",\n  "recipientAddress": "nexa1...",\n  "amount": "10.5",\n  "description": "Coffee"\n}` },
              { step: "04", title: "Get Receipt", code: `GET /api/user/transactions\n\n// Returns full transaction history\n// with status, timestamp, and\n// counterparty addresses` },
            ].map((item) => (
              <div key={item.step} className="bg-white/4 border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-black text-3xl text-amber-400/20">{item.step}</span>
                  <span className="font-bold text-white text-sm">{item.title}</span>
                </div>
                <pre className="text-[11px] font-mono text-amber-400/70 leading-relaxed whitespace-pre-wrap">{item.code}</pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeSection && <EndpointModal section={activeSection} onClose={() => setActiveSection(null)} />}
    </div>
  );
}
