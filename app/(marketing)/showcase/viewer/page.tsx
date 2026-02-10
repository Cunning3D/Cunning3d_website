import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

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
  searchParams?: Promise<{ cda?: string; title?: string }>;
}) {
  const sp = await searchParams;
  const cdaRaw = typeof sp?.cda === "string" ? sp.cda : "";
  const title =
    typeof sp?.title === "string" && sp.title.trim()
      ? sp.title.trim()
      : "Cunning Player";

  const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
  const playerBase = `${basePath}/wasm/cunning_player/index.html`;

  const cda = (() => {
    if (!cdaRaw) return "";
    if (/^https?:\/\//i.test(cdaRaw)) return cdaRaw;
    if (basePath && cdaRaw.startsWith(`${basePath}/`)) return cdaRaw;
    if (cdaRaw.startsWith("/")) return `${basePath}${cdaRaw}`;
    return cdaRaw;
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
            <div className="text-xs text-muted-foreground">Interactive Showcase</div>
            <div className="font-heading text-lg font-semibold truncate">{title}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/showcase"
              className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-accent"
            >
              Back
            </Link>
            {cda ? (
              <a
                href={cda}
                className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                CDA
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
              <div className="relative w-full aspect-[16/9]">
                <iframe
                  title="Cunning Player"
                  src={playerSrc}
                  className="absolute inset-0 block w-full h-full border-0"
                  allow="autoplay; fullscreen"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="container py-10 text-white">
            <div className="max-w-2xl">
              <div className="font-heading text-2xl font-semibold mb-2">
                WASM player not synced yet
              </div>
              <div className="text-sm text-white/70 mb-4">
                Expected files under <code>/public/wasm/cunning_player/</code>:
                <code className="ml-2">index.html</code>,
                <code className="ml-2">cunning_player.js</code>,
                <code className="ml-2">cunning_player_bg.wasm</code>.
              </div>
              <div className="text-sm text-white/70">
                Run <code>pnpm predev</code> (or <code>pnpm build</code>) in{" "}
                <code>Cunning3d_website</code> to copy the player web output into{" "}
                <code>public/</code>.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

