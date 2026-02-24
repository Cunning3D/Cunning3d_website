import { NextRequest, NextResponse } from "next/server";
import {
  clearGitHubSessionCookie,
  clearOAuthStateCookie,
  clearOAuthNextCookie,
  getBasePath,
  getGitHubOAuthClientId,
  getGitHubOAuthClientSecret,
  getGitHubOAuthRedirectUri,
  isGitHubOAuthConfigured,
  normalizeNextPath,
  readOAuthNextCookie,
  readOAuthStateCookie,
  setGitHubSessionCookie,
} from "@/lib/showcase/github-oauth";

type GitHubTokenResponse =
  | {
      access_token: string;
      token_type: string;
      scope: string;
    }
  | {
      error: string;
      error_description?: string;
      error_uri?: string;
    };

export async function GET(req: NextRequest) {
  const basePath = getBasePath();
  const defaultRedirectPath = `${basePath}/showcase/submit`;
  const nextFromCookie = normalizeNextPath(readOAuthNextCookie(req), basePath);
  const redirectTo = new URL(nextFromCookie || defaultRedirectPath, req.nextUrl.origin);

  if (!isGitHubOAuthConfigured()) {
    return NextResponse.redirect(redirectTo);
  }

  const url = req.nextUrl;
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";

  const expectedState = readOAuthStateCookie(req);
  if (error || !code || !state || !expectedState || state !== expectedState) {
    const res = NextResponse.redirect(redirectTo);
    clearOAuthStateCookie(res);
    clearOAuthNextCookie(res);
    clearGitHubSessionCookie(res);
    return res;
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: getGitHubOAuthClientId(),
      client_secret: getGitHubOAuthClientSecret(),
      code,
      redirect_uri: getGitHubOAuthRedirectUri(req),
    }),
  });

  const tokenJson = (await tokenRes.json()) as GitHubTokenResponse;
  if (!tokenRes.ok || !("access_token" in tokenJson)) {
    const res = NextResponse.redirect(redirectTo);
    clearOAuthStateCookie(res);
    clearOAuthNextCookie(res);
    clearGitHubSessionCookie(res);
    return res;
  }

  const res = NextResponse.redirect(redirectTo);
  clearOAuthStateCookie(res);
  clearOAuthNextCookie(res);
  setGitHubSessionCookie(res, {
    accessToken: tokenJson.access_token,
    createdAt: new Date().toISOString(),
  });
  return res;
}
