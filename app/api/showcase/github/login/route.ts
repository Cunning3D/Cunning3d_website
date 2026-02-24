import { NextRequest, NextResponse } from "next/server";
import {
  createOAuthState,
  getBasePath,
  getGitHubOAuthClientId,
  getGitHubOAuthRedirectUri,
  getGitHubOAuthScope,
  isGitHubOAuthConfigured,
  normalizeNextPath,
  setOAuthNextCookie,
  setOAuthStateCookie,
} from "@/lib/showcase/github-oauth";

export async function GET(req: NextRequest) {
  if (!isGitHubOAuthConfigured()) {
    return NextResponse.json(
      { error: "GitHub OAuth not configured" },
      { status: 501 }
    );
  }

  const basePath = getBasePath();
  const nextPath = normalizeNextPath(req.nextUrl.searchParams.get("next"), basePath);

  const state = createOAuthState();
  const params = new URLSearchParams();
  params.set("client_id", getGitHubOAuthClientId());
  params.set("redirect_uri", getGitHubOAuthRedirectUri(req));
  params.set("scope", getGitHubOAuthScope());
  params.set("state", state);
  params.set("allow_signup", "true");

  const res = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
  setOAuthStateCookie(res, state);
  if (nextPath) setOAuthNextCookie(res, nextPath);
  return res;
}
