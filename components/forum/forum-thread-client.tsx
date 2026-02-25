"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Github, Send, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type GitHubMe =
  | {
      login: string;
      name?: string | null;
      avatarUrl: string;
      htmlUrl: string;
    }
  | null;

type ForumThread = {
  number: number;
  title: string;
  titleRaw: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  comments: number;
  likes: number;
  url: string;
  state: string;
  author: { login: string; avatarUrl: string; htmlUrl: string };
};

type ForumComment = {
  id: number | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  author: { login: string; avatarUrl: string; htmlUrl: string };
};

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

function formatShortDate(iso: string) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function ForumThreadClient({ number }: { number: number }) {
  const t = useTranslations("forum");

  const threadNumber = useMemo(() => {
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : null;
  }, [number]);

  const [thread, setThread] = useState<ForumThread | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [me, setMe] = useState<GitHubMe>(null);
  const [checkingMe, setCheckingMe] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [savingLike, setSavingLike] = useState(false);

  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const loginHref = useMemo(() => {
    const next = threadNumber ? `/forum/${threadNumber}` : "/forum";
    return withBasePath(
      `/api/showcase/github/login?next=${encodeURIComponent(next)}`
    );
  }, [threadNumber]);

  const load = async () => {
    if (!threadNumber) return;
    setLoading(true);
    setError(null);
    try {
      const url = new URL(
        withBasePath(`/api/forum/thread/${threadNumber}`),
        window.location.origin
      );
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) {
        setError(`${t("loadFailed")} (${res.status})`);
        setThread(null);
        setComments([]);
        return;
      }
      const json = (await res.json()) as {
        thread?: ForumThread;
        comments?: ForumComment[];
      };
      setThread(json?.thread || null);
      setComments(Array.isArray(json?.comments) ? json.comments : []);
      const initialLikes =
        typeof json?.thread?.likes === "number" && Number.isFinite(json.thread.likes)
          ? Math.max(0, Math.floor(json.thread.likes))
          : 0;
      setLikeCount(initialLikes);
    } catch {
      setError(t("loadFailed"));
      setThread(null);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadNumber]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setCheckingMe(true);
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
        if (!cancelled) setCheckingMe(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!threadNumber) return;
    let cancelled = false;

    const run = async () => {
      try {
        const url = new URL(withBasePath("/api/forum/likes"), window.location.origin);
        url.searchParams.set("numbers", String(threadNumber));
        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as {
          counts?: Record<string, number>;
          viewerLiked?: Record<string, boolean> | null;
        };
        if (cancelled) return;

        const c = json?.counts?.[String(threadNumber)];
        if (typeof c === "number" && Number.isFinite(c)) {
          setLikeCount(Math.max(0, Math.floor(c)));
        }
        const l =
          json?.viewerLiked && typeof json.viewerLiked === "object"
            ? json.viewerLiked[String(threadNumber)]
            : undefined;
        if (typeof l === "boolean") setLiked(l);
      } catch {
        // ignore
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [threadNumber]);

  const toggleLike = async () => {
    if (!threadNumber) return;
    if (savingLike) return;

    setSavingLike(true);
    try {
      const res = await fetch(withBasePath("/api/forum/likes"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: threadNumber, action: "toggle" }),
      });

      if (res.status === 401) {
        window.location.href = loginHref;
        return;
      }

      const json = (await res.json()) as { count?: number; liked?: boolean };
      if (res.ok) {
        if (typeof json.count === "number" && Number.isFinite(json.count)) {
          setLikeCount(Math.max(0, Math.floor(json.count)));
        }
        if (typeof json.liked === "boolean") {
          setLiked(json.liked);
        }
      }
    } catch {
      // ignore
    } finally {
      setSavingLike(false);
    }
  };

  const canReply = Boolean(me && reply.trim() && !replying);

  const postReply = async () => {
    if (!threadNumber || !canReply) return;
    setReplying(true);
    setReplyError(null);
    try {
      const res = await fetch(
        withBasePath(`/api/forum/thread/${threadNumber}/comment`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: reply }),
        }
      );

      if (res.status === 401) {
        window.location.href = loginHref;
        return;
      }

      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setReplyError(json?.error || t("replyFailed"));
        return;
      }

      setReply("");
      await load();
    } catch {
      setReplyError(t("replyFailed"));
    } finally {
      setReplying(false);
    }
  };

  return (
    <section className="py-12">
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <Link href="/forum">
            <Button variant="outline">{t("back")}</Button>
          </Link>
          {thread?.url ? (
            <a
              href={thread.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t("openInGithub")}
            </a>
          ) : null}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-sm text-muted-foreground">{t("loading")}</div>
          ) : error ? (
            <div className="rounded-lg border bg-background p-4 text-sm">
              <div className="font-medium">{t("errorTitle")}</div>
              <div className="text-muted-foreground mt-1">{error}</div>
            </div>
          ) : !thread ? (
            <div className="text-sm text-muted-foreground">{t("notFound")}</div>
          ) : (
            <>
              <div className="rounded-xl border bg-white dark:bg-slate-900 p-6">
                <h1 className="font-heading text-2xl font-bold">{thread.title}</h1>
                <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                  <span>
                    {t("by")}{" "}
                    <a
                      href={thread.author.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      @{thread.author.login}
                    </a>
                  </span>
                  <span>{formatShortDate(thread.createdAt)}</span>
                  <span>{t("replies", { count: thread.comments })}</span>
                  <button
                    type="button"
                    onClick={() => void toggleLike()}
                    disabled={savingLike}
                    aria-pressed={liked}
                    aria-label={liked ? t("like.unlike") : t("like.like")}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 transition-colors ${
                      liked
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-transparent hover:bg-accent"
                    } disabled:opacity-60 disabled:pointer-events-none`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{likeCount}</span>
                  </button>
                  {thread.state === "closed" ? (
                    <span className="text-amber-600 dark:text-amber-400">
                      {t("closed")}
                    </span>
                  ) : null}
                </div>
                {thread.body ? (
                  <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {thread.body}
                  </div>
                ) : null}
              </div>

              <div className="mt-8">
                <div className="text-sm font-semibold mb-3">
                  {t("repliesTitle", { count: comments.length })}
                </div>
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      {t("noReplies")}
                    </div>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c.id ?? `${c.author.login}-${c.createdAt}`}
                        className="rounded-xl border bg-white dark:bg-slate-900 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-xs text-muted-foreground">
                            <a
                              href={c.author.htmlUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                            >
                              @{c.author.login}
                            </a>{" "}
                            · {formatShortDate(c.createdAt)}
                          </div>
                          {c.url ? (
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-muted-foreground hover:text-foreground"
                            >
                              {t("openInGithub")}
                            </a>
                          ) : null}
                        </div>
                        {c.body ? (
                          <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                            {c.body}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-10 rounded-xl border bg-white dark:bg-slate-900 p-6">
                <div className="text-sm font-semibold">{t("replyTitle")}</div>

                {checkingMe ? (
                  <div className="mt-3 text-sm text-muted-foreground">
                    {t("checking")}
                  </div>
                ) : !me ? (
                  <div className="mt-3 space-y-3">
                    <div className="text-sm">{t("signInToReply")}</div>
                    <a
                      href={loginHref}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-black/90"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      {t("signInGithub")}
                    </a>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {replyError ? (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                        {replyError}
                      </div>
                    ) : null}
                    <Textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder={t("placeholders.reply")}
                      rows={6}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={() => void postReply()}
                        disabled={!canReply}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {replying ? t("replying") : t("reply")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
