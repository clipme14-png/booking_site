import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-primary text-primary-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden>
        <circle cx="12" cy="11" r="5.75" stroke="currentColor" strokeWidth="2.1" />
        <path d="M12.6 14.9 16.4 19" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  href = "/",
  showText = true,
  inverted = false,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
  /** Render in white, for use on dark panels. */
  inverted?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="Quantum Invest home"
      className={cn(
        "inline-flex items-center gap-2 rounded-md transition-opacity hover:opacity-80",
        className,
      )}
    >
      <LogoMark className={inverted ? "bg-white text-black" : undefined} />
      {showText && (
        <span
          className={cn(
            "text-[15px] font-semibold tracking-tight",
            inverted ? "text-white" : "text-foreground",
          )}
        >
          Quantum Invest
        </span>
      )}
    </Link>
  );
}
