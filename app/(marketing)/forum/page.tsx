"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ForumThread = {
  number: number;
  title: string;
  author: string;
  createdAt: string;
  comments: number;
  url: string;
  state: string;
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

export default function ForumPage() {
  const t = useTranslations("forum");
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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
      setThreads(Array.isArray(json?.threads) ? json.threads : []);
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
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="bg-white/10 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-400/40"
            />
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
            ) : filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("empty")}</div>
            ) : (
              filtered.map((th) => (
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
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

