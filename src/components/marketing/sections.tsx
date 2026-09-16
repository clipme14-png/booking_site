"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Coins,
  Wallet,
  Check,
  ChevronRight,
  Plus,
  KeyRound,
  Landmark,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { plans, books, boards } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ease = [0.28, 0.11, 0.32, 1] as const;

/* ============================== Shared ==================================== */
function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[1080px] px-5", className)}>
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "max-w-[42rem]",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow && (
        <Reveal>
          <p className="text-[17px] font-semibold text-muted-foreground">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={1}>
        <h2 className="mt-2 text-balance text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[56px]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={2}>
          <p className="mt-5 text-pretty text-[19px] leading-[1.5] text-muted-foreground">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

function Tile({
  className,
  children,
  dark,
}: {
  className?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[24px] p-7 sm:rounded-[28px] sm:p-10",
        dark
          ? "bg-[#000] text-white dark:border dark:border-border dark:bg-card"
          : "bg-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TileText({
  label,
  title,
  body,
  dark,
}: {
  label: string;
  title: string;
  body: string;
  dark?: boolean;
}) {
  return (
    <div>
      <p className={cn("text-[13px] font-semibold", dark ? "text-white/55" : "text-muted-foreground")}>
        {label}
      </p>
      <h3 className="mt-2 text-balance text-[26px] font-semibold leading-[1.15] tracking-[-0.022em] sm:text-[28px]">
        {title}
      </h3>
      <p className={cn("mt-3 max-w-[34ch] text-[15px] leading-relaxed", dark ? "text-white/60" : "text-muted-foreground")}>
        {body}
      </p>
    </div>
  );
}

/* ============================== Features ================================== */
export function Features() {
  const shelf = books.slice(0, 6);
  return (
    <section id="features" className="scroll-mt-16 bg-background py-28 sm:py-36">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="Why Quantum Invest"
          title="Built for people who finish what they start."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* Library */}
          <Reveal className="lg:col-span-2">
            <Tile>
              <TileText
                label="Library"
                title="A library worth your time."
                body="Thousands of vetted titles across finance, markets, business and the mind. New books every week."
              />
              <div className="mt-10 flex items-end gap-3 sm:gap-4">
                {shelf.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ y: 24, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.05 * i, ease }}
                    className={cn(
                      "relative flex aspect-[2/3] flex-1 flex-col justify-between overflow-hidden rounded-[4px] p-2 text-white shadow-[0_12px_24px_-12px_rgb(0_0_0/0.45),inset_-3px_0_0_rgb(255_255_255/0.07)] sm:p-3",
                      i > 3 && "hidden sm:flex",
                    )}
                    style={{ backgroundImage: b.cover }}
                  >
                    <span className="line-clamp-4 hyphens-auto break-words text-[9px] font-semibold leading-tight sm:text-[11px]">
                      {b.title}
                    </span>
                    <span className="truncate text-[8px] text-white/55 sm:text-[9px]">{b.author}</span>
                  </motion.div>
                ))}
              </div>
            </Tile>
          </Reveal>

          {/* Paid */}
          <Reveal delay={1}>
            <Tile>
              <TileText
                label="Rewards"
                title="Paid in SOL."
                body="Every finished book and passed quiz pays out, straight to the wallet you control."
              />
              <div className="mt-auto pt-10">
                <p className="text-[56px] font-semibold leading-none tracking-[-0.04em] tabular">
                  +0.25
                </p>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  SOL for <span className="text-foreground">Thinking, Fast and Slow</span>
                </p>
              </div>
            </Tile>
          </Reveal>

          {/* Quizzes */}
          <Reveal>
            <Tile>
              <TileText
                label="Quizzes"
                title="Prove you read it."
                body="Short, timed quizzes confirm what you learned and raise your reward multiplier."
              />
              <ul className="mt-auto space-y-2 pt-10 text-[13px]">
                {["Loss aversion", "Anchoring", "Survivorship bias"].map((o, i) => (
                  <li
                    key={o}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3.5 py-2.5",
                      i === 0
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {o}
                    {i === 0 && <Check className="size-4" strokeWidth={2.25} />}
                  </li>
                ))}
              </ul>
            </Tile>
          </Reveal>

          {/* Boards */}
          <Reveal delay={1}>
            <Tile>
              <TileText
                label="Progression"
                title="Six boards to climb."
                body="Each board raises your reward rate. The last two carry governance rights."
              />
              <ol className="mt-auto space-y-2.5 pt-10">
                {boards.map((b) => (
                  <li key={b.level} className="flex items-center gap-3 text-[13px]">
                    <span className="w-20 shrink-0 text-muted-foreground">{b.name}</span>
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]">
                      <motion.span
                        className={cn(
                          "block h-full rounded-full",
                          b.status === "locked" ? "bg-foreground/15" : "bg-foreground",
                        )}
                        initial={{ width: 0 }}
                        whileInView={{
                          width: b.status === "completed" ? "100%" : b.status === "current" ? "68%" : "0%",
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: b.level * 0.06, ease }}
                      />
                    </span>
                  </li>
                ))}
              </ol>
            </Tile>
          </Reveal>

          {/* Referrals */}
          <Reveal delay={2}>
            <Tile>
              <TileText
                label="Referrals"
                title="Three levels deep."
                body="Earn a share of platform rewards when the people you invite read and earn."
              />
              <div className="mt-auto flex items-end justify-between pt-10">
                {[
                  { rate: "5%", plan: "Starter" },
                  { rate: "12%", plan: "Scholar" },
                  { rate: "18%", plan: "Sage" },
                ].map((r) => (
                  <div key={r.plan}>
                    <p className="text-[34px] font-semibold leading-none tracking-[-0.03em] tabular">{r.rate}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">{r.plan}</p>
                  </div>
                ))}
              </div>
            </Tile>
          </Reveal>

          {/* Custody */}
          <Reveal className="lg:col-span-3">
            <Tile dark className="lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <TileText
                dark
                label="Security"
                title="Your keys. Your rewards."
                body="Quantum Invest never holds your funds. Rewards go straight to your wallet, and every treasury pool can be verified on-chain."
              />
              <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-0 lg:w-[26rem] lg:shrink-0">
                {[
                  { icon: KeyRound, title: "Non-custodial", body: "Phantom, Solflare and Backpack." },
                  { icon: Landmark, title: "Open treasury", body: "Every pool, visible on-chain." },
                ].map((f) => (
                  <div key={f.title} className="rounded-2xl bg-white/[0.07] p-5">
                    <f.icon className="size-5 stroke-[1.5] text-white/70" />
                    <p className="mt-6 text-[15px] font-semibold">{f.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-white/55">{f.body}</p>
                  </div>
                ))}
              </div>
            </Tile>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ============================== How it works ============================== */
const steps = [
  { icon: Wallet, title: "Connect a wallet", desc: "Link Phantom, Solflare or Backpack. Your keys never leave your device." },
  { icon: BookOpen, title: "Read", desc: "Choose from your daily allowance and read in a quiet, focused reader." },
  { icon: Brain, title: "Pass the quiz", desc: "A few questions confirm what you learned and set your multiplier." },
  { icon: Coins, title: "Claim", desc: "Rewards accrue as you go. Claim to your wallet whenever you like." },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 bg-canvas py-28 sm:py-36">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Four steps. A few minutes."
          description="No prior crypto experience needed."
        />
        <ol className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i} as="li">
              <div className="border-t border-foreground pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-muted-foreground tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <s.icon className="size-5 stroke-[1.5] text-muted-foreground" />
                </div>
                <h3 className="mt-8 text-[21px] font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ============================== Plans ===================================== */
export function PlansPreview() {
  return (
    <section id="plans" className="scroll-mt-16 bg-background py-28 sm:py-36">
      <Container className="max-w-[1180px]">
        <SectionHeading
          eyebrow="Plans"
          title="Every plan pays."
          description="Higher tiers read more each day, draw from larger pools and earn more per referral."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => {
            const featured = !!plan.popular;
            return (
              <Reveal key={plan.id} delay={i}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-[28px] p-7",
                    featured
                      ? "bg-[#000] text-white dark:border dark:border-white/20 dark:bg-card"
                      : "bg-card",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[21px] font-semibold tracking-tight">{plan.name}</h3>
                    {featured && (
                      <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className={cn("mt-1 min-h-9 text-[13px] leading-snug", featured ? "text-white/60" : "text-muted-foreground")}>
                    {plan.tagline}
                  </p>

                  <div className="mt-8">
                    <p className="text-[40px] font-semibold leading-none tracking-[-0.03em] tabular">
                      {plan.priceSol === 0 ? "Free" : plan.priceSol}
                      {plan.priceSol > 0 && (
                        <span className={cn("ml-1.5 text-[15px] font-medium tracking-normal", featured ? "text-white/60" : "text-muted-foreground")}>
                          SOL / mo
                        </span>
                      )}
                    </p>
                    <p className={cn("mt-2 text-xs tabular", featured ? "text-white/50" : "text-muted-foreground")}>
                      {plan.priceUsd === 0 ? "Forever" : `About $${plan.priceUsd.toLocaleString("en-US")} per month`}
                    </p>
                  </div>

                  <div className={cn("my-7 h-px", featured ? "bg-white/15" : "bg-border")} />

                  <ul className="flex-1 space-y-3">
                    {plan.features.slice(0, 6).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug">
                        <Check
                          className={cn("mt-px size-4 shrink-0", featured ? "text-white/70" : "text-muted-foreground")}
                          strokeWidth={2}
                        />
                        <span className={featured ? "text-white/85" : "text-foreground/85"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.priceSol === 0 ? "/register" : "/plans"} className="mt-8">
                    <Button
                      variant={featured ? "default" : "outline"}
                      className={cn(
                        "w-full",
                        featured &&
                          "bg-white text-black hover:bg-white/85 dark:bg-white dark:text-black",
                      )}
                    >
                      {plan.priceSol === 0 ? "Start free" : `Choose ${plan.name}`}
                    </Button>
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Prices in SOL. Dollar amounts are estimates and move with the market.
        </p>
      </Container>
    </section>
  );
}

/* ============================== Roadmap =================================== */
const roadmap = [
  { quarter: "Q1 2026", title: "Foundation", status: "done", items: ["Mainnet launch", "Reading and quizzes", "Wallet integration"] },
  { quarter: "Q2 2026", title: "Growth", status: "done", items: ["Referrals v2", "Board progression", "Mobile beta"] },
  { quarter: "Q3 2026", title: "Expansion", status: "active", items: ["Governance token", "Creator publishing", "Audiobook rewards"] },
  { quarter: "Q4 2026", title: "Ecosystem", status: "upcoming", items: ["DAO treasury", "NFT marketplace", "Cross-chain rewards"] },
] as const;

const statusLabel = { done: "Shipped", active: "In progress", upcoming: "Planned" } as const;

export function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-16 bg-canvas py-28 sm:py-36">
      <Container>
        <SectionHeading
          eyebrow="Roadmap"
          title="Where we are going."
          description="Two quarters shipped. Two to go this year."
        />
        <ol className="relative mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Rail */}
          <div aria-hidden className="absolute inset-x-0 top-[5px] hidden h-px bg-border lg:block" />
          <motion.div
            aria-hidden
            className="absolute left-0 top-[5px] hidden h-px bg-foreground lg:block"
            initial={{ width: 0 }}
            whileInView={{ width: "62%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease }}
          />
          {roadmap.map((r, i) => (
            <Reveal key={r.quarter} delay={i} as="li">
              <div className="relative">
                <span
                  className={cn(
                    "relative z-10 block size-[11px] rounded-full border-2",
                    r.status === "done" && "border-foreground bg-foreground",
                    r.status === "active" && "border-foreground bg-canvas",
                    r.status === "upcoming" && "border-foreground/20 bg-canvas",
                  )}
                />
                <div className="mt-6 flex items-baseline justify-between gap-3">
                  <p className="text-[13px] font-medium text-muted-foreground tabular">{r.quarter}</p>
                  <p
                    className={cn(
                      "text-xs",
                      r.status === "active" ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {statusLabel[r.status]}
                  </p>
                </div>
                <h3 className="mt-1 text-[21px] font-semibold tracking-tight">{r.title}</h3>
                <ul className="mt-4 space-y-2">
                  {r.items.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "text-[15px]",
                        r.status === "upcoming" ? "text-muted-foreground" : "text-foreground/85",
                      )}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ============================== Testimonials ============================== */
const testimonials = [
  { name: "Sarah Chen", handle: "@sarahlearns", text: "I've earned 142 SOL reading books I already wanted to read. My commute became income.", board: "Luminary" },
  { name: "Marcus Kim", handle: "@marcusreads", text: "The quizzes make me retain what I read. Being paid for it is the bonus.", board: "Luminary" },
  { name: "Priya Patel", handle: "@priyap", text: "As a student, referral rewards cover my rent. It feels like a finance app, not a crypto project.", board: "Sage" },
  { name: "Diego Lopez", handle: "@degenreader", text: "Transparent treasury, instant payouts, careful design. This is how it should work.", board: "Sage" },
  { name: "Amara Okafor", handle: "@amarareads", text: "I was sceptical. Three months in: sixty books and 30 SOL.", board: "Adept" },
  { name: "Tom Weber", handle: "@tomhodls", text: "Board progression keeps me coming back. It's the most useful habit I've built.", board: "Scholar" },
];

export function Testimonials() {
  const [featured, ...rest] = testimonials;
  return (
    <section className="overflow-hidden bg-background py-28 sm:py-36">
      <Container>
        <Reveal>
          <figure className="mx-auto max-w-[52rem] text-center">
            <blockquote className="text-balance text-[28px] font-semibold leading-[1.25] tracking-[-0.022em] sm:text-[40px]">
              &ldquo;{featured.text}&rdquo;
            </blockquote>
            <figcaption className="mt-8 text-[15px]">
              <span className="font-semibold">{featured.name}</span>
              <span className="text-muted-foreground"> · {featured.board} board</span>
            </figcaption>
          </figure>
        </Reveal>
      </Container>

      <div className="no-scrollbar mt-20 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 lg:scroll-px-[max(1.25rem,calc((100vw_-_1080px)/2_+_1.25rem))] lg:px-[max(1.25rem,calc((100vw_-_1080px)/2_+_1.25rem))]">
        {rest.map((t, i) => (
          <Reveal key={t.handle} delay={i} className="snap-start">
            <figure className="flex h-full w-[300px] flex-col justify-between rounded-[22px] bg-card p-7 sm:w-[340px]">
              <blockquote className="text-[17px] leading-[1.45]">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-8 flex items-center justify-between text-[13px]">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-muted-foreground">{t.handle}</p>
                </div>
                <span className="text-muted-foreground">{t.board}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================== FAQ ======================================= */
const faqs = [
  { q: "How do I earn SOL?", a: "Finish a book and pass its quiz. Each book carries a fixed SOL reward, adjusted by your quiz score, streak and plan. Rewards accrue in real time and can be claimed to your wallet at any point." },
  { q: "Do you hold my funds?", a: "No. Quantum Invest is non-custodial. You connect your own Solana wallet, such as Phantom, Solflare or Backpack, and rewards are sent to it directly. We never have access to your keys." },
  { q: "What does the free plan include?", a: "Starter is free and stays free. It includes two books a day, access to the first board, standard quizzes and a 5% referral rate." },
  { q: "How do referrals work?", a: "You receive a personal link. When someone joins through it and starts earning, you receive a share of platform rewards across three levels. The rate depends on your plan and reaches 18% on Sage." },
  { q: "Where do rewards come from?", a: "Subscription revenue and the platform treasury fund the reward pools. The treasury is public and can be inspected on the Treasury page and on-chain." },
  { q: "How fast are withdrawals?", a: "Withdrawals settle on Solana within seconds and cost a fraction of a cent. They open weekly, with a low minimum." },
];

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-16 bg-canvas py-28 sm:py-36">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading align="left" eyebrow="Questions" title="Answers, plainly." />
          <Reveal delay={2}>
            <p className="mt-6 text-[15px] text-muted-foreground">
              Something else?{" "}
              <a href="mailto:support@quantuminvest.io" className="text-secondary hover:underline">
                Contact support
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal delay={1}>
          <dl className="border-t border-border">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.q} className="border-b border-border">
                  <dt>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-[19px] font-semibold tracking-tight">{faq.q}</span>
                      <Plus
                        className={cn(
                          "size-5 shrink-0 stroke-[1.5] text-muted-foreground transition-transform duration-300",
                          isOpen && "rotate-45",
                        )}
                      />
                    </button>
                  </dt>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.dd
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[40rem] pb-7 text-[17px] leading-[1.55] text-muted-foreground">
                          {faq.a}
                        </p>
                      </motion.dd>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}

/* ============================== Final CTA ================================= */
export function FinalCTA() {
  return (
    <section className="bg-[#000] py-32 text-white sm:py-44 dark:border-t dark:border-border dark:bg-[#0a0a0b]">
      <Container className="text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[16ch] text-balance text-[44px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[72px]">
            Your next book could pay you back.
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mt-6 max-w-md text-[19px] leading-relaxed text-white/60">
            Start on the free plan. No card, no custody.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-7">
            <Link href="/register">
              <Button size="xl" className="bg-white text-black hover:bg-white/85 dark:bg-white dark:text-black">
                Create your account
              </Button>
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex items-center text-[17px] text-[#2997ff] hover:underline"
            >
              Explore the dashboard
              <ChevronRight className="ml-0.5 size-4 stroke-[2] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
