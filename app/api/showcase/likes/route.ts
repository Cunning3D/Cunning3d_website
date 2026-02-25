import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

import { readGitHubSession } from "@/lib/showcase/github-oauth";

function parseIdsParam(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 200);
}

const LIKE_ISSUE_PREFIX = "[Showcase Like] ";
const LIKE_ISSUE_MARKER = LIKE_ISSUE_PREFIX.trim();
const GH_API_VERSION = "2022-11-28";

async function readAllowedIds() {
  const p = path.join(process.cwd(), "public", "examples", "index.json");
  const txt = await fs.readFile(p, "utf8");
  const json = JSON.parse(txt) as { items?: { id?: unknown }[] };
  const ids = new Set<string>();
  for (const it of json.items || []) {
    if (typeof it?.id === "string" && it.id.trim()) ids.add(it.id.trim());
  }
  return ids;
}

let cachedAllowedIds:
  | {
      loadedAt: number;
      ids: Set<string>;
    }
  | undefined;

async function getAllowedIds() {
  const now = Date.now();
  if (cachedAllowedIds && now - cachedAllowedIds.loadedAt < 60_000) {
    return cachedAllowedIds.ids;
  }
  const ids = await readAllowedIds();
  cachedAllowedIds = { loadedAt: now, ids };
  return ids;
}

function normalizeRepo(s: unknown) {
  const raw = String(s || "").trim();
  if (!raw) return "";
  // Strip scheme if someone pastes a GitHub URL.
  const cleaned = raw
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  return cleaned;
}

function parseOwnerRepo(s: string) {
  const parts = normalizeRepo(s).split("/").filter(Boolean);
  if (parts.length !== 2) return null;
  const [owner, repo] = parts;
  if (!owner || !repo) return null;
  return { owner, repo };
}

function getLikesRepo() {
  const repoString =
    process.env.SHOWCASE_LIKES_REPO ||
    process.env.COMMUNITY_REPO ||
    process.env.SHOWCASE_SUBMISSIONS_REPO ||
    (() => {
      const owner = String(process.env.VERCEL_GIT_REPO_OWNER || "").trim();
      const slug = String(process.env.VERCEL_GIT_REPO_SLUG || "").trim();
      return owner && slug ? `${owner}/${slug}` : "";
    })() ||
    "Cunning3D/Cunning3d_website";

  const parsed = parseOwnerRepo(repoString);
  if (!parsed) return null;
  return { ...parsed, repoString };
}

function ghHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": GH_API_VERSION,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

type GitHubSearchIssueItem = {
  number?: unknown;
  title?: unknown;
  reactions?: unknown;
};

type GitHubSearchResponse = {
  total_count?: unknown;
  items?: GitHubSearchIssueItem[];
};

function likeIdFromIssueTitle(title: string) {
  if (!title.startsWith(LIKE_ISSUE_PREFIX)) return null;
  const id = title.slice(LIKE_ISSUE_PREFIX.length).trim();
  return id || null;
}

