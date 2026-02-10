// Cunning3D 捐款配置 - 支付链接和等级定义
export const donateConfig = {
  // 支付平台链接（注册后填入你的链接）
  platforms: {
    kofi: '', // 例如: https://ko-fi.com/cunning3d
    payoneer: '', // Payoneer Request Payment 链接
    paypal: '', // PayPal.me 链接
    github: '', // GitHub Sponsors 链接（如果有）
    crypto: {
      eth: '', // 你的 ETH 钱包地址
      btc: '', // 你的 BTC 钱包地址
      usdt: '', // 你的 USDT 钱包地址 (ERC20)
    },
  },
  // 捐款等级（从低到高）
  tiers: [
    { name: 'Supporter', amount: 5, icon: 'sprout', perks: ['Support Cunning3D development', 'Name in credits'] },
    { name: 'Backer', amount: 15, icon: 'star', perks: ['Support Cunning3D development', 'Name in credits', 'Discord role'] },
    { name: 'Patron', amount: 50, icon: 'gem', perks: ['Support Cunning3D development', 'Name in credits', 'Discord role', 'Priority support'] },
    { name: 'Sponsor', amount: 150, icon: 'rocket', perks: ['All Patron perks', 'Logo on website', 'Direct communication'] },
    { name: 'Partner', amount: 500, icon: 'crown', perks: ['All Sponsor perks', 'Custom integration support', 'Feature prioritization'] },
  ],
  // 统计数据（会被自动同步脚本更新）
  metrics: {
    monthlyDollars: 0,
    oneTimeDollars: 0,
    members: 0,
    sponsors: 0,
  },
};

// 捐款者数据类型
export interface Donor {
  name: string;
  tier: string;
  amount: number;
  link?: string;
  logo?: string;
  date?: string;
  platform?: 'kofi' | 'payoneer' | 'github' | 'crypto' | 'other';
}

// 捐款者列表（会被自动同步脚本更新）
export const donors: Donor[] = [
  // 示例数据，实际数据由 sync 脚本生成
  // { name: 'ACME Studios', tier: 'Partner', amount: 500, link: 'https://acme.com', logo: '/donors/acme.png' },
];
