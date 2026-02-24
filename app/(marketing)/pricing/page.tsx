import Link from "next/link"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing")
  return {
    title: t("metaTitle"),
  }
}

export default async function PricingPage() {
  const t = await getTranslations("pricing")

  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          {t("title")}
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          {t("subtitle")}
        </p>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            {t("cardTitle")}
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {t("funds.docsExamples")}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {t("funds.engineNodes")}
            </li>

            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {t("funds.performanceGpu")}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {t("funds.toolingCi")}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {t("funds.communityFeedback")}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {t("funds.releaseDistribution")}
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-7xl font-bold">♥</h4>
            <p className="text-sm font-medium text-muted-foreground">
              {t("thankYou")}
            </p>
          </div>
          <Link href="/donate" className={cn(buttonVariants({ size: "lg" }))}>
            {t("donate")}
          </Link>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-4">
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:leading-7">
          {t("preferGithub")}
        </p>
      </div>
    </section>
  )
}
