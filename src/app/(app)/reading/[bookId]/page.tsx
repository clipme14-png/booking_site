"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  Coins,
  Minus,
  Plus,
  Timer,
  BookOpen,
  Award,
  CheckCircle2,
  Trophy,
  PartyPopper,
} from "lucide-react";
import { books } from "@/lib/mock-data";
import { cn, formatToken } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const CHAPTERS = [
  "No One's Crazy",
  "Luck & Risk",
  "Never Enough",
  "The Power of Compounding",
  "Room for Error",
];

const PROSE = [
  "Money decisions are rarely made on a spreadsheet. They are made at the dinner table, shaped by the era you were born into, the household you grew up in, and the quiet stories you tell yourself about what security feels like. Two people can look at the same market and reach opposite conclusions, and both can be entirely reasonable given the lives they have lived.",
  "The trouble is that we treat finance as if it were physics — governed by clean laws, solvable with the right formula. But money is closer to psychology. It is a subject where knowing what to do tells you almost nothing about what people will actually do when fear, greed, and the opinions of their neighbors enter the room.",
  "Consider how differently we judge outcomes. When an investment works out, we credit skill; when it fails, we blame bad luck. Yet luck and risk are siblings — both are the reality that every outcome in life is guided by forces other than individual effort. The line between bold and reckless is drawn only after we know how the story ended.",
  "This is why the hardest financial skill is getting the goalpost to stop moving. Modern capitalism is exceptionally good at manufacturing two things: wealth, and envy. The moment a milestone is reached, the reference point shifts, and the feeling of enough evaporates. People with more money than they can ever spend still take catastrophic risks to get more they do not need, to impress people who are not paying attention.",
  "The antidote is not a bigger number. It is a clearer definition of the word enough. Enough is not too little — it is the recognition that an insatiable appetite will eventually push you to a point of regret. The most dangerous financial trait is not ignorance; it is the ambition that has no ceiling.",
  "Compounding is where patience quietly outperforms brilliance. The counterintuitive truth is that you do not need extraordinary returns to build extraordinary wealth. You need good returns, sustained uninterrupted for the longest possible period. Time is the ingredient that turns the ordinary into the remarkable, and it is the one variable most investors are unwilling to respect.",
  "Which brings us to room for error — the single most underrated force in finance. The purpose of a margin of safety is to render the forecast unnecessary. You survive not by predicting the future but by building a plan that works even when the future refuses to cooperate. The goal is to remain in the game long enough for compounding to do its work.",
  "In the end, doing well with money has little to do with how smart you are and a great deal to do with how you behave. And behavior is hard to teach, even to very intelligent people. Humility, patience, and the willingness to let a plan run its course — these are the habits that quietly separate those who build lasting wealth from those who merely chase it.",
];

