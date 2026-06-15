import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useUpdateSettings, useChangePassword } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Shield, Bell, Wallet, ChevronRight, Save, Eye, EyeOff, CheckCircle2, AlertTriangle, Send, QrCode, History, Settings, BellRing, BellOff, Loader2 } from "lucide-react";
import { Link } from "wouter";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

const NOTIF_ITEMS = [
  { label: "Transaction Received", desc: "Alert when NEXA or any asset arrives", def: true },
  { label: "Transaction Sent", desc: "Confirmation after you send funds", def: true },
  { label: "Payment Link Paid", desc: "When a buyer completes your payment link", def: true },
  { label: "Security Alerts", desc: "New device sign-in or suspicious activity", def: true },
  { label: "Network Updates", desc: "NEXA protocol upgrades and validator news", def: false },
  { label: "Marketing", desc: "New features and ecosystem announcements", def: false },
];

function NotifToggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full border transition-all ${on ? "bg-amber-500/20 border-amber-500/40" : "bg-muted border-border/40"}`}
      >
        <div className={`w-4 h-4 rounded-full mt-1 transition-all mx-0.5 ${on ? "bg-amber-400 translate-x-5" : "bg-muted-foreground translate-x-0"}`} />
      </button>
    </div>
  );
}

function NotifPrefs() {
  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-1">
      <h3 className="font-bold text-sm mb-4">Notification Types</h3>
      {NOTIF_ITEMS.map((item) => (
        <NotifToggle key={item.label} label={item.label} desc={item.desc} defaultOn={item.def} />
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifStatus, setNotifStatus] = useState<"idle" | "subscribed" | "error">("idle");
  const [notifError, setNotifError] = useState("");
  const [testSent, setTestSent] = useState(false);

  const updateMutation = useUpdateSettings();
  const passwordMutation = useChangePassword();

  const enableNotifications = useCallback(async () => {
    setNotifLoading(true);
    setNotifError("");
    try {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm !== "granted") {
        setNotifError("Permission denied. Enable notifications in your browser settings.");
        setNotifLoading(false);
        return;
      }

      const swReg = await navigator.serviceWorker.ready;

      // Get VAPID public key
      const keyRes = await fetch("/api/notifications/vapid-public-key");
      const { publicKey } = await keyRes.json() as { publicKey: string };

      // Convert base64 to Uint8Array
      const urlB64 = publicKey.replace(/-/g, "+").replace(/_/g, "/");
      const raw = atob(urlB64);
      const key = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; ++i) key[i] = raw.charCodeAt(i);

      const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      });

      await fetch("/api/notifications/subscribe", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      setNotifStatus("subscribed");
    } catch (err) {
      setNotifError(err instanceof Error ? err.message : "Failed to enable notifications");
    } finally {
      setNotifLoading(false);
    }
  }, []);

  const sendTestNotification = useCallback(async () => {
    setTestSent(false);
    try {
      await fetch("/api/notifications/test", { method: "POST", credentials: "include" });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } catch (_) {}
  }, []);

  if (!user && !isLoading) { setLocation("/login"); return null; }
  if (!user) return null;

  const handleProfileSave = () => {
    setProfileError("");
    setProfileSuccess(false);
    updateMutation.mutate(
      { data: { fullName, email } },
      {
        onSuccess: () => { setProfileSuccess(true); setTimeout(() => setProfileSuccess(false), 3000); },
        onError: (e: Error) => setProfileError(e.message || "Failed to update profile"),
      }
    );
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    passwordMutation.mutate(
      { data: { currentPassword, newPassword } },
      {
        onSuccess: () => {
          setPasswordSuccess(true);
          setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
          setTimeout(() => setPasswordSuccess(false), 3000);
        },
        onError: (e: Error) => setPasswordError(e.message || "Failed to change password"),
      }
    );
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-5 pb-28 max-w-2xl">
      {/* Profile summary */}
      <div className="flex items-center gap-4 bg-card border border-border/40 rounded-2xl p-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-sm" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-900/80 to-amber-800/40 border border-amber-400/30 flex items-center justify-center">
            <img src={nexaLogo} alt="" className="w-8 h-8 object-contain opacity-70" />
          </div>
        </div>
        <div className="flex-1">
          <div className="font-bold text-base text-foreground">{user.fullName}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === "merchant" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
              {user.role}
            </span>
            <span className="text-[10px] text-muted-foreground">· Member since {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-5">
          <h3 className="font-bold text-base">Profile Information</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {user.role === "merchant" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Business Name</label>
                <input
                  type="text"
                  value={user.businessName ?? ""}
                  readOnly
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 text-sm text-muted-foreground cursor-not-allowed"
                />
                <p className="text-[11px] text-muted-foreground mt-1.5">Business name cannot be changed after registration</p>
              </div>
            )}
          </div>

          {profileError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              <span className="text-sm text-red-400">{profileError}</span>
            </div>
          )}
          {profileSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-emerald-400">Profile updated successfully</span>
            </div>
          )}

          <button
            onClick={handleProfileSave}
            disabled={updateMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-4">
          {/* Change Password */}
          <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Lock className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Change Password</h3>
                <p className="text-xs text-muted-foreground">Use a strong, unique password</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Current Password", value: currentPassword, setter: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                { label: "New Password", value: newPassword, setter: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew) },
                { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword, show: showNew, toggle: () => setShowNew(!showNew) },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.show ? "text" : "password"}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                    />
                    <button onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span className="text-sm text-red-400">{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-emerald-400">Password changed successfully</span>
              </div>
            )}

            <button
              onClick={handlePasswordChange}
              disabled={passwordMutation.isPending}
              className="w-full py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 font-bold text-sm transition-all disabled:opacity-50"
            >
              {passwordMutation.isPending ? "Updating…" : "Update Password"}
            </button>
          </div>

          {/* Security Info */}
          <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-sm">Security Overview</h3>
            {[
              { label: "NEXA Wallet", value: "secp256k1 cryptography", ok: true },
              { label: "Session", value: "Encrypted PostgreSQL session store", ok: true },
              { label: "Password", value: "bcrypt hashed (cost 12)", ok: true },
              { label: "Transport", value: "TLS / mTLS proxy", ok: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* NEXA Wallet Key Backup */}
          <Link href="/dashboard/nexa">
            <div className="flex items-center justify-between bg-card border border-amber-500/20 rounded-2xl p-5 hover:border-amber-500/40 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Back Up NEXA Private Key</div>
                  <div className="text-xs text-muted-foreground">View and copy your secp256k1 private key</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-4">

          {/* Push notifications card */}
          <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-amber-400/20 rounded-xl blur-sm" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-900/80 to-amber-800/40 border border-amber-400/30 flex items-center justify-center">
                  <img src={nexaLogo} alt="NEXA" className="w-6 h-6 object-contain" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm">NEXA Push Notifications</h3>
                <p className="text-xs text-muted-foreground">Real-time alerts on your device with the NEXA logo</p>
              </div>
            </div>

            {notifPermission === "denied" && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                <BellOff className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-red-400">Notifications blocked</div>
                  <div className="text-xs text-red-400/70 mt-0.5">Open your browser settings → Site permissions → Allow notifications for this site</div>
                </div>
              </div>
            )}

            {notifError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span className="text-sm text-red-400">{notifError}</span>
              </div>
            )}

            {notifStatus === "subscribed" && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-emerald-400">Device registered — NEXA notifications are active</span>
              </div>
            )}

            {testSent && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <BellRing className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-sm text-amber-400">Test notification sent — check your device</span>
              </div>
            )}

            <div className="flex gap-3">
              {notifPermission !== "granted" || notifStatus !== "subscribed" ? (
                <button
                  onClick={enableNotifications}
                  disabled={notifLoading || notifPermission === "denied"}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {notifLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Enabling…</>
                  ) : (
                    <><Bell className="h-4 w-4" /> Enable Push Notifications</>
                  )}
                </button>
              ) : (
                <button
                  onClick={sendTestNotification}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 font-bold text-sm transition-all"
                >
                  <BellRing className="h-4 w-4" /> Send Test Notification
                </button>
              )}
            </div>

            <div className="text-[11px] text-muted-foreground leading-relaxed">
              Notifications are delivered via the W3C Web Push API. Your browser receives a push token that is stored server-side and used to deliver NEXA-branded alerts directly to your device — even when the app is closed.
            </div>
          </div>

          {/* Preferences toggles */}
          <NotifPrefs />

        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-around gap-2">
          {[
            { icon: Send, label: "Send", href: "/dashboard/send", color: "text-amber-400" },
            { icon: QrCode, label: "Receive", href: "/dashboard/receive", color: "text-blue-400" },
            { icon: Wallet, label: "NEXA", href: "/dashboard/nexa", color: "text-amber-400" },
            { icon: History, label: "History", href: "/dashboard/transactions", color: "text-purple-400" },
            { icon: Settings, label: "Settings", href: "/dashboard/settings", color: "text-amber-400" },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <div className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted cursor-pointer transition-colors group">
                <action.icon className={`h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[10px] font-semibold text-muted-foreground">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
