"use client";

import * as React from "react";
import {
  DollarSign,
  Users,
  CreditCard,
  ArrowDownToLine,
  Download,
  ShieldAlert,
  Ban,
  Eye,
  Megaphone,
  Settings2,
  FileText,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatCard, CountUp } from "@/components/ui/stat-card";
import { AreaChart, BarChart, DonutChart } from "@/components/charts/charts";
import { Reveal } from "@/components/reveal";
import { useToast } from "@/components/ui/toast";
import { cn, formatUsd, formatToken, compact, timeAgo } from "@/lib/utils";
import {
  adminMetrics,
  leaderboard,
  transactions,
  plans,
  books,
} from "@/lib/mock-data";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Brand hex colors keyed by plan accent
const accentHex: Record<string, string> = {
  muted: "#8e8e93",
  secondary: "#5b7fa6",
  primary: "#2f6fde",
  accent: "#b8955a",
};

/* ------------------------------------------------------------------ */
/*  Fraud detection card                                              */
/* ------------------------------------------------------------------ */
function FraudCard() {
  const { toast } = useToast();
  const [flagged, setFlagged] = React.useState(adminMetrics.flagged);
  const [confirm, setConfirm] = React.useState<{ id: string; user: string } | null>(null);

  const riskBadge = (risk: string) =>
    risk === "high" ? (
      <Badge variant="destructive">High</Badge>
    ) : risk === "medium" ? (
      <Badge variant="warning">Medium</Badge>
    ) : (
      <Badge variant="outline">Low</Badge>
    );

  const ban = () => {
    if (!confirm) return;
    setFlagged((prev) => prev.filter((f) => f.id !== confirm.id));
    toast({ title: `${confirm.user} banned`, description: "The account has been suspended.", variant: "success" });
    setConfirm(null);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-destructive" /> Fraud detection
          </CardTitle>
          <CardDescription>Accounts flagged by anomaly detection.</CardDescription>
        </div>
        <Badge variant="destructive">{flagged.length} flagged</Badge>
      </CardHeader>
      <CardContent>
        {flagged.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-success" /> No active flags. All clear.
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>User</TH>
                <TH>Reason</TH>
                <TH>Risk</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {flagged.map((f) => (
                <TR key={f.id}>
                  <TD className="font-medium">{f.user}</TD>
                  <TD className="text-muted-foreground">{f.reason}</TD>
                  <TD>{riskBadge(f.risk)}</TD>
                  <TD>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast({ title: `Reviewing ${f.user}`, description: "Opening account activity." })}
                      >
                        <Eye /> Review
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setConfirm({ id: f.id, user: f.user })}
                      >
                        <Ban /> Ban
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={!!confirm} onClose={() => setConfirm(null)}>
        <DialogHeader
          title={`Ban ${confirm?.user}?`}
          description="This suspends the account and freezes any pending rewards. This action can be reversed by a super-admin."
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={ban}>
            <Ban /> Ban account
          </Button>
        </div>
      </Dialog>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Content management tab                                            */
/* ------------------------------------------------------------------ */
function ContentTable() {
  const { toast } = useToast();
  const [published, setPublished] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(books.map((b) => [b.id, b.progress > 0 || !!b.completed || b.rating >= 4.7])),
  );

  return (
    <Table>
      <THead>
        <TR>
          <TH>Title</TH>
          <TH>Category</TH>
          <TH>Reads</TH>
          <TH>Reward</TH>
          <TH className="text-right">Published</TH>
        </TR>
      </THead>
      <TBody>
        {books.map((b) => (
          <TR key={b.id}>
            <TD>
              <div className="flex items-center gap-3">
                <div className="size-8 shrink-0 rounded-md" style={{ backgroundImage: b.cover }} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.author}</p>
                </div>
              </div>
            </TD>
            <TD>
              <Badge variant="outline">{b.category}</Badge>
            </TD>
            <TD className="text-muted-foreground">{compact(Math.round(b.rating * 1000 + b.minutes * 37))}</TD>
            <TD className="font-medium text-accent">{formatToken(b.reward)}</TD>
            <TD>
              <div className="flex justify-end">
                <Switch
                  checked={published[b.id]}
                  onCheckedChange={(v) => {
                    setPublished((p) => ({ ...p, [b.id]: v }));
                    toast({ title: v ? "Book published" : "Book unpublished", description: b.title });
                  }}
                  aria-label={`Toggle publish ${b.title}`}
                />
              </div>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}

/* ------------------------------------------------------------------ */
/*  Announcements tab                                                 */
/* ------------------------------------------------------------------ */
function AnnouncementsTab() {
  const { toast } = useToast();
  const [posts, setPosts] = React.useState([
    { id: "p1", title: "12 new Crypto titles added", date: "2 days ago" },
    { id: "p2", title: "Weekly reward pool increased to 3,360 SOL", date: "1 week ago" },
    { id: "p3", title: "Board 5 (Sage) unlock event this weekend", date: "2 weeks ago" },
  ]);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [publishing, setPublishing] = React.useState(false);

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Add a title first", variant: "warning" });
      return;
    }
    setPublishing(true);
    setTimeout(() => {
      setPosts((prev) => [{ id: `p${Date.now()}`, title: title.trim(), date: "just now" }, ...prev]);
      setTitle("");
      setBody("");
      setPublishing(false);
      toast({ title: "Announcement published", variant: "success" });
    }, 600);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Compose announcement</CardTitle>
          <CardDescription>Broadcast to all platform users.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={publish} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ann-title">Title</Label>
              <Input
                id="ann-title"
                placeholder="What's new?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-body">Message</Label>
              <Textarea
                id="ann-body"
                className="min-h-32"
                placeholder="Write the announcement details…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" loading={publishing}>
                <Megaphone /> Publish
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Recent announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {posts.map((p) => (
            <div key={p.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground [&_svg]:size-4">
                <Megaphone />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{p.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings tab                                                      */
/* ------------------------------------------------------------------ */
function PlatformSettingsTab() {
  const { toast } = useToast();
  const [flags, setFlags] = React.useState({ maintenance: false, signups: true, referral: true });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Platform toggles</CardTitle>
          <CardDescription>Global switches applied instantly.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {[
            { key: "maintenance", title: "Maintenance mode", desc: "Temporarily take the platform offline for users." },
            { key: "signups", title: "Allow new signups", desc: "Let new users register accounts." },
            { key: "referral", title: "Referral program", desc: "Enable referral rewards platform-wide." },
          ].map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="text-sm font-medium">{f.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <Switch
                checked={flags[f.key as keyof typeof flags]}
                onCheckedChange={(v) => {
                  setFlags((p) => ({ ...p, [f.key]: v }));
                  toast({ title: `${f.title} ${v ? "enabled" : "disabled"}`, variant: f.key === "maintenance" && v ? "warning" : "default" });
                }}
                aria-label={f.title}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reward rates</CardTitle>
          <CardDescription>Base payout configuration (SOL).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rate-read">Daily reading reward</Label>
              <Input id="rate-read" type="number" step="0.01" defaultValue="0.12" trailing={<span className="text-xs">SOL</span>} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate-quiz">Quiz bonus</Label>
              <Input id="rate-quiz" type="number" step="0.01" defaultValue="0.20" trailing={<span className="text-xs">SOL</span>} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate-ref">Referral rate</Label>
              <Input id="rate-ref" type="number" step="1" defaultValue="12" trailing={<span className="text-xs">%</span>} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate-streak">Streak milestone</Label>
              <Input id="rate-streak" type="number" step="0.01" defaultValue="0.75" trailing={<span className="text-xs">SOL</span>} />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button size="sm" onClick={() => toast({ title: "Reward rates saved", variant: "success" })}>
              Save rates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
export default function AdminPage() {
  const { toast } = useToast();

  // Derive donut segments + revenue-by-plan from plans (weight by price)
  const planWeights = plans.map((p, i) => {
    const base = [4200, 3100, 1600, 520][i] ?? 300; // subscriber counts per plan
    return { plan: p, subs: base, revenue: base * p.priceUsd };
  });
  const donutSegments = planWeights
    .filter((w) => w.subs > 0)
    .map((w) => ({ label: w.plan.name, value: w.subs, color: accentHex[w.plan.accent] }));
  const totalSubs = donutSegments.reduce((s, x) => s + x.value, 0);
  const maxPlanRev = Math.max(...planWeights.map((w) => w.revenue), 1);

  const txMeta: Record<string, string> = {
    reward: "text-accent",
    referral: "text-secondary",
    deposit: "text-success",
    withdrawal: "text-destructive",
    subscription: "text-primary",
  };
  const statusBadge = (s: string) =>
    s === "completed" ? (
      <Badge variant="success">Completed</Badge>
    ) : s === "pending" ? (
      <Badge variant="warning">Pending</Badge>
    ) : (
      <Badge variant="destructive">Failed</Badge>
    );

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview & controls"
        actions={
          <>
            <Badge variant="solid" className="hidden sm:inline-flex">
              <ShieldCheck /> Admin
            </Badge>
            <Select
              className="h-9 w-36 text-[13px]"
              defaultValue="30d"
              options={[
                { label: "Last 7 days", value: "7d" },
                { label: "Last 30 days", value: "30d" },
                { label: "Last quarter", value: "90d" },
                { label: "Year to date", value: "ytd" },
              ]}
            />
            <Button size="sm" onClick={() => toast({ title: "Report exported", description: "CSV is downloading.", variant: "success" })}>
              <Download /> <span className="hidden sm:inline">Export report</span>
            </Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0}>
          <StatCard
            label="Revenue"
            value={formatUsd(adminMetrics.revenue)}
            icon={<DollarSign />}
            change={adminMetrics.revenueChange}
            changeLabel="vs last period"
            accent="primary"
          />
        </Reveal>
        <Reveal delay={1}>
          <StatCard
            label="Total users"
            value={<CountUp value={adminMetrics.users} />}
            icon={<Users />}
            change={adminMetrics.usersChange}
            changeLabel="vs last period"
            accent="secondary"
          />
        </Reveal>
        <Reveal delay={2}>
          <StatCard
            label="Active subscriptions"
            value={<CountUp value={adminMetrics.subscriptions} />}
            icon={<CreditCard />}
            change={adminMetrics.subscriptionsChange}
            changeLabel="vs last period"
            accent="accent"
          />
        </Reveal>
        <Reveal delay={3}>
          <StatCard
            label="Withdrawals"
            value={formatUsd(adminMetrics.withdrawals)}
            icon={<ArrowDownToLine />}
            change={adminMetrics.withdrawalsChange}
            changeLabel="vs last period"
            accent="warning"
          />
        </Reveal>
      </div>

      {/* Charts row */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Monthly gross revenue (in thousands USD).</CardDescription>
              </div>
              <span className="text-lg font-semibold tabular">{formatUsd(adminMetrics.revenue)}</span>
            </CardHeader>
            <CardContent>
              <AreaChart data={adminMetrics.revenueSeries} labels={monthLabels} color="var(--violet)" height={220} />
            </CardContent>
          </Card>
        </Reveal>
        <Reveal delay={1}>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>User growth</CardTitle>
                <CardDescription>Cumulative users (in thousands).</CardDescription>
              </div>
              <span className="text-lg font-semibold text-secondary">{compact(adminMetrics.users)}</span>
            </CardHeader>
            <CardContent>
              <BarChart data={adminMetrics.userSeries} labels={monthLabels} height={220} />
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Fraud + subscriptions breakdown */}
      <div className="mb-6 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Reveal>
            <FraudCard />
          </Reveal>
        </div>
        <Reveal delay={1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Subscriptions breakdown</CardTitle>
              <CardDescription>Active subscribers by plan.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <DonutChart segments={donutSegments} size={172}>
                  <span className="text-2xl font-semibold">{compact(totalSubs)}</span>
                  <span className="text-xs text-muted-foreground">subscribers</span>
                </DonutChart>
              </div>
              <div className="mt-5 space-y-2.5">
                <p className="text-xs font-medium text-muted-foreground">Revenue by plan</p>
                {planWeights
                  .filter((w) => w.revenue > 0)
                  .map((w) => (
                    <div key={w.plan.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="size-2.5 rounded-full" style={{ background: accentHex[w.plan.accent] }} />
                          {w.plan.name}
                        </span>
                        <span className="font-medium">{formatUsd(w.revenue)}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(w.revenue / maxPlanRev) * 100}%`, background: accentHex[w.plan.accent] }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Latest withdrawals */}
      <Reveal>
        <Card className="mb-6">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Latest transactions</CardTitle>
              <CardDescription>Most recent platform activity.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => toast({ title: "Opening full ledger" })}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Description</TH>
                  <TH>Type</TH>
                  <TH>Amount</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Time</TH>
                </TR>
              </THead>
              <TBody>
                {transactions.slice(0, 6).map((t) => (
                  <TR key={t.id}>
                    <TD className="max-w-[280px]">
                      <p className="truncate font-medium">{t.description}</p>
                      <p className="font-mono text-xs text-muted-foreground">{t.hash}</p>
                    </TD>
                    <TD className="capitalize text-muted-foreground">{t.type}</TD>
                    <TD className={cn("font-semibold", txMeta[t.type])}>
                      {t.amount >= 0 ? "+" : ""}
                      {formatToken(Math.abs(t.amount))}
                    </TD>
                    <TD>{statusBadge(t.status)}</TD>
                    <TD className="text-right text-muted-foreground">{timeAgo(t.minutesAgo)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </Reveal>

      {/* Management */}
      <Reveal>
        <div className="mb-4 flex items-center gap-2">
          <Settings2 className="size-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Management</h2>
        </div>
        <Tabs defaultValue="users">
          <div className="mb-5 overflow-x-auto">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Top accounts by earnings.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <THead>
                    <TR>
                      <TH>Name</TH>
                      <TH>Board</TH>
                      <TH>Books</TH>
                      <TH>Earnings</TH>
                      <TH>Status</TH>
                      <TH className="text-right">Actions</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {leaderboard.map((u) => (
                      <TR key={u.rank}>
                        <TD>
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} size="sm" />
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground">@{u.handle}</p>
                            </div>
                          </div>
                        </TD>
                        <TD>
                          <Badge variant="outline">{u.board}</Badge>
                        </TD>
                        <TD className="text-muted-foreground">{u.books}</TD>
                        <TD className="font-medium text-accent">{formatToken(u.earnings)}</TD>
                        <TD>
                          <Badge variant="success">Active</Badge>
                        </TD>
                        <TD>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => toast({ title: `Viewing ${u.name}` })}>
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => toast({ title: `${u.name} suspended`, variant: "warning" })}
                            >
                              Suspend
                            </Button>
                          </div>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" /> Content library
                  </CardTitle>
                  <CardDescription>Manage books and their publish status.</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast({ title: "Add a new book" })}>
                  <FileText /> Add book
                </Button>
              </CardHeader>
              <CardContent>
                <ContentTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsTab />
          </TabsContent>

          <TabsContent value="settings">
            <PlatformSettingsTab />
          </TabsContent>
        </Tabs>
      </Reveal>
    </div>
  );
}
