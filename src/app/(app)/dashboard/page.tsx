"use client";

import * as React from "react";
import Link from "next/link";
import {
  Coins,
  Gift,
  TrendingUp,
  Flame,
  BookOpen,
  Trophy,
  ArrowRight,
  ArrowUpRight,
  Users,
  CreditCard,
  ArrowDownToLine,
  Target,
  Crown,
  ChevronRight,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress, CircularProgress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatCard, CountUp } from "@/components/ui/stat-card";
import { AreaChart, BarChart } from "@/components/charts/charts";
import { Reveal } from "@/components/reveal";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { cn, formatToken, formatUsd, timeAgo } from "@/lib/utils";
import {
  dashboardStats,
  activityFeed,
  transactions,
  earningsSeries,
  earningsLabels,
  weeklyReading,
  weekdayLabels,
  boards,
  leaderboard,
  currentUser,
  type Transaction,
} from "@/lib/mock-data";

const SOL_USD = 164;

/* ---- transaction meta ---- */
const txMeta: Record<
  Transaction["type"],
  { icon: React.ReactNode; tint: string }
> = {
  reward: { icon: <Gift />, tint: "bg-foreground/[0.05] text-foreground" },
  withdrawal: { icon: <ArrowUpRight />, tint: "bg-foreground/[0.05] text-foreground" },
  deposit: { icon: <ArrowDownToLine />, tint: "bg-foreground/[0.05] text-foreground" },
  subscription: { icon: <CreditCard />, tint: "bg-foreground/[0.05] text-foreground" },
  referral: { icon: <Users />, tint: "bg-foreground/[0.05] text-foreground" },
};

const statusVariant: Record<
  Transaction["status"],
  "success" | "warning" | "destructive"
> = { completed: "success", pending: "warning", failed: "destructive" };

/* ---- activity feed icons ---- */
const activityIcon: Record<string, { icon: React.ReactNode; tint: string }> = {
  book: { icon: <BookOpen />, tint: "bg-foreground/[0.05] text-foreground" },
  quiz: { icon: <CheckCircle2 />, tint: "bg-foreground/[0.05] text-foreground" },
  referral: { icon: <Users />, tint: "bg-foreground/[0.05] text-foreground" },
  streak: { icon: <Flame />, tint: "bg-foreground/[0.05] text-foreground" },
  reward: { icon: <Gift />, tint: "bg-foreground/[0.05] text-foreground" },
};

/* ---- monthly (12) vs week (last 7 of earnings) ---- */
const weekEarnings = earningsSeries.slice(-7);
const weekEarningsLabels = weekdayLabels;

