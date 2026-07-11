# Quantum Invest — Learn-to-Earn on Solana

A complete, production-grade frontend for a premium Web3 **Learn-to-Earn** platform. Read books, pass quizzes, and earn SOL — with a UI that feels like a fintech product (Stripe / Linear / Coinbase), not a crypto dApp.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, **Lucide**, and the **Solana wallet adapter**. Full light/dark mode, fully responsive.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Configure the Solana RPC in `.env.local` (see `.env.example`).

## Design system

- **Tokens** live in `src/app/globals.css` (`:root` + `.dark`), mapped to Tailwind via `@theme inline`.
- Brand: purple (primary) · blue (secondary) · green (accent). Utilities: `bg-brand-gradient`, `text-gradient`, `glass`, `card-hover`.
- Dark mode is class-based (`<html class="dark">`), toggled by `ThemeProvider` with no flash-of-wrong-theme.

## Structure

```
src/
├─ app/
│  ├─ (marketing)/        # Landing page (hero, features, plans, roadmap, FAQ…)
│  ├─ (auth)/             # login, register, forgot-password, verify-email, two-factor, welcome
│  ├─ (app)/              # Dashboard app shell (sidebar + topbar)
│  │   dashboard, reading, reading/[bookId], quiz, plans, rewards,
│  │   withdraw, referrals, boards, treasury, transactions, wallet,
│  │   notifications, profile, admin
│  ├─ *-error, not-found, error   # Polished error & status pages
│  └─ layout.tsx          # Root: fonts, ThemeProvider, WalletProvider, ToastProvider
├─ components/
│  ├─ ui/                 # Reusable primitives (button, card, badge, input, dialog, tabs…)
│  ├─ charts/             # Custom SVG charts (area, bar, donut, sparkline)
│  ├─ app/                # App shell (sidebar, topbar, page-header)
│  └─ marketing/          # Landing sections
├─ lib/                   # utils + centralized mock data
└─ config/                # navigation config
```

## Notes

All data is mock/placeholder (`src/lib/mock-data.ts`) — the wallet adapter reads real balances when a wallet is connected, everything else is illustrative.
