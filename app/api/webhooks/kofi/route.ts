import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

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

type DonationMetrics = {
  monthlyDollars: number;
  oneTimeDollars: number;
  members: number;
  sponsors: number;
};

type DonationSnapshot = {
  updatedAt: string | null;
  metrics: DonationMetrics;
  donors: unknown[];
  _internal?: {
    kofi?: {
      processedTxIds?: string[];
      supporterIds?: string[];
      sponsorIds?: string[];
    };
  };
};

function toNumber(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function env(key: string) {
  return String(process.env[key] || "").trim();
}

function hmacHex(secret: string, value: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function splitOwnerRepo(ownerRepo: string) {
  const [owner, repo] = ownerRepo.split("/");
  if (!owner || !repo) return null;
  return { owner, repo };
}

function encodeGitHubPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

async function githubRequest(token: string, path: string, init?: RequestInit) {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
      "User-Agent": "cunning3d-website",
      ...(init?.headers || {}),
    },
  });
}

function parseSnapshot(raw: string): DonationSnapshot {
  try {
    const json = JSON.parse(raw) as Partial<DonationSnapshot>;
    return {
      updatedAt: typeof json.updatedAt === "string" ? json.updatedAt : null,
      metrics: {
        monthlyDollars: Math.max(0, toNumber(json.metrics?.monthlyDollars)),
        oneTimeDollars: Math.max(0, toNumber(json.metrics?.oneTimeDollars)),
        members: Math.max(0, toNumber(json.metrics?.members)),
        sponsors: Math.max(0, toNumber(json.metrics?.sponsors)),
      },
      donors: Array.isArray(json.donors) ? json.donors : [],
      _internal: typeof json._internal === "object" && json._internal ? json._internal : undefined,
    };
  } catch {
    return {
      updatedAt: null,
      metrics: { monthlyDollars: 0, oneTimeDollars: 0, members: 0, sponsors: 0 },
      donors: [],
    };
  }
}

function stringifySnapshot(snapshot: DonationSnapshot) {
  return `${JSON.stringify(snapshot, null, 2)}\n`;
}

async function loadSnapshotFromGitHub(params: {
  token: string;
  owner: string;
  repo: string;
  path: string;
  ref: string;
}) {
  const res = await githubRequest(
    params.token,
    `/repos/${params.owner}/${params.repo}/contents/${encodeGitHubPath(params.path)}?ref=${encodeURIComponent(params.ref)}`,
    { method: "GET" }
  );

  if (res.status === 404) {
    return { snapshot: parseSnapshot("{}"), sha: undefined as string | undefined };
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub GET content failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as { content?: string; sha?: string; encoding?: string };
  const base64 = String(json.content || "");
  const content = Buffer.from(base64, "base64").toString("utf8");
  return { snapshot: parseSnapshot(content), sha: json.sha };
}

async function saveSnapshotToGitHub(params: {
  token: string;
  owner: string;
  repo: string;
  path: string;
  branch: string;
  sha?: string;
  content: string;
  message: string;
}) {
  const res = await githubRequest(params.token, `/repos/${params.owner}/${params.repo}/contents/${encodeGitHubPath(params.path)}`, {
    method: "PUT",
    body: JSON.stringify({
      message: params.message,
      content: Buffer.from(params.content, "utf8").toString("base64"),
      sha: params.sha,
      branch: params.branch,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub PUT content failed: ${res.status} ${text}`);
  }
}

function updateSnapshotWithKofiEvent(params: {
  snapshot: DonationSnapshot;
  txId: string;
  supporterId: string;
  amount: number;
  isSubscription: boolean;
}) {
  const snapshot = params.snapshot;
  const nowIso = new Date().toISOString();

  const internal = snapshot._internal ?? {};
  const kofi = internal.kofi ?? {};

  const processedTxIds = new Set(Array.isArray(kofi.processedTxIds) ? kofi.processedTxIds : []);
  if (processedTxIds.has(params.txId)) {
    return { snapshot, changed: false };
  }
  processedTxIds.add(params.txId);

  const supporterIds = new Set(Array.isArray(kofi.supporterIds) ? kofi.supporterIds : []);
  supporterIds.add(params.supporterId);

  const sponsorThreshold = 150;
  const sponsorIds = new Set(Array.isArray(kofi.sponsorIds) ? kofi.sponsorIds : []);
  if (params.amount >= sponsorThreshold) sponsorIds.add(params.supporterId);

  const next: DonationSnapshot = {
    updatedAt: nowIso,
    donors: snapshot.donors,
    metrics: {
      monthlyDollars:
        snapshot.metrics.monthlyDollars + (params.isSubscription ? Math.max(0, params.amount) : 0),
      oneTimeDollars:
        snapshot.metrics.oneTimeDollars + (!params.isSubscription ? Math.max(0, params.amount) : 0),
      members: supporterIds.size,
      sponsors: sponsorIds.size,
    },
    _internal: {
      ...internal,
      kofi: {
        processedTxIds: Array.from(processedTxIds).slice(-2000),
        supporterIds: Array.from(supporterIds).slice(-2000),
        sponsorIds: Array.from(sponsorIds).slice(-2000),
      },
    },
  };

  return { snapshot: next, changed: true };
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
      const txId = String(data.kofi_transaction_id || data.message_id || "").trim();
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

      // 可选：用 GitHub 作为“无数据库”存储，把聚合指标写回 data/donations.json
      const githubToken = env("DONATIONS_GITHUB_TOKEN") || env("GITHUB_ACCESS_TOKEN") || env("GITHUB_TOKEN");
      const snapshotRepo = env("DONATIONS_SNAPSHOT_REPO") || env("SHOWCASE_SUBMISSIONS_REPO") || env("COMMUNITY_REPO");
      const snapshotPath = env("DONATIONS_SNAPSHOT_PATH") || "data/donations.json";
      const snapshotBranch = env("DONATIONS_SNAPSHOT_BRANCH") || "main";
      const repoInfo = snapshotRepo ? splitOwnerRepo(snapshotRepo) : null;

      if (githubToken && repoInfo && txId && Number.isFinite(amount) && amount > 0) {
        const hashSecret = env("DONATIONS_HASH_SECRET") || verificationToken;
        const email = String(data.email || "").trim().toLowerCase();
        const supporterId = email ? `kofi:${hmacHex(hashSecret, email)}` : `kofi:anon:${txId}`;

        let attempt = 0;
        while (attempt < 3) {
          attempt += 1;
          const { snapshot, sha } = await loadSnapshotFromGitHub({
            token: githubToken,
            owner: repoInfo.owner,
            repo: repoInfo.repo,
            path: snapshotPath,
            ref: snapshotBranch,
          });

          const result = updateSnapshotWithKofiEvent({
            snapshot,
            txId,
            supporterId,
            amount,
            isSubscription: Boolean(data.is_subscription_payment),
          });

          if (!result.changed) break;

          try {
            await saveSnapshotToGitHub({
              token: githubToken,
              owner: repoInfo.owner,
              repo: repoInfo.repo,
              path: snapshotPath,
              branch: snapshotBranch,
              sha,
              content: stringifySnapshot(result.snapshot),
              message: `chore: sync donations (ko-fi ${txId})`,
            });
            break;
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            if (message.includes("409") || message.includes("sha")) continue;
            throw e;
          }
        }
      }
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
