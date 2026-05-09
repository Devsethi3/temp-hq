"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { useBookmarks } from "@/hooks/useBookmarks"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
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

function useColumnCount() {
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w >= 1024) setColumns(3)
      else if (w >= 640) setColumns(2)
      else setColumns(1)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return columns
}

function BookmarkCard({
  logo,
  onRemove,
  isRemoving,
}: {
  logo: {
    id: number
    name: string
    slug: string
    designer: string
    logoUrl: string
  }
  onRemove: () => void
  isRemoving: boolean
}) {
  return (
    <Link
      href={`/logo/${logo.slug}`}
      className={cn(
        "group relative mb-4 block overflow-hidden",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className="flex h-full w-full items-center justify-center rounded-xl border bg-background p-2 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
        <Image
          src={logo.logoUrl}
          alt={logo.name}
          width={400}
          height={300}
          className="h-auto w-full rounded-lg object-contain"
          unoptimized
        />
      </div>
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100"
        )}
      >
        <button
          onClick={(e) => {
            e.preventDefault()
            onRemove()
          }}
          disabled={isRemoving}
          className={cn(
            "absolute top-3 right-3 cursor-pointer rounded-full p-2 transition-all duration-300",
            "bg-primary text-primary-foreground",
            isRemoving && "opacity-50"
          )}
          aria-label="Remove bookmark"
        >
          {isRemoving ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
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
          )}
        </button>
        <div
          className={cn(
            "absolute bottom-0 w-full rounded-xl p-4 pt-12 text-white",
            "bg-gradient-to-t from-black/80 to-transparent"
          )}
        >
          <h3 className="truncate">{logo.name}</h3>
          <p className="mt-0.5 truncate text-xs text-white/80">
            by {logo.designer}
          </p>
        </div>
      </div>
    </Link>
  )
}

function BookmarkCardSkeleton() {
  return (
    <div className="mb-4">
      <div className="flex h-full w-full items-center justify-center rounded-xl border bg-background p-2 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
        <Skeleton rounded="lg" className="h-[200px] w-full" />
      </div>
    </div>
  )
}

function BookmarksSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex gap-4">
        {Array.from({ length: columnCount }).map((_, colIdx) => (
          <div key={colIdx} className="flex flex-1 flex-col">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookmarkCardSkeleton key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BookmarksPage() {
  const [removingId, setRemovingId] = useState<number | null>(null)
  const { bookmarks, isLoaded, removeBookmark } = useBookmarks()
  const columnCount = useColumnCount()

  const columns = useMemo(() => {
    const cols: (typeof bookmarks)[] = Array.from(
      { length: columnCount },
      () => []
    )
    bookmarks.forEach((logo, i) => {
      cols[i % columnCount].push(logo)
    })
    return cols
  }, [bookmarks, columnCount])

  const handleRemove = (id: number) => {
    setRemovingId(id)
    removeBookmark(id)
    setTimeout(() => setRemovingId(null), 300)
  }

  if (!isLoaded) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl border-x px-4">
        <Header />
        <main className="py-8">
          <BookmarksSkeleton columnCount={3} />
        </main>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl border-x px-4">
        <Header />
        <main className="flex min-h-[400px] flex-col items-center justify-center py-8 text-center">
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
        </main>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl border-x px-4">
      <Header />
      <main className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-light">Bookmarks</h1>
          <span className="text-sm text-muted-foreground">
            {bookmarks.length} {bookmarks.length === 1 ? "logo" : "logos"}
          </span>
        </div>

        <div className="flex gap-4">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-1 flex-col">
              {col.map((logo) => (
                <BookmarkCard
                  key={logo.id}
                  logo={logo}
                  onRemove={() => handleRemove(logo.id)}
                  isRemoving={removingId === logo.id}
                />
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
