/**
 * Central placeholder data for the Quantum Invest learn-to-earn platform.
 * All values are static/mock — no real blockchain calls.
 */

export const currentUser = {
  name: "Alex Rivera",
  username: "alexreads",
  email: "alex.rivera@quantuminvest.io",
  avatar: "",
  wallet: "7Wm3xKq9vLpZ2nD4rT8cF1sJ6bH5aE0yU3iN9oQ2wXv",
  joined: "March 2025",
  verified: true,
  twoFactor: true,
  plan: "Scholar",
  board: 4,
  streak: 27,
};

export type Plan = {
  id: string;
  name: string;
  priceSol: number;
  priceUsd: number;
  tagline: string;
  dailyLimit: number;
  weeklyReward: string;
  boardAccess: string;
  referralRate: string;
  popular?: boolean;
  accent: "muted" | "primary" | "secondary" | "accent";
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceSol: 0,
    priceUsd: 0,
    tagline: "Dip your toes into learn-to-earn",
    dailyLimit: 2,
    weeklyReward: "0.05–0.2 SOL",
    boardAccess: "Board 1",
    referralRate: "5%",
    accent: "muted",
    features: [
      "2 books per day",
      "Access to Board 1",
      "Basic quizzes",
      "Community leaderboard",
      "5% referral rewards",
    ],
  },
  {
    id: "reader",
    name: "Reader",
    priceSol: 1.5,
    priceUsd: 240,
    tagline: "For consistent daily learners",
    dailyLimit: 5,
    weeklyReward: "0.4–1.2 SOL",
    boardAccess: "Boards 1–3",
    referralRate: "8%",
    accent: "secondary",
    features: [
      "5 books per day",
      "Access to Boards 1–3",
      "Timed quizzes + bonuses",
      "Priority reward pool",
      "8% referral rewards",
      "Reading analytics",
    ],
  },
  {
    id: "scholar",
    name: "Scholar",
    priceSol: 4,
    priceUsd: 640,
    tagline: "Maximize your earning potential",
    dailyLimit: 10,
    weeklyReward: "1.5–4 SOL",
    boardAccess: "Boards 1–6",
    referralRate: "12%",
    popular: true,
    accent: "primary",
    features: [
      "10 books per day",
      "Access to Boards 1–6",
      "Premium quiz multipliers",
      "Boosted reward pool share",
      "12% referral rewards",
      "Advanced analytics",
      "Early book access",
    ],
  },
  {
    id: "sage",
    name: "Sage",
    priceSol: 10,
    priceUsd: 1600,
    tagline: "The ultimate scholar experience",
    dailyLimit: 25,
    weeklyReward: "5–12 SOL",
    boardAccess: "All Boards",
    referralRate: "18%",
    accent: "accent",
    features: [
      "Unlimited daily reading",
      "Access to all Boards",
      "Max quiz multipliers",
      "Largest reward pool share",
      "18% referral rewards",
      "Dedicated support",
      "Governance voting rights",
      "Exclusive Sage NFT badge",
    ],
  },
];

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  minutes: number;
  progress: number;
  reward: number;
  cover: string;
  rating: number;
  completed?: boolean;
};

const covers = [
  "linear-gradient(160deg,#27324a 0%,#121826 100%)",
  "linear-gradient(160deg,#5b2a2c 0%,#2a1113 100%)",
  "linear-gradient(160deg,#2b4034 0%,#111c16 100%)",
  "linear-gradient(160deg,#48484c 0%,#1c1c1e 100%)",
  "linear-gradient(160deg,#6e5a3f 0%,#34291b 100%)",
  "linear-gradient(160deg,#34495c 0%,#161f29 100%)",
];

