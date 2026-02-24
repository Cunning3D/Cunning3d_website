"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Github, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type GitHubMe =
  | {
      login: string;
      name?: string | null;
      avatarUrl: string;
      htmlUrl: string;
    }
  | null;

type ShowcaseIndexItem = {
  id: string;
  title: string;
  author: string;
  authorLink?: string;
  image: string;
  description: string;
  tags: string[];
  featured?: boolean;
  cdaUrl: string;
  bytes?: number;
  updatedAt?: string;
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

function buildViewerHref(item: Pick<ShowcaseIndexItem, "id" | "title" | "cdaUrl">) {
  const params = new URLSearchParams();
  params.set("id", item.id);
  params.set("cda", item.cdaUrl);
  params.set("title", item.title);
  return `/showcase/viewer?${params.toString()}`;
}

function formatBytes(bytes: number | undefined) {
  if (!Number.isFinite(bytes) || !bytes || bytes <= 0) return "";
  const kb = 1024;
  const mb = kb * 1024;
  if (bytes >= mb) return `${(bytes / mb).toFixed(1)} MB`;
  if (bytes >= kb) return `${(bytes / kb).toFixed(1)} KB`;
  return `${bytes} B`;
}

function formatShortDate(iso: string | undefined) {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AccountPage() {
  const t = useTranslations("account");
  const tNav = useTranslations("nav");

  const [me, setMe] = useState<GitHubMe>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [myWorks, setMyWorks] = useState<ShowcaseIndexItem[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(false);

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
        const json = (await res.json()) as Exclude<GitHubMe, null>;
        if (!cancelled) setMe(json);
      } catch {
        if (!cancelled) setMe(null);
      } finally {
        if (!cancelled) setLoadingMe(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!me?.login) return;

    const run = async () => {
      setLoadingWorks(true);
      try {
        const res = await fetch(withBasePath("/examples/index.json"), {
          cache: "no-store",
        });
        const json = (await res.json()) as { items?: ShowcaseIndexItem[] };
        const items = Array.isArray(json.items) ? json.items : [];
        const mine = items.filter((it) => it.author === me.login);
        if (!cancelled) setMyWorks(mine);
      } catch {
        if (!cancelled) setMyWorks([]);
      } finally {
        if (!cancelled) setLoadingWorks(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [me?.login]);

  const loginHref = useMemo(() => withBasePath(`/api/showcase/github/login?next=${encodeURIComponent(withBasePath("/account"))}`), []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      <div className="container py-12">
        <div className="max-w-4xl">
          <div className="text-xs text-muted-foreground mb-2">{t("breadcrumb")}</div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {t("title")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t("subtitle")}
          </p>

          {loadingMe ? (
            <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-6">
              <div className="text-sm text-muted-foreground">{t("loading")}</div>
            </div>
          ) : !me ? (
            <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-6">
              <div className="font-heading text-lg font-semibold mb-1">
                {t("notSignedInTitle")}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {t("notSignedInDesc")}
              </div>
              <a href={loginHref}>
                <Button>
                  <Github className="w-4 h-4 mr-2" />
                  {tNav("login")}
                </Button>
              </a>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="rounded-xl border bg-white dark:bg-slate-950 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={me.avatarUrl} alt={me.login} />
                      <AvatarFallback className="font-semibold">
                        {me.login.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-heading text-xl font-semibold truncate">
                        {me.name || me.login}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        @{me.login}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href="/showcase/submit">
                      <Button variant="default">
                        <Upload className="w-4 h-4 mr-2" />
                        {t("submitShowcase")}
                      </Button>
                    </Link>
                    <a href={me.htmlUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline">
                        <Github className="w-4 h-4 mr-2" />
                        {t("viewGithub")}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-white dark:bg-slate-950 p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="font-heading text-lg font-semibold">
                    {t("myWorks")}
                  </div>
                  <div className="text-sm text-muted-foreground tabular-nums">
                    {loadingWorks ? "…" : myWorks.length}
                  </div>
                </div>

                {loadingWorks ? (
                  <div className="text-sm text-muted-foreground">{t("loadingWorks")}</div>
                ) : myWorks.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {t("noWorks")}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {myWorks.map((item) => (
                      <Link
                        key={item.id}
                        href={buildViewerHref(item)}
                        className="group rounded-xl overflow-hidden border bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <div className="p-4">
                          <div className="font-semibold truncate">{item.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground flex items-center justify-between gap-2">
                            <span className="truncate">{formatBytes(item.bytes)}</span>
                            <span className="shrink-0">{formatShortDate(item.updatedAt)}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {(item.tags || []).slice(0, 3).map((tag) => (
                              <Badge key={`${item.id}-${tag}`} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

