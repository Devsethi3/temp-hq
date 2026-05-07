"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { useBookmarks } from "@/hooks/useBookmarks"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { BookmarkOff01Icon } from "@hugeicons/core-free-icons"

function BookmarksSkeleton() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="relative flex h-32 w-full items-center justify-center bg-muted p-4">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <div className="bg-card/95 p-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BookmarksPage() {
  const [removingId, setRemovingId] = useState<number | null>(null)
  const { bookmarks, isLoaded, removeBookmark } = useBookmarks()

  const handleRemove = (id: number) => {
    setRemovingId(id)
    removeBookmark(id)
    setTimeout(() => setRemovingId(null), 300)
  }

  return (
    <div className="min-h-screen mx-auto max-w-7xl border-x px-4">
      <Header />
      <main className="py-8">
        {!isLoaded ? (
          <BookmarksSkeleton />
        ) : bookmarks.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={BookmarkOff01Icon} className="size-4" />
                </EmptyMedia>
                <EmptyTitle> No bookmarks yet</EmptyTitle>
                <EmptyDescription>
                  Explore the gallery and save your favorite logos{" "}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <Link href="/">
                    <Button>View Gallery</Button>
                  </Link>
                </div>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="font-heading text-2xl font-light">Bookmarks</h1>
              <span className="text-sm text-muted-foreground">
                {bookmarks.length} {bookmarks.length === 1 ? "logo" : "logos"}
              </span>
            </div>

            <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
              {bookmarks.map((logo) => (
                <Link
                  key={logo.id}
                  href={`/logo/${logo.slug}`}
                  className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
                >
                  <div className="relative flex h-32 w-full items-center justify-center bg-muted p-4">
                    <Image
                      src={logo.logoUrl}
                      alt={logo.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemove(logo.id)
                      }}
                      disabled={removingId === logo.id}
                      className="absolute top-2 right-2 rounded-full bg-primary p-2 text-primary-foreground opacity-100 transition-all hover:bg-primary/90 disabled:opacity-50"
                      aria-label="Remove bookmark"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-card/95 p-3 backdrop-blur-sm">
                    <h3 className="truncate font-heading text-sm font-medium">
                      {logo.name}
                    </h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {logo.designer}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
