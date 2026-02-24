import { NextRequest, NextResponse } from "next/server";
import {
  createOAuthState,
  getGitHubOAuthClientId,
  getGitHubOAuthRedirectUri,
  getGitHubOAuthScope,
  isGitHubOAuthConfigured,
  setOAuthStateCookie,
} from "@/lib/showcase/github-oauth";

export async function GET(req: NextRequest) {
  if (!isGitHubOAuthConfigured()) {
    return NextResponse.json(
      { error: "GitHub OAuth not configured" },
      { status: 501 }
    );
  }

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
  return res;
}

