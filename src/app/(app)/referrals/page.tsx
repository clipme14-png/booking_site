"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Users,
  UserCheck,
  Coins,
  TrendingUp,
  Share2,
  Send,
  MessageCircle,
  QrCode,
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
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/ui/stat-card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/reveal";
import { useToast } from "@/components/ui/toast";
import { cn, formatToken } from "@/lib/utils";
import { referralStats, leaderboard, currentUser } from "@/lib/mock-data";

/* --------------------------------------------------------------- */
/*  Brand icons (lucide dropped these; inline SVG keeps them sharp) */
/* --------------------------------------------------------------- */
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  );
}

/* --------------------------------------------------------------- */
/*  Deterministic QR-code-style placeholder (no external library)  */
/* --------------------------------------------------------------- */
function QrPlaceholder({ code, size = 132 }: { code: string; size?: number }) {
  const N = 21;
  // Build a deterministic pseudo-random matrix from char codes.
  const cells = React.useMemo(() => {
    const seedStr = (code || "QINVEST").toUpperCase();
    const out: boolean[] = [];
    let acc = 0;
    for (let i = 0; i < seedStr.length; i++) acc += seedStr.charCodeAt(i) * (i + 7);
    for (let i = 0; i < N * N; i++) {
      // xorshift-ish deterministic hash per cell
      let h = (acc + i * 2654435761) >>> 0;
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      out.push((h & 7) > 3);
    }
    return out;
  }, [code]);

  const cell = size / N;

  const isFinder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) =>
      r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };

  const finderCell = (r: number, c: number) => {
    // renders the concentric finder pattern
    const boxes: [number, number][] = [
      [0, 0],
      [0, N - 7],
      [N - 7, 0],
    ];
    for (const [r0, c0] of boxes) {
      const rr = r - r0;
      const cc = c - c0;
      if (rr >= 0 && rr < 7 && cc >= 0 && cc < 7) {
        const border = rr === 0 || rr === 6 || cc === 0 || cc === 6;
        const inner = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
        return border || inner;
      }
    }
    return false;
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={`QR code for referral code ${code}`}
      className="shrink-0"
    >
      <rect width={size} height={size} fill="#ffffff" rx={6} />
      {Array.from({ length: N }).map((_, r) =>
        Array.from({ length: N }).map((__, c) => {
          const finder = isFinder(r, c);
          const on = finder ? finderCell(r, c) : cells[r * N + c];
          if (!on) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              rx={cell * 0.18}
              fill="#0b0b12"
            />
          );
        }),
      )}
    </svg>
  );
}

