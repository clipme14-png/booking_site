"use client";

import * as React from "react";
import {
  Camera,
  Copy,
  Check,
  BadgeCheck,
  Trophy,
  Flame,
  Calendar,
  Wallet,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Laptop,
  Monitor,
  LogOut,
  Sun,
  Moon,
  Laptop2,
  Plus,
  Star,
  Link2Off,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { Reveal } from "@/components/reveal";
import { useToast } from "@/components/ui/toast";
import { cn, shortAddress } from "@/lib/utils";
import { currentUser } from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/*  Small helpers                                                     */
/* ------------------------------------------------------------------ */
function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-sections                                                      */
/* ------------------------------------------------------------------ */
function ProfileTab() {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Profile updated", description: "Your changes have been saved.", variant: "success" });
    }, 700);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Public profile</CardTitle>
        <CardDescription>This information may appear on the leaderboard and referrals.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={currentUser.name} icon={<UserIcon />} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue={currentUser.username} icon={<span className="text-sm">@</span>} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" defaultValue={currentUser.email} icon={<Mail />} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell the community a little about yourself…"
              defaultValue="Learning compounds. Reading my way to Sage board, one book at a time."
            />
            <p className="text-xs text-muted-foreground">Brief description for your profile. Max 160 characters.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={saving}>
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SecurityTab() {
  const { toast } = useToast();
  const [twoFactor, setTwoFactor] = React.useState(currentUser.twoFactor);
  const [pwSaving, setPwSaving] = React.useState(false);
  const [revoking, setRevoking] = React.useState<string | null>(null);
  const [sessions, setSessions] = React.useState([
    { id: "s1", device: "MacBook Pro", icon: <Laptop />, location: "San Francisco, US", last: "Active now", current: true },
    { id: "s2", device: "iPhone 15 Pro", icon: <Smartphone />, location: "San Francisco, US", last: "3 hours ago", current: false },
    { id: "s3", device: "Chrome · Windows", icon: <Monitor />, location: "Austin, US", last: "2 days ago", current: false },
  ]);

  const changePw = (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    setTimeout(() => {
      setPwSaving(false);
      toast({ title: "Password changed", description: "Use your new password next time you sign in.", variant: "success" });
    }, 700);
  };

  const revoke = (id: string) => {
    setRevoking(id);
    setTimeout(() => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setRevoking(null);
      toast({ title: "Session revoked", description: "That device has been signed out.", variant: "success" });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Use a strong, unique password to protect your rewards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePw} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" placeholder="••••••••••" icon={<KeyRound />} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" placeholder="••••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" type="password" placeholder="••••••••••" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" loading={pwSaving}>
                Update password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex size-10 items-center justify-center rounded-xl [&_svg]:size-5", twoFactor ? "bg-success/12 text-success" : "bg-muted-foreground/15 text-muted-foreground")}>
                <ShieldCheck />
              </div>
              <div>
                <p className="text-sm font-medium">Authenticator app</p>
                <p className="text-xs text-muted-foreground">
                  {twoFactor ? "Enabled — codes required at sign-in" : "Disabled"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={twoFactor ? "success" : "outline"}>{twoFactor ? "On" : "Off"}</Badge>
              <Switch
                checked={twoFactor}
                onCheckedChange={(v) => {
                  setTwoFactor(v);
                  toast({
                    title: v ? "Two-factor enabled" : "Two-factor disabled",
                    variant: v ? "success" : "warning",
                  });
                }}
                aria-label="Toggle two-factor authentication"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification</CardTitle>
          <CardDescription>Verified accounts earn a trust badge across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Email verified", value: currentUser.email, ok: true },
            { label: "Wallet verified", value: shortAddress(currentUser.wallet), ok: true },
          ].map((v) => (
            <div key={v.label} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3.5">
              <div>
                <p className="text-sm font-medium">{v.label}</p>
                <p className="text-xs text-muted-foreground">{v.value}</p>
              </div>
              <Badge variant="success">
                <BadgeCheck /> Verified
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Devices currently signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground [&_svg]:size-5">
                  {s.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{s.device}</p>
                    {s.current && <Badge variant="secondary">This device</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {s.location} · {s.last}
                  </p>
                </div>
              </div>
              {!s.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  loading={revoking === s.id}
                  onClick={() => revoke(s.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <LogOut /> Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function PreferencesTab() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system");
  const [prefs, setPrefs] = React.useState({ reducedMotion: false, compact: false, sounds: true });

  const themeOptions: { value: "light" | "dark" | "system"; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun /> },
    { value: "dark", label: "Dark", icon: <Moon /> },
    { value: "system", label: "System", icon: <Laptop2 /> },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose a theme. This syncs with the toggle in the top bar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((t) => {
              const selected = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    toast({ title: `${t.label} theme selected` });
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all [&_svg]:size-5",
                    selected
                      ? "border-primary bg-foreground/[0.03] text-foreground shadow-sm ring-2 ring-ring/20"
                      : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                  )}
                >
                  <span className={cn(selected && "text-primary")}>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language & region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs space-y-2">
            <Label htmlFor="lang">Language</Label>
            <Select
              id="lang"
              defaultValue="en"
              options={[
                { label: "English (US)", value: "en" },
                { label: "Español", value: "es" },
                { label: "Français", value: "fr" },
                { label: "Deutsch", value: "de" },
                { label: "日本語", value: "ja" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility & feel</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow title="Reduced motion" description="Minimize animations and transitions.">
            <Switch
              checked={prefs.reducedMotion}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, reducedMotion: v }))}
              aria-label="Reduced motion"
            />
          </SettingRow>
          <SettingRow title="Compact mode" description="Denser layout with tighter spacing.">
            <Switch
              checked={prefs.compact}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, compact: v }))}
              aria-label="Compact mode"
            />
          </SettingRow>
          <SettingRow title="Interface sounds" description="Play subtle sounds on rewards and actions.">
            <Switch
              checked={prefs.sounds}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, sounds: v }))}
              aria-label="Interface sounds"
            />
          </SettingRow>
        </CardContent>
      </Card>
    </div>
  );
}

