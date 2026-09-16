"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Clock,
  ArrowRight,
  Coins,
  Sparkles,
  Zap,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { quizQuestions } from "@/lib/mock-data";
import { cn, formatToken } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/progress";
import { SuccessMark } from "@/components/ui/success-mark";
import { useToast } from "@/components/ui/toast";

const QUESTION_TIME = 30;
const BOOK_TITLE = "The Psychology of Money";
const REWARD = 0.12;

export default function QuizPage() {
  const { toast } = useToast();
  const total = quizQuestions.length;

  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [locked, setLocked] = React.useState(false); // answer confirmed → show feedback
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(QUESTION_TIME);
  const [finished, setFinished] = React.useState(false);

  const question = quizQuestions[index];
  const isCorrect = selected === question?.correct;

  // Per-question countdown
  React.useEffect(() => {
    if (finished || locked) return;
    if (timeLeft <= 0) {
      handleConfirm(true);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, locked, finished]);

  const advance = React.useCallback(() => {
    if (index + 1 >= total) {
      setFinished(true);
      toast({
        title: "Quiz complete!",
        description: "Your reward is on the way.",
        variant: "success",
      });
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setLocked(false);
      setTimeLeft(QUESTION_TIME);
    }
  }, [index, total, toast]);

  const handleConfirm = (timedOut = false) => {
    if (locked) {
      advance();
      return;
    }
    if (selected === null && !timedOut) return;
    setLocked(true);
    if (!timedOut && selected === question.correct) {
      setScore((s) => s + 1);
    }
  };

  const percentage = Math.round((score / total) * 100);
  const xpGained = score * 25;

  /* ---------------- Completion screen ---------------- */
  if (finished) {
    return (
      <div className="mx-auto max-w-2xl py-6">
        <CompletionScreen
          score={score}
          total={total}
          percentage={percentage}
          xpGained={xpGained}
        />
      </div>
    );
  }

  /* ---------------- Quiz flow ---------------- */
  const warning = timeLeft <= 10;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Top area */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <BookOpen className="size-3.5" />
              Quiz
            </p>
            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              {BOOK_TITLE}
            </h1>
          </div>

          <CircularProgress
            value={(timeLeft / QUESTION_TIME) * 100}
            size={64}
            strokeWidth={6}
            className={cn(warning && "text-destructive")}
          >
            <div
              className={cn(
                "flex flex-col items-center leading-none",
                warning ? "text-destructive" : "text-foreground",
              )}
            >
              <span className="text-base font-semibold tabular-nums">
                {timeLeft}
              </span>
              <span className="text-[9px] text-muted-foreground">sec</span>
            </div>
          </CircularProgress>
        </div>

        {/* Segmented progress */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Question {index + 1} of {total}
          </span>
          <Badge variant={warning ? "destructive" : "outline"} className="gap-1">
            <Clock className="size-3" />
            {warning ? "Time running out" : "30 seconds each"}
          </Badge>
        </div>
        <div className="mt-2 flex gap-1.5">
          {quizQuestions.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]"
            >
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{
                  width: i < index ? "100%" : i === index ? "100%" : "0%",
                  opacity: i <= index ? 1 : 0.3,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="relative overflow-x-clip">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.28, 0.11, 0.32, 1] }}
          >
            <Card className="overflow-hidden">
              <CardContent className="space-y-5 p-6">
                <h2 className="text-lg font-semibold leading-snug">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, i) => {
                    const chosen = selected === i;
                    const correct = question.correct === i;
                    const showCorrect = locked && correct;
                    const showWrong = locked && chosen && !correct;

                    return (
                      <motion.button
                        key={i}
                        disabled={locked}
                        onClick={() => setSelected(i)}
                        animate={
                          showWrong
                            ? { x: [0, -8, 8, -6, 6, 0] }
                            : showCorrect
                              ? { scale: [1, 1.02, 1] }
                              : {}
                        }
                        transition={{ duration: 0.4 }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-all",
                          "disabled:cursor-default",
                          showCorrect &&
                            "border-success bg-success/10 shadow-[0_0_0_3px_hsl(var(--success)/0.12)]",
                          showWrong && "border-destructive bg-destructive/10",
                          !locked &&
                            chosen &&
                            "border-primary bg-foreground/[0.03] shadow-sm",
                          !locked &&
                            !chosen &&
                            "border-border bg-card hover:border-foreground/25 hover:bg-muted/50",
                          locked &&
                            !showCorrect &&
                            !showWrong &&
                            "border-border opacity-60",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                            showCorrect &&
                              "border-success bg-success text-white",
                            showWrong &&
                              "border-destructive bg-destructive text-white",
                            !locked &&
                              chosen &&
                              "border-primary bg-primary text-primary-foreground",
                            !locked &&
                              !chosen &&
                              "border-border text-muted-foreground",
                            locked &&
                              !showCorrect &&
                              !showWrong &&
                              "border-border text-muted-foreground",
                          )}
                        >
                          {showCorrect ? (
                            <Check className="size-4" />
                          ) : showWrong ? (
                            <X className="size-4" />
                          ) : (
                            String.fromCharCode(65 + i)
                          )}
                        </span>
                        <span className="flex-1">{option}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback banner */}
                <AnimatePresence>
                  {locked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                        isCorrect
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive",
                      )}
                    >
                      {isCorrect ? (
                        <>
                          <Check className="size-4" />
                          Correct! +25 XP
                        </>
                      ) : (
                        <>
                          <X className="size-4" />
                          {selected === null
                            ? "Time's up — the correct answer is highlighted."
                            : "Not quite — the correct answer is highlighted."}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Score: <span className="font-semibold text-foreground">{score}</span>
            /{total}
          </div>

          {!locked ? (
            <Button
              onClick={() => handleConfirm()}
              disabled={selected === null}
              className="min-w-32"
            >
              Confirm
            </Button>
          ) : (
            <Button onClick={advance} className="min-w-32">
              {index + 1 >= total ? "See results" : "Next question"}
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Completion                                                          */
/* ------------------------------------------------------------------ */

function CompletionScreen({
  score,
  total,
  percentage,
  xpGained,
}: {
  score: number;
  total: number;
  percentage: number;
  xpGained: number;
}) {
  const passed = percentage >= 50;
  const earned = +(REWARD * (score / total)).toFixed(3);


  return (
    <Card className="relative overflow-hidden">


      <CardContent className="relative z-10 flex flex-col items-center gap-5 p-8 text-center">
        {passed ? (
          <SuccessMark size={64} />
        ) : (
          <span className="flex size-16 items-center justify-center rounded-full bg-foreground/[0.06] text-muted-foreground">
            <RotateCcw className="size-7" strokeWidth={1.5} />
          </span>
        )}

        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">
            {passed ? "Quiz passed" : "Quiz complete"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {passed
              ? "Your reward has been credited."
              : "Review the book and try again for a larger reward."}
          </p>
        </div>

        <CircularProgress value={percentage} size={150} strokeWidth={12}>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-semibold tracking-tight">
              {percentage}%
            </span>
            <span className="text-xs text-muted-foreground">
              {score}/{total} correct
            </span>
          </div>
        </CircularProgress>

        <div className="grid w-full grid-cols-3 gap-3">
          <SummaryStat
            icon={<Check className="size-4 text-muted-foreground" />}
            label="Correct"
            value={`${score}/${total}`}
          />
          <SummaryStat
            icon={<Coins className="size-4 text-muted-foreground" />}
            label="SOL earned"
            value={formatToken(earned)}
          />
          <SummaryStat
            icon={<Zap className="size-4 text-muted-foreground" />}
            label="XP gained"
            value={`+${xpGained}`}
          />
        </div>

        {/* Board progress */}
        <div className="w-full rounded-xl bg-foreground/[0.03] p-4 text-left">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-medium">Board progress</span>
            <span className="font-semibold tabular">
              +{Math.round((score / total) * 4)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.07]">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "68%" }}
              animate={{ width: `${68 + Math.round((score / total) * 4)}%` }}
              transition={{ duration: 1, ease: [0.28, 0.11, 0.32, 1] }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Four more points unlock the Sage board.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Link
            href="/reading"
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            Back to library
          </Link>
          <Link
            href="/rewards"
            className={cn(buttonVariants(), "flex-1")}
          >
            View rewards
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-foreground/[0.03] p-3">
      {icon}
      <span className="text-sm font-semibold tabular-nums">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
