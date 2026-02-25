import donationSnapshot from "@/data/donations.json";

// Cunning3D 捐款配置 - 支付链接和等级定义

function readPublicEnv(value: string | undefined) {
  return String(value || "").trim();
}

// 捐款者数据类型
export interface Donor {
  /** Unique id for dedupe (e.g. "kofi:<transaction_id>"). */
  id?: string;
  name: string;
  tier: string;
  amount: number;
  link?: string;
  logo?: string;
  date?: string;
  currency?: string;
  isSubscription?: boolean;
  platform?: "kofi" | "payoneer" | "github" | "crypto" | "other";
}

type DonationMetrics = {
  monthlyDollars: number;
  oneTimeDollars: number;
  members: number;
  sponsors: number;
};

type DonationSnapshot = {
  updatedAt?: string;
  metrics?: Partial<DonationMetrics>;
  donors?: Donor[];
};

function toNumber(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

const snapshot = donationSnapshot as unknown as DonationSnapshot;

export const donors: Donor[] = Array.isArray(snapshot.donors) ? snapshot.donors : [];

const metrics: DonationMetrics = {
  monthlyDollars: Math.max(0, toNumber(snapshot.metrics?.monthlyDollars)),
  oneTimeDollars: Math.max(0, toNumber(snapshot.metrics?.oneTimeDollars)),
  members: Math.max(0, toNumber(snapshot.metrics?.members)),
  sponsors: Math.max(0, toNumber(snapshot.metrics?.sponsors)),
};

export const donateConfig = {
  // 支付平台链接（建议在 Vercel 通过环境变量配置）
  platforms: {
    kofi: readPublicEnv(process.env.NEXT_PUBLIC_DONATE_KOFI),
    payoneer: readPublicEnv(process.env.NEXT_PUBLIC_DONATE_PAYONEER),
    paypal: readPublicEnv(process.env.NEXT_PUBLIC_DONATE_PAYPAL),
    github: readPublicEnv(process.env.NEXT_PUBLIC_DONATE_GITHUB),
    crypto: {
      eth: readPublicEnv(process.env.NEXT_PUBLIC_DONATE_CRYPTO_ETH),
      btc: readPublicEnv(process.env.NEXT_PUBLIC_DONATE_CRYPTO_BTC),
      usdt: readPublicEnv(process.env.NEXT_PUBLIC_DONATE_CRYPTO_USDT),
    },
  },
  // 捐款等级（从低到高）
  tiers: [
    {
      name: 'Supporter',
      nameZh: '支持者',
      amount: 5,
      icon: 'sprout',
      perks: ['Support Cunning3D development', 'Name in credits'],
      perksZh: ['支持 Cunning3D 开发', '鸣谢名单署名'],
    },
    {
      name: 'Backer',
      nameZh: '资助者',
      amount: 15,
      icon: 'star',
      perks: ['Support Cunning3D development', 'Name in credits', 'Discord role'],
      perksZh: ['支持 Cunning3D 开发', '鸣谢名单署名', 'Discord 身份组'],
    },
    {
      name: 'Patron',
      nameZh: '赞助人',
      amount: 50,
      icon: 'gem',
      perks: ['Support Cunning3D development', 'Name in credits', 'Discord role', 'Priority support'],
      perksZh: ['支持 Cunning3D 开发', '鸣谢名单署名', 'Discord 身份组', '优先支持'],
    },
    {
      name: 'Sponsor',
      nameZh: '赞助商',
      amount: 150,
      icon: 'rocket',
      perks: ['All Patron perks', 'Logo on website', 'Direct communication'],
      perksZh: ['包含 Patron 全部权益', '官网展示 Logo', '直接沟通通道'],
    },
    {
      name: 'Partner',
      nameZh: '合作伙伴',
      amount: 500,
      icon: 'crown',
      perks: ['All Sponsor perks', 'Custom integration support', 'Feature prioritization'],
      perksZh: ['包含 Sponsor 全部权益', '定制集成支持', '功能优先排期'],
    },
  ],
  // 统计数据（来自 data/donations.json）
  metrics,
  updatedAt: typeof snapshot.updatedAt === "string" ? snapshot.updatedAt : undefined,
};
