import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Users,
  Gift,
  Wallet,
  ArrowDownToLine,
  Landmark,
  Receipt,
  Bell,
  User,
  CreditCard,
  Brain,
  ShieldCheck,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const appNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Reading Center", href: "/reading", icon: BookOpen },
      { label: "Quizzes", href: "/quiz", icon: Brain },
      { label: "Board Progress", href: "/boards", icon: Trophy },
    ],
  },
  {
    title: "Earn",
    items: [
      { label: "Rewards", href: "/rewards", icon: Gift, badge: "1.84" },
      { label: "Referrals", href: "/referrals", icon: Users },
      { label: "Plans", href: "/plans", icon: CreditCard },
      { label: "Treasury", href: "/treasury", icon: Landmark },
    ],
  },
  {
    title: "Wallet",
    items: [
      { label: "Wallet", href: "/wallet", icon: Wallet },
      { label: "Withdraw", href: "/withdraw", icon: ArrowDownToLine },
      { label: "Transactions", href: "/transactions", icon: Receipt },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Notifications", href: "/notifications", icon: Bell, badge: "3" },
      { label: "Profile", href: "/profile", icon: User },
      { label: "Admin", href: "/admin", icon: ShieldCheck },
    ],
  },
];

export const marketingNav = [
  { label: "Overview", href: "/#features" },
  { label: "How it works", href: "/#how" },
  { label: "Plans", href: "/#plans" },
  { label: "Roadmap", href: "/#roadmap" },
  { label: "Questions", href: "/#faq" },
];
