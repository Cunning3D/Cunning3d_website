"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useShowcaseLikes } from "@/components/showcase/use-showcase-likes";

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

export function ShowcaseLikeButton({ itemId }: { itemId: string }) {
  const { likedKeys, toggleLike } = useShowcaseLikes();
  const liked = itemId ? likedKeys.has(itemId) : false;
  const [count, setCount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const safeId = useMemo(() => String(itemId || "").trim(), [itemId]);

  useEffect(() => {
    if (!safeId) return;
    let cancelled = false;

    const run = async () => {
      try {
        const url = new URL(withBasePath("/api/showcase/likes"), window.location.origin);
        url.searchParams.set("ids", safeId);
        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as { counts?: Record<string, number> };
        const next = json?.counts?.[safeId];
        if (!cancelled) setCount(typeof next === "number" ? next : 0);
      } catch {
        // ignore
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [safeId]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        if (!safeId) return;
        const delta = liked ? -1 : 1;
        toggleLike(safeId);
        setCount((prev) => {
          const cur = typeof prev === "number" ? prev : 0;
          return Math.max(0, cur + delta);
        });

        setSaving(true);
        try {
          const res = await fetch(withBasePath("/api/showcase/likes"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: safeId, delta }),
          });
          const json = (await res.json()) as { count?: number };
          if (res.ok && typeof json.count === "number") {
            setCount(Math.max(0, json.count));
          }
        } catch {
          // ignore
        } finally {
          setSaving(false);
        }
      }}
      disabled={!safeId || saving}
      aria-pressed={liked}
    >
      <Heart className="w-4 h-4 mr-2" weight={liked ? "fill" : "light"} />
      {liked ? "Liked" : "Like"}
      {typeof count === "number" ? (
        <span className="ml-2 tabular-nums text-muted-foreground">{count}</span>
      ) : null}
    </Button>
  );
}
