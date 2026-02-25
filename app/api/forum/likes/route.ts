import { NextRequest, NextResponse } from "next/server";
import { readGitHubSession } from "@/lib/showcase/github-oauth";
import { FORUM_ISSUE_PREFIX, getForumRepo } from "@/lib/forum/github";

const GH_API_VERSION = "2022-11-28";

function ghHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": GH_API_VERSION,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

type GraphqlResponse<T> = { data?: T; errors?: { message?: unknown }[] };

async function ghGraphql<T>(token: string, query: string, variables: unknown) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...ghHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = (await res.json()) as GraphqlResponse<T>;
  if (!res.ok || json.errors?.length) {
    const msg = json.errors?.[0]?.message;
    throw new Error(
      `GitHub GraphQL error (${res.status}): ${
        typeof msg === "string" ? msg : "Unknown error"
      }`
    );
  }
  if (!json.data) throw new Error("GitHub GraphQL error: missing data");
  return json.data;
}

function parseNumbersParam(value: string | null) {
  if (!value) return [];
  const out: number[] = [];
  for (const part of value.split(",")) {
    const n = Number.parseInt(part.trim(), 10);
    if (Number.isFinite(n) && n > 0) out.push(Math.floor(n));
  }
  return out.slice(0, 200);
}

function isForumTitle(title: unknown) {
  return typeof title === "string" && title.startsWith(FORUM_ISSUE_PREFIX);
}

async function fetchLikesBatch(opts: {
  token: string;
  owner: string;
  repo: string;
  numbers: number[];
}) {
  const fields = opts.numbers
    .map(
      (n, idx) => `i${idx}: issue(number: ${Math.floor(n)}) {
        id
        title
        reactions(content: THUMBS_UP) {
          totalCount
          viewerHasReacted
        }
      }`
    )
    .join("\n");

  const data = await ghGraphql<{
    repository?: Record<string, any> | null;
  }>(
    opts.token,
    `query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        ${fields}
      }
    }`,
    { owner: opts.owner, repo: opts.repo }
  );

  const repoData = data.repository || {};
  const out = new Map<
    number,
    { issueId: string; title: string; count: number; liked: boolean }
  >();

  opts.numbers.forEach((n, idx) => {
    const entry = (repoData as any)?.[`i${idx}`];
    const title = typeof entry?.title === "string" ? entry.title : "";
    if (!title) return;
    const issueId = typeof entry?.id === "string" ? entry.id : "";
    const totalCount = Number.isFinite(entry?.reactions?.totalCount as number)
      ? Math.max(0, Math.floor(entry?.reactions?.totalCount as number))
      : 0;
    const viewerHasReacted = entry?.reactions?.viewerHasReacted === true;

    out.set(n, {
      issueId,
      title,
      count: totalCount,
      liked: viewerHasReacted,
    });
  });

  return out;
}

async function fetchLikes(opts: {
  token: string;
  owner: string;
  repo: string;
  numbers: number[];
}) {
  const counts: Record<string, number> = {};
  const viewerLiked: Record<string, boolean> = {};
  const batchSize = 40;

  for (let i = 0; i < opts.numbers.length; i += batchSize) {
    const batch = opts.numbers.slice(i, i + batchSize);
    const map = await fetchLikesBatch({ ...opts, numbers: batch });
    for (const n of batch) {
      const entry = map.get(n);
      if (!entry) continue;
      if (!isForumTitle(entry.title)) continue;
      counts[String(n)] = entry.count;
      viewerLiked[String(n)] = entry.liked;
    }
  }

  return { counts, viewerLiked };
}

async function getIssueReactionState(opts: {
  token: string;
  owner: string;
  repo: string;
  number: number;
}) {
  const data = await ghGraphql<{
    repository?: {
      issue?: {
        id?: unknown;
        title?: unknown;
        reactions?: { totalCount?: unknown; viewerHasReacted?: unknown };
      } | null;
    } | null;
  }>(
    opts.token,
    `query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $number) {
          id
          title
          reactions(content: THUMBS_UP) {
            totalCount
            viewerHasReacted
          }
        }
      }
    }`,
    { owner: opts.owner, repo: opts.repo, number: Math.floor(opts.number) }
  );

  const issue = data.repository?.issue;
  const issueId = typeof issue?.id === "string" ? issue.id : "";
  const title = typeof issue?.title === "string" ? issue.title : "";
  const totalCount = Number.isFinite(issue?.reactions?.totalCount as number)
    ? Math.max(0, Math.floor(issue?.reactions?.totalCount as number))
    : 0;
  const viewerHasReacted = issue?.reactions?.viewerHasReacted === true;
  return { issueId, title, totalCount, viewerHasReacted };
}

