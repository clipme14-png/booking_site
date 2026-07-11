"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { appNav } from "@/config/nav";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-2">
        {appNav.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-lg bg-primary/10"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <item.icon className="relative z-10 size-4.5 shrink-0" />
                      <span className="relative z-10 flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={active ? "default" : "outline"}
                          className="relative z-10 h-5 px-1.5 text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3">
        <div className="relative overflow-hidden rounded-xl bg-brand-gradient p-4 text-white">
          <div className="relative z-10">
            <Sparkles className="size-5" />
            <p className="mt-2 text-sm font-semibold">Upgrade to Sage</p>
            <p className="mt-0.5 text-xs text-white/80">
              Unlock unlimited reading & 18% referrals.
            </p>
            <Link
              href="/plans"
              className="mt-3 inline-flex rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur transition-colors hover:bg-white/30"
            >
              View plans
            </Link>
          </div>
          <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/10 blur-xl" />
        </div>
      </div>
    </div>
  );
}
