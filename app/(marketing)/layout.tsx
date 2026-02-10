import Link from "next/link"
import { getTranslations } from 'next-intl/server'
import { Heart } from '@phosphor-icons/react/dist/ssr'

import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { LocaleToggle } from "@/components/locale-toggle"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const t = await getTranslations('nav')

  const navItems = [
    { title: t('features'), href: "/#features" },
    { title: t('showcase'), href: "/showcase" },
    { title: t('docs'), href: "/docs" },
    { title: t('roadmap'), href: "/roadmap" },
    { title: t('changelog'), href: "/changelog" },
    { title: t('blog'), href: "/blog" },
    { title: t('me'), href: "/me" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <MainNav items={navItems} />
          <nav className="flex items-center gap-3">
            <Link
              href="/donate"
              className="flex items-center gap-1 text-sm font-medium text-pink-500 hover:text-pink-600"
            >
              <Heart className="w-4 h-4" weight="light" /> {t('donate')}
            </Link>
            <LocaleToggle />
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
