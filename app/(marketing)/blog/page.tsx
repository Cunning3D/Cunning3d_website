import Link from "next/link"

export const metadata = { title: "Blog" }

// Placeholder posts until Fumadocs blog is configured
const posts = [
  { id: "1", title: "Welcome to Cunning3D", description: "Introducing our procedural modeling tool", date: "2026-01-10", slug: "/blog/welcome" },
  { id: "2", title: "Node-Based Workflows", description: "Learn how to use nodes for procedural geometry", date: "2026-01-08", slug: "/blog/nodes" },
  { id: "3", title: "Getting Started Guide", description: "Your first steps with Cunning3D", date: "2026-01-05", slug: "/blog/getting-started" },
]

export default function BlogPage() {
  return (
    <div className="container py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4">
        <h1 className="font-heading text-4xl tracking-tight lg:text-5xl">Blog</h1>
        <p className="text-xl text-muted-foreground">Latest news and updates from Cunning3D.</p>
      </div>
      <hr className="my-8" />
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="group relative flex flex-col space-y-2">
            <div className="h-40 rounded-md bg-muted" />
            <h2 className="text-2xl font-extrabold">{post.title}</h2>
            <p className="text-muted-foreground">{post.description}</p>
            <p className="text-sm text-muted-foreground">{post.date}</p>
            <Link href={post.slug} className="absolute inset-0"><span className="sr-only">View Article</span></Link>
          </article>
        ))}
      </div>
    </div>
  )
}
