import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

// San Francisco is used on Apple devices via the system stack.
// Inter is the fallback everywhere else.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quantum Invest · Read. Learn. Earn.",
    template: "%s · Quantum Invest",
  },
  description:
    "Quantum Invest pays you in SOL for the books you finish and the quizzes you pass. Non-custodial, built on Solana.",
  keywords: ["Solana", "Web3", "Learn to Earn", "Crypto", "Reading", "Rewards"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} min-h-screen font-sans`}
      >
        <ThemeProvider>
          <WalletContextProvider>
            <ToastProvider>{children}</ToastProvider>
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
