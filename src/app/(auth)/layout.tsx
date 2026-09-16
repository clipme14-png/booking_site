import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const highlights = [
  { title: "A considered library", text: "Finance, markets, business and the mind." },
  { title: "Paid in SOL", text: "For every book you finish and quiz you pass." },
  { title: "Six boards", text: "Each one raises what you earn." },
  { title: "Non-custodial", text: "Your keys and your rewards stay with you." },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Brand panel */}
      <aside className="relative hidden w-[44%] max-w-[640px] flex-col bg-[#000] p-12 text-white lg:flex xl:p-16">
        <Logo href="/" inverted />

        <div className="flex flex-1 flex-col justify-center">
          <h2 className="max-w-[12ch] text-[48px] font-semibold leading-[1.05] tracking-[-0.035em] xl:text-[56px]">
            Read well. Get paid for it.
          </h2>
          <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-white/55">
            24,800 readers earn SOL for the books they finish on Quantum Invest.
          </p>

          <dl className="mt-14 max-w-md divide-y divide-white/10 border-y border-white/10">
            {highlights.map((h) => (
              <div key={h.title} className="py-4">
                <dt className="text-[15px] font-medium">{h.title}</dt>
                <dd className="mt-0.5 text-[13px] text-white/50">{h.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex gap-10 text-white">
          <div>
            <p className="text-[28px] font-semibold tracking-tight tabular">512K</p>
            <p className="text-xs text-white/45">SOL paid to readers</p>
          </div>
          <div>
            <p className="text-[28px] font-semibold tracking-tight tabular">1.2M</p>
            <p className="text-xs text-white/45">Books completed</p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="-ml-1 size-4" />
            Home
          </Link>
          <div className="lg:hidden">
            <Logo href="/" showText={false} />
          </div>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-6">
          <div className="w-full max-w-[380px]">{children}</div>
        </div>
        <p className="flex justify-center gap-4 pb-6 text-xs text-muted-foreground">
          <span>© 2026 Quantum Invest</span>
          <Link href="#" className="hover:text-foreground">Privacy</Link>
          <Link href="#" className="hover:text-foreground">Terms</Link>
        </p>
      </div>
    </div>
  );
}
