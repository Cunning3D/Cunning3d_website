import Link from "next/link"
import { fetchGitHubReleases } from "@/lib/github-releases"
import { githubRepo } from "@/config/releases"
import { ClipboardText, Package, Download, Star } from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'Changelog',
  description: 'Cunning3D version history and release notes.',
}

// 解析 Markdown 格式的 changelog 为简单的 HTML
function parseChangelog(body: string | undefined): string {
  if (!body) return '<p class="text-slate-500">No release notes available.</p>';

  return body
    .replace(/^### (.+)$/gm, '<h4 class="font-bold mt-4 mb-2">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-bold text-lg mt-6 mb-3">$1</h3>')
    .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1 rounded text-sm">$1</code>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, ' ');
}

export default async function ChangelogPage() {
  const releases = await fetchGitHubReleases(20);
  const hasReleases = releases.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 flex items-center gap-3">
            <ClipboardText className="w-10 h-10 md:w-12 md:h-12" weight="light" />
            Changelog
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Version history and release notes. Automatically synced from GitHub Releases.
          </p>
        </div>
      </section>

      {/* Releases */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="container max-w-4xl">
          {hasReleases ? (
            <div className="space-y-12">
              {releases.map((release, idx) => (
                <article key={release.tag} className="relative">
                  {/* Version badge */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-2xl font-mono font-bold ${idx === 0 ? 'text-green-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      v{release.version}
                    </span>
                    {release.isLatest && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-sm">
                        Latest
                      </span>
                    )}
                    {release.isPrerelease && (
                      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded text-sm">
                        Pre-release
                      </span>
                    )}
                    <span className="text-slate-500 text-sm">{release.date}</span>
                  </div>

                  {/* Release notes */}
                  <div
                    className="prose prose-slate dark:prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: parseChangelog(release.changelog) }}
                  />

                  {/* Download links */}
                  {release.assets.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {release.assets.map((asset) => (
                        <a
                          key={asset.name}
                          href={asset.url}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <Download className="w-4 h-4" weight="light" />
                          {asset.name} <span className="text-slate-400">({asset.size})</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Divider */}
                  {idx < releases.length - 1 && (
                    <hr className="mt-12 border-slate-200 dark:border-slate-800" />
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" weight="light" />
              <h2 className="font-heading text-2xl mb-2">No releases yet</h2>
              <p className="text-slate-500 mb-6">
                Check back soon or follow us on GitHub for updates.
              </p>
              <a
                href={`https://github.com/${githubRepo.owner}/${githubRepo.repo}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container text-center">
          <h2 className="font-heading text-2xl mb-4">Stay updated</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Watch the GitHub repository or join Discord to get notified about new releases.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href={`https://github.com/${githubRepo.owner}/${githubRepo.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg hover:opacity-90"
            >
              <Star className="w-5 h-5" weight="light" />
              Star on GitHub
            </a>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              <Download className="w-5 h-5" weight="light" />
              Download Latest
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
