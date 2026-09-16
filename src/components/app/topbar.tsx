"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Settings, LogOut, User as UserIcon, PanelLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletButton } from "@/components/wallet-button";
import { Avatar } from "@/components/ui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import { appNav } from "@/config/nav";
import { currentUser } from "@/lib/mock-data";

function useSectionTitle() {
  const pathname = usePathname();
  for (const group of appNav) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item.label;
      }
    }
  }
  return "";
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const title = useSectionTitle();
  return (
    <header className="glass sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border px-4 lg:px-8">
      <button
        onClick={onMenu}
        className="-ml-1 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <PanelLeft className="size-[18px] stroke-[1.75]" />
      </button>

      <p className="truncate text-[13px] font-semibold lg:hidden">{title}</p>

      <label className="relative hidden w-full max-w-xs items-center md:flex lg:max-w-sm">
        <Search className="pointer-events-none absolute left-3 size-3.5 stroke-[2] text-muted-foreground" />
        <input
          type="search"
          placeholder="Search"
          aria-label="Search books and transactions"
          className="h-8 w-full rounded-lg bg-foreground/[0.05] pl-8 pr-3 text-[13px] outline-none transition-[background-color,box-shadow] placeholder:text-muted-foreground focus:bg-card focus:ring-4 focus:ring-ring/15"
        />
      </label>

      <div className="ml-auto flex items-center gap-1">
        <div className="mr-1 hidden sm:block">
          <WalletButton size="sm" variant="outline" />
        </div>
        <ThemeToggle />
        <Link
          href="/notifications"
          className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          aria-label="Notifications, 3 unread"
        >
          <Bell className="size-[17px] stroke-[1.75]" />
          <span className="absolute right-2 top-2 size-[7px] rounded-full bg-destructive ring-2 ring-background" />
        </Link>

        <Dropdown
          trigger={
            <button className="ml-1 rounded-full transition-opacity hover:opacity-85" aria-label="Account menu">
              <Avatar name={currentUser.name} size="sm" />
            </button>
          }
        >
          <div className="flex items-center gap-3 px-2.5 py-2">
            <Avatar name={currentUser.name} />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold">{currentUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
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
