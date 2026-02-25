import { NextRequest, NextResponse } from "next/server";
import { readGitHubSession } from "@/lib/showcase/github-oauth";

const GH_API_VERSION = "2022-11-28";

function normalizeRepo(s: unknown) {
  const raw = String(s || "").trim();
  if (!raw) return "";
  return raw
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

function parseOwnerRepo(s: string) {
  const parts = normalizeRepo(s).split("/").filter(Boolean);
  if (parts.length !== 2) return null;
  const [owner, repo] = parts;
  if (!owner || !repo) return null;
  return { owner, repo };
}

function ghHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": GH_API_VERSION,
    Authorization: `Bearer ${token}`,
  };
}

async function ghJson<T>(token: string, url: string): Promise<{ ok: boolean; status: number; json: T }> {
  const res = await fetch(url, { headers: ghHeaders(token), cache: "no-store" });
  const json = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, json };
}

type SearchItem = {
  number?: unknown;
  title?: unknown;
  html_url?: unknown;
  state?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

type SearchResponse = {
  items?: SearchItem[];
};

async function ghSearchIssues(opts: {
  token: string;
  q: string;
  perPage?: number;
  page?: number;
  sort?: "updated" | "created" | "comments";
  order?: "desc" | "asc";
}) {
  const perPage = Math.min(Math.max(1, opts.perPage ?? 10), 30);
  const page = Math.min(Math.max(1, opts.page ?? 1), 10);

  const params = new URLSearchParams();
  params.set("q", opts.q);
  params.set("per_page", String(perPage));
  params.set("page", String(page));
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.order) params.set("order", opts.order);

  const url = `https://api.github.com/search/issues?${params.toString()}`;
  const res = await fetch(url, { headers: ghHeaders(opts.token), cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GitHub search failed (${res.status}): ${txt}`);
  }
  return (await res.json()) as SearchResponse;
}

type PullDetails = {
  number: number;
  title: string;
  url: string;
  state: "open" | "closed";
  merged: boolean;
  draft: boolean;
  createdAt: string;
  updatedAt: string;
  baseRef: string;
  headRef: string;
};

export async function GET(req: NextRequest) {
  const session = readGitHubSession(req);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const submissionsRepo =
    process.env.SHOWCASE_SUBMISSIONS_REPO || "Cunning3D/Cunning3d_website";
  const parsed = parseOwnerRepo(submissionsRepo);
  if (!parsed) {
    return NextResponse.json(
      { error: "Server misconfigured: invalid SHOWCASE_SUBMISSIONS_REPO" },
      { status: 500 }
    );
  }

  const token = session.accessToken;

  const meRes = await ghJson<{ login?: unknown }>(token, "https://api.github.com/user");
  if (!meRes.ok || typeof meRes.json.login !== "string") {
    return NextResponse.json(
      { error: "GitHub auth failed. Please sign in again." },
      { status: 401 }
    );
  }
  const login = meRes.json.login;

  const q = [
    `repo:${parsed.owner}/${parsed.repo}`,
    "is:pr",
    `author:${login}`,
    'in:body "This PR was created via the Cunning3D Showcase uploader."',
  ].join(" ");

  let search: SearchResponse;
  try {
    search = await ghSearchIssues({
      token,
      q,
      perPage: 10,
      page: 1,
      sort: "updated",
      order: "desc",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "GitHub search failed" },
      { status: 502 }
    );
  }

  const numbers = (Array.isArray(search.items) ? search.items : [])
    .map((it) => (typeof it.number === "number" ? it.number : Number.NaN))
    .filter((n) => Number.isFinite(n)) as number[];

  const details = await Promise.all(
    numbers.map(async (n) => {
      const prRes = await ghJson<{
        number?: unknown;
        title?: unknown;
        html_url?: unknown;
        state?: unknown;
        merged_at?: unknown;
        draft?: unknown;
        created_at?: unknown;
        updated_at?: unknown;
        base?: { ref?: unknown };
        head?: { ref?: unknown };
      }>(
        token,
        `https://api.github.com/repos/${encodeURIComponent(
          parsed.owner
        )}/${encodeURIComponent(parsed.repo)}/pulls/${n}`
      );

      if (!prRes.ok) return null;

      const number = typeof prRes.json.number === "number" ? prRes.json.number : n;
      const title = typeof prRes.json.title === "string" ? prRes.json.title : `PR #${n}`;
      const url = typeof prRes.json.html_url === "string" ? prRes.json.html_url : "";
      const state = prRes.json.state === "open" ? "open" : "closed";
      const merged = typeof prRes.json.merged_at === "string" && Boolean(prRes.json.merged_at);
      const draft = prRes.json.draft === true;
      const createdAt = typeof prRes.json.created_at === "string" ? prRes.json.created_at : "";
      const updatedAt = typeof prRes.json.updated_at === "string" ? prRes.json.updated_at : "";
      const baseRef = typeof prRes.json.base?.ref === "string" ? prRes.json.base.ref : "";
      const headRef = typeof prRes.json.head?.ref === "string" ? prRes.json.head.ref : "";

      const out: PullDetails = {
        number,
        title,
        url,
        state,
        merged,
        draft,
        createdAt,
        updatedAt,
        baseRef,
        headRef,
      };
      return out;
    })
  );

  const items = details
    .filter(Boolean)
    .sort((a, b) => (b!.updatedAt || "").localeCompare(a!.updatedAt || ""));

  return NextResponse.json({
    repo: `${parsed.owner}/${parsed.repo}`,
    login,
    items,
  });
}

