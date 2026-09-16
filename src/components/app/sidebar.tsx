"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { appNav } from "@/config/nav";
import { cn } from "@/lib/utils";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-14 items-center px-5">
        <Logo />
      </div>

      <nav aria-label="App" className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4 pt-3">
        {appNav.map((group) => (
          <div key={group.title} className="mb-6 last:mb-0">
            <p className="px-2.5 pb-1.5 text-[11px] font-semibold text-muted-foreground/80">
              {group.title}
            </p>
            <ul className="space-y-px">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors",
                        active
                          ? "bg-foreground/[0.07] font-medium text-foreground"
                          : "text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-4 shrink-0 stroke-[1.75]",
                          active ? "text-foreground" : "text-muted-foreground",
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[11px] text-muted-foreground tabular">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/plans"
          onClick={onNavigate}
          className="group block rounded-xl p-3 transition-colors hover:bg-foreground/[0.04]"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold">Scholar plan</p>
            <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </div>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            Move to Sage for unlimited reading and an 18% referral rate.
          </p>
        </Link>
      </div>
    </div>
  );
}
