import { NextRequest, NextResponse } from 'next/server';

// Ko-fi Webhook 接收端点 - 自动同步捐款数据
// 设置方法: 在 Ko-fi 后台 -> Settings -> Webhooks -> 填入 https://your-domain.com/api/webhooks/kofi

interface KofiWebhookData {
  verification_token: string;
  message_id: string;
  timestamp: string;
  type: 'Donation' | 'Subscription' | 'Commission' | 'Shop Order';
  is_public: boolean;
  from_name: string;
  message: string;
  amount: string;
  url: string;
  email: string;
  currency: string;
  is_subscription_payment: boolean;
  is_first_subscription_payment: boolean;
  kofi_transaction_id: string;
  shop_items?: unknown[];
  tier_name?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const dataStr = formData.get('data') as string;
    if (!dataStr) return NextResponse.json({ error: 'No data' }, { status: 400 });

    const data: KofiWebhookData = JSON.parse(dataStr);
    
    // 验证 token（在 Ko-fi 后台获取，存到环境变量）
    const verificationToken = process.env.KOFI_VERIFICATION_TOKEN;
    if (verificationToken && data.verification_token !== verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 处理捐款/订阅
    if (data.type === 'Donation' || data.type === 'Subscription') {
      const donor = {
        name: data.is_public ? data.from_name : 'Anonymous',
        amount: parseFloat(data.amount),
        message: data.message,
        isSubscription: data.is_subscription_payment,
        tier: data.tier_name || 'Supporter',
        date: data.timestamp,
        platform: 'kofi' as const,
      };

      // TODO: 这里可以存到数据库，或者通过 GitHub API 更新 donors 文件
      // 现在先记录日志
      console.log('[Ko-fi Webhook] New donation:', donor);

      // 可选：发送通知到 Discord/Slack
      // await sendDiscordNotification(donor);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Ko-fi Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// 验证端点（Ko-fi 会先 GET 一下确认可用）
export async function GET() {
  return NextResponse.json({ status: 'Ko-fi webhook endpoint ready' });
}
