import { NextRequest, NextResponse } from "next/server";
import { readGitHubSession } from "@/lib/showcase/github-oauth";

export async function GET(req: NextRequest) {
  const session = readGitHubSession(req);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const ghRes = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  if (!ghRes.ok) {
    return NextResponse.json({ error: "GitHub API error" }, { status: 401 });
  }

  const json = (await ghRes.json()) as {
    login?: unknown;
    name?: unknown;
    avatar_url?: unknown;
    html_url?: unknown;
  };

  if (typeof json.login !== "string") {
    return NextResponse.json({ error: "GitHub API error" }, { status: 401 });
  }

  return NextResponse.json({
    login: json.login,
    name: typeof json.name === "string" ? json.name : null,
    avatarUrl: typeof json.avatar_url === "string" ? json.avatar_url : "",
    htmlUrl: typeof json.html_url === "string" ? json.html_url : "",
  });
}

