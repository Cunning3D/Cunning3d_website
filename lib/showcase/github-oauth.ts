import crypto from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "c3d_github_session";
const STATE_COOKIE = "c3d_github_oauth_state";
const NEXT_COOKIE = "c3d_github_oauth_next";

function normalizeBasePath(p: unknown) {
  const s = String(p || "").trim();
  if (!s) return "";
  const withLeadingSlash = s.startsWith("/") ? s : `/${s}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

export function getBasePath() {
  return normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
}

export function normalizeNextPath(next: string | null | undefined, basePath: string) {
  const raw = String(next || "").trim();
  if (!raw) return null;

  // Only allow same-origin relative paths (avoid open redirects).
  if (!raw.startsWith("/")) return null;
  if (raw.startsWith("//")) return null;
  if (raw.includes("\\") || raw.includes("\u0000")) return null;
  // Disallow schemes like "https:" just in case.
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) return null;

  const bp = String(basePath || "").trim();
  if (!bp) return raw;
  if (raw === bp || raw.startsWith(`${bp}/`)) return raw;
  return `${bp}${raw === "/" ? "" : raw}`;
}

export function isGitHubOAuthConfigured() {
  return Boolean(
    process.env.GITHUB_OAUTH_CLIENT_ID &&
      process.env.GITHUB_OAUTH_CLIENT_SECRET &&
      process.env.GITHUB_OAUTH_COOKIE_SECRET
  );
}

export function getGitHubOAuthClientId() {
  return process.env.GITHUB_OAUTH_CLIENT_ID || "";
}

export function getGitHubOAuthClientSecret() {
  return process.env.GITHUB_OAUTH_CLIENT_SECRET || "";
}

export function getGitHubOAuthScope() {
  return (
    process.env.SHOWCASE_GITHUB_SCOPE || "read:user user:email public_repo"
  );
}

export function getGitHubOAuthRedirectUri(req: NextRequest) {
  const basePath = getBasePath();
  const fromEnv = String(process.env.GITHUB_OAUTH_REDIRECT_URI || "").trim();
  if (fromEnv) return fromEnv;

  const origin = (() => {
    const appUrl = String(process.env.NEXT_PUBLIC_APP_URL || "").trim();
    if (!appUrl) return req.nextUrl.origin;
    try {
      return new URL(appUrl).origin;
    } catch {
      return req.nextUrl.origin;
    }
  })();

  return `${origin}${basePath}/api/showcase/github/callback`;
}

function deriveKey(secret: string) {
  return crypto.createHash("sha256").update(secret).digest();
}

function encryptJson(payload: unknown, secret: string) {
  const iv = crypto.randomBytes(12);
  const key = deriveKey(secret);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}

function decryptJson(token: string, secret: string) {
  const buf = Buffer.from(token, "base64url");
  if (buf.length < 12 + 16) return null;
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const key = deriveKey(secret);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
  return JSON.parse(plaintext) as unknown;
}

export function createOAuthState() {
  return crypto.randomBytes(32).toString("base64url");
}

function cookieSecureFlag() {
  return process.env.NODE_ENV === "production";
}

function cookieSecret() {
  return process.env.GITHUB_OAUTH_COOKIE_SECRET || "";
}

export function setOAuthStateCookie(res: NextResponse, state: string) {
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: cookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
}

export function setOAuthNextCookie(res: NextResponse, nextPath: string) {
  const s = String(nextPath || "").trim();
  if (!s) return;
  res.cookies.set(NEXT_COOKIE, s, {
    httpOnly: true,
    secure: cookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
}

export function readOAuthStateCookie(req: NextRequest) {
  return req.cookies.get(STATE_COOKIE)?.value || "";
}

export function readOAuthNextCookie(req: NextRequest) {
  return req.cookies.get(NEXT_COOKIE)?.value || "";
}

export function clearOAuthStateCookie(res: NextResponse) {
  res.cookies.set(STATE_COOKIE, "", {
    httpOnly: true,
    secure: cookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function clearOAuthNextCookie(res: NextResponse) {
  res.cookies.set(NEXT_COOKIE, "", {
    httpOnly: true,
    secure: cookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function setGitHubSessionCookie(
  res: NextResponse,
  session: { accessToken: string; createdAt: string }
) {
  const secret = cookieSecret();
  if (!secret) return;
  const value = encryptJson(session, secret);
  res.cookies.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: cookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge: 14 * 24 * 60 * 60,
  });
}

export function clearGitHubSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: cookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function readGitHubSession(req: NextRequest) {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const secret = cookieSecret();
  if (!secret) return null;
  try {
    const parsed = decryptJson(raw, secret) as
      | { accessToken?: unknown; createdAt?: unknown }
      | null;
    if (!parsed) return null;
    if (typeof parsed.accessToken !== "string") return null;
    if (typeof parsed.createdAt !== "string") return null;
    return { accessToken: parsed.accessToken, createdAt: parsed.createdAt };
  } catch {
    return null;
  }
}
