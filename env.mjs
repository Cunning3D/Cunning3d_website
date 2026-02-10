// Simplified env config for Next.js 15+
export const env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN || "",
}
