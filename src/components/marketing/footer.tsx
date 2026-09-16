import Link from "next/link";
import { Logo } from "@/components/logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Plans", href: "/#plans" },
      { label: "Library", href: "/reading" },
      { label: "Treasury", href: "/treasury" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Roadmap", href: "/#roadmap" },
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Journal", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Questions", href: "/#faq" },
      { label: "Contact", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "X", href: "#" },
      { label: "Discord", href: "#" },
      { label: "Telegram", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="bg-background text-xs text-muted-foreground">
      <div className="mx-auto max-w-[1080px] px-5 pb-10 pt-12">
        <p className="max-w-[60rem] border-b border-border pb-6 leading-relaxed">
          Rewards are paid in SOL and vary with plan, quiz performance and pool size.
          Digital assets are volatile and their value can fall as well as rise.
          Nothing on this site is investment advice.
        </p>

        <div className="grid grid-cols-2 gap-8 py-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-foreground hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Logo className="[&>span:last-child]:text-[13px]" />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>Copyright © 2026 Quantum Invest. All rights reserved.</span>
            <span className="hidden h-3 w-px bg-border sm:block" />
            {["Privacy", "Terms", "Security", "Cookies"].map((l) => (
              <Link key={l} href="#" className="hover:text-foreground hover:underline">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