function reactionsPlusOne(reactions: unknown) {
  const value = (reactions as any)?.["+1"];
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

async function ghSearchIssues(opts: {
  owner: string;
  repo: string;
  q: string;
  token?: string;
  page?: number;
  perPage?: number;
  sort?: "updated" | "created";
  order?: "desc" | "asc";
}) {
  const perPage = Math.min(Math.max(1, opts.perPage || 100), 100);
  const page = Math.min(Math.max(1, opts.page || 1), 10);

  const params = new URLSearchParams();
  params.set("q", opts.q);
  params.set("per_page", String(perPage));
  params.set("page", String(page));
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.order) params.set("order", opts.order);

  const url = `https://api.github.com/search/issues?${params.toString()}`;
  const res = await fetch(url, {
    headers: ghHeaders(opts.token),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GitHub search failed (${res.status})`);
  }
  const json = (await res.json()) as GitHubSearchResponse;
  return json;
}

async function findLikeIssueNumberForId(opts: {
  owner: string;
  repo: string;
  id: string;
  token?: string;
}) {
  const fullTitle = `${LIKE_ISSUE_PREFIX}${opts.id}`;
  const q = `repo:${opts.owner}/${opts.repo} is:issue in:title "${fullTitle}"`;

  let json: GitHubSearchResponse | null = null;
  try {
    json = await ghSearchIssues({
      owner: opts.owner,
      repo: opts.repo,
      q,
      token: opts.token,
      perPage: 10,
      page: 1,
      sort: "created",
      order: "asc",
    });
  } catch {
    return null;
  }

  const items = Array.isArray(json?.items) ? json.items : [];
  const matches = items
    .map((it) => ({
      number: typeof it.number === "number" ? it.number : Number.NaN,
      title: typeof it.title === "string" ? it.title : "",
    }))
    .filter((it) => Number.isFinite(it.number) && it.title === fullTitle)
    .sort((a, b) => (a.number as number) - (b.number as number));

  return matches.length > 0 ? (matches[0]!.number as number) : null;
}

async function createLikeIssue(opts: {
  owner: string;
  repo: string;
  id: string;
  token: string;
  requestOrigin: string;
  basePath: string;
}) {
  const title = `${LIKE_ISSUE_PREFIX}${opts.id}`;
  const showcaseUrl = `${opts.requestOrigin}${opts.basePath}/showcase/viewer?id=${encodeURIComponent(
    opts.id
  )}`;

  const body = [
    "Auto-generated by the Cunning3D website.",
    "",
    `This issue stores per-user 👍 reactions for showcase item: \`${opts.id}\`.`,
    "",
    `Showcase: ${showcaseUrl}`,
    "",
    `<!-- c3d:showcase-like:${opts.id} -->`,
  ].join("\n");

  const res = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(
      opts.owner
    )}/${encodeURIComponent(opts.repo)}/issues`,
    {
      method: "POST",
      headers: {
        ...ghHeaders(opts.token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Cannot create like issue (${res.status}): ${txt}`);
  }

  const json = (await res.json()) as { number?: unknown };
  const number = typeof json.number === "number" ? json.number : NaN;
  if (!Number.isFinite(number)) throw new Error("Cannot create like issue");
  return number;
}

type GraphqlResponse<T> = { data?: T; errors?: { message?: unknown }[] };

async function ghGraphql<T>(token: string, query: string, variables: unknown) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": GH_API_VERSION,
      Authorization: `Bearer ${token}`,
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
        reactions?: { totalCount?: unknown; viewerHasReacted?: unknown };
      } | null;
    } | null;
  }>(
    opts.token,
    `query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $number) {
          id
          reactions(content: THUMBS_UP) {
            totalCount
            viewerHasReacted
          }
        }
      }
    }`,
    { owner: opts.owner, repo: opts.repo, number: opts.number }
  );

  const issue = data.repository?.issue;
  const issueId = typeof issue?.id === "string" ? issue.id : "";
  const totalCount = Number.isFinite(issue?.reactions?.totalCount as number)
    ? Math.max(0, Math.floor(issue?.reactions?.totalCount as number))
    : 0;
  const viewerHasReacted = issue?.reactions?.viewerHasReacted === true;
  return { issueId, totalCount, viewerHasReacted };
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

