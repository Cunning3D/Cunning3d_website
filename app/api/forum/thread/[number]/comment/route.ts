import { NextRequest, NextResponse } from "next/server";
import { readGitHubSession } from "@/lib/showcase/github-oauth";
import { getForumRepo, ghHeaders } from "@/lib/forum/github";

function parseIssueNumber(raw: unknown) {
  const n = Number.parseInt(String(raw || ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function clampBody(s: string) {
  const trimmed = String(s || "").trim();
  if (!trimmed) return "";
  return trimmed.length > 20_000 ? trimmed.slice(0, 20_000) : trimmed;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ number?: string }> }
) {
  const session = readGitHubSession(req);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const repo = getForumRepo();
  if (!repo) {
    return NextResponse.json(
      { error: "Server misconfigured: invalid FORUM_REPO" },
      { status: 500 }
    );
  }

  const p = await params;
  const number = parseIssueNumber(p?.number);
  if (!number) {
    return NextResponse.json({ error: "Invalid thread id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bodyInput =
    typeof (body as any)?.body === "string" ? (body as any).body : "";
  const commentBody = clampBody(bodyInput);
  if (!commentBody) {
    return NextResponse.json({ error: "Missing body" }, { status: 400 });
  }

  const ghRes = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(
      repo.owner
    )}/${encodeURIComponent(repo.repo)}/issues/${number}/comments`,
    {
      method: "POST",
      headers: {
        ...ghHeaders(session.accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: `${commentBody}\n\n<!-- c3d:forum-comment -->`,
      }),
      cache: "no-store",
    }
  );

  if (!ghRes.ok) {
    const txt = await ghRes.text().catch(() => "");
    return NextResponse.json(
      { error: "GitHub API error", status: ghRes.status, details: txt },
      { status: 502 }
    );
  }

  const json = (await ghRes.json()) as { html_url?: unknown };
  const url = typeof json.html_url === "string" ? json.html_url : "";
  return NextResponse.json({ ok: true, url }, { status: 200 });
}