function WalletsTab() {
  const { toast } = useToast();
  const [wallets, setWallets] = React.useState([
    { id: "w1", name: "Phantom", address: currentUser.wallet, primary: true },
    { id: "w2", name: "Solflare", address: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin", primary: false },
  ]);
  const [confirmUnlink, setConfirmUnlink] = React.useState<string | null>(null);

  const setPrimary = (id: string) => {
    setWallets((prev) => prev.map((w) => ({ ...w, primary: w.id === id })));
    toast({ title: "Primary wallet updated", variant: "success" });
  };

  const doUnlink = () => {
    setWallets((prev) => prev.filter((w) => w.id !== confirmUnlink));
    setConfirmUnlink(null);
    toast({ title: "Wallet unlinked", variant: "success" });
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Linked wallets</CardTitle>
          <CardDescription>Rewards are paid out to your primary wallet.</CardDescription>
        </div>
        <Button size="sm" onClick={() => toast({ title: "Connect a wallet", description: "Approve the connection in your wallet app." })}>
          <Plus /> Link wallet
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {wallets.map((w) => (
          <div key={w.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-foreground/[0.05] text-foreground [&_svg]:size-5">
                <Wallet />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{w.name}</p>
                  {w.primary && <Badge variant="default">Primary</Badge>}
                </div>
                <p className="font-mono text-xs text-muted-foreground">{shortAddress(w.address, 6)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!w.primary && (
                <Button variant="outline" size="sm" onClick={() => setPrimary(w.id)}>
                  <Star /> Set primary
                </Button>
              )}
              {!w.primary && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Unlink wallet"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setConfirmUnlink(w.id)}
                >
                  <Link2Off />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>

      <Dialog open={!!confirmUnlink} onClose={() => setConfirmUnlink(null)}>
        <DialogHeader
          title="Unlink this wallet?"
          description="You won't be able to receive rewards on this wallet until you link it again."
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirmUnlink(null)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={doUnlink}>
            Unlink wallet
          </Button>
        </div>
      </Dialog>
    </Card>
  );
}

function NotificationsSettingsTab() {
  const { toast } = useToast();
  const channels = ["Email", "Push", "In-app"] as const;
  const rows = ["Rewards", "Referrals", "Board unlocks", "Announcements", "Security", "Marketing"];
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, boolean>>>(() =>
    Object.fromEntries(
      rows.map((r) => [
        r,
        {
          Email: r !== "Marketing",
          Push: r === "Rewards" || r === "Security" || r === "Board unlocks",
          "In-app": true,
        },
      ]),
    ),
  );

  const toggle = (row: string, ch: string) =>
    setMatrix((m) => ({ ...m, [row]: { ...m[row], [ch]: !m[row][ch] } }));

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Notification preferences</CardTitle>
          <CardDescription>Choose how you want to hear about each type of event.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast({ title: "Preferences saved", variant: "success" })}>
          Save
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[420px]">
            <div className="grid grid-cols-[1fr_repeat(3,72px)] items-center gap-2 border-b border-border pb-3 text-xs font-medium text-muted-foreground">
              <span>Category</span>
              {channels.map((c) => (
                <span key={c} className="text-center">
                  {c}
                </span>
              ))}
            </div>
            {rows.map((r) => (
              <div
                key={r}
                className="grid grid-cols-[1fr_repeat(3,72px)] items-center gap-2 border-b border-border py-3.5 last:border-0"
              >
                <span className="text-sm font-medium">{r}</span>
                {channels.map((c) => (
                  <div key={c} className="flex justify-center">
                    <Switch
                      checked={matrix[r][c]}
                      onCheckedChange={() => toggle(r, c)}
                      aria-label={`${r} via ${c}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyWallet = async () => {
    try {
      await navigator.clipboard.writeText(currentUser.wallet);
    } catch {
      /* ignore */
    }
    setCopied(true);
    toast({ title: "Wallet address copied", variant: "success" });
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div>
      <PageHeader title="Account" description="Profile, security and preferences." />

      {/* Profile header */}
      <Reveal>
        <Card className="mb-6 overflow-hidden">
          <CardContent className="pt-6 sm:pt-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative w-fit">
                  <Avatar name={currentUser.name} src={currentUser.avatar} size="xl" className="size-20 text-2xl" />
                  <button
                    onClick={() => toast({ title: "Upload a new photo" })}
                    aria-label="Change photo"
                    className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-foreground text-background transition-opacity hover:opacity-85 [&_svg]:size-3.5"
                  >
                    <Camera />
                  </button>
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-tight">{currentUser.name}</h2>
                    {currentUser.verified && (
                      <Badge variant="secondary">
                        <BadgeCheck /> Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="default">{currentUser.plan} plan</Badge>
                    <button
                      onClick={copyWallet}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3"
                    >
                      {shortAddress(currentUser.wallet)}
                      {copied ? <Check className="text-success" /> : <Copy />}
                    </button>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground [&_svg]:size-3.5">
                      <Calendar /> Joined {currentUser.joined}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pb-1">
                <div className="rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-primary [&_svg]:size-4">
                    <Trophy />
                    <span className="text-lg font-semibold text-foreground">{currentUser.board}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Board tier</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-warning [&_svg]:size-4">
                    <Flame />
                    <span className="text-lg font-semibold text-foreground">{currentUser.streak}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Day streak</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Tabs */}
      <Tabs defaultValue="profile">
        <div className="mb-5 overflow-x-auto">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
        <TabsContent value="wallets">
          <WalletsTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
