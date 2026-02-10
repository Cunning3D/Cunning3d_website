import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const metadata = {
  title: "Pricing",
}

export default function PricingPage() {
  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Support Cunning3D
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Help us ship the best node-based procedural 3D workflow.
        </p>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            What your support funds
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Documentation & examples
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Engine & node development
            </li>

            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Performance & GPU features
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Tooling & CI
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Community & feedback loops
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Release & distribution
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-7xl font-bold">♥</h4>
            <p className="text-sm font-medium text-muted-foreground">
              Thank you
            </p>
          </div>
          <Link href="/donate" className={cn(buttonVariants({ size: "lg" }))}>
            Donate
          </Link>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-4">
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:leading-7">
          Prefer GitHub? Sponsor the project and help us build faster.
        </p>
      </div>
    </section>
  )
}
