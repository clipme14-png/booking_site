"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
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
      title="Something went wrong."
      description="This page didn't load as expected. Try again, or return home."
      accent="destructive"
      actions={
        <>
          <Button size="lg" onClick={() => reset()}>
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">
              Go to home
            </Button>
          </Link>
        </>
      }
    >
      {error.digest && (
        <p className="text-xs text-muted-foreground">
          Reference{" "}
          <code className="ml-1 rounded-md bg-foreground/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-foreground/70">
            {error.digest}
          </code>
        </p>
      )}
    </StatusPage>
  );
}
