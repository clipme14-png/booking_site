"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Coins,
  Brain,
  Users,
  Trophy,
  ShieldCheck,
  Wallet,
  Zap,
  ChevronDown,
  Check,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { plans } from "@/lib/mock-data";

/* ============================== Section wrapper ============================ */
function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
          {eyebrow}
        </Badge>
      </Reveal>
      <Reveal delay={1}>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={2}>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ============================== Features ================================== */
const features = [
  { icon: BookOpen, title: "Curated library", desc: "Thousands of vetted books across finance, crypto, business and growth — updated weekly.", accent: "text-primary bg-primary/10" },
  { icon: Coins, title: "Earn real SOL", desc: "Every completed book and quiz pays out in SOL, straight to your non-custodial wallet.", accent: "text-secondary bg-secondary/10" },
  { icon: Brain, title: "Knowledge quizzes", desc: "Prove you learned it. Timed quizzes unlock bonus multipliers on your rewards.", accent: "text-accent bg-accent/10" },
  { icon: Trophy, title: "Gamified boards", desc: "Climb six progression boards, each unlocking bigger rewards and exclusive NFT badges.", accent: "text-primary bg-primary/10" },
  { icon: Users, title: "Referral engine", desc: "Earn up to 18% across three referral levels when friends learn and earn with you.", accent: "text-secondary bg-secondary/10" },
  { icon: ShieldCheck, title: "Transparent treasury", desc: "On-chain reward pools you can verify. No hidden math, no custody of your funds.", accent: "text-accent bg-accent/10" },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title={<>Everything you need to <span className="text-gradient">learn and earn</span></>}
          description="A premium reading experience with real financial upside, engineered on Solana for instant, low-cost rewards."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i % 3}>
              <Card className="card-hover group h-full p-6">
                <div className={`flex size-12 items-center justify-center rounded-xl ${f.accent} transition-transform group-hover:scale-110`}>
                  <f.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== How it works ============================== */
