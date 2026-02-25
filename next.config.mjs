import { createMDX } from 'fumadocs-mdx/next';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = createMDX();
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

function normalizeBasePath(p) {
  const s = String(p || '').trim();
  if (!s) return undefined;
  const withLeadingSlash = s.startsWith('/') ? s : `/${s}`;
  const withoutTrailingSlash = withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
  return withoutTrailingSlash || undefined;
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
  async headers() {
    // Large WASM player assets: allow browser caching to avoid re-downloading on repeat visits.
    // We keep index.html revalidated so updates roll out quickly.
    const playerAssetCache =
      'public, max-age=604800, stale-while-revalidate=86400'; // 7d cache, 1d SWR
    const playerHtmlCache = 'public, max-age=0, must-revalidate';

    return [
      {
        source: '/wasm/cunning_player/cunning_player_bg.wasm',
        headers: [{ key: 'Cache-Control', value: playerAssetCache }],
      },
      {
        source: '/wasm/cunning_player/cunning_player.js',
        headers: [{ key: 'Cache-Control', value: playerAssetCache }],
      },
      {
        source: '/wasm/cunning_player/cunning_player_worker.js',
        headers: [{ key: 'Cache-Control', value: playerAssetCache }],
      },
      {
        source: '/wasm/cunning_player/index.html',
        headers: [{ key: 'Cache-Control', value: playerHtmlCache }],
      },
    ];
  },
  // We read `.drawio` XML files at runtime via `fs.readFile()` in `components/mdx/drawio.tsx`.
  // Ensure Vercel/Next output-file-tracing bundles these files into the serverless output.
  outputFileTracingIncludes: {
    '*': ['content/docs/diagrams/**'],
  },
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'images.unsplash.com' } // 允许 Unsplash 图片
    ],
  },
};

export default withNextIntl(withMDX(nextConfig));
