"use client";

import * as React from "react";
import {
  Copy,
  ArrowDownToLine,
  ArrowUpRight,
  Send,
  Wallet as WalletIcon,
  Gift,
  Clock,
  Coins,
  Plus,
  CheckCircle2,
  Activity,
  ArrowDownLeft,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Reveal } from "@/components/reveal";
import { WalletButton } from "@/components/wallet-button";
import { useToast } from "@/components/ui/toast";
import { cn, formatToken, formatUsd, shortAddress, timeAgo } from "@/lib/utils";
import { currentUser, dashboardStats, transactions, type Transaction } from "@/lib/mock-data";

const SOL_USD = 164;

const activityTypes: Transaction["type"][] = ["deposit", "withdrawal", "reward"];

const typeMeta: Record<
  Transaction["type"],
  { label: string; icon: React.ReactNode; badge: string }
> = {
  reward: { label: "Reward", icon: <Gift />, badge: "bg-accent/12 text-accent" },
  withdrawal: {
    label: "Withdrawal",
    icon: <ArrowUpRight />,
    badge: "bg-warning/15 text-warning",
  },
  deposit: {
    label: "Deposit",
    icon: <ArrowDownToLine />,
    badge: "bg-secondary/12 text-secondary",
  },
  subscription: {
    label: "Subscription",
    icon: <Coins />,
    badge: "bg-primary/12 text-primary",
  },
  referral: { label: "Referral", icon: <Users />, badge: "bg-secondary/12 text-secondary" },
};

const statusVariant: Record<
  Transaction["status"],
  "success" | "warning" | "destructive"
> = {
  completed: "success",
  pending: "warning",
  failed: "destructive",
};

const connectedWallets = [
  { name: "Phantom", primary: true, address: currentUser.wallet, connected: true },
  { name: "Backpack", primary: false, address: null, connected: false },
  { name: "Solflare", primary: false, address: null, connected: false },
];

export default function WalletPage() {
  const { toast } = useToast();
  const balance = dashboardStats.walletBalance;

  const copyAddress = () => {
    navigator.clipboard?.writeText(currentUser.wallet);
    toast({ title: "Address copied", description: "Wallet address copied to clipboard.", variant: "success" });
  };

  const activity = transactions.filter((t) => activityTypes.includes(t.type));

  const stats = [
    {
      label: "Available",
      value: formatToken(balance - dashboardStats.pendingRewards),
      icon: <Coins />,
      tint: "bg-accent/12 text-accent",
    },
    {
      label: "Pending",
      value: formatToken(dashboardStats.pendingRewards),
      icon: <Clock />,
      tint: "bg-warning/15 text-warning",
    },
    {
      label: "Total earned",
      value: formatToken(dashboardStats.totalEarnings),
      icon: <Gift />,
      tint: "bg-primary/12 text-primary",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Wallet"
        description="Manage your balance, connected wallets and on-chain activity"
        actions={<WalletButton />}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Balance card */}
        <Reveal className="lg:col-span-2">
          <Card className="relative overflow-hidden border-0 bg-brand-gradient text-white shadow-lg">
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/10 blur-3xl" />
            <CardContent className="relative p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                  <WalletIcon className="size-4" />
                  Total balance
                </div>
                <Badge className="border-white/25 bg-white/15 text-white">
                  Solana Devnet
                </Badge>
              </div>

              <div className="mt-5 flex items-end gap-3">
                <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {balance.toFixed(2)}
                </span>
                <span className="mb-1 text-lg font-semibold text-white/80">SOL</span>
              </div>
              <p className="mt-1 text-sm text-white/70">
                ≈ {formatUsd(balance * SOL_USD)}
              </p>

              <button
                onClick={copyAddress}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 font-mono text-sm text-white/90 transition-colors hover:bg-white/20"
                aria-label="Copy wallet address"
              >
                {shortAddress(currentUser.wallet, 6)}
                <Copy className="size-3.5" />
              </button>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  onClick={() =>
                    toast({ title: "Deposit", description: "Opening deposit flow…", variant: "default" })
                  }
                >
                  <ArrowDownToLine />
                  Deposit
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  onClick={() =>
                    toast({ title: "Withdraw", description: "Opening withdrawal flow…", variant: "default" })
                  }
                >
                  <ArrowUpRight />
                  Withdraw
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  onClick={() =>
                    toast({ title: "Send", description: "Opening send flow…", variant: "default" })
                  }
                >
                  <Send />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Network card */}
        <Reveal delay={1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Network</CardTitle>
              <CardDescription>Live connection status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3.5 py-3">
                <span className="text-sm text-muted-foreground">Cluster</span>
                <span className="text-sm font-medium">Solana Devnet</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3.5 py-3">
                <span className="text-sm text-muted-foreground">RPC health</span>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-success">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
                    <span className="relative inline-flex size-2 rounded-full bg-success" />
                  </span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3.5 py-3">
                <span className="text-sm text-muted-foreground">Avg. slot time</span>
                <span className="text-sm font-medium">412 ms</span>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Stat row */}
      <Reveal delay={1}>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label} className="card-hover p-5">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl [&_svg]:size-5",
                    s.tint,
                  )}
                >
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="text-xl font-bold tracking-tight">{s.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Reveal>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Wallet activity */}
        <Reveal delay={2} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-4 text-primary" />
                  Wallet activity
                </CardTitle>
                <CardDescription>Deposits, withdrawals and rewards</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH className="pl-6">Type</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Status</TH>
                    <TH>Time</TH>
                    <TH className="pr-6 text-right">Hash</TH>
                  </TR>
                </THead>
                <TBody>
                  {activity.map((t) => {
                    const meta = typeMeta[t.type];
                    const positive = t.amount >= 0;
                    return (
                      <TR key={t.id}>
                        <TD className="pl-6">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium [&_svg]:size-3.5",
                              meta.badge,
                            )}
                          >
                            {meta.icon}
                            {meta.label}
                          </span>
                        </TD>
                        <TD
                          className={cn(
                            "text-right font-semibold tabular-nums",
                            positive ? "text-success" : "text-destructive",
                          )}
                        >
                          {positive ? "+" : "−"}
                          {formatToken(Math.abs(t.amount))}
                        </TD>
                        <TD>
                          <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
                        </TD>
                        <TD className="whitespace-nowrap text-muted-foreground">
                          {timeAgo(t.minutesAgo)}
                        </TD>
                        <TD className="pr-6 text-right font-mono text-xs text-muted-foreground">
                          {t.hash}
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </CardContent>
          </Card>
        </Reveal>

        {/* Connected wallets */}
        <Reveal delay={2}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Connected wallets</CardTitle>
              <CardDescription>Manage linked Solana wallets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedWallets.map((w) => (
                <div
                  key={w.name}
                  className="flex items-center justify-between rounded-xl border border-border p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                      <WalletIcon className="size-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{w.name}</p>
                        {w.primary && (
                          <Badge variant="secondary" className="px-1.5 py-0">
                            Primary
                          </Badge>
                        )}
                      </div>
                      {w.connected && w.address ? (
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {shortAddress(w.address)}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Not connected
                        </p>
                      )}
                    </div>
                  </div>
                  {w.connected ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                      <CheckCircle2 className="size-4" />
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: `Connect ${w.name}`,
                          description: "Opening wallet connection…",
                          variant: "default",
                        })
                      }
                    >
                      <Plus className="size-4" />
                      Link
                    </Button>
                  )}
                </div>
              ))}
              <p className="pt-1 text-center text-xs text-muted-foreground">
                Rewards are paid to your primary wallet.
              </p>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
