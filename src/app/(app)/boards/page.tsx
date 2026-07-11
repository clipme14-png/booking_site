"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Check,
  Lock,
  Sparkles,
  BookOpen,
  Flame,
  Brain,
  Users,
  Award,
  Rocket,
  Crown,
  Star,
  Zap,
  Target,
  Gift,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress, CircularProgress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { boards, dashboardStats } from "@/lib/mock-data";

/* --------------------------------------------------------------- */
/*  Achievements                                                   */
/* --------------------------------------------------------------- */
type Achievement = {
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  color: string;
};

const achievements: Achievement[] = [
  { name: "First Book", description: "Finished your first book", icon: <BookOpen />, earned: true, color: "#7c3aed" },
  { name: "7-Day Streak", description: "Read 7 days in a row", icon: <Flame />, earned: true, color: "#f59e0b" },
  { name: "Quiz Master", description: "Aced 25 quizzes", icon: <Brain />, earned: true, color: "#2563eb" },
  { name: "Referral Pro", description: "Referred 10+ friends", icon: <Users />, earned: true, color: "#16a34a" },
  { name: "Century Club", description: "Read 100 books", icon: <Award />, earned: true, color: "#db2777" },
  { name: "Early Adopter", description: "Joined in the first season", icon: <Rocket />, earned: true, color: "#06b6d4" },
  { name: "Sage Ascension", description: "Reach the Sage board", icon: <Crown />, earned: false, color: "#db2777" },
  { name: "Perfect Month", description: "30-day reading streak", icon: <Star />, earned: false, color: "#f59e0b" },
];

/* --------------------------------------------------------------- */
/*  Milestones                                                     */
/* --------------------------------------------------------------- */
const milestones = [
  { label: "Reach Sage board", detail: "150 books read", value: 68, reward: "15 SOL + NFT", icon: <Crown /> },
  { label: "30-day streak", detail: "27 / 30 days", value: 90, reward: "0.75 SOL", icon: <Flame /> },
  { label: "Quiz Master II", detail: "42 / 50 quizzes", value: 84, reward: "1.2 SOL", icon: <Brain /> },
  { label: "Referral Legend", detail: "34 / 50 referrals", value: 68, reward: "3 SOL", icon: <Users /> },
];