export const books: Book[] = [
  { id: "b1", title: "The Psychology of Money", author: "Morgan Housel", category: "Finance", minutes: 24, progress: 68, reward: 0.12, cover: covers[0], rating: 4.9 },
  { id: "b2", title: "Atomic Habits", author: "James Clear", category: "Self-Growth", minutes: 31, progress: 0, reward: 0.15, cover: covers[1], rating: 4.8 },
  { id: "b3", title: "The Bitcoin Standard", author: "Saifedean Ammous", category: "Crypto", minutes: 42, progress: 100, reward: 0.2, cover: covers[2], rating: 4.7, completed: true },
  { id: "b4", title: "Zero to One", author: "Peter Thiel", category: "Business", minutes: 28, progress: 0, reward: 0.14, cover: covers[3], rating: 4.6 },
  { id: "b5", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology", minutes: 55, progress: 22, reward: 0.25, cover: covers[4], rating: 4.8 },
  { id: "b6", title: "The Almanack of Naval", author: "Eric Jorgenson", category: "Wealth", minutes: 33, progress: 100, reward: 0.18, cover: covers[5], rating: 4.9, completed: true },
  { id: "b7", title: "Mastering Ethereum", author: "Andreas Antonopoulos", category: "Crypto", minutes: 48, progress: 0, reward: 0.22, cover: covers[1], rating: 4.7 },
  { id: "b8", title: "Deep Work", author: "Cal Newport", category: "Productivity", minutes: 36, progress: 45, reward: 0.16, cover: covers[0], rating: 4.6 },
];

export const bookCategories = [
  "All", "Finance", "Crypto", "Self-Growth", "Business", "Psychology", "Productivity", "Wealth",
];

export type Transaction = {
  id: string;
  type: "reward" | "withdrawal" | "deposit" | "subscription" | "referral";
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  minutesAgo: number;
  hash: string;
};

export const transactions: Transaction[] = [
  { id: "t1", type: "reward", description: "Quiz completion — The Bitcoin Standard", amount: 0.2, status: "completed", minutesAgo: 42, hash: "5xK…9aB" },
  { id: "t2", type: "referral", description: "Referral bonus — @cryptomia", amount: 0.48, status: "completed", minutesAgo: 180, hash: "3jQ…2wX" },
  { id: "t3", type: "reward", description: "Daily reading reward", amount: 0.12, status: "completed", minutesAgo: 300, hash: "8mN…4rT" },
  { id: "t4", type: "withdrawal", description: "Withdrawal to wallet", amount: -2.5, status: "pending", minutesAgo: 420, hash: "1sD…7gH" },
  { id: "t5", type: "subscription", description: "Scholar plan — monthly", amount: -4.0, status: "completed", minutesAgo: 2880, hash: "9oQ…2vX" },
  { id: "t6", type: "reward", description: "Weekly streak bonus", amount: 0.75, status: "completed", minutesAgo: 4320, hash: "6bH…5aE" },
  { id: "t7", type: "deposit", description: "Wallet deposit", amount: 5.0, status: "completed", minutesAgo: 7200, hash: "2wX…8cF" },
  { id: "t8", type: "referral", description: "Referral bonus — @degenreader", amount: 0.32, status: "failed", minutesAgo: 8600, hash: "4rT…1sJ" },
];

export const earningsSeries = [1.2, 1.8, 1.4, 2.6, 2.1, 3.2, 2.8, 3.9, 3.4, 4.6, 4.1, 5.2];
export const earningsLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const weeklyReading = [3, 5, 2, 6, 4, 7, 5];
export const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type BoardTier = {
  level: number;
  name: string;
  requirement: string;
  reward: string;
  status: "completed" | "current" | "locked";
  color: string;
};

export const boards: BoardTier[] = [
  { level: 1, name: "Novice", requirement: "Read 10 books", reward: "0.5 SOL", status: "completed", color: "#8e8e93" },
  { level: 2, name: "Apprentice", requirement: "Read 30 books", reward: "1.2 SOL", status: "completed", color: "#6f8f78" },
  { level: 3, name: "Adept", requirement: "Read 75 books", reward: "3 SOL", status: "completed", color: "#5b7fa6" },
  { level: 4, name: "Scholar", requirement: "Read 150 books", reward: "6 SOL + NFT", status: "current", color: "#2f6fde" },
  { level: 5, name: "Sage", requirement: "Read 300 books", reward: "15 SOL + NFT", status: "locked", color: "#8a74ad" },
  { level: 6, name: "Luminary", requirement: "Read 600 books", reward: "40 SOL + Governance", status: "locked", color: "#b8955a" },
];

export type LeaderboardEntry = {
  rank: number;
  name: string;
  handle: string;
  earnings: number;
  books: number;
  board: string;
  you?: boolean;
};

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah Chen", handle: "sarahlearns", earnings: 142.8, books: 512, board: "Luminary" },
  { rank: 2, name: "Marcus Kim", handle: "marcusreads", earnings: 128.4, books: 487, board: "Luminary" },
  { rank: 3, name: "Priya Patel", handle: "priyap", earnings: 98.2, books: 401, board: "Sage" },
  { rank: 4, name: "Diego Lopez", handle: "degenreader", earnings: 76.5, books: 342, board: "Sage" },
  { rank: 12, name: "Alex Rivera", handle: "alexreads", earnings: 34.7, books: 168, board: "Scholar", you: true },
];

