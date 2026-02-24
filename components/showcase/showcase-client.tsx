"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Heart,
  MagnifyingGlass,
  Palette,
  Star,
  X,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShowcaseLikes } from "@/components/showcase/use-showcase-likes";

export interface ShowcaseItem {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  tags: string[];
  featured?: boolean;
  cdaUrl: string;
  bytes?: number;
  updatedAt?: string;
}

type ShowcaseSort = "featured" | "new" | "size" | "az";
const DEFAULT_SORT: ShowcaseSort = "featured";
const PER_PAGE = 24;

type ShowcaseQueryState = {
  tag: string;
  q: string;
  sort: ShowcaseSort;
  page: number;
};

function safeTrimmedString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function parseSort(v: string): ShowcaseSort {
  switch (v) {
    case "featured":
    case "new":
    case "size":
    case "az":
      return v;
    default:
      return DEFAULT_SORT;
  }
}

function parsePage(v: string) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const kb = 1024;
  const mb = kb * 1024;
  if (bytes >= mb) return `${(bytes / mb).toFixed(1)} MB`;
  if (bytes >= kb) return `${(bytes / kb).toFixed(1)} KB`;
  return `${bytes} B`;
}

function formatShortDate(iso: string) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildViewerHref(item: ShowcaseItem) {
  const params = new URLSearchParams();
  params.set("cda", item.cdaUrl);
  params.set("title", item.title);
  return `/showcase/viewer?${params.toString()}`;
}

function readQueryFromLocation(): ShowcaseQueryState {
  if (typeof window === "undefined") {
    return { tag: "", q: "", sort: DEFAULT_SORT, page: 1 };
  }

  const params = new URLSearchParams(window.location.search);
  const tag = safeTrimmedString(params.get("tag"));
  const q = safeTrimmedString(params.get("q"));
  const sort = parseSort(safeTrimmedString(params.get("sort")));
  const page = parsePage(safeTrimmedString(params.get("page")));

  return { tag, q, sort, page };
}

function writeQueryToLocation(next: ShowcaseQueryState, mode: "push" | "replace") {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  const params = url.searchParams;
  params.delete("tag");
  params.delete("q");
  params.delete("sort");
  params.delete("page");

  if (next.tag) params.set("tag", next.tag);
  if (next.q) params.set("q", next.q);
  if (next.sort && next.sort !== DEFAULT_SORT) params.set("sort", next.sort);
  if (next.page && next.page > 1) params.set("page", String(next.page));

  const nextUrl = url.toString();
  if (mode === "replace") {
    window.history.replaceState(null, "", nextUrl);
  } else {
    window.history.pushState(null, "", nextUrl);
  }
}

