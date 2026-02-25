import { NextRequest, NextResponse } from "next/server";

// Ko-fi Webhook 接收端点（可选）
// 用途：接收 Ko-fi 的捐赠事件。默认仅做校验 + 最小化日志（不记录邮箱/留言等敏感信息）。
// 配置：Ko-fi 后台 -> Settings -> Webhooks -> 填入 https://your-domain.com/api/webhooks/kofi

interface KofiWebhookData {
  verification_token: string;
  message_id: string;
  timestamp: string;
  type: "Donation" | "Subscription" | "Commission" | "Shop Order";
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
    const verificationToken = String(process.env.KOFI_VERIFICATION_TOKEN || "").trim();
    if (!verificationToken) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    const formData = await request.formData();
    const dataStr = formData.get("data") as string;
    if (!dataStr) return NextResponse.json({ error: "No data" }, { status: 400 });

    const data: KofiWebhookData = JSON.parse(dataStr);

    // 验证 token（在 Ko-fi 后台获取，存到环境变量）
    if (data.verification_token !== verificationToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 处理捐款/订阅
    if (data.type === "Donation" || data.type === "Subscription") {
      const amount = Number.parseFloat(data.amount);
      console.log("[Ko-fi Webhook] Donation received", {
        tx: data.kofi_transaction_id,
        type: data.type,
        amount: Number.isFinite(amount) ? amount : data.amount,
        currency: data.currency,
        isPublic: data.is_public,
        isSubscription: data.is_subscription_payment,
        tier: data.tier_name || "Supporter",
        timestamp: data.timestamp,
      });

      // TODO: 通过 GitHub API 创建 PR 来更新 data/donations.json（不需要数据库）。
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Ko-fi Webhook] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// 验证端点（Ko-fi 会先 GET 一下确认可用）
export async function GET() {
  const configured = Boolean(String(process.env.KOFI_VERIFICATION_TOKEN || "").trim());
  return NextResponse.json({
    status: "Ko-fi webhook endpoint ready",
    configured,
  });
}
