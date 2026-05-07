"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function LogoDetailSkeleton() {
  return (
    <main className="py-12">
      <div className="flex flex-wrap gap-8">
        <div className="flex w-full flex-col lg:items-center items-start justify-between sm:flex-row">
          <div className="flex flex-col gap-2">
            <div>
              <Skeleton className="mt-2 h-9 w-48" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>

            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <div className="flex w-full lg:mt-0 mt-3 flex-wrap gap-1 flex-row lg:w-fit">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </div>

        <div className="relative aspect-video w-screen overflow-hidden">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
    </main>
  )
}

function SimilarLogosSkeleton() {
  return (
    <section className="pt-16">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="group relative mb-4 block break-inside-avoid overflow-hidden"
          >
            <div
              className={cn(
                "flex h-full w-full items-center justify-center rounded-xl border bg-background p-2 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background",
                "dark:inset-shadow-white/20"
              )}
            >
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export { LogoDetailSkeleton, SimilarLogosSkeleton }
