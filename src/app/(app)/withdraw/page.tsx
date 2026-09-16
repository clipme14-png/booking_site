"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Wallet,
  Check,
  Clock,
  Coins,
  CalendarClock,
  Zap,
  ShieldCheck,
  ArrowDownToLine,
  ExternalLink,
  History,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/reveal";
import { useToast } from "@/components/ui/toast";
import { dashboardStats, currentUser, transactions } from "@/lib/mock-data";
import { cn, formatToken, shortAddress, timeAgo } from "@/lib/utils";

const MIN_WITHDRAWAL = 0.5;
const NETWORK_FEE = 0.000005;
const BALANCE = dashboardStats.walletBalance;

function statusBadge(status: string) {
  if (status === "completed") return <Badge variant="success">Completed</Badge>;
  if (status === "pending") return <Badge variant="warning">Pending</Badge>;
  return <Badge variant="destructive">Failed</Badge>;
}

export default function WithdrawPage() {
  const { toast } = useToast();
  const [amount, setAmount] = React.useState("");
  const [destination, setDestination] = React.useState(shortAddress(currentUser.wallet));
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const numeric = parseFloat(amount) || 0;
  const withdrawals = transactions.filter((t) => t.type === "withdrawal");

  let amountError: string | null = null;
  if (amount !== "") {
    if (numeric <= 0) amountError = "Enter a valid amount.";
    else if (numeric < MIN_WITHDRAWAL) amountError = `Minimum withdrawal is ${MIN_WITHDRAWAL} SOL.`;
    else if (numeric > BALANCE) amountError = "Amount exceeds available balance.";
  }
  const destError = destination.trim().length < 6 ? "Enter a valid wallet address." : null;

  const receive = Math.max(0, numeric - NETWORK_FEE);
  const valid = numeric >= MIN_WITHDRAWAL && numeric <= BALANCE && !destError;

  const setMax = () => setAmount(String(BALANCE));

  const confirmWithdraw = () => {
    setReviewOpen(false);
    setSuccess(true);
    toast({
      title: "Withdrawal submitted",
      description: `${formatToken(numeric)} on its way to your wallet.`,
      variant: "success",
    });
  };

  const reset = () => {
    setSuccess(false);
    setAmount("");
  };

  return (
    <div>
      <PageHeader title="Withdraw" description="Move your earnings to your Solana wallet" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left: form */}
        <Reveal className="xl:col-span-2">
          <Card className="p-6">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="flex size-20 items-center justify-center rounded-full bg-foreground/[0.05] text-foreground"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                    >
                      <Check className="size-10" strokeWidth={3} />
                    </motion.span>
                  </motion.div>
                  <h2 className="mt-6 text-xl font-semibold tracking-tight">Withdrawal submitted</h2>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    {formatToken(numeric)} is being sent to{" "}
                    <span className="font-medium text-foreground">{destination}</span>. It should
                    arrive in about 5 seconds.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={reset}>
                      New withdrawal
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <CardTitle>Withdrawal amount</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Available balance:{" "}
                      <span className="font-semibold text-foreground">
                        {formatToken(BALANCE)}
                      </span>
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (SOL)</Label>
                    <Input
                      id="amount"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      icon={<Coins />}
                      trailing={
                        <button
                          type="button"
                          onClick={setMax}
                          className="pointer-events-auto rounded-md bg-primary/12 px-2 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                        >
                          Max
                        </button>
                      }
                      aria-invalid={!!amountError}
                      className={cn(amountError && "border-destructive focus-visible:ring-destructive/25")}
                    />
                    {amountError && (
                      <p className="text-xs font-medium text-destructive">{amountError}</p>
                    )}
                  </div>

                  {/* Destination */}
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination wallet</Label>
                    <Input
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      icon={<Wallet />}
                      placeholder="Solana address"
                      aria-invalid={!!destError}
                      className={cn(destError && "border-destructive focus-visible:ring-destructive/25")}
                    />
                    {destError ? (
                      <p className="text-xs font-medium text-destructive">{destError}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Double-check this address — transfers are irreversible.
                      </p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-2.5 rounded-xl border border-border bg-muted/40 p-4 text-sm">
                    <SummaryRow label="Amount" value={formatToken(numeric)} />
                    <SummaryRow
                      label="Network fee"
                      value={`~${NETWORK_FEE.toFixed(6)} SOL`}
                    />
                    <div className="border-t border-border pt-2.5">
                      <SummaryRow
                        label="You'll receive"
                        value={formatToken(receive)}
                        emphasize
                      />
                    </div>
                    <SummaryRow label="Estimated arrival" value="~5 seconds" muted />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Minimum withdrawal is {MIN_WITHDRAWAL} SOL.
                  </p>

                  <Button
                    className="w-full"
                    disabled={!valid}
                    onClick={() => setReviewOpen(true)}
                  >
                    <ArrowUpRight /> Confirm withdrawal
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </Reveal>

        {/* Right: info cards */}
        <div className="space-y-4">
          {info.map((c, i) => (
            <Reveal key={c.title} delay={i}>
              <Card className="flex items-start gap-3.5 p-5">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5",
                    c.tint,
                  )}
                >
                  {c.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.body}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      {/* History */}
      <Reveal className="mt-8">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <History className="size-4 text-muted-foreground" />
            <CardTitle>Withdrawal history</CardTitle>
          </div>
          {withdrawals.length === 0 ? (
            <EmptyState
              icon={<ArrowDownToLine />}
              title="No withdrawals yet"
              description="Your withdrawal transactions will appear here once you make one."
            />
          ) : (
            <Table>
              <THead>
                <TR className="hover:bg-transparent">
                  <TH>Date</TH>
                  <TH className="text-right">Amount</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Tx hash</TH>
                </TR>
              </THead>
              <TBody>
                {withdrawals.map((t) => (
                  <TR key={t.id}>
                    <TD className="text-muted-foreground">{timeAgo(t.minutesAgo)}</TD>
                    <TD className="text-right font-semibold">
                      {formatToken(Math.abs(t.amount))}
                    </TD>
                    <TD>{statusBadge(t.status)}</TD>
                    <TD className="text-right">
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        {t.hash}
                        <ExternalLink className="size-3" />
                      </span>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </Card>
      </Reveal>

      {/* Review dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)}>
        <DialogHeader
          title="Review withdrawal"
          description="Confirm the details before submitting."
        />
        <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
          <SummaryRow label="Amount" value={formatToken(numeric)} />
          <SummaryRow label="Network fee" value={`~${NETWORK_FEE.toFixed(6)} SOL`} />
          <SummaryRow label="Destination" value={destination} />
          <div className="border-t border-border pt-3">
            <SummaryRow label="You'll receive" value={formatToken(receive)} emphasize />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setReviewOpen(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={confirmWithdraw}>
            <ShieldCheck /> Confirm &amp; withdraw
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  emphasize,
  muted,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right font-semibold",
          emphasize && "text-base text-foreground",
          muted && "font-medium text-muted-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

const info = [
  {
    icon: <CalendarClock />,
    tint: "bg-foreground/[0.05] text-foreground",
    title: "Weekly availability",
    body: "Withdrawals open weekly. Next window in ~2 days.",
  },
  {
    icon: <Coins />,
    tint: "bg-foreground/[0.05] text-foreground",
    title: "Minimum withdrawal",
    body: `${MIN_WITHDRAWAL} SOL per transaction.`,
  },
  {
    icon: <Zap />,
    tint: "bg-foreground/[0.05] text-foreground",
    title: "Transaction fee",
    body: "~0.000005 SOL — near-zero on Solana.",
  },
  {
    icon: <Clock />,
    tint: "bg-foreground/[0.05] text-foreground",
    title: "Estimated arrival",
    body: "Funds land in seconds after confirmation.",
  },
];
