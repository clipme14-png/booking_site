"use client";

import * as React from "react";
import {
  Coins,
  Gift,
  Clock,
  Calendar,
  TrendingUp,
  Sparkles,
  Check,
  Hourglass,
  BookOpen,
  Brain,
  Users,
  Flame,
  Inbox,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { AreaChart, DonutChart } from "@/components/charts/charts";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/reveal";
import { useToast } from "@/components/ui/toast";
import { rewards, earningsSeries, earningsLabels } from "@/lib/mock-data";
import { cn, formatToken } from "@/lib/utils";

type Range = "7d" | "30d" | "all";

const sources = [
  { label: "Reading", value: 42, color: "#7c3aed", icon: <BookOpen /> },
  { label: "Quiz", value: 24, color: "#2563eb", icon: <Brain /> },
  { label: "Referral", value: 21, color: "#16a34a", icon: <Users /> },
  { label: "Streak", value: 13, color: "#f59e0b", icon: <Flame /> },
];

function statusBadge(status: string) {
  if (status === "claimable") return <Badge variant="success">Claimable</Badge>;
  if (status === "pending") return <Badge variant="warning">Pending</Badge>;
  return <Badge variant="outline">Claimed</Badge>;
}

export default function RewardsPage() {
  const { toast } = useToast();
  const [claimAllOpen, setClaimAllOpen] = React.useState(false);
  const [claimItem, setClaimItem] = React.useState<(typeof rewards.history)[number] | null>(null);
  const [range, setRange] = React.useState<Range>("30d");

  const claimable = rewards.history.filter((h) => h.status === "claimable");
  const pending = rewards.history.filter((h) => h.status === "pending");

  const rangedSeries = React.useMemo(() => {
    if (range === "7d") return earningsSeries.slice(-6);
    if (range === "30d") return earningsSeries.slice(-9);
    return earningsSeries;
  }, [range]);
  const rangedLabels = React.useMemo(() => {
    if (range === "7d") return earningsLabels.slice(-6);
    if (range === "30d") return earningsLabels.slice(-9);
    return earningsLabels;
  }, [range]);

  const confirmClaimAll = () => {
    setClaimAllOpen(false);
    toast({
      title: "Claimed 1.84 SOL",
      description: "Rewards sent to your wallet.",
      variant: "success",
    });
  };
  const confirmClaimItem = () => {
    const label = claimItem?.type;
    setClaimItem(null);
    toast({
      title: "Reward claimed",
      description: `${label} added to your wallet.`,
      variant: "success",
    });
  };

  return (
    <div>
      <PageHeader
        title="Rewards"
        description="Track, claim, and grow your on-chain earnings"
        actions={
          <Button onClick={() => setClaimAllOpen(true)}>
            <Gift /> Claim all ({formatToken(rewards.claimable)})
          </Button>
        }
      />

      {/* Hero row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-1">
          <Card className="relative overflow-hidden bg-brand-gradient p-6 text-white shadow-glow">
            <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Sparkles className="size-4" /> Claimable now
              </div>
              <div className="mt-3 text-4xl font-bold tracking-tight">
                {formatToken(rewards.claimable)}
              </div>
              <p className="mt-1 text-sm text-white/70">
                Ready to withdraw to your wallet
              </p>
              <Button
                variant="subtle"
                className="mt-6 w-full bg-white text-primary hover:bg-white/90"
                onClick={() => setClaimAllOpen(true)}
              >
                <Coins /> Claim rewards
              </Button>
            </div>
          </Card>
        </Reveal>

        <div className="grid grid-cols-2 gap-5 lg:col-span-2">
          <Reveal delay={1}>
            <StatCard
              label="Pending"
              value={formatToken(rewards.pending)}
              icon={<Hourglass />}
              accent="warning"
            />
          </Reveal>
          <Reveal delay={2}>
            <StatCard
              label="Daily"
              value={formatToken(rewards.daily)}
              icon={<Clock />}
              accent="secondary"
            />
          </Reveal>
          <Reveal delay={3}>
            <StatCard
              label="Weekly"
              value={formatToken(rewards.weekly)}
              icon={<Calendar />}
              accent="accent"
            />
          </Reveal>
          <Reveal delay={3}>
            <StatCard
              label="Total earned"
              value={formatToken(rewards.totalEarned)}
              icon={<TrendingUp />}
              accent="primary"
            />
          </Reveal>
        </div>
      </div>

      {/* Tabs */}
      <Reveal className="mt-8">
        <Card className="p-6">
          <Tabs defaultValue="available">
            <TabsList className="mb-5">
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="available">
              {claimable.length === 0 ? (
                <EmptyState
                  icon={<Inbox />}
                  title="Nothing to claim right now"
                  description="Read a book or pass a quiz to unlock new rewards."
                />
              ) : (
                <div className="space-y-3">
                  {claimable.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-accent/12 text-accent [&_svg]:size-5">
                          <Gift />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{r.type}</p>
                          <p className="text-xs text-muted-foreground">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-accent">
                          +{formatToken(r.amount)}
                        </span>
                        <Button size="sm" onClick={() => setClaimItem(r)}>
                          Claim
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {pending.length === 0 ? (
                <EmptyState
                  icon={<Hourglass />}
                  title="No pending rewards"
                  description="Rewards that are unlocking will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {pending.map((r, i) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-warning/12 text-warning [&_svg]:size-5">
                          <Hourglass />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{r.type}</p>
                          <p className="text-xs text-muted-foreground">
                            Unlocks in ~{(i + 1) * 12}h
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-warning">
                        {formatToken(r.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Type</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Date</TH>
                    <TH className="text-right">Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {rewards.history.map((r) => (
                    <TR key={r.id}>
                      <TD className="font-medium">{r.type}</TD>
                      <TD className="text-right font-semibold">
                        {formatToken(r.amount)}
                      </TD>
                      <TD className="text-muted-foreground">{r.date}</TD>
                      <TD className="text-right">{statusBadge(r.status)}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TabsContent>
          </Tabs>
        </Card>
      </Reveal>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Rewards over time</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cumulative SOL earned
                </p>
              </div>
              <div className="inline-flex rounded-lg border border-border bg-muted/60 p-1">
                {(["7d", "30d", "all"] as Range[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                      range === r
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <AreaChart
              data={rangedSeries}
              labels={rangedLabels}
              color="var(--violet)"
              height={220}
            />
          </Card>
        </Reveal>

        <Reveal delay={1}>
          <Card className="flex h-full flex-col p-6">
            <CardTitle>Reward sources</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Where your SOL comes from</p>
            <div className="mt-4 flex justify-center">
              <DonutChart segments={sources} size={168} strokeWidth={20}>
                <span className="text-2xl font-bold">100%</span>
                <span className="text-xs text-muted-foreground">of rewards</span>
              </DonutChart>
            </div>
            <ul className="mt-6 space-y-2.5">
              {sources.map((s) => (
                <li key={s.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                  </span>
                  <span className="font-semibold">{s.value}%</span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>

      {/* Claim all dialog */}
      <Dialog open={claimAllOpen} onClose={() => setClaimAllOpen(false)}>
        <DialogHeader
          title="Claim all rewards"
          description="This will send all claimable rewards to your connected wallet."
        />
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
          <span className="text-sm text-muted-foreground">Total claimable</span>
          <span className="text-lg font-bold">{formatToken(rewards.claimable)}</span>
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setClaimAllOpen(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={confirmClaimAll}>
            <Check /> Confirm claim
          </Button>
        </div>
      </Dialog>

      {/* Claim single dialog */}
      <Dialog open={!!claimItem} onClose={() => setClaimItem(null)}>
        {claimItem && (
          <>
            <DialogHeader title="Claim reward" description={claimItem.type} />
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-lg font-bold text-accent">
                +{formatToken(claimItem.amount)}
              </span>
            </div>
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setClaimItem(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={confirmClaimItem}>
                <Check /> Claim now
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