const quickActions = [
  { label: "Read a book", href: "/reading", icon: <BookOpen />, tint: "bg-foreground/[0.05] text-foreground" },
  { label: "Take a quiz", href: "/quiz", icon: <Zap />, tint: "bg-foreground/[0.05] text-foreground" },
  { label: "Withdraw", href: "/withdraw", icon: <ArrowUpRight />, tint: "bg-foreground/[0.05] text-foreground" },
  { label: "Invite friends", href: "/referrals", icon: <Users />, tint: "bg-foreground/[0.05] text-foreground" },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const [claimOpen, setClaimOpen] = React.useState(false);
  const [claiming, setClaiming] = React.useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const recentTx = transactions.slice(0, 5);
  const topThree = leaderboard.slice(0, 3);
  const you = leaderboard.find((l) => l.you);

  const currentBoard = boards.find((b) => b.status === "current");
  const nextBoard = boards.find((b) => b.status === "locked");

  const confirmClaim = () => {
    setClaiming(true);
    setTimeout(() => {
      setClaiming(false);
      setClaimOpen(false);
      toast({
        title: "Rewards claimed",
        description: `${formatToken(dashboardStats.claimableRewards)} added to your wallet.`,
        variant: "success",
      });
    }, 1100);
  };

  return (
    <div>
      <PageHeader
        title="Welcome back, Alex"
        description={`${today} · ${dashboardStats.streak}-day reading streak`}
        actions={
          <>
            <Button onClick={() => setClaimOpen(true)}>Claim rewards</Button>
          </>
        }
      />

      {/* Stat cards */}
      <Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Wallet balance"
            value={<CountUp value={dashboardStats.walletBalance} decimals={2} suffix=" SOL" />}
            icon={<Coins />}
            change={8.2}
            changeLabel="this week"
            accent="primary"
          />
          <StatCard
            label="Ready to claim"
            value={<CountUp value={dashboardStats.claimableRewards} decimals={2} suffix=" SOL" />}
            icon={<Gift />}
            change={12.5}
            changeLabel="since Monday"
            accent="accent"
          />
          <StatCard
            label="Earned this week"
            value={<CountUp value={dashboardStats.weeklyEarnings} decimals={2} suffix=" SOL" />}
            icon={<TrendingUp />}
            change={5.4}
            changeLabel="vs last week"
            accent="secondary"
          />
          <StatCard
            label="Reading streak"
            value={<CountUp value={dashboardStats.streak} suffix=" days" />}
            icon={<Flame />}
            change={3.7}
            changeLabel="personal best"
            accent="warning"
          />
        </div>
      </Reveal>

      {/* Main grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Left column (2/3) */}
        <div className="space-y-5 xl:col-span-2">
          {/* Earnings overview */}
          <Reveal delay={1}>
            <Card>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Earnings</CardTitle>
                  <CardDescription>SOL rewards over time</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-[28px] font-semibold leading-none tracking-tight tabular">
                    {formatToken(dashboardStats.totalEarnings)}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground tabular">
                    About {formatUsd(dashboardStats.totalEarnings * SOL_USD)} in total
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="month">
                  <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Year</TabsTrigger>
                  </TabsList>
                  <TabsContent value="week" className="pt-5">
                    <AreaChart
                      data={weekEarnings}
                      labels={weekEarningsLabels}
                      color="var(--violet)"
                      height={220}
                    />
                  </TabsContent>
                  <TabsContent value="month" className="pt-5">
                    <AreaChart
                      data={earningsSeries}
                      labels={earningsLabels}
                      color="var(--violet)"
                      height={220}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </Reveal>

          {/* Reading activity */}
          <Reveal delay={2}>
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-4 text-secondary" />
                    Reading activity
                  </CardTitle>
                  <CardDescription>Books read over the last 7 days</CardDescription>
                </div>
                <Badge variant="secondary">
                  {weeklyReading.reduce((a, b) => a + b, 0)} books
                </Badge>
              </CardHeader>
              <CardContent>
                <BarChart data={weeklyReading} labels={weekdayLabels} height={180} />
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* Right column (1/3) */}
        <div className="grid gap-5 md:grid-cols-3 md:items-start xl:grid-cols-1">
          {/* Board progress */}
          <Reveal delay={1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="size-4 text-primary" />
                  Board progress
                </CardTitle>
                <CardDescription>
                  Toward {nextBoard?.name ?? "next tier"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <CircularProgress value={dashboardStats.boardProgress} size={148} strokeWidth={12}>
                  <div className="text-center">
                    <p className="text-3xl font-semibold tracking-tight">
                      {dashboardStats.boardProgress}%
                    </p>
                    <p className="text-xs text-muted-foreground">to Sage</p>
                  </div>
                </CircularProgress>
                <div className="mt-5 flex w-full items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: currentBoard?.color }}
                    />
                    <span className="text-sm font-medium">
                      {currentBoard?.name} tier
                    </span>
                  </div>
                  <Badge variant="default">{currentUser.plan} plan</Badge>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Daily goal */}
          <Reveal delay={2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-4 text-accent" />
                  Daily goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold tracking-tight">
                    {dashboardStats.booksReadToday}
                    <span className="text-base font-medium text-muted-foreground">
                      {" "}
                      / {dashboardStats.dailyGoal} books
                    </span>
                  </p>
                  <span className="text-sm font-semibold text-accent">
                    {Math.round(
                      (dashboardStats.booksReadToday / dashboardStats.dailyGoal) * 100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={(dashboardStats.booksReadToday / dashboardStats.dailyGoal) * 100}
                  indicatorClassName="bg-accent"
                />
                <p className="text-xs text-muted-foreground">
                  {`${dashboardStats.booksRemaining} more to reach today's goal.`}
                </p>
              </CardContent>
            </Card>
          </Reveal>

          {/* Quick actions */}
          <Reveal delay={2}>
            <Card>
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {quickActions.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="group flex flex-col gap-3 rounded-xl border border-border p-3.5 transition-colors hover:bg-foreground/[0.03]"
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg [&_svg]:size-4.5",
                        a.tint,
                      )}
                    >
                      {a.icon}
                    </span>
                    <span className="flex items-center justify-between text-sm font-medium">
                      {a.label}
                      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>

      {/* Lower grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Recent transactions */}
        <Reveal delay={1} className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Recent transactions</CardTitle>
                <CardDescription>Your latest on-chain activity</CardDescription>
              </div>
              <Link
                href="/transactions"
                className="inline-flex items-center gap-1 text-sm text-secondary hover:underline"
              >
                View all <ArrowRight className="size-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-1">
              {recentTx.map((t) => {
                const meta = txMeta[t.type];
                const positive = t.amount >= 0;
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
                        meta.tint,
                      )}
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {t.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(t.minutesAgo)}
                      </p>
                    </div>
                    <Badge variant={statusVariant[t.status]} className="hidden sm:inline-flex">
                      {t.status}
                    </Badge>
                    <span
                      className={cn(
                        "w-24 shrink-0 text-right text-sm font-semibold tabular-nums",
                        positive ? "text-success" : "text-destructive",
                      )}
                    >
                      {positive ? "+" : "−"}
                      {formatToken(Math.abs(t.amount))}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </Reveal>

        {/* Activity feed */}
        <Reveal delay={2}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Activity feed</CardTitle>
              <CardDescription>What you&apos;ve been up to</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                {activityFeed.map((a) => {
                  const meta = activityIcon[a.icon] ?? activityIcon.reward;
                  return (
                    <li key={a.id} className="relative flex gap-3">
                      <span
                        className={cn(
                          "z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card [&_svg]:size-4",
                          meta.tint,
                        )}
                      >
                        {meta.icon}
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-sm leading-snug">{a.text}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(a.minutesAgo)}
                          </span>
                          {a.amount !== undefined && (
                            <span className="text-xs font-semibold text-success">
                              +{formatToken(a.amount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Leaderboard */}
      <Reveal delay={1}>
        <Card className="mt-5">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="size-4 text-warning" />
                Leaderboard position
              </CardTitle>
              <CardDescription>Top learners this season</CardDescription>
            </div>
            <Link
              href="/boards"
              className="inline-flex items-center gap-1 text-sm text-secondary hover:underline"
            >
              Full board <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {topThree.map((entry) => (
              <LeaderRow key={entry.rank} entry={entry} />
            ))}
            {you && (
              <>
                <div className="mx-3 border-t border-dashed border-border" />
                <LeaderRow entry={you} highlight />
              </>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* Claim dialog */}
      <Dialog open={claimOpen} onClose={() => setClaimOpen(false)}>
        <DialogHeader
          title="Claim your rewards"
          description="Move your claimable SOL rewards to your wallet balance."
        />
        <div className="my-4 flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground [&_svg]:size-5">
              <Gift />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Claimable</p>
              <p className="text-lg font-semibold">
                {formatToken(dashboardStats.claimableRewards)}
              </p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            ≈ {formatUsd(dashboardStats.claimableRewards * SOL_USD)}
          </span>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setClaimOpen(false)}>
            Cancel
          </Button>
          <Button loading={claiming} onClick={confirmClaim}>
            Confirm claim
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

/* ---- leaderboard row ---- */
function LeaderRow({
  entry,
  highlight = false,
}: {
  entry: (typeof leaderboard)[number];
  highlight?: boolean;
}) {
  const medal =
    entry.rank === 1
      ? "text-warning"
      : entry.rank === 2
        ? "text-muted-foreground"
        : entry.rank === 3
          ? "text-accent"
          : "text-muted-foreground";
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
        highlight
          ? "border-border bg-foreground/[0.03]"
          : "border-transparent hover:bg-muted/50",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
          entry.rank <= 3 ? cn("bg-muted", medal) : "bg-muted text-muted-foreground",
        )}
      >
        {entry.rank}
      </span>
      <Avatar name={entry.name} size="sm" ring={highlight} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {entry.name}
          {highlight && (
            <span className="ml-1.5 text-xs font-semibold text-primary">
              (You)
            </span>
          )}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          @{entry.handle} · {entry.books} books
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatToken(entry.earnings)}</p>
        <p className="text-xs text-muted-foreground">{entry.board}</p>
      </div>
    </div>
  );
}
