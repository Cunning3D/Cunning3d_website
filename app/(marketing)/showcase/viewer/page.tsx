import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { CopyCurrentUrlButton } from "@/components/showcase/copy-current-url-button";
import { ShowcaseLikeButton } from "@/components/showcase/showcase-like-button";
import { ShowcaseViewCounter } from "@/components/showcase/showcase-view-counter";
import { WasmPlayerFrame } from "@/components/showcase/wasm-player-frame";
import { getTranslations } from "next-intl/server";

function normalizeBasePath(p: unknown) {
  const s = String(p || "").trim();
  if (!s) return "";
  const withLeadingSlash = s.startsWith("/") ? s : `/${s}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

async function wasmPlayerReady() {
  const base = path.join(process.cwd(), "public", "wasm", "cunning_player");
  try {
    await fs.access(path.join(base, "index.html"));
    await fs.access(path.join(base, "cunning_player.js"));
    await fs.access(path.join(base, "cunning_player_bg.wasm"));
    return true;
  } catch {
    return false;
  }
}

export default async function ShowcaseViewerPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; cda?: string; title?: string }>;
}) {
  const t = await getTranslations("showcase");
  const sp = await searchParams;
  const idRaw = typeof sp?.id === "string" ? sp.id : "";
  const cdaRaw = typeof sp?.cda === "string" ? sp.cda : "";
  const titleFallback = t("viewer.titleFallback");
  const title =
    typeof sp?.title === "string" && sp.title.trim()
      ? sp.title.trim()
      : titleFallback;

  const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
  const playerBase = `${basePath}/wasm/cunning_player/index.html`;

  const cda = (() => {
    if (!cdaRaw) return "";
    if (/^https?:\/\//i.test(cdaRaw)) return cdaRaw;
    if (basePath && cdaRaw.startsWith(`${basePath}/`)) return cdaRaw;
    if (cdaRaw.startsWith("/")) return `${basePath}${cdaRaw}`;
    return cdaRaw;
  })();

  const itemId = (() => {
    const s = idRaw.trim();
    if (s) return s;
    if (!cdaRaw) return "";

    const pathLike = (() => {
      if (/^https?:\/\//i.test(cdaRaw)) {
        try {
          return new URL(cdaRaw).pathname;
        } catch {
          return cdaRaw;
        }
      }
      return cdaRaw;
    })();

    const file = pathLike.split("/").filter(Boolean).pop() || "";
    const base = decodeURIComponent(file).replace(/\.cda$/i, "");
    return base.replace(/[^a-zA-Z0-9_-]+/g, "-");
  })();

  const playerSrc = cda
    ? `${playerBase}?cda=${encodeURIComponent(cda)}`
    : playerBase;

  const ready = await wasmPlayerReady();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{t("viewer.breadcrumb")}</div>
            <div className="font-heading text-lg font-semibold truncate">{title}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/showcase"
              className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-accent"
            >
              {t("actions.back")}
            </Link>
            <CopyCurrentUrlButton label={t("actions.copyLink")} copiedLabel={t("actions.copied")} />
            {itemId ? <ShowcaseViewCounter itemId={itemId} /> : null}
            {itemId ? <ShowcaseLikeButton itemId={itemId} /> : null}
            {cda ? (
              <a
                href={cda}
                download
                className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                {t("actions.downloadCda")}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="w-full border-t bg-black">
        {/* Server-side existence check to avoid a confusing blank iframe when assets aren't synced yet */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        {ready ? (
          <div className="container py-4">
            <div className="mx-auto w-full max-w-[1280px]">
              <WasmPlayerFrame src={playerSrc} title={titleFallback} />
            </div>
          </div>
        ) : (
          <div className="container py-10 text-white">
            <div className="max-w-2xl">
              <div className="font-heading text-2xl font-semibold mb-2">
                {t("viewer.wasmNotSyncedTitle")}
              </div>
              <div className="text-sm text-white/70 mb-4">
                {t("viewer.wasmNotSyncedDesc")}
              </div>
              <div className="text-sm text-white/70">
                {t("viewer.wasmNotSyncedHint")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
