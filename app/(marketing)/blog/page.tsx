import Link from "next/link"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog")
  return { title: t("title") }
}

// Placeholder posts until Fumadocs blog is configured
const posts = [
  { id: "1", title: "Welcome to Cunning3D", description: "Introducing our procedural modeling tool", date: "2026-01-10", slug: "/blog/welcome" },
  { id: "2", title: "Node-Based Workflows", description: "Learn how to use nodes for procedural geometry", date: "2026-01-08", slug: "/blog/nodes" },
  { id: "3", title: "Getting Started Guide", description: "Your first steps with Cunning3D", date: "2026-01-05", slug: "/blog/getting-started" },
]

export default async function BlogPage() {
  const t = await getTranslations("blog")
  return (
    <div className="container py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4">
        <h1 className="font-heading text-4xl tracking-tight lg:text-5xl">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
      </div>
      <hr className="my-8" />
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="group relative flex flex-col space-y-2">
            <div className="h-40 rounded-md bg-muted" />
            <h2 className="text-2xl font-extrabold">{post.title}</h2>
            <p className="text-muted-foreground">{post.description}</p>
            <p className="text-sm text-muted-foreground">{post.date}</p>
            <Link href={post.slug} className="absolute inset-0"><span className="sr-only">{t("viewArticle")}</span></Link>
          </article>
        ))}
      </div>
    </div>
  )
}
