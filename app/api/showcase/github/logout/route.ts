import { NextRequest, NextResponse } from "next/server";
import { clearGitHubSessionCookie, getBasePath, normalizeNextPath } from "@/lib/showcase/github-oauth";

export async function POST(req: NextRequest) {
  const basePath = getBasePath();
  const defaultRedirectPath = `${basePath}/showcase/submit`;
  const nextPath = normalizeNextPath(req.nextUrl.searchParams.get("next"), basePath);
  const res = NextResponse.redirect(new URL(nextPath || defaultRedirectPath, req.nextUrl.origin));
  clearGitHubSessionCookie(res);
  return res;
}

export async function GET(req: NextRequest) {
  return POST(req);
}
