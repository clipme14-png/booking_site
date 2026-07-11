"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function NetworkErrorPage() {
  return (
    <StatusPage
      icon={WifiOff}
      title="Connection lost"
      description="We couldn't reach the Quantum Invest servers. Check your internet connection and try again — your progress is safe."
      accent="warning"
      actions={
        <>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => window.location.reload()}
          >
            <RefreshCw />
            Retry
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Home />
              Back to home
            </Button>
          </Link>
        </>
      }
    />
  );
}
