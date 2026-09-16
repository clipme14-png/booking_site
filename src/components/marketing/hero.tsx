"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/stat-card";
import { ProductWindow } from "@/components/marketing/product-window";

const ease = [0.28, 0.11, 0.32, 1] as const;

const stats = [
  { value: 512, suffix: "K", label: "SOL paid to readers" },
  { value: 24.8, suffix: "K", label: "Active readers", decimals: 1 },
  { value: 1.2, suffix: "M", label: "Books completed", decimals: 1 },
  { value: 99.9, suffix: "%", label: "Platform uptime", decimals: 1 },
];

export function Hero() {
  const visualRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section className="relative overflow-hidden bg-canvas pt-36 sm:pt-44">
      <div className="mx-auto max-w-[1080px] px-5 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease }}
          className="text-[15px] font-semibold text-warning sm:text-[17px]"
        >
          Season 4 rewards are live
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.05, ease }}
          className="mx-auto mt-3 max-w-[14ch] text-balance text-[48px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[80px]"
        >
          Knowledge that pays.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease }}
          className="mx-auto mt-6 max-w-[34rem] text-pretty text-[19px] leading-[1.45] text-muted-foreground sm:text-[21px]"
        >
          Finish a book. Pass a short quiz. Receive SOL in your own wallet.
          Quantum Invest turns a reading habit into a return.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-7"
        >
          <Link href="/register">
            <Button size="xl">Get started free</Button>
          </Link>
          <Link
            href="/#how"
            className="group inline-flex items-center text-[17px] text-secondary hover:underline"
          >
            See how it works
            <ChevronRight className="ml-0.5 size-4 stroke-[2] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-5 text-xs text-muted-foreground"
        >
          Free Starter plan. No card required. Non-custodial.
        </motion.p>
      </div>

      {/* Product */}
      <div ref={visualRef} className="mx-auto mt-20 max-w-[1120px] px-5 sm:mt-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
          style={{ scale, y }}
          className="origin-top"
        >
          <ProductWindow />
        </motion.div>
      </div>

      {/* Figures */}
      <div className="mx-auto max-w-[1080px] px-5 py-24 sm:py-32">
        <dl className="grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {stats.map((s) => (
            <div key={s.label} className="px-4 text-center">
              <dd className="text-[40px] font-semibold leading-none tracking-[-0.03em] sm:text-[48px]">
                <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </dd>
              <dt className="mt-3 text-[13px] text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
