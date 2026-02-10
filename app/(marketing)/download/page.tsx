import Link from "next/link"
import { fetchGitHubReleases, getLatestRelease } from "@/lib/github-releases"
import { githubRepo } from "@/config/releases"
import type { IconWeight } from "@phosphor-icons/react"
import {
  Desktop,
  AppleLogo,
  LinuxLogo,
  GameController,
  Package,
  Rocket,
  ArrowDown,
} from '@phosphor-icons/react/dist/ssr'

// 平台图标映射
const platformIconMap: Record<string, React.ComponentType<{ className?: string; weight?: IconWeight }>> = {
  windows: Desktop,
  macos: AppleLogo,
  linux: LinuxLogo,
  unity: GameController,
  source: Package,
}

const platformNames: Record<string, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  unity: 'Unity Package',
  source: 'Source Code',
}

export default async function DownloadPage() {
  const [latestRelease, allReleases] = await Promise.all([
    getLatestRelease(),
    fetchGitHubReleases(10),
  ])

  const hasReleases = allReleases.length > 0 && allReleases[0].assets.length > 0

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Download Cunning3D
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Get the latest version of Cunning3D for your platform. Free and open source.
          </p>
        </div>
      </section>

      {/* Latest Release */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="container">
          {latestRelease && hasReleases ? (
            <>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-heading text-3xl">Latest Release</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  v{latestRelease.version}
                </span>
                <span className="text-slate-500 text-sm">{latestRelease.date}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {latestRelease.assets.map((asset) => {
                  const PlatformIcon = platformIconMap[asset.platform] || Package
                  return (
                    <a
                      key={asset.name}
                      href={asset.url}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    >
                      <PlatformIcon className="w-8 h-8 text-blue-500" weight="light" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{platformNames[asset.platform]}</div>
                        <div className="text-sm text-slate-500">{asset.size}</div>
                      </div>
                      <ArrowDown className="w-5 h-5 text-blue-500" weight="light" />
                    </a>
                  )
                })}
              </div>

              {latestRelease.changelog && (
                <details className="border rounded-lg p-4">
                  <summary className="cursor-pointer font-medium">Release Notes</summary>
                  <div className="mt-4 prose prose-sm max-w-none text-slate-600">
                    <pre className="whitespace-pre-wrap text-sm">{latestRelease.changelog}</pre>
                  </div>
                </details>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Rocket className="w-16 h-16 mx-auto mb-4 text-slate-300" weight="light" />
              <h2 className="font-heading text-2xl mb-2">Coming Soon</h2>
              <p className="text-slate-500 mb-6">
                No releases available yet. Check back soon or build from source!
              </p>
              <a
                href={`https://github.com/${githubRepo.owner}/${githubRepo.repo}`}
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

      {/* All Releases */}
      {allReleases.length > 1 && (
        <section className="py-12 bg-slate-50 dark:bg-slate-900">
          <div className="container">
            <h2 className="font-heading text-2xl mb-6">All Releases</h2>
            <div className="space-y-4">
              {allReleases.map((release) => (
                <div key={release.tag} className="bg-white dark:bg-slate-800 border rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-mono font-bold">v{release.version}</span>
                    {release.isLatest && (
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Latest</span>
                    )}
                    {release.isPrerelease && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">Pre-release</span>
                    )}
                    <span className="text-slate-500 text-sm">{release.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {release.assets.map((asset) => {
                      const PlatformIcon = platformIconMap[asset.platform] || Package
                      return (
                        <a
                          key={asset.name}
                          href={asset.url}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <PlatformIcon className="w-4 h-4" weight="light" />
                          {asset.name}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Build from Source */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="container">
          <h2 className="font-heading text-2xl mb-4">Build from Source</h2>
          <p className="text-slate-600 mb-6">
            Want to build Cunning3D yourself? Clone the repository and follow the build instructions.
          </p>
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="text-slate-500"># Clone the repository</div>
            <div>git clone https://github.com/{githubRepo.owner}/{githubRepo.repo}.git</div>
            <div className="mt-2 text-slate-500"># Build with Cargo</div>
            <div>cd {githubRepo.repo} && cargo build --release</div>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            See the <Link href="/docs" className="text-blue-600 hover:underline">documentation</Link> for detailed build instructions.
          </p>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container">
          <h2 className="font-heading text-2xl mb-6">System Requirements</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Desktop className="w-5 h-5" weight="light" />
                Windows
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>Windows 10/11 (64-bit)</li>
                <li>4 GB RAM minimum</li>
                <li>OpenGL 4.5 or Vulkan</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <AppleLogo className="w-5 h-5" weight="light" />
                macOS
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>macOS 11 Big Sur or later</li>
                <li>Apple Silicon or Intel</li>
                <li>Metal 2 support</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <LinuxLogo className="w-5 h-5" weight="light" />
                Linux
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>Ubuntu 20.04+ or equivalent</li>
                <li>4 GB RAM minimum</li>
                <li>OpenGL 4.5 or Vulkan</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
