import { NextRequest, NextResponse } from "next/server";
import { getForumRepo, getGitHubReadToken, ghHeaders, isForumIssueTitle, stripForumPrefix } from "@/lib/forum/github";

type GitHubIssue = {
  number?: unknown;
  title?: unknown;
  body?: unknown;
  user?: { login?: unknown; avatar_url?: unknown; html_url?: unknown } | null;
  created_at?: unknown;
  updated_at?: unknown;
  comments?: unknown;
  html_url?: unknown;
  state?: unknown;
};

type GitHubComment = {
  id?: unknown;
  body?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
  html_url?: unknown;
  user?: { login?: unknown; avatar_url?: unknown; html_url?: unknown } | null;
};

function parseIssueNumber(raw: unknown) {
  const n = Number.parseInt(String(raw || ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ number?: string }> }
) {
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

  const token = getGitHubReadToken();
  const issueRes = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(
      repo.owner
    )}/${encodeURIComponent(repo.repo)}/issues/${number}`,
    {
      headers: ghHeaders(token || undefined),
      cache: "no-store",
    }
  );

  if (!issueRes.ok) {
    return NextResponse.json(
      { error: "GitHub API error", status: issueRes.status },
      { status: 502 }
    );
  }

  const issueJson = (await issueRes.json()) as GitHubIssue;
  const titleRaw = typeof issueJson.title === "string" ? issueJson.title : "";
  if (!isForumIssueTitle(titleRaw)) {
    return NextResponse.json({ error: "Not a forum thread" }, { status: 404 });
  }

  const thread = {
    number,
    title: stripForumPrefix(titleRaw),
    titleRaw,
    body: typeof issueJson.body === "string" ? issueJson.body : "",
    createdAt: typeof issueJson.created_at === "string" ? issueJson.created_at : "",
    updatedAt: typeof issueJson.updated_at === "string" ? issueJson.updated_at : "",
    comments: typeof issueJson.comments === "number" ? Math.max(0, issueJson.comments) : 0,
    url: typeof issueJson.html_url === "string" ? issueJson.html_url : "",
    state: typeof issueJson.state === "string" ? issueJson.state : "open",
    author: {
      login:
        typeof issueJson.user?.login === "string" ? issueJson.user.login : "unknown",
      avatarUrl:
        typeof issueJson.user?.avatar_url === "string"
          ? issueJson.user.avatar_url
          : "",
      htmlUrl:
        typeof issueJson.user?.html_url === "string" ? issueJson.user.html_url : "",
    },
  };

  const commentsRes = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(
      repo.owner
    )}/${encodeURIComponent(repo.repo)}/issues/${number}/comments?per_page=100&page=1`,
    {
      headers: ghHeaders(token || undefined),
      cache: "no-store",
    }
  );

  const commentsJson: GitHubComment[] = commentsRes.ok
    ? ((await commentsRes.json()) as GitHubComment[])
    : [];

  const comments = (Array.isArray(commentsJson) ? commentsJson : []).map((c) => ({
    id: typeof c.id === "number" ? c.id : null,
    body: typeof c.body === "string" ? c.body : "",
    createdAt: typeof c.created_at === "string" ? c.created_at : "",
    updatedAt: typeof c.updated_at === "string" ? c.updated_at : "",
    url: typeof c.html_url === "string" ? c.html_url : "",
    author: {
      login: typeof c.user?.login === "string" ? c.user.login : "unknown",
      avatarUrl:
        typeof c.user?.avatar_url === "string" ? c.user.avatar_url : "",
      htmlUrl: typeof c.user?.html_url === "string" ? c.user.html_url : "",
    },
  }));

  return NextResponse.json({ repo: repo.repoString, thread, comments }, { status: 200 });
}
