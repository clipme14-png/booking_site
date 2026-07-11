"use client";

import Link from "next/link";
import { Compass, Home, LayoutDashboard } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StatusPage
      icon={Compass}
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist, may have moved, or the link is broken. Let's get you back on track."
      accent="primary"
      actions={
        <>
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home />
              Back to home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <LayoutDashboard />
              Go to dashboard
            </Button>
          </Link>
        </>
      }
    />
  );
}
