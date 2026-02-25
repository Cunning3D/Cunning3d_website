"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Github, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type GitHubMe =
  | {
      login: string;
      name?: string | null;
      avatarUrl: string;
      htmlUrl: string;
    }
  | null;

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

export default function ForumNewPage() {
  const t = useTranslations("forum");
  const router = useRouter();

  const [me, setMe] = useState<GitHubMe>(null);
  const [checking, setChecking] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setChecking(true);
      try {
        const res = await fetch(withBasePath("/api/showcase/github/me"), {
          cache: "no-store",
        });
        if (!res.ok) {
          if (!cancelled) setMe(null);
          return;
        }
        const json = (await res.json()) as Exclude<GitHubMe, null>;
        if (!cancelled) setMe(json);
      } catch {
        if (!cancelled) setMe(null);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const loginHref = useMemo(() => {
    return withBasePath(
      `/api/showcase/github/login?next=${encodeURIComponent("/forum/new")}`
    );
  }, []);

  const canSubmit = Boolean(me && title.trim() && !submitting);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(withBasePath("/api/forum/thread"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      if (res.status === 401) {
        window.location.href = loginHref;
        return;
      }

      const json = (await res.json()) as { number?: number; error?: string };
      if (!res.ok || typeof json.number !== "number") {
        setError(json?.error || t("postFailed"));
        return;
      }

      router.push(`/forum/${json.number}`);
    } catch {
      setError(t("postFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12">
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold">{t("newTitle")}</h1>
            <p className="text-sm text-muted-foreground mt-2">{t("newDesc")}</p>
          </div>
          <Link href="/forum">
            <Button variant="outline">{t("back")}</Button>
          </Link>
        </div>

        <div className="mt-8 rounded-xl border bg-white dark:bg-slate-900 p-6">
          {checking ? (
            <div className="text-sm text-muted-foreground">{t("checking")}</div>
          ) : !me ? (
            <div className="space-y-3">
              <div className="text-sm">{t("signInToPost")}</div>
              <a
                href={loginHref}
                className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-black/90"
              >
                <Github className="w-4 h-4 mr-2" />
                {t("signInGithub")}
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {t("postingAs")}{" "}
                <a
                  href={me.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:underline"
                >
                  @{me.login}
                </a>
              </div>

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                  {error}
                </div>
              ) : null}

              <div className="space-y-2">
                <div className="text-sm font-medium">{t("fields.title")}</div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("placeholders.title")}
                  maxLength={120}
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">{t("fields.body")}</div>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={t("placeholders.body")}
                  rows={10}
                />
                <div className="text-xs text-muted-foreground">
                  {t("markdownHint")}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => void submit()} disabled={!canSubmit}>
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? t("posting") : t("post")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
