"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useBookmarks } from "@/hooks/useBookmarks"
import { useLogos, type Logo } from "@/hooks/useLogos"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { HelpCircleIcon } from "@hugeicons/core-free-icons"

interface LogoGalleryProps {
  category?: string
  theme?: string
  searchQuery?: string
  sortBy?: string
}

function BookmarkButton({
  logo,
  isBookmarked,
  onToggle,
}: {
  logo: Logo
  isBookmarked: boolean
  onToggle: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    onToggle()
    setTimeout(() => setLoading(false), 300)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "absolute top-3 right-3 cursor-pointer rounded-full p-2 transition-all duration-300",
        isBookmarked
          ? "bg-primary text-primary-foreground"
          : "bg-background/60 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground",
        loading && "opacity-50"
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {loading ? (
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
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
    </button>
  )
}

function LogoCard({
  logo,
  isBookmarked,
  onToggleBookmark,
}: {
  logo: Logo
  isBookmarked: boolean
  onToggleBookmark: () => void
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
          src={logo.logo_url}
          alt={logo.name}
          width={400}
          height={300}
          className="h-auto w-full rounded-lg object-contain"
          unoptimized
        />
      </div>
      {/* Always show bookmark icon if bookmarked */}
      {isBookmarked && (
        <div className="absolute top-3 right-3 rounded-full bg-primary p-2 text-primary-foreground">
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
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
      )}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          isBookmarked && "group-hover:opacity-100"
        )}
      >
        {!isBookmarked && (
          <BookmarkButton
            logo={logo}
            isBookmarked={isBookmarked}
            onToggle={onToggleBookmark}
          />
        )}
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

function LogoCardSkeleton() {
  return (
    <div className="mb-4">
      <div className="flex h-full w-full items-center justify-center rounded-xl border bg-background p-2 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
        <Skeleton rounded="lg" className="h-[200px] w-full" />
      </div>
    </div>
  )
}

const SKELETON_COUNT = 6

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

type GalleryItem =
  | { type: "logo"; data: Logo }
  | { type: "skeleton"; key: string }

export function LogoGallery({
  category = "all",
  theme = "all",
  searchQuery = "",
  sortBy = "latest",
}: LogoGalleryProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useLogos(category, theme, searchQuery, sortBy)
  const {
    isLoaded: bookmarksLoaded,
    toggleBookmark,
    isBookmarked,
  } = useBookmarks()
  const columnCount = useColumnCount()

  const observerRef = useRef<IntersectionObserver | null>(null)

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect()
      if (!node || !hasNextPage || isFetchingNextPage) return
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            fetchNextPage()
          }
        },
        { rootMargin: "400px" }
      )
      observerRef.current.observe(node)
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  const allLogos = data?.pages.flatMap((page) => page.logos) ?? []

  const items: GalleryItem[] = useMemo(() => {
    const result: GalleryItem[] = allLogos.map((logo) => ({
      type: "logo" as const,
      data: logo,
    }))
    if (isFetchingNextPage) {
      for (let i = 0; i < SKELETON_COUNT; i++) {
        result.push({ type: "skeleton" as const, key: `skeleton-${i}` })
      }
    }
    return result
  }, [allLogos, isFetchingNextPage])

  const columns = useMemo(() => {
    const cols: GalleryItem[][] = Array.from({ length: columnCount }, () => [])
    items.forEach((item, i) => {
      cols[i % columnCount].push(item)
    })
    return cols
  }, [items, columnCount])

  if (isLoading || !bookmarksLoaded) {
    return (
      <div className="mt-10 w-full">
        <div className="flex gap-4">
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <div key={colIdx} className="flex flex-1 flex-col">
              {Array.from({
                length: Math.ceil(SKELETON_COUNT / columnCount),
              }).map((_, i) => (
                <LogoCardSkeleton key={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError || allLogos.length === 0) {
    return (
      <div className="mt-10 flex min-h-[400px] w-full items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={HelpCircleIcon} className="size-4" />
            </EmptyMedia>
            <EmptyTitle>
              {isError ? "Failed to load logos." : "No logos found."}
            </EmptyTitle>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mt-10 w-full">
      <div className="flex gap-4">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-1 flex-col">
            {col.map((item) =>
              item.type === "skeleton" ? (
                <LogoCardSkeleton key={item.key} />
              ) : (
                <LogoCard
                  key={item.data.id}
                  logo={item.data}
                  isBookmarked={isBookmarked(item.data.id)}
                  onToggleBookmark={() =>
                    toggleBookmark({
                      id: item.data.id,
                      name: item.data.name,
                      slug: item.data.slug,
                      designer: item.data.designer,
                      category: item.data.category,
                      logoUrl: item.data.logo_url,
                    })
                  }
                />
              )
            )}
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className="h-1" />
    </div>
  )
}
