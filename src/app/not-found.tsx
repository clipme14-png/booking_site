"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StatusPage
      icon={Compass}
      code="404"
      title="This page can't be found."
      description="The link may be broken, or the page may have moved."
      actions={
        <>
          <Link href="/">
            <Button size="lg" className="w-full">
              Go to home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full">
              Open dashboard
            </Button>
          </Link>
        </>
      }
    />
  );
}
