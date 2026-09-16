"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Users,
  Trophy,
  Megaphone,
  Wallet,
  ShieldAlert,
  Bell,
  BellOff,
  MoreHorizontal,
  Check,
  CheckCheck,
  Trash2,
  SlidersHorizontal,
  Circle,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/reveal";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { useToast } from "@/components/ui/toast";
import { cn, timeAgo } from "@/lib/utils";
import { notifications as seedNotifications, type Notification } from "@/lib/mock-data";

type Category = Notification["category"];

const categoryMeta: Record<
  Category,
  { label: string; icon: React.ReactNode; wrap: string }
> = {
  reward: { label: "Rewards", icon: <Gift />, wrap: "bg-foreground/[0.05] text-foreground" },
  referral: { label: "Referrals", icon: <Users />, wrap: "bg-foreground/[0.05] text-foreground" },
  board: { label: "Board", icon: <Trophy />, wrap: "bg-foreground/[0.05] text-foreground" },
  announcement: { label: "Announcements", icon: <Megaphone />, wrap: "bg-foreground/[0.05] text-foreground" },
  wallet: { label: "Wallet", icon: <Wallet />, wrap: "bg-foreground/[0.05] text-foreground" },
  security: { label: "Security", icon: <ShieldAlert />, wrap: "bg-destructive/12 text-destructive" },
};

const filters: { value: "all" | Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "reward", label: "Rewards" },
  { value: "referral", label: "Referrals" },
  { value: "board", label: "Board" },
  { value: "announcement", label: "Announcements" },
  { value: "wallet", label: "Wallet" },
  { value: "security", label: "Security" },
];

function NotificationRow({
  n,
  onToggleRead,
  onDelete,
}: {
  n: Notification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const meta = categoryMeta[n.category];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.18 } }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex gap-3.5 rounded-xl border border-border p-4 transition-colors sm:gap-4",
        n.read
          ? "bg-card hover:bg-muted/40"
          : "border-border bg-card hover:bg-muted/40",
      )}
    >
      {!n.read && (
        <span className="absolute left-1.5 top-1/2 size-2 -translate-y-1/2 rounded-full bg-secondary sm:left-2" aria-label="Unread" />
      )}
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5",
          meta.wrap,
        )}
      >
        {meta.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {n.title}
              </p>
              {!n.read && (
                <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <span className="hidden whitespace-nowrap text-xs text-muted-foreground sm:block">
              {timeAgo(n.minutesAgo)}
            </span>
            <Dropdown
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label="Options">
                  <MoreHorizontal />
                </Button>
              }
            >
              <DropdownItem onClick={() => onToggleRead(n.id)}>
                {n.read ? <Circle /> : <Check />}
                {n.read ? "Mark as unread" : "Mark as read"}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem destructive onClick={() => onDelete(n.id)}>
                <Trash2 />
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 sm:hidden">
          <Badge variant="outline">{meta.label}</Badge>
          <span className="text-xs text-muted-foreground">{timeAgo(n.minutesAgo)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<Notification[]>(seedNotifications);
  const [active, setActive] = React.useState<"all" | Category>("all");

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    if (unread === 0) {
      toast({ title: "You're all caught up", description: "No unread notifications." });
      return;
    }
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: "All caught up",
      description: `${unread} notification${unread === 1 ? "" : "s"} marked as read.`,
      variant: "success",
    });
  };

  const toggleRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  const remove = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast({ title: "Notification removed" });
  };

  const filtered = items.filter((n) => active === "all" || n.category === active);
  const today = filtered.filter((n) => n.minutesAgo < 1440);
  const earlier = filtered.filter((n) => n.minutesAgo >= 1440);

  const countFor = (value: "all" | Category) =>
    value === "all"
      ? items.filter((n) => !n.read).length
      : items.filter((n) => n.category === value && !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={
          unread > 0
            ? `You have ${unread} unread notification${unread === 1 ? "" : "s"}.`
            : "You're all caught up."
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck />
              <span className="hidden sm:inline">Mark all as read</span>
              <span className="sm:hidden">Read all</span>
            </Button>
            <Dropdown
              trigger={
                <Button variant="outline" size="icon-sm" aria-label="Notification settings">
                  <SlidersHorizontal />
                </Button>
              }
            >
              <DropdownItem onClick={() => toast({ title: "Notification preferences opened" })}>
                <SlidersHorizontal />
                Preferences
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  toast({ title: "Notifications muted", description: "Paused for 8 hours.", variant: "warning" })
                }
              >
                <BellOff />
                Mute for 8 hours
              </DropdownItem>
            </Dropdown>
          </>
        }
      />

      {/* Filter pills */}
      <div className="mb-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((f) => {
          const isActive = active === f.value;
          const c = countFor(f.value);
          return (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                isActive
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
              )}
            >
              {f.label}
              {c > 0 && (
                <span
                  className={cn(
                    "inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                    isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-foreground/[0.06] text-foreground",
                  )}
                >
                  {c}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Reveal>
          <EmptyState
            icon={<Bell />}
            title="Nothing here yet"
            description={
              active === "all"
                ? "You have no notifications. When something happens, it'll show up here."
                : `No ${categoryMeta[active as Category]?.label.toLowerCase()} notifications right now.`
            }
            action={
              active !== "all" ? (
                <Button variant="outline" size="sm" onClick={() => setActive("all")}>
                  View all notifications
                </Button>
              ) : undefined
            }
          />
        </Reveal>
      ) : (
        <div className="space-y-8">
          {today.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">Today</h2>
                <Badge variant="outline">{today.length}</Badge>
              </div>
              <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {today.map((n) => (
                    <NotificationRow key={n.id} n={n} onToggleRead={toggleRead} onDelete={remove} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {earlier.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">Earlier</h2>
                <Badge variant="outline">{earlier.length}</Badge>
              </div>
              <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {earlier.map((n) => (
                    <NotificationRow key={n.id} n={n} onToggleRead={toggleRead} onDelete={remove} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
