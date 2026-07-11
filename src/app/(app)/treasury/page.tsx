"use client";

import * as React from "react";
import {
  Vault,
  Coins,
  Gift,
  CalendarDays,
  CalendarClock,
  Send,
  Users,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Repeat,
  TrendingUp,
  Wallet,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard, CountUp } from "@/components/ui/stat-card";
import { AreaChart, DonutChart } from "@/components/charts/charts";
import { Reveal } from "@/components/reveal";
import { cn, formatToken, formatUsd, compact } from "@/lib/utils";
import { treasury } from "@/lib/mock-data";

const SOL_USD = 168; // approximate conversion for ≈ display
const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* --------------------------------------------------------------- */
/*  Pool explainer + community metrics                             */
/* --------------------------------------------------------------- */
const pools = [
  {
    name: "Daily Pool",
    icon: <CalendarDays />,
    tone: "bg-primary/12 text-primary",
    amount: treasury.dailyPool,
    description:
      "Refilled every 24h and split among readers who hit their daily goal.",
  },
  {
    name: "Weekly Pool",
    icon: <CalendarClock />,
    tone: "bg-secondary/12 text-secondary",
    amount: treasury.weeklyPool,
    description:
      "A larger reward shared by the most consistent learners each week.",
  },
  {
    name: "Board Pool",
    icon: <Layers />,
    tone: "bg-accent/12 text-accent",
    amount: 6800,
    description:
      "Milestone payouts released when members climb to a new board tier.",
  },
  {
    name: "Referral Pool",
    icon: <Users />,
    tone: "bg-warning/15 text-warning",
    amount: 4620,
    description:
      "Funds the multi-level commissions paid when friends learn and earn.",
  },
];

const communityMetrics = [
  {
    label: "Active users",
    value: treasury.activeUsers,
    suffix: "",
    sub: "+6.2% this month",
    icon: <Users />,
    tone: "bg-primary/12 text-primary",
  },
  {
    label: "Avg daily payout",
    value: 480,
    suffix: " SOL",
    sub: "≈ " + formatUsd(480 * SOL_USD),
    icon: <TrendingUp />,
    tone: "bg-accent/12 text-accent",
  },
  {
    label: "Books read",
    value: 1284000,
    suffix: "",
    sub: "all-time across the network",
    icon: <BookOpen />,
    tone: "bg-secondary/12 text-secondary",
  },
  {
    label: "30-day retention",
    value: 74,
    suffix: "%",
    sub: "of new readers stay active",
    icon: <Repeat />,
    tone: "bg-warning/15 text-warning",
  },
];

