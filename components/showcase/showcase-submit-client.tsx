"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("showcase");
  const [me, setMe] = useState<GitHubMe>(null);
  const [loadingMe, setLoadingMe] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState(t("submit.placeholders.tags"));
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
        setError(json.error || t("submit.submitFailed"));
        return;
      }
      if (json.prUrl) setPrUrl(json.prUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("submit.submitFailed"));
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
              {t("submit.githubLoginTitle")}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {t.rich("submit.githubLoginDesc", {
                repo: submissionsRepo,
                code: (chunks) => <code>{chunks}</code>,
              })}
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
                    {t("submit.signOut")}
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
                {loadingMe ? t("submit.checking") : t("submit.signInGithub")}
              </a>
            )}
          </div>
        </div>

        {!oauthEnabled ? (
          <div className="mt-4 text-sm text-amber-700 dark:text-amber-400">
            {t("submit.oauthNotConfigured")}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border bg-white dark:bg-slate-950 p-5">
        <div className="font-heading text-lg font-semibold mb-1">{t("submit.uploadTitle")}</div>
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          {t("submit.uploadDesc")}
        </div>

        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("submit.fields.title")}</div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("submit.placeholders.title")}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("submit.fields.tags")}</div>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder={t("submit.placeholders.tags")}
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
            <div className="text-sm font-medium">{t("submit.fields.description")}</div>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("submit.placeholders.description")}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("submit.fields.cdaFile")}</div>
              <Input
                type="file"
                accept=".cda"
                onChange={(e) => setCdaFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("submit.fields.coverImage")}</div>
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
              {t("submit.prCreated")}{" "}
              <a href={prUrl} className="underline underline-offset-4">
                {prUrl}
              </a>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onSubmit} disabled={!canSubmit}>
              {submitting ? t("submit.creatingPr") : t("submit.createPr")}
            </Button>
            <Link
              href="/showcase"
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              {t("submit.back")}
            </Link>
          </div>

          {!me ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t("submit.signInHint")}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-5">
        <div className="font-heading text-lg font-semibold mb-1">{t("submit.manualPrTitle")}</div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {t("submit.manualPrDesc")}
        </div>
      </div>
    </div>
  );
}
