'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { roadmapPhases, statusColors } from "@/config/roadmap"
import type { IconWeight } from "@phosphor-icons/react"
import {
  CheckCircle,
  Circle,
  Clock,
  Sparkle,
  Faders,
  TrendUp,
  Calendar,
  Crosshair,
  MapTrifold,
  CraneTower,
  GameController,
  Brain,
  Hexagon,
  Globe,
} from '@phosphor-icons/react/dist/ssr'

const statusIcons = {
  'done': CheckCircle,
  'in-progress': Clock,
  'planned': Circle,
  'future': Sparkle,
}

const phaseIconMap: Record<string, React.ComponentType<{ className?: string; weight?: IconWeight }>> = {
  'construction': CraneTower,
  'gamepad': GameController,
  'brain': Brain,
  'hexagon': Hexagon,
  'globe': Globe,
}

const statusLabels = {
  'done': 'Done',
  'in-progress': 'In Progress',
  'planned': 'Planned',
  'future': 'Future',
}

export default function RoadmapClient() {
  const [filter, setFilter] = useState<string>('all')
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null)

  // 计算统计数据
  const stats = useMemo(() => {
    const allItems = roadmapPhases.flatMap(p => p.items)
    const total = allItems.length
    const done = allItems.filter(i => i.status === 'done').length
    const inProgress = allItems.filter(i => i.status === 'in-progress').length
    const planned = allItems.filter(i => i.status === 'planned').length
    const future = allItems.filter(i => i.status === 'future').length
    const progress = Math.round((done / total) * 100)
    return { total, done, inProgress, planned, future, progress }
  }, [])

  // 过滤功能
  const filteredPhases = useMemo(() => {
    if (filter === 'all') return roadmapPhases
    return roadmapPhases.map(phase => ({
      ...phase,
      items: phase.items.filter(item => item.status === filter)
    })).filter(phase => phase.items.length > 0)
  }, [filter])

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
              <Crosshair className="w-4 h-4" weight="light" />
              <span>Updated January 2026</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 flex items-center gap-3">
              <MapTrifold className="w-10 h-10 md:w-12 md:h-12" weight="light" />
              Roadmap
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              See what we&apos;re building and what&apos;s coming next. This roadmap is updated regularly based on community feedback.
            </p>
          </motion.div>

          {/* 进度统计卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" weight="light" />
                <span className="text-2xl font-bold">{stats.done}</span>
              </div>
              <p className="text-slate-400 text-sm">Completed</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Clock className="w-5 h-5" weight="light" />
                <span className="text-2xl font-bold">{stats.inProgress}</span>
              </div>
              <p className="text-slate-400 text-sm">In Progress</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Calendar className="w-5 h-5" weight="light" />
                <span className="text-2xl font-bold">{stats.planned + stats.future}</span>
              </div>
              <p className="text-slate-400 text-sm">Planned</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <TrendUp className="w-5 h-5" weight="light" />
                <span className="text-2xl font-bold">{stats.progress}%</span>
              </div>
              <p className="text-slate-400 text-sm">Progress</p>
            </div>
          </motion.div>

          {/* 总体进度条 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Overall Progress</span>
              <span className="text-white font-medium">{stats.progress}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="container">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Faders className="w-4 h-4" weight="light" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                All ({stats.total})
              </button>
              {(['done', 'in-progress', 'planned', 'future'] as const).map((status) => {
                const count = status === 'in-progress' ? stats.inProgress : stats[status]
                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      filter === status
                        ? `${statusColors[status].bg} ${statusColors[status].text} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 ring-current`
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {status === 'done' && <CheckCircle className="w-4 h-4" weight="light" />}
                    {status === 'in-progress' && <Clock className="w-4 h-4" weight="light" />}
                    {status === 'planned' && <Circle className="w-4 h-4" weight="light" />}
                    {status === 'future' && <Sparkle className="w-4 h-4" weight="light" />}
                    {statusLabels[status]}
                    <span className="text-xs opacity-70">
                      ({count})
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container max-w-6xl">
          <AnimatePresence mode="wait">
            {filteredPhases.map((phase, phaseIdx) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: phaseIdx * 0.1 }}
                className="relative mb-20 last:mb-0"
                onMouseEnter={() => setHoveredPhase(phase.id)}
                onMouseLeave={() => setHoveredPhase(null)}
              >
                {/* Phase connector line */}
                <div className="hidden md:block absolute left-8 top-20 bottom-0 w-px">
                  <div className="h-full bg-gradient-to-b from-slate-200 via-slate-200 to-transparent dark:from-slate-700 dark:via-slate-700" />
                </div>

                {/* Phase header */}
                <div className="flex items-start gap-6 mb-10">
                  {/* Icon with ring effect */}
                  <div className="relative shrink-0">
                    {(() => {
                      const PhaseIcon = phaseIconMap[phase.icon] || CraneTower
                      return (
                        <motion.div
                          animate={{
                            scale: hoveredPhase === phase.id ? 1.05 : 1,
                            boxShadow: hoveredPhase === phase.id
                              ? '0 0 0 8px rgba(59, 130, 246, 0.1)'
                              : '0 0 0 0px rgba(59, 130, 246, 0)'
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 relative z-10"
                        >
                          <PhaseIcon className="w-8 h-8 text-white" weight="light" />
                        </motion.div>
                      )
                    })()}
                    {/* Glow effect */}
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-blue-500/20 blur-xl -z-10" />
                  </div>

                  <div className="pt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        {phase.title}
                      </h2>
                      <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {phase.items.length} items
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" weight="light" />
                      {phase.timeframe}
                    </p>
                  </div>
                </div>

                {/* Items grid */}
                <div className="md:ml-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {phase.items.map((item, itemIdx) => {
                    const StatusIcon = statusIcons[item.status]
                    const isDone = item.status === 'done'

                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: itemIdx * 0.05 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className={`
                          group relative rounded-2xl p-6 transition-all duration-300
                          ${isDone
                            ? 'bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/60 dark:border-green-900/40'
                            : 'bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                          }
                        `}
                      >
                        {/* Status indicator stripe */}
                        <div className={`
                          absolute left-0 top-6 bottom-6 w-1 rounded-full transition-all duration-300
                          ${item.status === 'done' ? 'bg-green-500' :
                            item.status === 'in-progress' ? 'bg-blue-500' :
                            item.status === 'planned' ? 'bg-amber-500' : 'bg-slate-400'}
                          group-hover:h-[calc(100%-24px)] group-hover:top-3
                        `} />

                        {/* Content */}
                        <div className="pl-4">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className={`font-semibold leading-tight ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                              {item.title}
                            </h3>
                            <div className={`
                              shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                              ${item.status === 'done' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                item.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                item.status === 'planned' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                            `}>
                              <StatusIcon className="w-4 h-4" weight="light" />
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                            {item.description}
                          </p>

                          {item.version && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">v</span>
                              <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{item.version}</span>
                            </div>
                          )}
                        </div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {filteredPhases.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Faders className="w-8 h-8 text-slate-400" weight="light" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No items found</h3>
              <p className="text-slate-500">Try selecting a different filter</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-900/5 mb-6">
              <Sparkle className="w-8 h-8 text-amber-500" weight="light" />
            </div>

            <h2 className="font-heading text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Shape the future
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto mb-10">
              Have a feature request or idea? Join our community and help us build the tools you need.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="https://github.com/o-oOvOo-o/cunning3D-dev/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl shadow-lg shadow-slate-900/5 hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-medium">Submit Feature Request</span>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="https://discord.gg/cunning3d"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:bg-indigo-700 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span className="font-medium">Join Discord</span>
              </motion.a>
            </div>

            {/* Trust indicators */}
            <p className="mt-8 text-sm text-slate-400">
              Join <span className="font-medium text-slate-600 dark:text-slate-300">2,400+</span> developers building with Cunning3D
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
