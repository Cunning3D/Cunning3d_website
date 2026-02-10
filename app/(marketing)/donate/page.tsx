"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { donateConfig, donors } from "@/config/donate"
import type { IconWeight } from "@phosphor-icons/react"
import {
  Heart,
  Coffee,
  Wallet,
  Copy,
  Check,
  ArrowSquareOut,
  Users,
  CurrencyDollar,
  TrendUp,
  Trophy,
  Plant,
  Star,
  Diamond,
  Rocket,
  Crown,
} from '@phosphor-icons/react/dist/ssr'

// 图标映射
const tierIconMap: Record<string, React.ComponentType<{ className?: string; weight?: IconWeight }>> = {
  'sprout': Plant,
  'star': Star,
  'gem': Diamond,
  'rocket': Rocket,
  'crown': Crown,
}

export default function DonatePage() {
  const [isMonthly, setIsMonthly] = useState(true)
  const [selected, setSelected] = useState(25)
  const [copied, setCopied] = useState<string | null>(null)
  const amounts = donateConfig.tiers.map(t => t.amount)
  const { platforms, metrics } = donateConfig

  const currentTier = donateConfig.tiers.slice().reverse().find(t => selected >= t.amount) || donateConfig.tiers[0]
  const CurrentTierIcon = tierIconMap[currentTier.icon] || Heart

  const getPaymentLink = () => {
    if (platforms.kofi) return platforms.kofi
    if (platforms.paypal) return platforms.paypal
    if (platforms.payoneer) return platforms.payoneer
    return null
  }
  const paymentLink = getPaymentLink()

  // 按等级分组捐款者
  const donorsByTier = donateConfig.tiers.slice().reverse().map(tier => ({
    tier,
    donors: donors.filter(d => d.tier === tier.name),
  })).filter(g => g.donors.length > 0)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-slate-950 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative z-10 py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-16">
            {/* Left content */}
            <div className="flex-1 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm mb-8">
                  <Heart className="w-4 h-4 text-rose-400" weight="light" />
                  <span className="text-slate-300">Powered by community</span>
                </div>

                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
                  Support the
                  <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    future of 3D
                  </span>
                </h1>

                <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                  Your contribution helps us build the next generation of procedural modeling tools.
                  Join {metrics.members > 0 ? metrics.members : 'hundreds of'} supporters making this vision real.
                </p>

                {/* Quick stats */}
                <div className="flex gap-8 mt-10">
                  <div>
                    <div className="text-3xl font-bold text-white">${metrics.monthlyDollars > 0 ? metrics.monthlyDollars : '0'}</div>
                    <div className="text-sm text-slate-500">monthly</div>
                  </div>
                  <div className="w-px bg-slate-800" />
                  <div>
                    <div className="text-3xl font-bold text-white">{metrics.members > 0 ? metrics.members : '0'}</div>
                    <div className="text-sm text-slate-500">supporters</div>
                  </div>
                  <div className="w-px bg-slate-800" />
                  <div>
                    <div className="text-3xl font-bold text-white">100%</div>
                    <div className="text-sm text-slate-500">open source</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Donation Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-[60px]" />

                {/* Toggle */}
                <div className="relative flex rounded-full bg-slate-800 p-1 mb-8">
                  <motion.div
                    className="absolute top-1 bottom-1 rounded-full bg-indigo-500"
                    layoutId="toggle"
                    initial={false}
                    animate={{ x: isMonthly ? 0 : '100%' }}
                    style={{ width: 'calc(50% - 4px)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                  <button
                    onClick={() => setIsMonthly(true)}
                    className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors ${isMonthly ? 'text-white' : 'text-slate-400'}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsMonthly(false)}
                    className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors ${!isMonthly ? 'text-white' : 'text-slate-400'}`}
                  >
                    One-time
                  </button>
                </div>

                {/* Amount selection */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {amounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setSelected(amt)}
                      className={`relative py-4 rounded-xl border font-semibold transition-all ${
                        selected === amt
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      ${amt}
                      {selected === amt && (
                        <motion.div
                          layoutId="selected"
                          className="absolute inset-0 rounded-xl border-2 border-indigo-500"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Current tier */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                      <CurrentTierIcon className="w-6 h-6 text-white" weight="light" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">You&apos;ll become</div>
                      <div className="text-lg font-semibold text-white">{currentTier.name}</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {currentTier.perks.map((perk, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-indigo-400" weight="light" />
                        </div>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                {paymentLink ? (
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                  >
                    <Coffee className="w-5 h-5" weight="light" />
                    Donate ${selected} {isMonthly ? '/ month' : ''}
                    <ArrowSquareOut className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" weight="light" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-800 text-slate-500 font-semibold py-4 rounded-xl cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}

                {/* Crypto options */}
                {(platforms.crypto.eth || platforms.crypto.btc || platforms.crypto.usdt) && (
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 mb-3 text-center">Or donate with crypto</p>
                    <div className="flex gap-2 justify-center">
                      {platforms.crypto.eth && (
                        <button
                          onClick={() => copyToClipboard(platforms.crypto.eth, 'eth')}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                        >
                          <span>ETH</span>
                          {copied === 'eth' ? <Check className="w-3 h-3 text-green-400" weight="light" /> : <Copy className="w-3 h-3" weight="light" />}
                        </button>
                      )}
                      {platforms.crypto.btc && (
                        <button
                          onClick={() => copyToClipboard(platforms.crypto.btc, 'btc')}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                        >
                          <span>BTC</span>
                          {copied === 'btc' ? <Check className="w-3 h-3 text-green-400" weight="light" /> : <Copy className="w-3 h-3" weight="light" />}
                        </button>
                      )}
                      {platforms.crypto.usdt && (
                        <button
                          onClick={() => copyToClipboard(platforms.crypto.usdt, 'usdt')}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                        >
                          <span>USDT</span>
                          {copied === 'usdt' ? <Check className="w-3 h-3 text-green-400" weight="light" /> : <Copy className="w-3 h-3" weight="light" />}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CurrencyDollar, value: `$${metrics.oneTimeDollars.toLocaleString()}`, label: 'One-time donations', color: 'from-violet-500 to-purple-600' },
              { icon: TrendUp, value: `$${metrics.monthlyDollars.toLocaleString()}`, label: 'Monthly recurring', color: 'from-blue-500 to-indigo-600' },
              { icon: Users, value: metrics.members.toString(), label: 'Total supporters', color: 'from-emerald-500 to-teal-600' },
              { icon: Trophy, value: metrics.sponsors.toString(), label: 'Corporate sponsors', color: 'from-amber-500 to-orange-600' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" weight="light" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supporters Wall */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Our Supporters
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Cunning3D is made possible by these amazing people and organizations.
              </p>
            </motion.div>
          </div>

          {donors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 mb-6">
                <Heart className="w-10 h-10 text-indigo-500" weight="light" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Be the first
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Your name will appear here and in our application credits. Support the future of procedural modeling.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {donorsByTier.map(({ tier, donors: tierDonors }, tierIndex) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: tierIndex * 0.1 }}
                >
                  {/* Tier header */}
                  <div className="flex items-center gap-4 mb-8">
                    {(() => {
                      const TierIcon = tierIconMap[tier.icon] || Heart
                      return (
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500">
                          <TierIcon className="w-6 h-6 text-white" weight="light" />
                        </div>
                      )
                    })()}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                      <p className="text-sm text-slate-500">${tier.amount}/month</p>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800" />
                  </div>

                  {/* Donor cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tierDonors.map((donor, donorIndex) => (
                      <motion.div
                        key={donor.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: donorIndex * 0.05 }}
                      >
                        {donor.link ? (
                          <a
                            href={donor.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
                          >
                            {donor.logo ? (
                              <img src={donor.logo} alt={donor.name} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                                {donor.name.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {donor.name}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <ArrowSquareOut className="w-3 h-3" weight="light" />
                                <span>Visit</span>
                              </div>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            {donor.logo ? (
                              <img src={donor.logo} alt={donor.name} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-sm">
                                {donor.name.charAt(0)}
                              </div>
                            )}
                            <div className="font-medium text-slate-900 dark:text-white truncate">
                              {donor.name}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Thank you note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <p className="text-slate-400 text-sm">
              Stats sync automatically from payment platforms.
              <Link href="mailto:support@cunning3d.com" className="text-indigo-500 hover:text-indigo-600 ml-1">
                Contact us
              </Link>
              {' '}for questions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ / Why Support */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why support Cunning3D?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Wallet,
                title: 'Sustainable Development',
                description: 'Your support allows us to dedicate more time to core development and maintenance.',
              },
              {
                icon: Users,
                title: 'Community First',
                description: 'Supporters help shape the roadmap through direct feedback and feature requests.',
              },
              {
                icon: Trophy,
                title: 'Recognition',
                description: 'Get your name in the credits and on this wall of supporters.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-lg shadow-slate-900/5 mb-6">
                  <item.icon className="w-6 h-6 text-indigo-500" weight="light" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
