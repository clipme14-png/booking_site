# Quantum Invest — Learn-to-Earn on Solana

A complete frontend for a **learn-to-earn** platform on Solana. Read books, pass quizzes and earn SOL, in an interface that feels like a considered consumer product rather than a crypto dApp.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, **Lucide**, and the **Solana wallet adapter**. Full light/dark mode, fully responsive.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Configure the Solana RPC in `.env.local` (see `.env.example`).

## Payments

Paid plans can be bought with **Paystack** (card, bank, transfer, USSD) or with **SOL or USDC** sent to your Solana wallet. Copy `.env.example` to `.env.local` and fill in the billing section. A method whose settings are missing is shown as unavailable in the checkout.

**Paystack.** The server creates the transaction and sends the customer to Paystack's hosted page. When they return to `/billing/return`, and again when Paystack calls the webhook, the server re-verifies the transaction with Paystack and checks the amount and currency before activating the plan. In the Paystack dashboard, set the webhook URL to `<APP_URL>/api/billing/paystack/webhook`.

**Crypto.** Each order gets a unique amount, the price plus a tiny offset, and a Solana Pay reference key. The customer can pay in any of three ways:

- scan the QR code or open the link in Phantom, Solflare or another Solana Pay wallet;
- press "Pay with wallet" in the app;
- copy the address and send the exact amount by hand, including from an exchange.

The server finds the payment by its reference or, for manual transfers, by the exact amount. It accepts a payment only if the transaction succeeded, reached `MERCHANT_WALLET`, and hasn't already paid another order. Open checkouts poll for the payment. To credit customers who close the page, call the sweep endpoint every minute or two:

```bash
curl -X POST -H "Authorization: Bearer $BILLING_CRON_SECRET" https://your-app/api/billing/crypto/sweep
```

**Storage.** Orders and subscriptions are stored in a JSON file, which suits a single long-running server. Before deploying to serverless hosting or several instances, replace the functions in `src/lib/billing/store.ts` with database calls.

**Code.** Server logic lives in `src/lib/billing/`, the API routes in `src/app/api/billing/`, and the checkout in `src/components/billing/checkout-dialog.tsx`.

## Design system

A restrained, Apple-inspired system: near-monochrome surfaces, one blue for links, focus and data, and colour only where it carries meaning.

- **Tokens** live in `src/app/globals.css` (`:root` + `.dark`), mapped to Tailwind via `@theme inline`.
- **Colour.** `primary` is ink (#1d1d1f, white in dark mode). `secondary` is the link and data blue. `accent` and `success` are green, used for positive values. Chart series read from `--violet`, `--blue` and `--green`, which hold HSL channels.
- **Type.** San Francisco on Apple devices through the system stack, Inter elsewhere. Headlines are semibold with tight tracking. The reader uses the system serif (New York).
- **Surfaces.** Cards are white on a #f5f5f7 ground with hairline borders. `surface-ink` gives a dark, Apple Card-like panel that stays dark in both themes. `glass` is the translucent toolbar material.
- **Motion.** One easing curve (`--ease-apple`), short fades, no bounce. `prefers-reduced-motion` is respected.
- **Legacy names.** `bg-brand-gradient` now renders solid ink, and `text-gradient` and `grid-pattern` are no-ops, so older markup keeps compiling.
- Dark mode is class-based (`<html class="dark">`), toggled by `ThemeProvider` with no flash of the wrong theme.

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
