import { SiteConfig } from "types"
import { githubRepo } from "@/config/releases"

function normalizeBasePath(p: unknown) {
  const s = String(p || "").trim()
  if (!s) return ""
  const withLeadingSlash = s.startsWith("/") ? s : `/${s}`
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cunning3d.com"
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)
const siteUrl = (() => {
  if (!basePath) return appUrl
  try {
    const u = new URL(appUrl)
    const p = u.pathname.replace(/\/+$/, "")
    if (p && p === basePath) return appUrl
    u.pathname = `${p}${basePath}`
    return u.toString().replace(/\/+$/, "")
  } catch {
    return appUrl
  }
})()

const githubUrl = `https://github.com/${githubRepo.owner}/${githubRepo.repo}`

export const siteConfig: SiteConfig = {
  name: "Cunning3D",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 13.",
  url: siteUrl,
  ogImage: `${siteUrl}/og.jpg`,
  links: {
    twitter: "https://twitter.com/cunning3d",
    github: githubUrl,
  },
}