export type Notification = {
  id: string;
  category: "reward" | "referral" | "board" | "announcement" | "wallet" | "security";
  title: string;
  body: string;
  minutesAgo: number;
  read: boolean;
};

export const notifications: Notification[] = [
  { id: "n1", category: "reward", title: "Reward claimed", body: "You earned 0.2 SOL for completing a quiz.", minutesAgo: 12, read: false },
  { id: "n2", category: "board", title: "Board progress", body: "You're 68% of the way to unlocking Sage.", minutesAgo: 90, read: false },
  { id: "n3", category: "referral", title: "New referral", body: "@cryptomia joined using your link. +0.48 SOL.", minutesAgo: 240, read: false },
  { id: "n4", category: "announcement", title: "New books added", body: "12 new titles are now available in Crypto.", minutesAgo: 720, read: true },
  { id: "n5", category: "security", title: "New login detected", body: "A new device signed in from San Francisco.", minutesAgo: 1440, read: true },
  { id: "n6", category: "wallet", title: "Withdrawal processing", body: "Your 2.5 SOL withdrawal is being processed.", minutesAgo: 420, read: true },
];

export type ActivityItem = {
  id: string;
  icon: string;
  text: string;
  minutesAgo: number;
  amount?: number;
};

export const activityFeed: ActivityItem[] = [
  { id: "a1", icon: "book", text: "Completed “The Bitcoin Standard”", minutesAgo: 42, amount: 0.2 },
  { id: "a2", icon: "quiz", text: "Passed quiz with 95% score", minutesAgo: 45 },
  { id: "a3", icon: "referral", text: "Earned referral bonus from @cryptomia", minutesAgo: 180, amount: 0.48 },
  { id: "a4", icon: "streak", text: "Extended reading streak to 27 days", minutesAgo: 300 },
  { id: "a5", icon: "reward", text: "Claimed daily reading reward", minutesAgo: 300, amount: 0.12 },
];

export const referralStats = {
  link: "https://quantuminvest.io/r/alexreads",
  code: "ALEXREADS",
  totalReferrals: 34,
  activeReferrals: 21,
  totalEarned: 18.6,
  conversionRate: 62,
  pending: 2.4,
  levels: [
    { level: 1, count: 21, rate: "12%", earned: 12.8 },
    { level: 2, count: 9, rate: "5%", earned: 4.2 },
    { level: 3, count: 4, rate: "2%", earned: 1.6 },
  ],
  referredUsers: [
    { name: "@cryptomia", joined: "2 days ago", earned: 0.48, status: "active" },
    { name: "@degenreader", joined: "1 week ago", earned: 0.32, status: "active" },
    { name: "@satoshigirl", joined: "2 weeks ago", earned: 0.9, status: "active" },
    { name: "@hodlqueen", joined: "3 weeks ago", earned: 0.0, status: "inactive" },
  ],
};

