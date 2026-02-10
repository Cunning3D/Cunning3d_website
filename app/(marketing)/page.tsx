import Link from "next/link"
import { getTranslations } from 'next-intl/server'
import {
  Heart,
  Crown,
  Lightning,
  Trophy,
  Diamond,
  Hexagon,
  Star,
  Medal,
  GameController,
  Tree,
  ChartBar,
} from '@phosphor-icons/react/dist/ssr'

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { featureCategories } from "@/config/features"
import { getLatestRelease } from "@/lib/github-releases"
import { ProjectStats } from "@/components/project-stats"
import { githubRepo } from "@/config/releases"

// 特性图标映射
import {
  FlowArrow,
  Cube,
  ArrowsClockwise,
  ArrowsOut,
  Cpu,
  Monitor,
  GitBranch,
  Globe,
  Laptop,
  Plug,
  Scroll,
  PuzzlePiece,
  Wrench,
  Brain,
  Robot,
  Sparkle,
  Chat,
  Eye,
  SlidersHorizontal,
} from '@phosphor-icons/react/dist/ssr'

import type { IconWeight } from "@phosphor-icons/react"

const featureIconMap: Record<string, React.ComponentType<{ className?: string; weight?: IconWeight }>> = {
  'hexagon': Hexagon,
  'zap': Lightning,
  'globe': Globe,
  'plug': Plug,
  'brain': Brain,
  'workflow': FlowArrow,
  'box': Cube,
  'refresh-cw': ArrowsClockwise,
  'move-3d': ArrowsOut,
  'cpu': Cpu,
  'monitor': Monitor,
  'git-branch': GitBranch,
  'gamepad-2': GameController,
  'laptop': Laptop,
  'scroll-text': Scroll,
  'puzzle': PuzzlePiece,
  'wrench': Wrench,
  'bot': Robot,
  'sparkles': Sparkle,
  'message-square': Chat,
  'eye': Eye,
  'sliders': SlidersHorizontal,
  'brain-circuit': Brain,
}

async function getGitHubStars(): Promise<string | null> {
  try {
    if (!githubRepo.owner || !githubRepo.repo || githubRepo.owner === "user") return null

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    }
    if (env.GITHUB_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${env.GITHUB_ACCESS_TOKEN}`
    }

    const response = await fetch(
      `https://api.github.com/repos/${githubRepo.owner}/${githubRepo.repo}`,
      {
        headers,
        next: { revalidate: 60 },
      }
    )
    if (!response?.ok) return null
    const json = await response.json()
    return parseInt(json["stargazers_count"]).toLocaleString()
  } catch {
    return null
  }
}

