import { useState } from "react";
import { useLocation } from "wouter";
import { useUpdateSettings, useChangePassword } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Shield, Bell, Wallet, ChevronRight, Save, Eye, EyeOff, CheckCircle2, AlertTriangle, LogOut, Send, QrCode, History, Settings } from "lucide-react";
import { Link } from "wouter";
import nexaLogo from "@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png";

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

  const updateMutation = useUpdateSettings();
  const passwordMutation = useChangePassword();

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
        <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-base">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">Manage how Nexa notifies you about activity.</p>
          {[
            { label: "Transaction Received", desc: "Get notified when funds arrive", enabled: true },
            { label: "Transaction Sent", desc: "Confirmation when you send funds", enabled: true },
            { label: "Payment Link Paid", desc: "When a merchant payment link is used", enabled: true },
            { label: "Security Alerts", desc: "New sign-in or suspicious activity", enabled: true },
            { label: "Network Updates", desc: "NEXA protocol and node updates", enabled: false },
            { label: "Marketing", desc: "New features and announcements", enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <div className={`w-10 h-6 rounded-full border transition-colors cursor-pointer ${item.enabled ? "bg-amber-500/20 border-amber-500/40" : "bg-muted border-border/40"}`}>
                <div className={`w-4 h-4 rounded-full mt-1 transition-all ${item.enabled ? "bg-amber-400 translate-x-5" : "bg-muted-foreground translate-x-1"}`} />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Notification delivery coming soon — these are your preferences for when push notifications are enabled.</p>
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