async function fetchViewerLikedForIssueNumbers(opts: {
  token: string;
  owner: string;
  repo: string;
  mapping: Array<{ id: string; number: number }>;
}) {
  const liked: Record<string, boolean> = {};
  const batchSize = 40;

  for (let i = 0; i < opts.mapping.length; i += batchSize) {
    const batch = opts.mapping.slice(i, i + batchSize);

    const fields = batch
      .map(
        (it, idx) => `i${idx}: issue(number: ${Math.floor(it.number)}) {
          reactions(content: THUMBS_UP) { viewerHasReacted }
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
    batch.forEach((it, idx) => {
      const entry = (repoData as any)?.[`i${idx}`];
      liked[it.id] = entry?.reactions?.viewerHasReacted === true;
    });
  }

  return liked;
}

export async function GET(req: NextRequest) {
  const ids = parseIdsParam(req.nextUrl.searchParams.get("ids"));
  if (ids.length === 0) {
    return NextResponse.json({ counts: {}, viewerLiked: null }, { status: 200 });
  }

  const allowed = await getAllowedIds();
  const wanted = ids.filter((id) => allowed.has(id));

  const repo = getLikesRepo();
  if (!repo) {
    return NextResponse.json(
      { error: "Server misconfigured: invalid SHOWCASE_LIKES_REPO" },
      { status: 500 }
    );
  }

  const readToken = String(
    process.env.GITHUB_ACCESS_TOKEN || process.env.GITHUB_TOKEN || ""
  ).trim();

  const wantedSet = new Set(wanted);
  const issueById = new Map<string, { number: number; count: number }>();

  if (wantedSet.size > 0) {
    const q = `repo:${repo.owner}/${repo.repo} is:issue in:title "${LIKE_ISSUE_MARKER}"`;
    const perPage = 100;
    const maxPages = 10;

    for (let page = 1; page <= maxPages; page++) {
      let json: GitHubSearchResponse;
      try {
        json = await ghSearchIssues({
          owner: repo.owner,
          repo: repo.repo,
          q,
          token: readToken || undefined,
          page,
          perPage,
          sort: "updated",
          order: "desc",
        });
      } catch {
        break;
      }

      const items = Array.isArray(json.items) ? json.items : [];
      for (const it of items) {
        const number =
          typeof it.number === "number" ? Math.floor(it.number) : NaN;
        const title = typeof it.title === "string" ? it.title : "";
        if (!Number.isFinite(number) || !title) continue;
        const likeId = likeIdFromIssueTitle(title);
        if (!likeId || !wantedSet.has(likeId)) continue;
        if (!issueById.has(likeId)) {
          issueById.set(likeId, {
            number,
            count: reactionsPlusOne(it.reactions),
          });
        }
      }

      if (issueById.size >= wantedSet.size) break;
      if (items.length < perPage) break;
    }
  }

  const counts: Record<string, number> = {};
  const mappingForViewer: Array<{ id: string; number: number }> = [];
  for (const id of wanted) {
    const entry = issueById.get(id);
    const count = entry?.count ?? 0;
    counts[id] = count;
    if (entry?.number) mappingForViewer.push({ id, number: entry.number });
  }

  const session = readGitHubSession(req);
  const viewerLiked = session
    ? await fetchViewerLikedForIssueNumbers({
        token: session.accessToken,
        owner: repo.owner,
        repo: repo.repo,
        mapping: mappingForViewer,
      }).catch(() => ({} as Record<string, boolean>))
    : null;

  return NextResponse.json({ counts, viewerLiked }, { status: 200 });
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

  const id = typeof (body as any)?.id === "string" ? (body as any).id.trim() : "";
  const delta = (body as any)?.delta;
  const action =
    typeof (body as any)?.action === "string" ? (body as any).action : "toggle";

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (delta !== undefined && delta !== 1 && delta !== -1) {
    return NextResponse.json({ error: "Invalid delta" }, { status: 400 });
  }

  const allowed = await getAllowedIds();
  if (!allowed.has(id)) {
    return NextResponse.json({ error: "Unknown id" }, { status: 404 });
  }

  const repo = getLikesRepo();
  if (!repo) {
    return NextResponse.json(
      { error: "Server misconfigured: invalid SHOWCASE_LIKES_REPO" },
      { status: 500 }
    );
  }

  const basePath = (() => {
    const s = String(process.env.NEXT_PUBLIC_BASE_PATH || "").trim();
    if (!s) return "";
    const withLeadingSlash = s.startsWith("/") ? s : `/${s}`;
    return withLeadingSlash.endsWith("/")
      ? withLeadingSlash.slice(0, -1)
      : withLeadingSlash;
  })();

  let issueNumber =
    (await findLikeIssueNumberForId({
      owner: repo.owner,
      repo: repo.repo,
      id,
      token: session.accessToken,
    })) || null;

  if (!issueNumber) {
    issueNumber = await createLikeIssue({
      owner: repo.owner,
      repo: repo.repo,
      id,
      token: session.accessToken,
      requestOrigin: req.nextUrl.origin,
      basePath,
    });
  }

  const state = await getIssueReactionState({
    token: session.accessToken,
    owner: repo.owner,
    repo: repo.repo,
    number: issueNumber,
  });

  const mode = (() => {
    if (delta === 1) return "like";
    if (delta === -1) return "unlike";
    if (action === "like" || action === "unlike" || action === "toggle")
      return action;
    return "toggle";
  })();

  const shouldLike =
    mode === "like"
      ? true
      : mode === "unlike"
        ? false
        : !state.viewerHasReacted;

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
    { id, count: next.totalCount, liked: next.viewerHasReacted },
    { status: 200 }
  );
}
