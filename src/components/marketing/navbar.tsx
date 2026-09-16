"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { marketingNav } from "@/config/nav";
import { cn } from "@/lib/utils";

const ease = [0.28, 0.11, 0.32, 1] as const;

export function MarketingNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        open
          ? "border-b border-border bg-canvas"
          : scrolled
          ? "glass border-b border-border"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-13 max-w-[1080px] items-center justify-between px-5">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] text-foreground/75 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-3 text-[13px] text-foreground/75 transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link href="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative flex size-9 items-center justify-center rounded-full"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={cn(
                "absolute h-[1.5px] w-[17px] rounded-full bg-foreground transition-transform duration-300",
                open ? "rotate-45" : "-translate-y-[3.5px]",
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-[17px] rounded-full bg-foreground transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-[3.5px]",
              )}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-[calc(100dvh-3.25rem)] overflow-y-auto bg-canvas md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col px-9 pt-6">
              {marketingNav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.4, ease }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-[28px] font-semibold tracking-tight"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-8 flex flex-col gap-3 border-t border-border pt-8"
              >
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button size="lg" className="w-full">
                    Get started
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button size="lg" variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
