"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GitHubMe =
  | {
      login: string;
      name?: string | null;
      avatarUrl: string;
      htmlUrl: string;
    }
  | null;

function parseTags(value: string) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeBasePath(p: unknown) {
  const s = String(p || "").trim();
  if (!s) return "";
  const withLeadingSlash = s.startsWith("/") ? s : `/${s}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
const withBasePath = (p: string) =>
  `${BASE_PATH}${p.startsWith("/") ? p : `/${p}`}`;

export function ShowcaseSubmitClient({
  oauthEnabled,
  submissionsRepo,
}: {
  oauthEnabled: boolean;
  submissionsRepo: string;
}) {
  const [me, setMe] = useState<GitHubMe>(null);
  const [loadingMe, setLoadingMe] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("Community, Example");
  const [cdaFile, setCdaFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prUrl, setPrUrl] = useState<string | null>(null);

  const tags = useMemo(() => parseTags(tagsInput), [tagsInput]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoadingMe(true);
      try {
        const res = await fetch(withBasePath("/api/showcase/github/me"), {
          cache: "no-store",
        });
        if (!res.ok) {
          if (!cancelled) setMe(null);
          return;
        }
        const json = (await res.json()) as {
          login: string;
          name?: string | null;
          avatarUrl: string;
          htmlUrl: string;
        };
        if (!cancelled) setMe(json);
      } finally {
        if (!cancelled) setLoadingMe(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const canSubmit = Boolean(me && cdaFile && !submitting);

  const onSubmit = async () => {
    if (!me || !cdaFile) return;
    setSubmitting(true);
    setError(null);
    setPrUrl(null);
    try {
      const fd = new FormData();
      fd.set("title", title);
      fd.set("description", description);
      fd.set("tags", tags.join(","));
      fd.set("cda", cdaFile);
      if (imageFile) fd.set("image", imageFile);

      const res = await fetch(withBasePath("/api/showcase/submit"), {
        method: "POST",
        body: fd,
      });
      const json = (await res.json()) as { prUrl?: string; error?: string };
      if (!res.ok) {
        setError(json.error || "Submit failed");
        return;
      }
      if (json.prUrl) setPrUrl(json.prUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-heading text-lg font-semibold">
              GitHub login (recommended)
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Creates a PR to <code>{submissionsRepo}</code>.
            </div>
          </div>

          <div className="flex items-center gap-2">
            {me ? (
              <>
                <a
                  href={me.htmlUrl}
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  <Image
                    src={me.avatarUrl}
                    alt={me.login}
                    width={18}
                    height={18}
                    className="rounded-full"
                  />
                  {me.login}
                </a>
                <form
                  action={withBasePath("/api/showcase/github/logout")}
                  method="post"
                >
                  <Button type="submit" variant="outline" size="sm">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <a
                href={
                  oauthEnabled
                    ? withBasePath("/api/showcase/github/login")
                    : undefined
                }
                className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  oauthEnabled
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
                }`}
                aria-disabled={!oauthEnabled}
              >
                {loadingMe ? "Checking…" : "Sign in with GitHub"}
              </a>
            )}
          </div>
        </div>

        {!oauthEnabled ? (
          <div className="mt-4 text-sm text-amber-700 dark:text-amber-400">
            GitHub OAuth is not configured on this deployment yet. Ask the site
            owner to set <code>GITHUB_OAUTH_CLIENT_ID</code>,{" "}
            <code>GITHUB_OAUTH_CLIENT_SECRET</code>,{" "}
            <code>GITHUB_OAUTH_COOKIE_SECRET</code>.
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border bg-white dark:bg-slate-950 p-5">
        <div className="font-heading text-lg font-semibold mb-1">Upload</div>
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          Provide a <code>.cda</code> and (optionally) a cover image. Keep it
          small—PRs are reviewed manually.
        </div>

        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Title</div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Procedural City"
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Tags</div>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Community, PCG, Roads"
              />
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Description</div>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this CDA demonstrate?"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">CDA file</div>
              <Input
                type="file"
                accept=".cda"
                onChange={(e) => setCdaFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Cover image (optional)</div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {error ? (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : null}

          {prUrl ? (
            <div className="text-sm">
              PR created:{" "}
              <a href={prUrl} className="underline underline-offset-4">
                {prUrl}
              </a>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onSubmit} disabled={!canSubmit}>
              {submitting ? "Creating PR…" : "Create PR"}
            </Button>
            <Link
              href="/showcase"
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              Back
            </Link>
          </div>

          {!me ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with GitHub first to prevent anonymous spam.
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-5">
        <div className="font-heading text-lg font-semibold mb-1">Manual PR</div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          If automatic upload is unavailable, you can still contribute by
          opening a PR that adds your <code>.cda</code> (and a same-name cover
          image) into <code>public/examples/</code>.
        </div>
      </div>
    </div>
  );
}
