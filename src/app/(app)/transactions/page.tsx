"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Gift,
  CreditCard,
  Users,
  ArrowDownToLine,
  Receipt,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/reveal";
import { useToast } from "@/components/ui/toast";
import { cn, formatToken, timeAgo } from "@/lib/utils";
import { transactions, type Transaction } from "@/lib/mock-data";

type TxType = Transaction["type"];

const typeMeta: Record<
  TxType,
  { label: string; icon: React.ReactNode; badge: string }
> = {
  reward: {
    label: "Reward",
    icon: <Gift />,
    badge: "bg-accent/12 text-accent",
  },
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
    icon: <CreditCard />,
    badge: "bg-primary/12 text-primary",
  },
  referral: {
    label: "Referral",
    icon: <Users />,
    badge: "bg-secondary/12 text-secondary",
  },
};

const statusVariant: Record<
  Transaction["status"],
  "success" | "warning" | "destructive"
> = {
  completed: "success",
  pending: "warning",
  failed: "destructive",
};

const typeOptions = [
  { label: "All types", value: "all" },
  { label: "Reward", value: "reward" },
  { label: "Withdrawal", value: "withdrawal" },
  { label: "Deposit", value: "deposit" },
  { label: "Subscription", value: "subscription" },
  { label: "Referral", value: "referral" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

export default function TransactionsPage() {
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (status !== "all" && t.status !== status) return false;
      if (
        q &&
        !t.description.toLowerCase().includes(q) &&
        !t.hash.toLowerCase().includes(q) &&
        !t.type.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [query, type, status]);

  const totals = React.useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    for (const t of transactions) {
      if (t.status === "failed") continue;
      if (t.amount >= 0) inflow += t.amount;
      else outflow += Math.abs(t.amount);
    }
    return { inflow, outflow, net: inflow - outflow };
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Transactions"
        description="All deposits, withdrawals, rewards and referrals"
        actions={
          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: "Preparing export",
                description: "Your CSV will download shortly.",
                variant: "default",
              })
            }
          >
            <Download />
            Export CSV
          </Button>
        }
      />

      {/* Summary mini-stats */}
      <Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="card-hover p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-success/12 text-success [&_svg]:size-5">
                <ArrowDownLeft />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total in
                </p>
                <p className="text-lg font-bold text-success">
                  +{formatToken(totals.inflow)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="card-hover p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/12 text-destructive [&_svg]:size-5">
                <ArrowUpRight />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total out
                </p>
                <p className="text-lg font-bold text-destructive">
                  −{formatToken(totals.outflow)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="card-hover p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary [&_svg]:size-5">
                <Coins />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Net flow
                </p>
                <p
                  className={cn(
                    "text-lg font-bold",
                    totals.net >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {totals.net >= 0 ? "+" : "−"}
                  {formatToken(Math.abs(totals.net))}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Reveal>

      {/* Filter bar */}
      <Reveal delay={1}>
        <Card className="mt-5">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                icon={<Search />}
                placeholder="Search description or tx hash…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search transactions"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-[360px]">
              <Select
                options={typeOptions}
                value={type}
                onChange={(e) => setType(e.target.value)}
                aria-label="Filter by type"
              />
              <Select
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              />
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Table */}
      <Reveal delay={2}>
        <Card className="mt-5 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<Receipt />}
                title="No transactions found"
                description="Try adjusting your search or filters to see more results."
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      setType("all");
                      setStatus("all");
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Type</TH>
                    <TH>Description</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Status</TH>
                    <TH>Time</TH>
                    <TH className="text-right">Tx hash</TH>
                  </TR>
                </THead>
                <TBody>
                  {filtered.map((t) => {
                    const meta = typeMeta[t.type];
                    const positive = t.amount >= 0;
                    return (
                      <TR key={t.id}>
                        <TD>
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
                        <TD className="max-w-[280px] truncate font-medium">
                          {t.description}
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
                          <Badge variant={statusVariant[t.status]}>
                            {t.status}
                          </Badge>
                        </TD>
                        <TD className="whitespace-nowrap text-muted-foreground">
                          {timeAgo(t.minutesAgo)}
                        </TD>
                        <TD className="text-right font-mono text-xs text-muted-foreground">
                          {t.hash}
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>

              {/* Pagination footer */}
              <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3.5 text-sm text-muted-foreground sm:flex-row">
                <span>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    1–{filtered.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {filtered.length}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </Reveal>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Need a wallet-level view?{" "}
        <Link href="/wallet" className="text-primary hover:underline">
          Open your wallet
        </Link>
        .
      </p>
    </div>
  );
}