export default function TreasuryPage() {
  const totalDist = treasury.monthlyDistribution.reduce((a, b) => a + b, 0);

  return (
    <div>
      <PageHeader
        title="Treasury"
        description="Full transparency into the Quantum Invest reward economy"
        actions={
          <Button variant="outline">
            <ExternalLink />
            View on-chain
          </Button>
        }
      />

      {/* Big number row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Reveal delay={0}>
          <StatCard
            label="Platform Treasury"
            value={formatToken(treasury.totalTreasury, "SOL", 0)}
            icon={<Vault />}
            accent="primary"
          >
            <p className="mt-2 text-xs text-muted-foreground">
              ≈ {formatUsd(treasury.totalTreasury * SOL_USD)}
            </p>
          </StatCard>
        </Reveal>
        <Reveal delay={1}>
          <StatCard
            label="Reward Pool"
            value={formatToken(treasury.rewardPool, "SOL", 0)}
            icon={<Coins />}
            accent="secondary"
          >
            <p className="mt-2 text-xs text-muted-foreground">
              ≈ {formatUsd(treasury.rewardPool * SOL_USD)}
            </p>
          </StatCard>
        </Reveal>
        <Reveal delay={2}>
          <StatCard
            label="Daily Reward Pool"
            value={formatToken(treasury.dailyPool, "SOL", 0)}
            icon={<Gift />}
            accent="accent"
          >
            <p className="mt-2 text-xs text-muted-foreground">
              refilled every 24 hours
            </p>
          </StatCard>
        </Reveal>
        <Reveal delay={0}>
          <StatCard
            label="Weekly Pool"
            value={formatToken(treasury.weeklyPool, "SOL", 0)}
            icon={<CalendarClock />}
            accent="warning"
          >
            <p className="mt-2 text-xs text-muted-foreground">
              ≈ {formatUsd(treasury.weeklyPool * SOL_USD)}
            </p>
          </StatCard>
        </Reveal>
        <Reveal delay={1}>
          <StatCard
            label="Total Distributed"
            value={
              <CountUp value={treasury.totalDistributed} suffix=" SOL" />
            }
            icon={<Send />}
            accent="primary"
          >
            <p className="mt-2 text-xs text-muted-foreground">
              paid to learners since launch
            </p>
          </StatCard>
        </Reveal>
        <Reveal delay={2}>
          <StatCard
            label="Active Users"
            value={<CountUp value={treasury.activeUsers} />}
            icon={<Users />}
            accent="secondary"
          >
            <p className="mt-2 text-xs text-muted-foreground">
              earning across all boards
            </p>
          </StatCard>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Distribution donut */}
        <Reveal className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Distribution breakdown</CardTitle>
              <CardDescription>
                How the reward economy is allocated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <DonutChart
                  segments={treasury.distribution}
                  size={180}
                  strokeWidth={24}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold tracking-tight">100%</p>
                    <p className="text-xs text-muted-foreground">allocated</p>
                  </div>
                </DonutChart>
                <ul className="flex-1 space-y-3 self-stretch">
                  {treasury.distribution.map((seg) => (
                    <li
                      key={seg.label}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: seg.color }}
                        />
                        {seg.label}
                      </span>
                      <span className="text-sm font-semibold">{seg.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Monthly distribution area chart */}
        <Reveal delay={1} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle>Rewards distributed over time</CardTitle>
                  <CardDescription>
                    Monthly SOL paid out to the community.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tracking-tight">
                    {compact(totalDist * 1000)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    total (12 months)
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={treasury.monthlyDistribution}
                labels={monthLabels}
                height={220}
                color="var(--violet)"
              />
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Community metrics */}
      <Reveal className="mt-6 block">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {communityMetrics.map((m) => (
            <Card key={m.label} className="card-hover p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    <CountUp value={m.value} suffix={m.suffix} />
                  </p>
                </div>
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl [&_svg]:size-5",
                    m.tone,
                  )}
                >
                  {m.icon}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{m.sub}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* Reward pool allocation */}
      <Reveal className="mt-6 block">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary [&_svg]:size-4">
                <Wallet />
              </span>
              <div>
                <CardTitle>Reward pool allocation</CardTitle>
                <CardDescription>
                  How each pool funds the learn-to-earn loop.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {pools.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-muted/25 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl [&_svg]:size-5",
                        p.tone,
                      )}
                    >
                      {p.icon}
                    </span>
                    <Badge variant="outline">
                      {formatToken(p.amount, "SOL", 0)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Transparency banner */}
      <Reveal className="mt-6 block">
        <Card className="relative overflow-hidden glass">
          <div className="pointer-events-none absolute inset-0 bg-brand-gradient/5" />
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
          <CardContent className="relative flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent/12 text-accent shadow-glow [&_svg]:size-6">
                <ShieldCheck />
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-tight">
                  Verifiably on-chain
                </h3>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Every deposit, reward and payout is recorded on Solana. The
                  treasury is fully auditable in real time — no hidden balances,
                  no custodial black boxes.
                </p>
              </div>
            </div>
            <Button variant="outline" className="shrink-0">
              <ExternalLink />
              Explorer
            </Button>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