export default function BoardsPage() {
  const current = boards.find((b) => b.status === "current") ?? boards[0];
  const currentIndex = boards.findIndex((b) => b.status === "current");
  const next = boards[currentIndex + 1] ?? null;
  const completedCount = boards.filter((b) => b.status === "completed").length;

  return (
    <div>
      <PageHeader
        title="Board Progress"
        description="Climb the boards, unlock bigger rewards"
      />

      {/* Hero current board */}
      <Reveal>
        <Card className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at 20% 20%, ${current.color}, transparent 60%)`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
          <CardContent className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span
                  className="flex size-14 items-center justify-center rounded-2xl text-white shadow-glow [&_svg]:size-7"
                  style={{ backgroundColor: current.color }}
                >
                  <Trophy />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="solid">Level {current.level}</Badge>
                    <Badge variant="outline">Current board</Badge>
                  </div>
                  <h2 className="mt-1.5 text-3xl font-bold tracking-tight">
                    {current.name}
                  </h2>
                </div>
              </div>

              <p className="max-w-md text-sm text-muted-foreground">
                {current.requirement} to complete this board. You&apos;re{" "}
                <span className="font-semibold text-foreground">
                  {dashboardStats.boardProgress}%
                </span>{" "}
                of the way toward unlocking{" "}
                <span
                  className="font-semibold"
                  style={{ color: next?.color }}
                >
                  {next?.name ?? "the summit"}
                </span>
                .
              </p>

              {next && (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Next board</p>
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: next.color }}
                      />
                      {next.name}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Reward to unlock
                    </p>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-accent">
                      <Gift className="size-4" />
                      {next.reward}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* progress ring */}
            <div className="flex flex-col items-center gap-3">
              <CircularProgress
                value={dashboardStats.boardProgress}
                size={168}
                strokeWidth={12}
              >
                <div className="text-center">
                  <p className="text-3xl font-bold tracking-tight">
                    {dashboardStats.boardProgress}%
                  </p>
                  <p className="text-xs text-muted-foreground">to {next?.name}</p>
                </div>
              </CircularProgress>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {boards.length} boards complete
              </p>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Journey timeline */}
      <Reveal className="mt-6 block">
        <Card>
          <CardHeader>
            <CardTitle>Your journey</CardTitle>
            <CardDescription>
              Progress through all six boards to reach Luminary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-6">
              {/* vertical line */}
              <span className="absolute left-[27px] top-3 bottom-3 w-px bg-border" />
              {boards.map((board, i) => (
                <JourneyNode key={board.level} board={board} index={i} />
              ))}
            </ol>
          </CardContent>
        </Card>
      </Reveal>

      {/* Achievements */}
      <Reveal className="mt-6 block">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Achievements &amp; badges</CardTitle>
                <CardDescription>
                  {achievements.filter((a) => a.earned).length} of{" "}
                  {achievements.length} unlocked
                </CardDescription>
              </div>
              <Badge variant="accent">
                <Sparkles />
                {achievements.filter((a) => a.earned).length} earned
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {achievements.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -3 }}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors",
                    a.earned
                      ? "border-border bg-card card-hover"
                      : "border-dashed border-border bg-muted/30",
                  )}
                >
                  {!a.earned && (
                    <span className="absolute right-2 top-2 text-muted-foreground [&_svg]:size-3.5">
                      <Lock />
                    </span>
                  )}
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl [&_svg]:size-6",
                      !a.earned && "opacity-40 grayscale",
                    )}
                    style={{
                      backgroundColor: a.earned ? `${a.color}1f` : undefined,
                      color: a.earned ? a.color : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {a.icon}
                  </span>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        !a.earned && "text-muted-foreground",
                      )}
                    >
                      {a.name}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                      {a.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Milestones */}
        <Reveal>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
              <CardDescription>Your next rewards are close.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((m) => (
                <div key={m.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary [&_svg]:size-4">
                        {m.icon}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{m.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.detail}
                        </p>
                      </div>
                    </div>
                    <Badge variant="accent">{m.reward}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={m.value} className="h-1.5" />
                    <span className="w-9 text-right text-xs font-semibold text-muted-foreground">
                      {m.value}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Reveal>

        {/* Rewards per board */}
        <Reveal delay={1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Rewards per board</CardTitle>
              <CardDescription>
                What you earn at each tier of the climb.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <THead>
                  <TR>
                    <TH>Board</TH>
                    <TH>Requirement</TH>
                    <TH className="text-right">Reward</TH>
                    <TH className="text-right">Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {boards.map((b) => (
                    <TR key={b.level}>
                      <TD>
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: b.color }}
                          />
                          <span className="font-medium">{b.name}</span>
                        </div>
                      </TD>
                      <TD className="text-muted-foreground">{b.requirement}</TD>
                      <TD className="text-right font-semibold text-accent">
                        {b.reward}
                      </TD>
                      <TD className="text-right">
                        <Badge
                          variant={
                            b.status === "completed"
                              ? "success"
                              : b.status === "current"
                                ? "default"
                                : "outline"
                          }
                        >
                          {b.status}
                        </Badge>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- */
/*  Journey timeline node                                          */
/* --------------------------------------------------------------- */
function JourneyNode({ board, index }: { board: (typeof boards)[number]; index: number }) {
  const completed = board.status === "completed";
  const current = board.status === "current";
  const locked = board.status === "locked";

  return (
    <motion.li
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-start gap-4 pl-1"
    >
      {/* node marker */}
      <span className="relative z-10 shrink-0">
        {current && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 0 0 ${board.color}` }}
            animate={{
              boxShadow: [
                `0 0 0 0 ${board.color}66`,
                `0 0 0 10px ${board.color}00`,
              ],
            }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
        <span
          className={cn(
            "flex size-[54px] items-center justify-center rounded-full border-2 text-white [&_svg]:size-6",
            locked && "border-border bg-muted text-muted-foreground",
          )}
          style={
            locked
              ? undefined
              : {
                  backgroundColor: board.color,
                  borderColor: board.color,
                }
          }
        >
          {completed ? <Check /> : locked ? <Lock /> : <Trophy />}
        </span>
      </span>

      {/* content */}
      <div
        className={cn(
          "flex-1 rounded-xl border p-4 transition-colors",
          current
            ? "border-primary/40 bg-primary/6 shadow-glow"
            : "border-border bg-card",
          locked && "opacity-70",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Level {board.level}
            </span>
            <h3 className="text-base font-semibold">{board.name}</h3>
            {completed && (
              <Badge variant="success">
                <Check />
                Complete
              </Badge>
            )}
            {current && (
              <Badge variant="default">
                <Zap />
                In progress
              </Badge>
            )}
            {locked && (
              <Badge variant="outline">
                <Lock />
                Locked
              </Badge>
            )}
          </div>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-accent">
            <Gift className="size-4" />
            {board.reward}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{board.requirement}</p>
        {current && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="size-3.5" />
                Progress
              </span>
              <span>{dashboardStats.boardProgress}%</span>
            </div>
            <Progress value={dashboardStats.boardProgress} className="h-2" />
          </div>
        )}
      </div>
    </motion.li>
  );
}
