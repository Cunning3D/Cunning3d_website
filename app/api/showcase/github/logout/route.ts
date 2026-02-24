import { NextRequest, NextResponse } from "next/server";
import { clearGitHubSessionCookie, getBasePath } from "@/lib/showcase/github-oauth";

export async function POST(req: NextRequest) {
  const basePath = getBasePath();
  const res = NextResponse.redirect(
    new URL(`${basePath}/showcase/submit`, req.nextUrl.origin)
  );
  clearGitHubSessionCookie(res);
  return res;
}

export async function GET(req: NextRequest) {
  return POST(req);
}