export function ShowcaseClient({ items }: { items: ShowcaseItem[] }) {
  const { likedKeys, toggleLike } = useShowcaseLikes();
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState<ShowcaseQueryState>({
    tag: "",
    q: "",
    sort: DEFAULT_SORT,
    page: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setHydrated(true);
    const initial = readQueryFromLocation();
    setQuery(initial);
    setSearchInput(initial.q);

    const onPop = () => {
      const s = readQueryFromLocation();
      setQuery(s);
      setSearchInput(s.q);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const updateQuery = (
    patch: Partial<ShowcaseQueryState>,
    mode: "push" | "replace"
  ) => {
    setQuery((prev) => {
      const next: ShowcaseQueryState = {
        ...prev,
        ...patch,
      };
      // Normalize
      next.tag = next.tag.trim();
      next.q = next.q.trim();
      next.sort = parseSort(next.sort);
      next.page = Number.isFinite(next.page) ? Math.max(1, next.page) : 1;

      writeQueryToLocation(next, mode);
      return next;
    });
  };

  const allTags = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      for (const t of it.tags || []) {
        map.set(t, (map.get(t) || 0) + 1);
      }
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [items]);

  const deferredQuery = useDeferredValue(query.q);

  const filteredItems = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const tag = query.tag;

    return items.filter((it) => {
      if (tag && !(it.tags || []).includes(tag)) return false;
      if (!q) return true;

      const hay = [
        it.title,
        it.description,
        it.author,
        ...(it.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [deferredQuery, items, query.tag]);

  const sortedItems = useMemo(() => {
    const out = [...filteredItems];
    const sort = query.sort;

    const updatedScore = (it: ShowcaseItem) =>
      it.updatedAt ? Date.parse(it.updatedAt) || 0 : 0;
    const sizeScore = (it: ShowcaseItem) => (Number.isFinite(it.bytes) ? (it.bytes as number) : 0);
    const featuredScore = (it: ShowcaseItem) => (it.featured ? 1 : 0);

    out.sort((a, b) => {
      if (sort === "featured") {
        const f = featuredScore(b) - featuredScore(a);
        if (f !== 0) return f;
        const t = updatedScore(b) - updatedScore(a);
        if (t !== 0) return t;
        return a.title.localeCompare(b.title);
      }
      if (sort === "new") {
        const t = updatedScore(b) - updatedScore(a);
        if (t !== 0) return t;
        return a.title.localeCompare(b.title);
      }
      if (sort === "size") {
        const s = sizeScore(b) - sizeScore(a);
        if (s !== 0) return s;
        return a.title.localeCompare(b.title);
      }
      // az
      return a.title.localeCompare(b.title);
    });

    return out;
  }, [filteredItems, query.sort]);

  const pageCount = Math.max(1, Math.ceil(sortedItems.length / PER_PAGE));
  const page = Math.min(Math.max(1, query.page), pageCount);
  const pageStart = (page - 1) * PER_PAGE;
  const pageEnd = Math.min(pageStart + PER_PAGE, sortedItems.length);
  const pagedItems = sortedItems.slice(pageStart, pageEnd);

  // Clamp page when filters shrink the list.
  useEffect(() => {
    if (!hydrated) return;
    if (query.page !== page) updateQuery({ page }, "replace");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, page]);

  const featuredItems = useMemo(
    () => items.filter((item) => item.featured),
    [items]
  );

  const hasActiveFilters =
    Boolean(query.tag) ||
    Boolean(query.q) ||
    query.sort !== DEFAULT_SORT ||
    query.page > 1;

  const onClearAll = () => {
    setSearchInput("");
    updateQuery({ tag: "", q: "", sort: DEFAULT_SORT, page: 1 }, "push");
  };

  // Debounce typing -> URL state (replace to avoid polluting history).
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!hydrated) return;
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      updateQuery({ q: searchInput, page: 1 }, "replace");
    }, 250);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, hydrated]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 flex items-center gap-3">
            <Palette className="w-10 h-10 md:w-12 md:h-12" weight="light" />
            Showcase
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Real, interactive examples powered by the Cunning Player (WASM).
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link
              href="/showcase/submit"
              className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Submit
            </Link>
            <Link
              href="/showcase/new"
              className="inline-flex items-center rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
            >
              New (WASM soon)
            </Link>
          </div>

          <div className="mt-8 flex flex-col gap-3 max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MagnifyingGlass
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  weight="light"
                />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search title, tags, author…"
                  className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-400/40"
                />
                {searchInput ? (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-300 hover:text-white hover:bg-white/10"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" weight="light" />
                  </button>
                ) : null}
              </div>

              <div className="sm:w-44">
                <Select
                  value={query.sort}
                  onValueChange={(v) =>
                    updateQuery({ sort: parseSort(v), page: 1 }, "push")
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="new">Newest</SelectItem>
                    <SelectItem value="size">Largest</SelectItem>
                    <SelectItem value="az">A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Button
                size="sm"
                variant={query.tag ? "outline" : "default"}
                className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                onClick={() => updateQuery({ tag: "", page: 1 }, "push")}
              >
                All <span className="ml-2 text-xs opacity-70">{items.length}</span>
              </Button>
              {allTags.map(({ tag, count }) => (
                <Button
                  key={tag}
                  size="sm"
                  variant={query.tag === tag ? "default" : "outline"}
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                  onClick={() =>
                    updateQuery(
                      { tag: query.tag === tag ? "" : tag, page: 1 },
                      "push"
                    )
                  }
                >
                  {tag} <span className="ml-2 text-xs opacity-70">{count}</span>
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span>
                  {sortedItems.length === 0
                    ? "No results"
                    : `Showing ${pageStart + 1}–${pageEnd} of ${sortedItems.length}`}
                </span>
                {!hydrated ? <span className="opacity-70">(loading…)</span> : null}
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="ml-2 text-slate-200 hover:text-white underline underline-offset-4"
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      setLinkCopied(true);
                      window.setTimeout(() => setLinkCopied(false), 1200);
                    } catch {
                      // ignore
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4" weight="bold" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" weight="light" />
                      Copy link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="py-12 bg-white dark:bg-slate-950">
          <div className="container">
            <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-6">
              <div className="font-heading text-xl mb-2">No examples synced yet</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Put <code>.cda</code> files into <code>public/examples/</code> and run{" "}
                <code>pnpm prebuild</code> (or let GitHub Actions sync them) to
                generate <code>public/examples/index.json</code>.
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Featured */}
      {featuredItems.length > 0 && !hasActiveFilters && (
        <section className="py-12 bg-slate-50 dark:bg-slate-900">
          <div className="container">
            <h2 className="font-heading text-2xl mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500" weight="light" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <Link
                  key={item.id}
                  href={buildViewerHref(item)}
                  className="group relative rounded-xl overflow-hidden bg-white dark:bg-slate-800 border shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-2">by {item.author}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span>{item.bytes ? formatBytes(item.bytes) : ""}</span>
                      <span>
                        {item.updatedAt ? formatShortDate(item.updatedAt) : ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter & Gallery */}
      {items.length > 0 ? (
        <section className="py-12 bg-white dark:bg-slate-950">
          <div className="container">
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {pagedItems.map((item) => {
                  const liked = likedKeys.has(item.cdaUrl);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={buildViewerHref(item)}
                        className="group relative rounded-xl overflow-hidden border bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow block h-full"
                      >
                        <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleLike(item.cdaUrl);
                            }}
                            aria-label={liked ? "Unlike" : "Like"}
                            aria-pressed={liked}
                            className={`absolute top-3 right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-colors ${
                              liked
                                ? "bg-pink-500/90 border-pink-400/40 text-white"
                                : "bg-white/10 border-white/20 text-white hover:bg-white/15"
                            }`}
                          >
                            <Heart
                              className="w-4 h-4"
                              weight={liked ? "fill" : "light"}
                            />
                          </button>
                          <div className="absolute left-3 bottom-3 right-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-white font-semibold truncate">
                                {item.title}
                              </div>
                              {item.featured ? (
                                <Star
                                  className="w-5 h-5 text-amber-400"
                                  weight="fill"
                                />
                              ) : null}
                            </div>
                            <div className="text-xs text-white/70 truncate">
                              by {item.author}
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                            {item.description}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[10px] px-2 py-0.5"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              {item.bytes ? formatBytes(item.bytes) : ""}
                            </span>
                            <span>
                              {item.updatedAt
                                ? formatShortDate(item.updatedAt)
                                : ""}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {sortedItems.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No works found. Try adjusting your filters.
              </div>
            )}

            {sortedItems.length > 0 && pageCount > 1 ? (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuery({ page: page - 1 }, "push")}
                  disabled={page <= 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" weight="light" />
                  Prev
                </Button>
                <div className="text-xs text-slate-500 dark:text-slate-400 px-3">
                  Page {page} / {pageCount}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuery({ page: page + 1 }, "push")}
                  disabled={page >= pageCount}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" weight="light" />
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}

