"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${next} appearance`}
      title={`Switch to ${next} appearance`}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground",
        className,
      )}
    >
      <Sun
        className="absolute size-[17px] stroke-[1.75] transition-all duration-300 dark:scale-75 dark:opacity-0"
      />
      <Moon
        className="absolute size-[17px] scale-75 stroke-[1.75] opacity-0 transition-all duration-300 dark:scale-100 dark:opacity-100"
      />
    </button>
  );
}
