"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Sparkles,
  Zap,
  BookOpen,
  ShieldCheck,
  Wallet,
  Star,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { Reveal } from "@/components/reveal";
import { useToast } from "@/components/ui/toast";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { plans, currentUser, type Plan } from "@/lib/mock-data";
import { cn, formatToken, formatUsd } from "@/lib/utils";

const accentDot: Record<Plan["accent"], string> = {
  muted: "bg-muted-foreground/50",
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
};

function priceFor(plan: Plan, yearly: boolean) {
  if (plan.priceSol === 0) return 0;
  return yearly ? +(plan.priceSol * 12 * 0.8).toFixed(2) : plan.priceSol;
}

export default function PlansPage() {
  const { toast } = useToast();
  const [yearly, setYearly] = React.useState(false);
  const [selected, setSelected] = React.useState<Plan | null>(null);

  const confirm = () => {
    if (!selected) return;
    const label = selected.name;
    setSelected(null);
    toast({
      title: `Welcome to ${label}!`,
      description: "Your subscription is active. Time to earn.",
      variant: "success",
    });
  };

  return (
    <div>
      <PageHeader title="Plans" description="Upgrade your earning potential" />

      {/* Billing toggle */}
      <Reveal>
        <div className="mb-8 flex items-center justify-center gap-4">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !yearly ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Monthly
          </span>
          <Switch
            checked={yearly}
            onCheckedChange={setYearly}
            aria-label="Toggle yearly billing"
          />
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                yearly ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Yearly
            </span>
            <Badge variant="success">Save 20%</Badge>
          </span>
        </div>
      </Reveal>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan, i) => {
          const isCurrent = plan.name === currentUser.plan;
          const price = priceFor(plan, yearly);
          return (
            <Reveal key={plan.id} delay={i} className="h-full">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="h-full"
              >
                <Card
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden p-6",
                    plan.popular &&
                      "border-primary shadow-glow sm:scale-[1.02]",
                  )}
                >
                  {plan.popular && (
                    <div className="absolute right-5 top-5">
                      <Badge variant="solid" className="gap-1">
                        <Sparkles className="size-3" /> Most popular
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", accentDot[plan.accent])} />
                    <h3 className="text-lg font-bold tracking-tight">{plan.name}</h3>
                  </div>
                  <p className="mt-1.5 min-h-10 text-sm text-muted-foreground">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="mt-5">
                    {plan.priceSol === 0 ? (
                      <div className="text-4xl font-bold tracking-tight">Free</div>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-bold tracking-tight">
                          {price}
                        </span>
                        <span className="text-lg font-semibold text-muted-foreground">
                          SOL
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {yearly ? "/yr" : "/mo"}
                        </span>
                      </div>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {plan.priceSol === 0
                        ? "No card required"
                        : `≈ ${formatUsd(yearly ? plan.priceUsd * 12 * 0.8 : plan.priceUsd)} ${yearly ? "per year" : "per month"}`}
                    </p>
                  </div>

                  {/* Key metrics */}
                  <div className="mt-6 space-y-2.5 rounded-xl border border-border bg-muted/40 p-4 text-sm">
                    <MetricRow label="Daily reading limit" value={`${plan.dailyLimit} books`} />
                    <MetricRow label="Weekly reward" value={plan.weeklyReward} />
                    <MetricRow label="Board access" value={plan.boardAccess} />
                    <MetricRow label="Referral rate" value={plan.referralRate} />
                  </div>

                  {/* Features */}
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                          <Check className="size-3" />
                        </span>
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-6">
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        <Check /> Current plan
                      </Button>
                    ) : (
                      <Button
                        variant={plan.popular ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelected(plan)}
                      >
                        {plan.priceSol === 0 ? "Get started" : "Subscribe"}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      {/* Comparison table */}
      <Reveal className="mt-14">
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight">Compare all plans</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every detail, side by side. Your current plan is highlighted.
          </p>
        </div>
        <Card className="overflow-hidden p-0">
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH className="min-w-40">Feature</TH>
                {plans.map((p) => (
                  <TH
                    key={p.id}
                    className={cn(
                      "text-center",
                      p.name === currentUser.plan && "bg-primary/[0.07] text-primary",
                    )}
                  >
                    {p.name}
                  </TH>
                ))}
              </TR>
            </THead>
            <TBody>
              {comparisonRows.map((row) => (
                <TR key={row.label}>
                  <TD className="font-medium text-foreground">{row.label}</TD>
                  {plans.map((p) => (
                    <TD
                      key={p.id}
                      className={cn(
                        "text-center",
                        p.name === currentUser.plan && "bg-primary/[0.05]",
                      )}
                    >
                      <Cell value={row.get(p)} />
                    </TD>
                  ))}
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </Reveal>

      {/* Reassurance strip */}
      <Reveal className="mt-8">
        <Card className="bg-muted/30 p-6">
          <p className="mb-4 text-sm font-semibold">All plans include</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reassurance.map((r) => (
              <div key={r.title} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary [&_svg]:size-4.5">
                  {r.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      {/* Confirm dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <DialogHeader
              title={`Subscribe to ${selected.name}`}
              description={selected.tagline}
            />
            <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold">{selected.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Billing</span>
                <span className="font-semibold">{yearly ? "Yearly" : "Monthly"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="text-base font-bold">
                  {selected.priceSol === 0
                    ? "Free"
                    : `${formatToken(priceFor(selected, yearly))} ${yearly ? "/yr" : "/mo"}`}
                </span>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={confirm}>
                <Wallet /> Confirm &amp; pay in SOL
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <span className="inline-flex text-accent">
        <Check className="size-4" />
      </span>
    );
  if (value === false)
    return (
      <span className="inline-flex text-muted-foreground/50">
        <X className="size-4" />
      </span>
    );
  return <span className="text-sm text-foreground">{value}</span>;
}

const comparisonRows: { label: string; get: (p: Plan) => string | boolean }[] = [
  { label: "Daily books", get: (p) => `${p.dailyLimit}` },
  { label: "Boards", get: (p) => p.boardAccess },
  {
    label: "Quiz multiplier",
    get: (p) =>
      ({ starter: "1x", reader: "1.5x", scholar: "2x", sage: "3x" })[p.id] ?? "1x",
  },
  { label: "Referral rate", get: (p) => p.referralRate },
  { label: "Analytics", get: (p) => p.id !== "starter" },
  {
    label: "Support",
    get: (p) =>
      ({ starter: "Community", reader: "Email", scholar: "Priority", sage: "Dedicated" })[p.id] ??
      "Community",
  },
  { label: "Governance", get: (p) => p.id === "sage" },
];

const reassurance = [
  { icon: <ShieldCheck />, title: "On-chain rewards", body: "Every reward settled on Solana." },
  { icon: <Zap />, title: "Instant upgrades", body: "Switch tiers anytime, prorated." },
  { icon: <BookOpen />, title: "Full library", body: "Access the complete catalog." },
  { icon: <Star />, title: "No lock-in", body: "Cancel whenever you like." },
];
