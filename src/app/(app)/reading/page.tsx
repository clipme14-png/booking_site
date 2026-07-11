"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Clock,
  Coins,
  BookOpen,
  Target,
  CheckCircle2,
  ArrowRight,
  Flame,
  Sparkles,
} from "lucide-react";
import { books, bookCategories, dashboardStats, type Book } from "@/lib/mock-data";
import { cn, formatToken } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { Reveal } from "@/components/reveal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress, CircularProgress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";

/* ------------------------------------------------------------------ */
/* Local BookCard                                                      */
/* ------------------------------------------------------------------ */

function BookCover({
  cover,
  className,
  children,
}: {
  cover: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden rounded-xl",
        className,
      )}
      style={{ backgroundImage: cover }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/10" />
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/15 blur-2xl" />
      {children}
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const started = book.progress > 0 && !book.completed;
  const label = book.completed ? "Completed" : started ? "Continue" : "Read";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden card-hover">
        <BookCover cover={book.cover} className="h-40 p-3">
          <div className="absolute left-3 top-3">
            <Badge variant="solid" className="shadow-sm backdrop-blur">
              <Coins className="size-3" />
              {formatToken(book.reward)}
            </Badge>
          </div>
          {book.completed && (
            <div className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-success text-white shadow-sm">
              <CheckCircle2 className="size-4" />
            </div>
          )}
          <div className="relative z-10 flex items-center gap-1 rounded-md bg-black/30 px-2 py-1 text-xs font-medium text-white backdrop-blur">
            <Star className="size-3 fill-warning text-warning" />
            {book.rating.toFixed(1)}
          </div>
        </BookCover>

        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold leading-tight">
                {book.title}
              </h3>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {book.author}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{book.category}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {book.minutes} min read
            </span>
          </div>

          {book.progress > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{book.completed ? "Finished" : "Progress"}</span>
                <span className="font-medium text-foreground">
                  {book.progress}%
                </span>
              </div>
              <Progress
                value={book.progress}
                className="h-1.5"
                indicatorClassName={book.completed ? "bg-success" : undefined}
              />
            </div>
          )}

          <div className="mt-auto pt-1">
            {book.completed ? (
              <Button
                variant="subtle"
                size="sm"
                className="w-full"
                disabled
              >
                <CheckCircle2 className="size-4" />
                Completed
              </Button>
            ) : (
              <Link
                href={`/reading/${book.id}`}
                className={cn(
                  buttonVariants({
                    variant: started ? "default" : "outline",
                    size: "sm",
                  }),
                  "w-full",
                )}
              >
                {label}
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ReadingPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");

  const continueReading = books.filter((b) => b.progress > 0 && b.progress < 100);
  const completedBooks = books.filter((b) => b.completed);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchesCat = category === "All" || b.category === category;
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  const goalPct = Math.round(
    (dashboardStats.booksReadToday / dashboardStats.dailyGoal) * 100,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reading Center"
        description="Read, learn, and earn rewards"
        actions={
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Target className="size-3.5" />
            </span>
            <span className="text-sm font-medium">
              {dashboardStats.booksReadToday}
              <span className="text-muted-foreground">
                /{dashboardStats.dailyGoal}
              </span>{" "}
              today
            </span>
          </div>
        }
      />

      {/* Continue reading strip */}
      {continueReading.length > 0 && (
        <Reveal>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                <h2 className="text-lg font-semibold tracking-tight">
                  Continue reading
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {continueReading.length} in progress
              </span>
            </div>

            <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
              {continueReading.map((book) => (
                <motion.div
                  key={book.id}
                  whileHover={{ y: -3 }}
                  className="w-[300px] shrink-0 snap-start sm:w-[340px]"
                >
                  <Card className="overflow-hidden card-hover">
                    <div className="flex gap-4 p-4">
                      <BookCover
                        cover={book.cover}
                        className="h-32 w-24 shrink-0"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Badge variant="solid" className="w-fit">
                          <Coins className="size-3" />
                          {formatToken(book.reward)}
                        </Badge>
                        <h3 className="mt-2 truncate text-sm font-semibold">
                          {book.title}
                        </h3>
                        <p className="truncate text-xs text-muted-foreground">
                          {book.author}
                        </p>
                        <div className="mt-auto space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">
                              {book.progress}% read
                            </span>
                            <span className="text-muted-foreground">
                              {Math.round(
                                book.minutes * (1 - book.progress / 100),
                              )}{" "}
                              min left
                            </span>
                          </div>
                          <Progress value={book.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-border p-3">
                      <Link
                        href={`/reading/${book.id}`}
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "w-full",
                        )}
                      >
                        Continue
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Search + category filter */}
      <Reveal delay={1}>
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Explore library
            </h2>
            <div className="w-full sm:max-w-xs">
              <Input
                icon={<Search />}
                placeholder="Search books, authors…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search books"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {bookCategories.map((cat) => {
              const active = cat === category;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                    active
                      ? "border-transparent bg-brand-gradient text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* Grid */}
      <Reveal delay={2}>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search className="size-6" />}
            title="No books found"
            description="Try a different search term or category filter."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </Reveal>

      {/* Completed + Daily goal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              <h2 className="text-lg font-semibold tracking-tight">
                Completed books
              </h2>
              <Badge variant="success">{completedBooks.length}</Badge>
            </div>

            {completedBooks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {completedBooks.map((book) => (
                  <Card
                    key={book.id}
                    className="flex items-center gap-4 p-4 card-hover"
                  >
                    <BookCover
                      cover={book.cover}
                      className="h-20 w-16 shrink-0"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-8 items-center justify-center rounded-full bg-success/90 text-white shadow-sm">
                          <CheckCircle2 className="size-5" />
                        </div>
                      </div>
                    </BookCover>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">
                        {book.title}
                      </h3>
                      <p className="truncate text-xs text-muted-foreground">
                        {book.author}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge variant="success" className="gap-1">
                          <Coins className="size-3" />
                          {formatToken(book.reward)} earned
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="size-3 fill-warning text-warning" />
                          {book.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="size-6" />}
                title="No completed books yet"
                description="Finish a book and pass its quiz to see it here."
              />
            )}
          </section>
        </Reveal>

        {/* Daily reading goal */}
        <Reveal delay={1}>
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brand-gradient opacity-10 blur-3xl" />
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex w-full items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                  <Sparkles className="size-4 text-primary" />
                  Daily reading goal
                </span>
                <Badge variant="warning" className="gap-1">
                  <Flame className="size-3" />
                  {dashboardStats.streak}d streak
                </Badge>
              </div>

              <CircularProgress value={goalPct} size={140} strokeWidth={12}>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold tracking-tight">
                    {dashboardStats.booksReadToday}
                    <span className="text-base text-muted-foreground">
                      /{dashboardStats.dailyGoal}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    books today
                  </span>
                </div>
              </CircularProgress>

              <p className="text-sm text-muted-foreground">
                {dashboardStats.booksRemaining} more to hit today&apos;s goal and
                keep your streak alive.
              </p>

              <div className="grid w-full grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-left">
                  <p className="text-xs text-muted-foreground">Goal progress</p>
                  <p className="text-lg font-semibold">{goalPct}%</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-left">
                  <p className="text-xs text-muted-foreground">Est. reward</p>
                  <p className="text-lg font-semibold text-primary">
                    {formatToken(0.12)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