const steps = [
  { icon: Wallet, title: "Connect your wallet", desc: "Link Phantom, Solflare or Backpack in one click. Non-custodial from day one." },
  { icon: BookOpen, title: "Read & learn", desc: "Pick books from your daily allowance and read in a distraction-free interface." },
  { icon: Brain, title: "Pass the quiz", desc: "Complete a short quiz to prove mastery and unlock reward multipliers." },
  { icon: Coins, title: "Claim your SOL", desc: "Rewards accrue instantly. Claim and withdraw to your wallet anytime." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/40 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={<>Start earning in <span className="text-gradient">four steps</span></>}
          description="From wallet to rewards in minutes. No prior crypto experience required."
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i}>
              <div className="relative h-full">
                <Card className="card-hover h-full p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-brand-gradient text-white">
                      <s.icon className="size-6" />
                    </div>
                    <span className="text-4xl font-bold text-muted/60">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </Card>
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== Plans preview ============================= */
export function PlansPreview() {
  return (
    <section id="plans" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Plans"
          title={<>Choose your <span className="text-gradient">earning tier</span></>}
          description="Higher tiers unlock more daily reading, bigger reward pools and richer referral rates."
        />
        <div className="mt-16 grid gap-5 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i}>
              <Card
                className={`card-hover relative flex h-full flex-col p-6 ${
                  plan.popular ? "border-primary/50 shadow-glow" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="solid" className="gap-1">
                      <Zap className="size-3" /> Most popular
                    </Badge>
                  </div>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {plan.priceSol === 0 ? "Free" : `${plan.priceSol}`}
                  </span>
                  {plan.priceSol > 0 && (
                    <span className="text-sm text-muted-foreground">SOL/mo</span>
                  )}
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/plans" className="mt-6">
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    {plan.priceSol === 0 ? "Get started" : "Subscribe"}
                  </Button>
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== Roadmap ================================== */
const roadmap = [
  { quarter: "Q1 2026", title: "Foundation", status: "done", items: ["Mainnet launch", "Core reading & quizzes", "Wallet integration"] },
  { quarter: "Q2 2026", title: "Growth", status: "done", items: ["Referral engine v2", "Board progression", "Mobile app beta"] },
  { quarter: "Q3 2026", title: "Expansion", status: "active", items: ["Governance token", "Creator publishing", "Audiobook rewards"] },
  { quarter: "Q4 2026", title: "Ecosystem", status: "upcoming", items: ["DAO treasury", "NFT marketplace", "Cross-chain rewards"] },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Roadmap"
          title={<>The road to <span className="text-gradient">a learning economy</span></>}
          description="We're building the largest decentralized learn-to-earn ecosystem. Here's where we're headed."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((r, i) => (
            <Reveal key={r.quarter} delay={i}>
              <Card
                className={`h-full p-6 ${
                  r.status === "active" ? "border-primary/50 bg-primary/[0.03]" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {r.quarter}
                  </span>
                  <Badge
                    variant={
                      r.status === "done"
                        ? "success"
                        : r.status === "active"
                          ? "default"
                          : "outline"
                    }
                  >
                    {r.status === "done" ? "Shipped" : r.status === "active" ? "In progress" : "Planned"}
                  </Badge>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{r.title}</h3>
                <ul className="mt-4 space-y-2">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span
                        className={`size-1.5 rounded-full ${
                          r.status === "done" ? "bg-accent" : r.status === "active" ? "bg-primary" : "bg-muted-foreground/40"
                        }`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== Testimonials ============================= */
const testimonials = [
  { name: "Sarah Chen", handle: "@sarahlearns", text: "I've earned 142 SOL just by reading books I already wanted to read. Quantum Invest turned my commute into income.", board: "Luminary" },
  { name: "Marcus Kim", handle: "@marcusreads", text: "The quiz system actually makes me retain what I read. And getting paid for it? Genuinely life-changing.", board: "Luminary" },
  { name: "Priya Patel", handle: "@priyap", text: "As a student, the referral rewards alone cover my rent. The UX feels like a fintech app, not crypto.", board: "Sage" },
  { name: "Diego Lopez", handle: "@degenreader", text: "Transparent treasury, instant Solana payouts, beautiful design. This is how learn-to-earn should work.", board: "Sage" },
  { name: "Amara Okafor", handle: "@amarareads", text: "I was skeptical of 'read to earn' but Quantum Invest is the real deal. 60+ books and 30 SOL in three months.", board: "Adept" },
  { name: "Tom Weber", handle: "@tomhodls", text: "The board progression keeps me coming back daily. It's the most addictive productive habit I've built.", board: "Scholar" },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title={<>Loved by <span className="text-gradient">24,000+ learners</span></>}
          description="Real people turning their reading habit into real rewards."
        />
        <div className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.handle} delay={i % 3}>
              <Card className="card-hover mb-5 break-inside-avoid p-6">
                <p className="text-sm leading-relaxed text-foreground">
                  “{t.text}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.handle}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {t.board}
                  </Badge>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== FAQ ===================================== */
const faqs = [
  { q: "How do I actually earn SOL?", a: "You earn by completing books and passing their quizzes. Each book has a fixed SOL reward, boosted by quiz performance, streaks and your subscription tier. Rewards accrue in real time and can be claimed to your wallet anytime." },
  { q: "Is Quantum Invest custodial? Do you hold my funds?", a: "No. Quantum Invest is fully non-custodial. You connect your own Solana wallet (Phantom, Solflare, Backpack) and rewards are sent directly to it. We never take custody of your keys or funds." },
  { q: "What does the free Starter plan include?", a: "The Starter plan is free forever and includes 2 books per day, access to Board 1, basic quizzes and 5% referral rewards. It's the perfect way to try Quantum Invest with zero commitment." },
  { q: "How does the referral program work?", a: "You get a unique referral link. When someone joins and starts earning, you receive a percentage of platform rewards across three referral levels — up to 18% on the Sage plan." },
  { q: "Where do the rewards come from?", a: "Rewards are funded by subscription revenue and the platform treasury, which is fully transparent and viewable on our Treasury page. Daily and weekly pools are distributed to active learners." },
  { q: "How fast are withdrawals?", a: "Because Quantum Invest runs on Solana, withdrawals settle in seconds with negligible fees. Withdrawals are available weekly with a low minimum threshold." },
];

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about learning and earning on Quantum Invest."
        />
        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={Math.min(i, 3)}>
              <Card className="overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== Final CTA ================================ */
export function FinalCTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-10 text-center text-white sm:p-16">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute -left-10 -top-10 size-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 size-72 rounded-full bg-black/10 blur-3xl" />
            <div className="relative z-10">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-5xl">
                Your next book could pay you back.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">
                Join thousands earning SOL for the knowledge they gain. Start
                free — no card, no custody, no catch.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/register">
                  <Button size="xl" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    Create free account
                    <ArrowRight />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="xl" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                    Explore dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
