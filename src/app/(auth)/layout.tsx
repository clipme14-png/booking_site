import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, Coins, ShieldCheck, TrendingUp } from "lucide-react";

const highlights = [
  { icon: BookOpen, text: "Read curated books across finance, crypto & growth" },
  { icon: Coins, text: "Earn SOL rewards for every book & quiz you complete" },
  { icon: TrendingUp, text: "Climb the boards and multiply your earning potential" },
  { icon: ShieldCheck, text: "Non-custodial. Your keys, your rewards, always" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-brand-gradient lg:flex lg:flex-col">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute -left-20 top-1/4 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-10 bottom-10 size-80 rounded-full bg-black/10 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col p-12 text-white">
          <Logo href="/" />
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="max-w-md text-4xl font-bold leading-tight">
              Turn knowledge into wealth on Solana.
            </h2>
            <p className="mt-4 max-w-md text-white/80">
              Join 24,000+ learners earning real rewards for reading. The more
              you learn, the more you earn.
            </p>
            <ul className="mt-10 space-y-4">
              {highlights.map((h) => (
                <li key={h.text} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                    <h.icon className="size-4.5" />
                  </span>
                  <span className="text-sm text-white/90">{h.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/70">
            <span>512K+ SOL distributed</span>
            <span>·</span>
            <span>24.8K learners</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between p-6">
          <div className="lg:hidden">
            <Logo href="/" />
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="pb-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