/* --------------------------------------------------------------- */
/*  Social share icon button                                       */
/* --------------------------------------------------------------- */
function ShareButton({
  label,
  icon,
  className,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Share on ${label}`}
      title={`Share on ${label}`}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-foreground/[0.05] active:scale-95 [&_svg]:size-4",
        className,
      )}
    >
      {icon}
    </button>
  );
}

/* --------------------------------------------------------------- */
/*  Referral tree node                                             */
/* --------------------------------------------------------------- */
type TreeNode = { name: string; earned: number; children?: TreeNode[] };

const treeData: TreeNode = {
  name: currentUser.name,
  earned: referralStats.totalEarned,
  children: [
    {
      name: "@cryptomia",
      earned: 0.48,
      children: [
        { name: "@blockbard", earned: 0.12 },
        { name: "@ledgerlily", earned: 0.08 },
      ],
    },
    {
      name: "@satoshigirl",
      earned: 0.9,
      children: [{ name: "@nodenomad", earned: 0.15 }],
    },
    {
      name: "@degenreader",
      earned: 0.32,
      children: [{ name: "@yieldyogi", earned: 0.05 }],
    },
  ],
};

export default function ReferralsPage() {
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = React.useState(false);

  const copy = (value: string, kind: "link" | "code") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    if (kind === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1800);
    }
    toast({
      title: kind === "link" ? "Referral link copied" : "Referral code copied",
      description: value,
      variant: "success",
    });
  };

  const share = (network: string) => {
    toast({
      title: `Sharing to ${network}`,
      description: "Opening share dialog…",
      variant: "default",
    });
  };

  return (
    <div>
      <PageHeader
        title="Referrals"
        description="Earn up to 18% when the people you invite read and earn."
      />

      {/* Referral link + share + QR */}
      <Reveal>
        <Card className="overflow-hidden">
          <div className="relative border-b border-border p-6 sm:p-7">
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight">
                      Your referral link
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Share it anywhere. You earn across three levels.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ref-link">Referral link</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="ref-link"
                      readOnly
                      value={referralStats.link}
                      icon={<Share2 />}
                      className="font-medium"
                      onFocus={(e) => e.currentTarget.select()}
                    />
                    <Button
                      onClick={() => copy(referralStats.link, "link")}
                      className="shrink-0"
                    >
                      {copiedLink ? <Check /> : <Copy />}
                      {copiedLink ? "Copied" : "Copy link"}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-3.5 pr-2.5">
                    <span className="text-xs text-muted-foreground">Code</span>
                    <span className="font-mono text-sm font-semibold tracking-wider">
                      {referralStats.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => copy(referralStats.code, "code")}
                      aria-label="Copy referral code"
                      className="text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5"
                    >
                      <Copy />
                    </button>
                  </div>

                  <Separator orientation="vertical" className="hidden h-8 sm:block" />

                  <div className="flex items-center gap-2">
                    <ShareButton
                      label="X"
                      icon={<XIcon />}
                      onClick={() => share("X")}
                    />
                    <ShareButton
                      label="Telegram"
                      icon={<Send />}
                      onClick={() => share("Telegram")}
                    />
                    <ShareButton
                      label="WhatsApp"
                      icon={<MessageCircle />}
                      onClick={() => share("WhatsApp")}
                    />
                    <ShareButton
                      label="Facebook"
                      icon={<FacebookIcon />}
                      onClick={() => share("Facebook")}
                    />
                  </div>
                </div>
              </div>

              {/* QR */}
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-2xl border border-border bg-white p-3 shadow-sm">
                  <QrPlaceholder code={referralStats.code} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <QrCode className="size-3.5" />
                  Scan to join
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0}>
          <StatCard
            label="Total referrals"
            value={referralStats.totalReferrals}
            icon={<Users />}
            change={18}
            changeLabel="this month"
            accent="primary"
          />
        </Reveal>
        <Reveal delay={1}>
          <StatCard
            label="Active referrals"
            value={referralStats.activeReferrals}
            icon={<UserCheck />}
            change={12}
            changeLabel="active now"
            accent="accent"
          />
        </Reveal>
        <Reveal delay={2}>
          <StatCard
            label="Total earned"
            value={formatToken(referralStats.totalEarned)}
            icon={<Coins />}
            change={9}
            changeLabel="vs last month"
            accent="secondary"
          />
        </Reveal>
        <Reveal delay={3}>
          <StatCard
            label="Conversion rate"
            value={`${referralStats.conversionRate}%`}
            icon={<TrendingUp />}
            change={4}
            changeLabel="click → signup"
            accent="warning"
          />
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Referral levels */}
        <Reveal className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Referral levels</CardTitle>
              <CardDescription>
                Earn commission across three tiers of your network.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {referralStats.levels.map((lvl, i) => {
                const chipTone = [
                  "bg-foreground/[0.05] text-foreground",
                  "bg-foreground/[0.05] text-foreground",
                  "bg-foreground/[0.05] text-foreground",
                ][i];
                const barTone = ["bg-primary", "bg-secondary", "bg-accent"][i];
                const max = referralStats.levels[0].count || 1;
                return (
                  <div
                    key={lvl.level}
                    className="rounded-xl border border-border bg-muted/30 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg text-sm font-semibold",
                            chipTone,
                          )}
                        >
                          L{lvl.level}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">
                            Level {lvl.level}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lvl.count} referrals · {lvl.rate} rate
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatToken(lvl.earned)}
                        </p>
                        <p className="text-xs text-muted-foreground">earned</p>
                      </div>
                    </div>
                    <Progress
                      value={(lvl.count / max) * 100}
                      className="mt-3 h-1.5"
                      indicatorClassName={barTone}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </Reveal>

        {/* Top referrers leaderboard */}
        <Reveal delay={1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top referrers</CardTitle>
              <CardDescription>Community leaderboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                    entry.you
                      ? "border-foreground/25 bg-foreground/[0.03]"
                      : "border-transparent hover:bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
                      entry.rank <= 3
                        ? "bg-foreground/[0.07] text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {entry.rank}
                  </span>
                  <Avatar name={entry.name} size="sm" ring={entry.you} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {entry.name}
                      {entry.you && (
                        <Badge variant="default" className="ml-1.5">
                          You
                        </Badge>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      @{entry.handle}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-accent">
                    {formatToken(entry.earnings)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Referral tree */}
      <Reveal className="mt-6 block">
        <Card>
          <CardHeader>
            <CardTitle>Referral tree</CardTitle>
            <CardDescription>
              Your network and the referrals they bring in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center overflow-x-auto pb-2">
              {/* Root */}
              <TreeCard node={treeData} root />
              {/* connector down */}
              <div className="h-6 w-px bg-border" />
              {/* Level 1 row */}
              <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-start md:gap-8">
                {treeData.children?.map((child, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <TreeCard node={child} />
                    {child.children && child.children.length > 0 && (
                      <>
                        <div className="h-5 w-px bg-border" />
                        <div className="flex flex-wrap justify-center gap-3">
                          {child.children.map((leaf, j) => (
                            <TreeCard key={j} node={leaf} small />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Your referrals table */}
      <Reveal className="mt-6 block">
        <Card>
          <CardHeader>
            <CardTitle>Your referrals</CardTitle>
            <CardDescription>
              Everyone who joined Quantum Invest with your link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referralStats.referredUsers.length === 0 ? (
              <EmptyState
                icon={<Users />}
                title="No referrals yet"
                description="Share your link to start earning commission when friends learn and earn."
                action={
                  <Button onClick={() => copy(referralStats.link, "link")}>
                    <Copy />
                    Copy referral link
                  </Button>
                }
              />
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>User</TH>
                    <TH>Joined</TH>
                    <TH className="text-right">Earned</TH>
                    <TH className="text-right">Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {referralStats.referredUsers.map((u) => (
                    <TR key={u.name}>
                      <TD>
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name.replace("@", "")} size="sm" />
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </TD>
                      <TD className="text-muted-foreground">{u.joined}</TD>
                      <TD className="text-right font-semibold">
                        {u.earned > 0 ? formatToken(u.earned) : "—"}
                      </TD>
                      <TD className="text-right">
                        <Badge
                          variant={u.status === "active" ? "success" : "outline"}
                        >
                          {u.status}
                        </Badge>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}

/* --------------------------------------------------------------- */
/*  Tree card                                                      */
/* --------------------------------------------------------------- */
function TreeCard({
  node,
  root,
  small,
}: {
  node: TreeNode;
  root?: boolean;
  small?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex items-center gap-2.5 rounded-xl border bg-card px-3 py-2",
        root
          ? "border-foreground/25 bg-foreground/[0.03]"
          : "border-border",
        small ? "px-2.5 py-1.5" : "",
      )}
    >
      <Avatar
        name={node.name.replace("@", "")}
        size={small ? "sm" : root ? "default" : "sm"}
        ring={root}
      />
      <div className="min-w-0">
        <p
          className={cn(
            "truncate font-medium leading-tight",
            small ? "text-xs" : "text-sm",
          )}
        >
          {root ? node.name + " (you)" : node.name}
        </p>
        <p
          className={cn(
            "leading-tight text-accent",
            small ? "text-[10px]" : "text-xs",
          )}
        >
          {formatToken(node.earned)}
        </p>
      </div>
    </motion.div>
  );
}
