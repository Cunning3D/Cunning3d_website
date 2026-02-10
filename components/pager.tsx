import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface DocsPagerProps { doc?: { slug: string } }

export function DocsPager({ doc }: DocsPagerProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <Link href="/docs" className={cn(buttonVariants({ variant: "ghost" }))}>← Documentation</Link>
    </div>
  )
}
