"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Palette, Star } from "@phosphor-icons/react";

export interface ShowcaseItem {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  tags: string[];
  featured?: boolean;
  cdaUrl: string;
}

export function ShowcaseClient({ items }: { items: ShowcaseItem[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const it of items) for (const t of it.tags) s.add(t);
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filteredItems = selectedTag
    ? items.filter((item) => item.tags.includes(selectedTag))
    : items;

  const featuredItems = items.filter((item) => item.featured);

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
      {featuredItems.length > 0 && (
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
                  href={`/showcase/viewer?cda=${encodeURIComponent(
                    item.cdaUrl
                  )}&title=${encodeURIComponent(item.title)}`}
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
      {items.length > 0 && (
        <section className="py-12 bg-white dark:bg-slate-950">
          <div className="container">
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/showcase/viewer?cda=${encodeURIComponent(
                    item.cdaUrl
                  )}&title=${encodeURIComponent(item.title)}`}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 hover:ring-2 ring-blue-500 transition-all cursor-pointer"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-300">by {item.author}</p>
                  </div>
                </Link>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No works found for this filter.
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

