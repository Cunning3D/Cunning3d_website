import { NextRequest, NextResponse } from "next/server";
import { readGitHubSession } from "@/lib/showcase/github-oauth";
import { FORUM_ISSUE_PREFIX, getForumRepo, ghHeaders } from "@/lib/forum/github";

function clampTitle(s: string) {
  const trimmed = String(s || "").trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return trimmed.length > 120 ? trimmed.slice(0, 120).trim() : trimmed;
}

function clampBody(s: string) {
  const trimmed = String(s || "").trim();
  if (!trimmed) return "";
  // Keep within a sane limit (GitHub supports much more, this is just to avoid abuse).
  return trimmed.length > 20_000 ? trimmed.slice(0, 20_000) : trimmed;
}

export async function POST(req: NextRequest) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const titleInput =
    typeof (body as any)?.title === "string" ? (body as any).title : "";
  const bodyInput =
    typeof (body as any)?.body === "string" ? (body as any).body : "";

  const title = clampTitle(titleInput);
  if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

  const issueTitle = `${FORUM_ISSUE_PREFIX}${title}`;
  const issueBody = [
    clampBody(bodyInput),
    "",
    "<!-- c3d:forum-thread -->",
  ]
    .join("\n")
    .trim();

  const ghRes = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(
      repo.owner
    )}/${encodeURIComponent(repo.repo)}/issues`,
    {
      method: "POST",
      headers: {
        ...ghHeaders(session.accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
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

  const json = (await ghRes.json()) as { number?: unknown; html_url?: unknown };
  const number = typeof json.number === "number" ? Math.floor(json.number) : NaN;
  const url = typeof json.html_url === "string" ? json.html_url : "";
  if (!Number.isFinite(number)) {
    return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
  }

  return NextResponse.json({ number, url }, { status: 200 });
}

