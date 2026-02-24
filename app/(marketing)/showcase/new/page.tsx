import Link from "next/link";

export default function ShowcaseNewPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      <div className="container py-12">
        <div className="max-w-3xl">
          <div className="text-xs text-muted-foreground mb-2">Showcase</div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            New (Coming soon)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            We&apos;re building a Cunning3D WASM editor so you can create and share
            <code className="mx-1">.cda</code> directly in the browser—similar to
            Shadertoy.
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/showcase"
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              Back to Showcase
            </Link>
            <Link
              href="/showcase/submit"
              className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Submit a CDA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

