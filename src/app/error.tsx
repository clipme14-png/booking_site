"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this would report to an error-tracking service.
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      icon={AlertTriangle}
      title="Something went wrong"
      description="An unexpected error occurred while loading this page. Our team has been notified — you can try again or head back home."
      accent="destructive"
      actions={
        <>
          <Button size="lg" className="w-full sm:w-auto" onClick={() => reset()}>
            <RotateCcw />
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Home />
              Back to home
            </Button>
          </Link>
        </>
      }
    >
      {error.digest && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Error reference</span>
          <code className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-[11px] text-foreground/70">
            {error.digest}
          </code>
        </div>
      )}
    </StatusPage>
  );
}
