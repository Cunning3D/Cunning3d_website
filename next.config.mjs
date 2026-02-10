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
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'images.unsplash.com' } // 允许 Unsplash 图片
    ],
  },
};

export default withNextIntl(withMDX(nextConfig));
