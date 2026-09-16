import { BookOpen, LayoutGrid, Gift, Wallet, Trophy, ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { books, earningsSeries } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * A static, hand-built rendering of the dashboard for the landing page.
 * No screenshot: it inherits the live theme and stays sharp at any size.
 */
export function ProductWindow() {
  const reading = books.filter((b) => b.progress > 0 && b.progress < 100).slice(0, 3);
  const series = earningsSeries;
  const max = Math.max(...series);
  const w = 100;
  const h = 40;
  const pts = series.map((v, i) => [(i / (series.length - 1)) * w, h - (v / max) * (h - 4) - 2]);
  const line = pts
    .map((p, i) => {
      if (i === 0) return `M ${p[0]},${p[1]}`;
      const prev = pts[i - 1];
      const cx = (prev[0] + p[0]) / 2;
      return `C ${cx},${prev[1]} ${cx},${p[1]} ${p[0]},${p[1]}`;
    })
    .join(" ");

  return (
    <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-[0_40px_80px_-32px_rgb(0_0_0/0.22),0_0_0_0.5px_rgb(0_0_0/0.04)] sm:rounded-[28px]">
      {/* Title bar */}
      <div className="flex h-10 items-center gap-2 border-b border-border px-4">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="mx-auto hidden rounded-md bg-foreground/[0.05] px-16 py-1 text-[11px] text-muted-foreground sm:block">
          app.quantuminvest.io
        </span>
        <span className="w-10 sm:w-[46px]" />
      </div>

      <div className="flex text-left">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 border-r border-border bg-sidebar p-3 md:block">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <LogoMark className="size-5 rounded-[6px] [&_svg]:size-3.5" />
            <span className="text-[13px] font-semibold">Quantum Invest</span>
          </div>
          <ul className="mt-4 space-y-0.5 text-[13px]">
            {[
              { icon: LayoutGrid, label: "Dashboard", active: true },
              { icon: BookOpen, label: "Library" },
              { icon: Trophy, label: "Boards" },
              { icon: Gift, label: "Rewards" },
              { icon: Wallet, label: "Wallet" },
            ].map((item) => (
              <li
                key={item.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-1.5",
                  item.active ? "bg-foreground/[0.07] font-medium" : "text-muted-foreground",
                )}
              >
                <item.icon className="size-4 stroke-[1.75]" />
                {item.label}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 p-5 sm:p-8">
          <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">Overview</p>
          <p className="mt-0.5 text-lg font-semibold tracking-tight sm:text-[22px]">Good morning, Alex</p>

          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-5 sm:gap-4">
            {/* Balance */}
            <div className="rounded-2xl border border-border p-4 sm:col-span-3 sm:p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total earned</p>
                  <p className="mt-1 text-[28px] font-semibold leading-none tracking-tight tabular sm:text-[34px]">
                    38.42 <span className="text-base font-medium text-muted-foreground">SOL</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
                  <ArrowUpRight className="size-3.5" />
                  12.5%
                </span>
              </div>
              <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-5 h-20 w-full overflow-visible sm:h-24">
                <defs>
                  <linearGradient id="pw-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--violet) / 0.14)" />
                    <stop offset="100%" stopColor="hsl(var(--violet) / 0)" />
                  </linearGradient>
                </defs>
                <path d={`${line} L ${w},${h} L 0,${h} Z`} fill="url(#pw-fill)" />
                <path d={line} fill="none" stroke="hsl(var(--violet))" strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            {/* Claimable */}
            <div className="flex flex-col justify-between rounded-2xl bg-primary p-4 text-primary-foreground sm:col-span-2 sm:p-5">
              <div>
                <p className="text-xs opacity-60">Ready to claim</p>
                <p className="mt-1 text-[28px] font-semibold leading-none tracking-tight tabular sm:text-[34px]">
                  1.84 <span className="text-base font-medium opacity-60">SOL</span>
                </p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-[11px] opacity-60">
                  <span>Scholar board</span>
                  <span className="tabular">68%</span>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-primary-foreground/15">
                  <div className="h-full w-[68%] rounded-full bg-primary-foreground" />
                </div>
                <div className="mt-4 inline-flex h-8 items-center rounded-full bg-primary-foreground px-4 text-xs font-medium text-primary">
                  Claim rewards
                </div>
              </div>
            </div>
          </div>

          {/* Reading list */}
          <div className="mt-3 rounded-2xl border border-border sm:mt-4">
            <div className="flex items-center justify-between px-4 pt-4 sm:px-5">
              <p className="text-[13px] font-semibold">Continue reading</p>
              <p className="text-xs text-secondary">See all</p>
            </div>
            <ul className="mt-2 divide-y divide-border">
              {reading.map((b) => (
                <li key={b.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <span
                    className="h-10 w-7 shrink-0 rounded-[3px] shadow-[inset_-2px_0_0_rgb(255_255_255/0.08)]"
                    style={{ backgroundImage: b.cover }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{b.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{b.author}</p>
                  </div>
                  <div className="hidden w-32 items-center gap-2 sm:flex">
                    <div className="h-1 flex-1 rounded-full bg-foreground/[0.08]">
                      <div className="h-full rounded-full bg-foreground" style={{ width: `${b.progress}%` }} />
                    </div>
                    <span className="w-8 text-right text-[11px] text-muted-foreground tabular">{b.progress}%</span>
                  </div>
                  <span className="w-20 text-right text-xs font-medium tabular text-success">
                    +{b.reward.toFixed(2)} SOL
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
