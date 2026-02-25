"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Plus, RefreshCw, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ForumThread = {
  number: number;
  title: string;
  author: string;
  createdAt: string;
  comments: number;
  likes: number;
  url: string;
  state: string;
};

type ForumSort = "new" | "popular";
const DEFAULT_SORT: ForumSort = "new";

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

export default function ForumPage() {
  const t = useTranslations("forum");
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ForumSort>(DEFAULT_SORT);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedKeys, setLikedKeys] = useState<Set<string>>(() => new Set());
  const [savingKeys, setSavingKeys] = useState<Set<string>>(() => new Set());

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(withBasePath("/api/forum/threads"), window.location.origin);
      url.searchParams.set("page", "1");
      url.searchParams.set("perPage", "30");
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) {
        setError(`${t("loadFailed")} (${res.status})`);
        setThreads([]);
        return;
      }
      const json = (await res.json()) as { threads?: ForumThread[] };
      const list = Array.isArray(json?.threads) ? json.threads : [];
      setThreads(list);
      setLikeCounts(
        Object.fromEntries(
          list.map((th) => [String(th.number), Math.max(0, th.likes || 0)])
        )
      );
    } catch {
      setError(t("loadFailed"));
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter((th) => {
      const hay = `${th.title} ${th.author}`.toLowerCase();
      return hay.includes(q);
    });
  }, [threads, query]);

  useEffect(() => {
    const numbers = threads.map((th) => String(th.number)).filter(Boolean);
    if (numbers.length === 0) return;

    let cancelled = false;
    const run = async () => {
      try {
        const url = new URL(withBasePath("/api/forum/likes"), window.location.origin);
        url.searchParams.set("numbers", numbers.join(","));
        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as {
          counts?: Record<string, number>;
          viewerLiked?: Record<string, boolean> | null;
        };
        if (cancelled) return;

        if (json?.counts && typeof json.counts === "object") {
          setLikeCounts((prev) => ({ ...prev, ...json.counts }));
        }
        if (json?.viewerLiked && typeof json.viewerLiked === "object") {
          setLikedKeys(
            new Set(
              Object.entries(json.viewerLiked)
                .filter(([, v]) => v === true)
                .map(([k]) => k)
            )
          );
        }
      } catch {
        // ignore
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [threads]);

  const sorted = useMemo(() => {
    const out = [...filtered];
    if (sort === "popular") {
      out.sort((a, b) => {
        const la = likeCounts[String(a.number)] ?? Math.max(0, a.likes || 0);
        const lb = likeCounts[String(b.number)] ?? Math.max(0, b.likes || 0);
        const d = lb - la;
        if (d !== 0) return d;
        const ta = Date.parse(a.createdAt) || 0;
        const tb = Date.parse(b.createdAt) || 0;
        return tb - ta;
      });
      return out;
    }

    // new
    out.sort((a, b) => {
      const ta = Date.parse(a.createdAt) || 0;
      const tb = Date.parse(b.createdAt) || 0;
      return tb - ta;
    });
    return out;
  }, [filtered, sort, likeCounts]);

  const toggleLike = async (threadNumber: number) => {
    const key = String(threadNumber);
    if (!key) return;
    if (savingKeys.has(key)) return;

    setSavingKeys((prev) => new Set(prev).add(key));
    try {
      const res = await fetch(withBasePath("/api/forum/likes"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: threadNumber, action: "toggle" }),
      });

      if (res.status === 401) {
        const next = `${window.location.pathname}${window.location.search}`;
        window.location.href = withBasePath(
          `/api/showcase/github/login?next=${encodeURIComponent(next)}`
        );
        return;
      }

      const json = (await res.json()) as { count?: number; liked?: boolean };
      if (res.ok) {
        if (typeof json.count === "number" && Number.isFinite(json.count)) {
          const nextCount = Math.max(0, Math.floor(json.count));
          setLikeCounts((prev) => ({
            ...prev,
            [key]: nextCount,
          }));
        }
        if (typeof json.liked === "boolean") {
          const nextLiked = json.liked;
          setLikedKeys((prev) => {
            const next = new Set(prev);
            if (nextLiked) next.add(key);
            else next.delete(key);
            return next;
          });
        }
      }
    } catch {
      // ignore
    } finally {
      setSavingKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-14 text-white">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold flex items-center gap-3">
                <MessageCircle className="w-10 h-10" />
                {t("title")}
              </h1>
              <p className="mt-3 text-slate-300 max-w-2xl">{t("subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/forum/new">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("newPost")}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                onClick={() => void load()}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t("refresh")}
              </Button>
            </div>
          </div>

          <div className="mt-6 max-w-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="bg-white/10 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-400/40"
              />
              <div className="sm:w-44">
                <Select value={sort} onValueChange={(v) => setSort(v as ForumSort)}>
                  <SelectTrigger className="bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder={t("sort.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{t("sort.new")}</SelectItem>
                    <SelectItem value="popular">{t("sort.popular")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          {error ? (
            <div className="rounded-lg border bg-background p-4 text-sm">
              <div className="font-medium">{t("errorTitle")}</div>
              <div className="text-muted-foreground mt-1">{error}</div>
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">{t("loading")}</div>
            ) : sorted.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("empty")}</div>
            ) : (
              sorted.map((th) => {
                const key = String(th.number);
                const liked = likedKeys.has(key);
                const saving = savingKeys.has(key);
                const likeCount = likeCounts[key] ?? Math.max(0, th.likes || 0);
                return (
                <div
                  key={th.number}
                  className="rounded-xl border bg-white dark:bg-slate-900 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/forum/${th.number}`}
                        className="font-semibold hover:underline truncate block"
                      >
                        {th.title}
                      </Link>
                      <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                        <span>
                          {t("by")} {th.author}
                        </span>
                        <span>{formatShortDate(th.createdAt)}</span>
                        <span>
                          {t("replies", { count: th.comments })}
                        </span>
                        <button
                          type="button"
                          onClick={() => void toggleLike(th.number)}
                          disabled={saving}
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
                        {th.state === "closed" ? (
                          <span className="text-amber-600 dark:text-amber-400">
                            {t("closed")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {th.url ? (
                      <a
                        href={th.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground shrink-0"
                      >
                        {t("openInGithub")}
                      </a>
                    ) : null}
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
}