function formatClock(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ReaderPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const book = books.find((b) => b.id === bookId) ?? books[0];
  const { toast } = useToast();

  const [seconds, setSeconds] = React.useState(0);
  const [fontSize, setFontSize] = React.useState(18);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [progress, setProgress] = React.useState(
    book.progress > 0 && book.progress < 100 ? book.progress : 12,
  );
  const [completed, setCompleted] = React.useState(false);
  const [showReward, setShowReward] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Reading timer
  React.useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Track scroll progress within the prose column
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = el.offsetHeight - viewport + 200;
      const scrolled = Math.min(
        Math.max(-rect.top + viewport * 0.25, 0),
        Math.max(total, 1),
      );
      const pct = Math.round((scrolled / Math.max(total, 1)) * 100);
      setProgress((prev) => Math.max(prev, Math.min(pct, 99)));
      if (pct >= 96 && !completed) {
        setCompleted(true);
        setProgress(100);
        setShowReward(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [completed]);

  const minutesRemaining = Math.max(
    1,
    Math.round(book.minutes * (1 - progress / 100)),
  );
  const activeChapter = Math.min(
    CHAPTERS.length - 1,
    Math.floor((progress / 100) * CHAPTERS.length),
  );

  const toggleBookmark = () => {
    setBookmarked((b) => {
      const next = !b;
      toast({
        title: next ? "Bookmark added" : "Bookmark removed",
        description: next
          ? "We saved your spot in this book."
          : "Bookmark cleared.",
        variant: next ? "success" : "default",
      });
      return next;
    });
  };

  const markComplete = () => {
    setCompleted(true);
    setProgress(100);
    setShowReward(true);
  };

  const changeFont = (delta: number) =>
    setFontSize((f) => Math.min(24, Math.max(14, f + delta)));

  return (
    <div className="pb-24">
      {/* Sticky toolbar */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/reading"
            aria-label="Back to reading"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{book.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {book.author}
            </p>
          </div>

          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium sm:flex">
            <Timer className="size-3.5 text-primary" />
            {formatClock(seconds)}
          </div>

          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
            <Clock className="size-3.5" />
            {minutesRemaining} min left
          </div>

          <div className="flex items-center rounded-lg border border-border bg-card">
            <button
              onClick={() => changeFont(-2)}
              className="flex size-8 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Decrease font size"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="px-1 text-xs font-semibold text-muted-foreground">
              A
            </span>
            <button
              onClick={() => changeFont(2)}
              className="flex size-8 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Increase font size"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <Button
            variant={bookmarked ? "default" : "outline"}
            size="icon-sm"
            onClick={toggleBookmark}
            aria-label="Toggle bookmark"
          >
            <Bookmark
              className={cn("size-4", bookmarked && "fill-current")}
            />
          </Button>
        </div>

        <div className="mt-3">
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main reading column */}
        <div ref={scrollRef}>
          <div className="mx-auto max-w-2xl">
            <Badge variant="default" className="mb-4">
              Chapter {activeChapter + 1} — {CHAPTERS[activeChapter]}
            </Badge>
            <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              {book.title}
            </h1>

            <div
              className="space-y-6 leading-relaxed text-foreground/90"
              style={{ fontSize, lineHeight: 1.75 }}
            >
              {PROSE.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5 }}
                >
                  {i === 0 ? (
                    <span className="float-left mr-2 mt-1 text-6xl font-bold leading-[0.8] text-gradient">
                      {p.charAt(0)}
                    </span>
                  ) : null}
                  {i === 0 ? p.slice(1) : p}
                </motion.p>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/30 p-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow">
                <Award className="size-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Finished this chapter?
                </p>
                <p className="text-xs text-muted-foreground">
                  Mark it complete to earn {formatToken(book.reward)} and unlock
                  the quiz.
                </p>
              </div>
              <Button onClick={markComplete} disabled={completed}>
                {completed ? (
                  <>
                    <CheckCircle2 className="size-4" /> Completed
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" /> Mark as complete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-40 space-y-4">
            <Card className="overflow-hidden">
              <div
                className="h-28"
                style={{ backgroundImage: book.cover }}
              />
              <CardContent className="space-y-3 p-4">
                <div>
                  <h3 className="text-sm font-semibold">{book.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {book.author}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{book.category}</Badge>
                  <Badge variant="solid" className="gap-1">
                    <Coins className="size-3" />
                    {formatToken(book.reward)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <BookOpen className="size-3.5" />
                  Table of contents
                </p>
                <ul className="space-y-1">
                  {CHAPTERS.map((ch, i) => {
                    const active = i === activeChapter;
                    const done = i < activeChapter;
                    return (
                      <li key={ch}>
                        <div
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                            active
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                              active
                                ? "border-primary bg-primary text-white"
                                : done
                                  ? "border-success bg-success/15 text-success"
                                  : "border-border",
                            )}
                          >
                            {done ? (
                              <CheckCircle2 className="size-3" />
                            ) : (
                              i + 1
                            )}
                          </span>
                          <span className="truncate">{ch}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid grid-cols-2 gap-3 p-4">
                <Stat label="Time reading" value={formatClock(seconds)} />
                <Stat label="Progress" value={`${progress}%`} />
                <Stat label="Min left" value={`${minutesRemaining}`} />
                <Stat label="Rating" value={book.rating.toFixed(1)} />
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      {/* Bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/reading"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </Link>

          <div className="flex flex-1 items-center gap-3">
            <Progress value={progress} className="h-1.5 flex-1" />
            <span className="w-10 text-right text-xs font-semibold tabular-nums">
              {progress}%
            </span>
          </div>

          <Button size="sm" onClick={markComplete}>
            Finish &amp; take quiz
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Reward dialog */}
      <Dialog open={showReward} onClose={() => setShowReward(false)}>
        <RewardCelebration reward={book.reward} />
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function RewardCelebration({ reward }: { reward: number }) {
  const confetti = React.useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 260,
        y: -(Math.random() * 160 + 60),
        rotate: Math.random() * 360,
        color: ["#7c3aed", "#2563eb", "#16a34a", "#f59e0b", "#db2777"][i % 5],
        delay: Math.random() * 0.2,
      })),
    [],
  );

  return (
    <div className="relative flex flex-col items-center overflow-hidden py-4 text-center">
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          className="absolute left-1/2 top-16 size-2 rounded-sm"
          style={{ backgroundColor: c.color }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: c.x,
            y: c.y,
            rotate: c.rotate,
          }}
          transition={{ duration: 1.4, delay: c.delay, ease: "easeOut" }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative z-10 flex size-20 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow"
      >
        <Trophy className="size-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 mt-4"
      >
        <div className="flex items-center justify-center gap-2">
          <PartyPopper className="size-5 text-warning" />
          <h2 className="text-xl font-bold tracking-tight">Reward earned!</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          You finished the book. Nice work.
        </p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
          className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-5 py-3"
        >
          <Coins className="size-5 text-primary" />
          <span className="text-2xl font-bold text-gradient">
            +{formatToken(reward)}
          </span>
        </motion.div>

        <p className="mt-4 text-xs text-muted-foreground">
          Pass the quiz to claim your reward and earn bonus XP.
        </p>

        <div className="mt-5 flex gap-2">
          <Link
            href="/reading"
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            Back to library
          </Link>
          <Link
            href="/quiz"
            className={cn(buttonVariants(), "flex-1")}
          >
            Take quiz
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
