"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
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

export function ShowcaseViewCounter({ itemId }: { itemId: string }) {
  const t = useTranslations("showcase");
  const [count, setCount] = useState<number | null>(null);

  const safeId = useMemo(() => String(itemId || "").trim(), [itemId]);

  useEffect(() => {
    if (!safeId) return;
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch(withBasePath("/api/showcase/views"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: safeId }),
          cache: "no-store",
        });
        if (res.ok) {
          const json = (await res.json()) as { count?: number };
          if (!cancelled) setCount(typeof json.count === "number" ? json.count : 0);
          return;
        }
      } catch {
        // ignore
      }

      // Fallback: just fetch current count.
      try {
        const url = new URL(withBasePath("/api/showcase/views"), window.location.origin);
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
    <Button type="button" variant="outline" size="sm" disabled={!safeId} title={t("views")}>
      <Eye className="w-4 h-4 mr-2" />
      {t("views")}
      {typeof count === "number" ? (
        <span className="ml-2 tabular-nums text-muted-foreground">{count}</span>
      ) : null}
    </Button>
  );
}

