"use client";

import Link from "next/link";
import { Bell, Menu, Search, Settings, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletButton } from "@/components/wallet-button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import { currentUser } from "@/lib/mock-data";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border glass px-4 lg:px-6">
      <button
        onClick={onMenu}
        className="flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden max-w-sm flex-1 md:block">
        <Input
          icon={<Search />}
          placeholder="Search books, transactions…"
          className="h-10 bg-muted/50"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <div className="hidden sm:block">
          <WalletButton size="sm" />
        </div>
        <ThemeToggle />
        <Link
          href="/notifications"
          className="relative flex size-10 items-center justify-center rounded-lg border border-border bg-card/50 text-foreground transition-colors hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-4.5" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </Link>

        <Dropdown
          trigger={
            <button className="rounded-full transition-transform hover:scale-105">
              <Avatar name={currentUser.name} />
            </button>
          }
        >
          <div className="px-2.5 py-2">
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
          <DropdownSeparator />
          <Link href="/profile">
            <DropdownItem>
              <UserIcon /> Profile
            </DropdownItem>
          </Link>
          <Link href="/profile">
            <DropdownItem>
              <Settings /> Settings
            </DropdownItem>
          </Link>
          <DropdownSeparator />
          <Link href="/login">
            <DropdownItem destructive>
              <LogOut /> Sign out
            </DropdownItem>
          </Link>
        </Dropdown>
      </div>
    </header>
  );
}