export default async function IndexPage() {
  const t = await getTranslations('home')
  const tFeatures = await getTranslations('features')

  const [stars, latestRelease] = await Promise.all([
    getGitHubStars(),
    getLatestRelease(),
  ])
  const latestVersion = latestRelease?.version || '0.1.0'

  // 特性分类的翻译 key 映射
  const categoryKeys: Record<string, string> = {
    modeling: 'modeling',
    performance: 'performance',
    platform: 'platform',
    extensibility: 'extensibility',
    ai: 'ai',
  }

  return (
    <>
      {/* Hero */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 bg-blue-800 text-white">
        <div className="container flex flex-col items-start gap-4 text-left">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl whitespace-pre-line">
            {t('hero.title')}
          </h1>
          <p className="max-w-[42rem] leading-normal text-slate-300 sm:text-xl sm:leading-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/download" className="flex items-center overflow-hidden rounded-md">
              <span className="bg-sky-500 px-5 py-2.5 font-medium text-white hover:bg-sky-600">
                {t('hero.download')}
              </span>
              <span className="bg-slate-200 px-4 py-2.5 font-medium text-slate-700">
                {latestVersion}
              </span>
            </Link>
            <Link
              href="/docs"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/30 text-white hover:bg-white/10")}
            >
              {t('hero.whatsNew')}
            </Link>
          </div>
          <p className="text-sm text-slate-400">
            <Link href="/download" className="hover:underline">{t('hero.olderVersions')}</Link>
          </p>
        </div>
      </section>

      {/* Supporters - 放在 Features 上面 */}
      <section id="supporters" className="relative bg-slate-950 py-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="container relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm mb-6">
              <Heart className="w-4 h-4 text-rose-400" weight="light" />
              <span className="text-slate-300">Community powered</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {t('supporters.title')}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Cunning3D is made possible by these amazing people and organizations.
            </p>
          </div>

          {/* Featured Sponsors - Corporate Tiers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {/* Corporate Titanium */}
            <div className="group relative md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-cyan-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-cyan-400" weight="light" />
                  <span className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Corporate Titanium</span>
                </div>
                <div className="text-3xl font-black tracking-tight text-white mb-2">ACME STUDIOS</div>
                <p className="text-slate-500 text-sm">$6,000 / month</p>
              </div>
            </div>

            {/* Corporate Platinum */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-purple-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Lightning className="w-5 h-5 text-purple-400" weight="light" />
                  <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Corporate Platinum</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <GameController className="w-5 h-5 text-purple-400" weight="light" />
                    <span>GameForge</span>
                  </div>
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <Tree className="w-5 h-5 text-green-400" weight="light" />
                    <span>EverGreen Tech</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mt-4">$4,000 / month</p>
              </div>
            </div>

            {/* Corporate Bronze */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-amber-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-5 h-5 text-amber-400" weight="light" />
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Corporate Bronze</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                    <Diamond className="w-5 h-5 text-blue-400" weight="light" />
                    <span>BluePixel</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                    <Lightning className="w-5 h-5 text-yellow-400" weight="light" />
                    <span>VoltStudio</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mt-4">$500 / month</p>
              </div>
            </div>
          </div>

          {/* Individual Supporters Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Diamond */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Diamond className="w-5 h-5 text-cyan-300" weight="light" />
                <span className="text-sm font-semibold text-cyan-300">Diamond</span>
                <span className="text-xs text-slate-500">$250/mo</span>
              </div>
              <div className="space-y-2">
                {['Chris Zhang', 'Alex Renderer', 'RustCraft', 'NodeMaster'].map((name) => (
                  <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                      {name.charAt(0)}
                    </div>
                    <span className="text-slate-300 text-sm font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Titanium */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Hexagon className="w-5 h-5 text-slate-300" weight="light" />
                <span className="text-sm font-semibold text-slate-300">Titanium</span>
                <span className="text-xs text-slate-500">$100/mo</span>
              </div>
              <div className="space-y-2">
                {['ModelMaker', 'ProceduralPro', 'VoxelVince', 'MeshMaster'].map((name) => (
                  <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-slate-400/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white text-sm font-bold">
                      {name.charAt(0)}
                    </div>
                    <span className="text-slate-400 text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platinum */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-slate-400" weight="light" />
                <span className="text-sm font-semibold text-slate-400">Platinum</span>
                <span className="text-xs text-slate-500">$50/mo</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['GeometryGuru', 'PolyPete', 'ShaderSam', 'NodeNinja', 'BevelBoss', 'ExtrudeMaster', 'UVUnwrapper', 'TopologyTom', 'HalfEdgeHero', 'AttributeAce'].map((name) => (
                  <span key={name} className="px-3 py-1.5 rounded-full bg-white/5 text-slate-400 text-xs border border-white/5 hover:border-slate-400/20 transition-colors cursor-default">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Gold */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Medal className="w-5 h-5 text-amber-600" weight="light" />
                <span className="text-sm font-semibold text-amber-600">Gold</span>
                <span className="text-xs text-slate-500">$25/mo</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['vertex_lover', 'poly_pusher', 'rust_modeler', 'bevy_fan', 'node_wizard', 'mesh_maker', 'geo_genius', 'curve_crafter', 'surface_sculptor', 'primitive_pro', 'boolean_boss', 'vdb_victor'].map((name) => (
                  <span key={name} className="px-2.5 py-1 rounded-full bg-white/5 text-slate-500 text-xs border border-white/5 hover:border-amber-500/20 transition-colors cursor-default">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              <Heart className="w-5 h-5" weight="light" />
              Become a Supporter
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      {featureCategories.map((category, idx) => {
        const isAI = category.id === 'ai'
        const isEven = idx % 2 === 0
        const bgClass = category.bgClass || (isEven ? 'bg-slate-50 dark:bg-transparent' : 'bg-white dark:bg-slate-950')
        const key = categoryKeys[category.id] || category.id
        const CategoryIcon = featureIconMap[category.icon] || Hexagon

        return (
          <section key={category.id} id={category.id} className={`${bgClass} py-12 md:py-16 lg:py-20`}>
            <div className="container">
              <div className="flex flex-col space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <CategoryIcon className={`w-10 h-10 ${isAI ? 'text-violet-400' : 'text-blue-500'}`} weight="light" />
                  <h2 className={`font-heading text-3xl md:text-4xl ${isAI ? 'text-white' : ''}`}>
                    {tFeatures(`${key}.title`)}
                  </h2>
                </div>
                <p className={`max-w-[42rem] sm:text-lg ${isAI ? 'text-slate-400' : 'text-muted-foreground'}`}>
                  {tFeatures(`${key}.desc`)}
                </p>
              </div>
              <div className={`grid gap-4 ${category.features.length <= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
                {category.features.map((f) => {
                  const FeatureIcon = featureIconMap[f.icon] || Hexagon
                  return (
                    <div
                      key={f.title}
                      className={isAI
                        ? 'rounded-xl border border-violet-800/50 bg-slate-900/50 p-5 backdrop-blur-sm hover:border-violet-600 transition-colors'
                        : 'rounded-xl border bg-background p-5 hover:border-blue-500 transition-colors'
                      }
                    >
                      <FeatureIcon className={`w-8 h-8 mb-3 ${isAI ? 'text-violet-400' : 'text-blue-500'}`} weight="light" />
                      <h3 className={`font-bold mb-1 ${isAI ? 'text-white' : ''}`}>{f.title}</h3>
                      <p className={`text-sm ${isAI ? 'text-slate-400' : 'text-muted-foreground'}`}>{f.description}</p>
                    </div>
                  )
                })}
              </div>
              {isAI && (
                <p className="text-center text-slate-500 text-sm mt-8">
                  {tFeatures('ai.tip')}
                </p>
              )}
            </div>
          </section>
        )
      })}

      {/* Open Source */}
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            {t('openSource.title')}
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            {t('openSource.desc')}{" "}
            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              {t('openSource.github')}
            </Link>
            .
          </p>
          {stars && (
            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" className="inline-flex">
              <div className="flex h-10 w-10 items-center justify-center space-x-2 rounded-md border border-muted bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5 text-foreground">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-muted border-y-transparent"></div>
                <div className="flex h-10 items-center rounded-md border border-muted bg-muted px-4 font-medium">
                  {t('openSource.stars', { count: stars })}
                </div>
              </div>
            </Link>
          )}

          {/* 项目统计 */}
          <div className="mt-8 p-6 rounded-xl border bg-slate-50 dark:bg-slate-900">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <ChartBar className="w-5 h-5" weight="light" />
              {t('stats.title')}
            </h3>
            <ProjectStats />
          </div>
        </div>
      </section>
    </>
  )
}
