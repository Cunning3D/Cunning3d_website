"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

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
  const t = useTranslations("showcase");
  const [liked, setLiked] = useState(false);
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
        const json = (await res.json()) as {
          counts?: Record<string, number>;
          viewerLiked?: Record<string, boolean> | null;
        };
        const next = json?.counts?.[safeId];
        if (!cancelled) setCount(typeof next === "number" ? next : 0);
        const likedNext =
          json?.viewerLiked && typeof json.viewerLiked === "object"
            ? json.viewerLiked[safeId]
            : undefined;
        if (!cancelled && typeof likedNext === "boolean") setLiked(likedNext);
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
        setSaving(true);
        try {
          const res = await fetch(withBasePath("/api/showcase/likes"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: safeId, action: "toggle" }),
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
              setCount(Math.max(0, Math.floor(json.count)));
            }
            if (typeof json.liked === "boolean") {
              setLiked(json.liked);
            }
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
      {liked ? t("like.liked") : t("like.like")}
      {typeof count === "number" ? (
        <span className="ml-2 tabular-nums text-muted-foreground">{count}</span>
      ) : null}
    </Button>
  );
}