async function setThumbsUpReaction(opts: {
  token: string;
  issueId: string;
  on: boolean;
}) {
  const mutation = opts.on ? "addReaction" : "removeReaction";
  const data = await ghGraphql<{
    [key: string]:
      | {
          subject?: {
            reactions?: { totalCount?: unknown; viewerHasReacted?: unknown };
          };
        }
      | undefined;
  }>(
    opts.token,
    `mutation($subjectId: ID!) {
      ${mutation}(input: { subjectId: $subjectId, content: THUMBS_UP }) {
        subject {
          reactions(content: THUMBS_UP) {
            totalCount
            viewerHasReacted
          }
        }
      }
    }`,
    { subjectId: opts.issueId }
  );

  const payload = (data as any)?.[mutation];
  const reactions = payload?.subject?.reactions;
  const totalCount = Number.isFinite(reactions?.totalCount as number)
    ? Math.max(0, Math.floor(reactions?.totalCount as number))
    : 0;
  const viewerHasReacted = reactions?.viewerHasReacted === true;
  return { totalCount, viewerHasReacted };
}

export async function GET(req: NextRequest) {
  const numbers = parseNumbersParam(req.nextUrl.searchParams.get("numbers"));
  if (numbers.length === 0) {
    return NextResponse.json({ counts: {}, viewerLiked: null }, { status: 200 });
  }

  const repo = getForumRepo();
  if (!repo) {
    return NextResponse.json(
      { error: "Server misconfigured: invalid FORUM_REPO" },
      { status: 500 }
    );
  }

  const session = readGitHubSession(req);
  if (!session) {
    return NextResponse.json({ counts: {}, viewerLiked: null }, { status: 200 });
  }

  const data = await fetchLikes({
    token: session.accessToken,
    owner: repo.owner,
    repo: repo.repo,
    numbers,
  }).catch(() => ({ counts: {}, viewerLiked: {} }));

  return NextResponse.json(
    { counts: data.counts, viewerLiked: data.viewerLiked },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const session = readGitHubSession(req);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const numberRaw = (body as any)?.number;
  const action =
    typeof (body as any)?.action === "string" ? (body as any).action : "toggle";

  const number = Number.parseInt(String(numberRaw || ""), 10);
  if (!Number.isFinite(number) || number <= 0) {
    return NextResponse.json({ error: "Invalid thread id" }, { status: 400 });
  }

  const repo = getForumRepo();
  if (!repo) {
    return NextResponse.json(
      { error: "Server misconfigured: invalid FORUM_REPO" },
      { status: 500 }
    );
  }

  const state = await getIssueReactionState({
    token: session.accessToken,
    owner: repo.owner,
    repo: repo.repo,
    number,
  });

  if (!isForumTitle(state.title)) {
    return NextResponse.json({ error: "Not a forum thread" }, { status: 404 });
  }

  const mode =
    action === "like" || action === "unlike" || action === "toggle"
      ? action
      : "toggle";
  const shouldLike =
    mode === "like" ? true : mode === "unlike" ? false : !state.viewerHasReacted;

  let next = {
    totalCount: state.totalCount,
    viewerHasReacted: state.viewerHasReacted,
  };

  if (shouldLike && !state.viewerHasReacted && state.issueId) {
    next = await setThumbsUpReaction({
      token: session.accessToken,
      issueId: state.issueId,
      on: true,
    });
  } else if (!shouldLike && state.viewerHasReacted && state.issueId) {
    next = await setThumbsUpReaction({
      token: session.accessToken,
      issueId: state.issueId,
      on: false,
    });
  }

  return NextResponse.json(
    { number: Math.floor(number), count: next.totalCount, liked: next.viewerHasReacted },
    { status: 200 }
  );
}