export const treasury = {
  totalTreasury: 84200,
  rewardPool: 21600,
  dailyPool: 480,
  weeklyPool: 3360,
  totalDistributed: 512400,
  activeUsers: 24810,
  distribution: [
    { label: "Reading Rewards", value: 45, color: "#2f6fde" },
    { label: "Referral Pool", value: 22, color: "#b8955a" },
    { label: "Board Rewards", value: 18, color: "#6f8f78" },
    { label: "Reserve", value: 15, color: "#8e8e93" },
  ],
  monthlyDistribution: [32, 38, 41, 45, 52, 48, 58, 61, 67, 72, 78, 84],
};

export const rewards = {
  claimable: 1.84,
  pending: 0.62,
  daily: 0.12,
  weekly: 0.84,
  totalEarned: 34.7,
  history: [
    { id: "r1", type: "Daily reading", amount: 0.12, date: "Today", status: "claimed" },
    { id: "r2", type: "Quiz bonus", amount: 0.2, date: "Today", status: "claimable" },
    { id: "r3", type: "Streak milestone", amount: 0.75, date: "Yesterday", status: "claimed" },
    { id: "r4", type: "Referral reward", amount: 0.48, date: "2 days ago", status: "claimed" },
    { id: "r5", type: "Weekly pool share", amount: 0.84, date: "3 days ago", status: "pending" },
  ],
};

export const dashboardStats = {
  walletBalance: 12.48,
  pendingRewards: 0.62,
  claimableRewards: 1.84,
  booksReadToday: 3,
  booksRemaining: 7,
  streak: 27,
  referralEarnings: 18.6,
  weeklyEarnings: 4.2,
  monthlyEarnings: 16.8,
  totalEarnings: 34.7,
  boardProgress: 68,
  dailyGoal: 10,
};

export const quizQuestions = [
  {
    id: "q1",
    question: "According to the book, what is the primary driver of long-term wealth?",
    options: [
      "Timing the market perfectly",
      "Consistent saving and compounding",
      "High-risk speculative bets",
      "Inheriting capital",
    ],
    correct: 1,
  },
  {
    id: "q2",
    question: "What behavioral trait does the author say matters most for investors?",
    options: ["Intelligence", "Access to information", "Patience", "Aggression"],
    correct: 2,
  },
  {
    id: "q3",
    question: "The concept of “enough” refers to:",
    options: [
      "Knowing when to stop taking risks",
      "Maximizing returns at all costs",
      "Never selling assets",
      "Only investing in bonds",
    ],
    correct: 0,
  },
  {
    id: "q4",
    question: "Compounding works best when combined with:",
    options: ["Frequent trading", "Time and patience", "Leverage", "Diversification alone"],
    correct: 1,
  },
];

export const adminMetrics = {
  revenue: 284600,
  revenueChange: 18.2,
  users: 24810,
  usersChange: 12.4,
  subscriptions: 8420,
  subscriptionsChange: 9.1,
  withdrawals: 142300,
  withdrawalsChange: -3.2,
  revenueSeries: [42, 48, 51, 58, 62, 71, 68, 79, 84, 92, 98, 112],
  userSeries: [1.2, 1.5, 1.9, 2.4, 3.1, 3.8, 4.6, 5.9, 7.2, 8.8, 10.4, 12.1],
  flagged: [
    { id: "f1", user: "@suspicious1", reason: "Rapid quiz completion", risk: "high" },
    { id: "f2", user: "@botreader", reason: "Referral farming pattern", risk: "high" },
    { id: "f3", user: "@fastclicks", reason: "Unusual reading speed", risk: "medium" },
  ],
};
