import { NextRequest, NextResponse } from "next/server";
import { FORUM_ISSUE_MARKER, getForumRepo, getGitHubReadToken, ghHeaders, stripForumPrefix } from "@/lib/forum/github";

type GitHubSearchIssueItem = {
  number?: unknown;
  title?: unknown;
  user?: { login?: unknown } | null;
  created_at?: unknown;
  comments?: unknown;
  html_url?: unknown;
  state?: unknown;
};

type GitHubSearchResponse = {
  total_count?: unknown;
  items?: GitHubSearchIssueItem[];
};

function parsePositiveInt(v: string | null, fallback: number) {
  const n = Number.parseInt(String(v || ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function GET(req: NextRequest) {
  const repo = getForumRepo();
  if (!repo) {
    return NextResponse.json(
      { error: "Server misconfigured: invalid FORUM_REPO" },
      { status: 500 }
    );
  }

  const page = Math.min(parsePositiveInt(req.nextUrl.searchParams.get("page"), 1), 50);
  const perPage = Math.min(
    Math.max(5, parsePositiveInt(req.nextUrl.searchParams.get("perPage"), 20)),
    50
  );

  const q = `repo:${repo.owner}/${repo.repo} is:issue in:title "${FORUM_ISSUE_MARKER}"`;
  const params = new URLSearchParams();
  params.set("q", q);
  params.set("page", String(page));
  params.set("per_page", String(perPage));
  params.set("sort", "created");
  params.set("order", "desc");

  const token = getGitHubReadToken();
  const res = await fetch(`https://api.github.com/search/issues?${params.toString()}`, {
    headers: ghHeaders(token || undefined),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "GitHub API error", status: res.status },
      { status: 502 }
    );
  }

  const json = (await res.json()) as GitHubSearchResponse;
  const items = Array.isArray(json.items) ? json.items : [];
  const total = typeof json.total_count === "number" ? json.total_count : null;

  const threads = items
    .map((it) => {
      const number = typeof it.number === "number" ? Math.floor(it.number) : NaN;
      const title = typeof it.title === "string" ? it.title : "";
      if (!Number.isFinite(number) || !title) return null;
      return {
        number,
        title: stripForumPrefix(title),
        titleRaw: title,
        author:
          typeof it.user?.login === "string" && it.user.login
            ? it.user.login
            : "unknown",
        createdAt: typeof it.created_at === "string" ? it.created_at : "",
        comments: typeof it.comments === "number" ? Math.max(0, it.comments) : 0,
        url: typeof it.html_url === "string" ? it.html_url : "",
        state: typeof it.state === "string" ? it.state : "open",
      };
    })
    .filter(Boolean);

  return NextResponse.json(
    { repo: repo.repoString, page, perPage, total, threads },
    { status: 200 }
  );
}

