export const GH_API_VERSION = "2022-11-28";

export const FORUM_ISSUE_PREFIX = "[Forum] ";
export const FORUM_ISSUE_MARKER = FORUM_ISSUE_PREFIX.trim();

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

export function ghHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": GH_API_VERSION,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function getGitHubReadToken() {
  const token = String(
    process.env.GITHUB_ACCESS_TOKEN || process.env.GITHUB_TOKEN || ""
  ).trim();
  return token || null;
}

export function getForumRepo() {
  const repoString =
    process.env.FORUM_REPO ||
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

export function isForumIssueTitle(title: string) {
  return String(title || "").startsWith(FORUM_ISSUE_PREFIX);
}

export function stripForumPrefix(title: string) {
  const s = String(title || "");
  if (!s.startsWith(FORUM_ISSUE_PREFIX)) return s;
  const trimmed = s.slice(FORUM_ISSUE_PREFIX.length).trim();
  return trimmed || s;
}

