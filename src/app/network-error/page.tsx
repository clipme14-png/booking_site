"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function NetworkErrorPage() {
  return (
    <StatusPage
      icon={WifiOff}
      title="You're offline."
      description="We couldn't reach Quantum Invest. Check your connection and try again. Your reading progress is saved."
      accent="warning"
      actions={
        <>
          <Button size="lg" onClick={() => window.location.reload()}>
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">
              Go to home
            </Button>
          </Link>
        </>
      }
    />
  );
}
