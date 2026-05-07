"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useBookmarks } from "@/hooks/useBookmarks"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface SimilarLogo {
  id: number
  name: string
  slug: string
  logo_url: string
  designer: string
  category: string
  theme: string
}

interface SimilarLogosProps {
  currentSlug: string
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
              <Skeleton className="h-44 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BookmarkBtn({
  isBookmarked,
  onToggle,
}: {
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
        "absolute top-2 right-2 rounded-full p-2 opacity-0 transition-all group-hover:opacity-100",
        isBookmarked
          ? "bg-primary text-primary-foreground"
          : "bg-background/90 text-muted-foreground hover:text-foreground",
        loading && "opacity-50"
      )}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
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
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
    </button>
  )
}

export default function SimilarLogos({ currentSlug }: SimilarLogosProps) {
  const [logos, setLogos] = useState<SimilarLogo[]>([])
  const [loading, setLoading] = useState(true)
  const { toggleBookmark, isBookmarked } = useBookmarks()

  useEffect(() => {
    setLoading(true)
    fetch("/api/logos?limit=30")
      .then((res) => res.json())
      .then((data: { logos: SimilarLogo[] }) => {
        const all = data.logos
        const currentLogo = all.find((l: SimilarLogo) => l.slug === currentSlug)
        if (!currentLogo) {
          setLogos(
            all.filter((l: SimilarLogo) => l.slug !== currentSlug).slice(0, 6)
          )
          return
        }
        const similar = all.filter(
          (l: SimilarLogo) =>
            l.slug !== currentSlug &&
            (l.category === currentLogo.category ||
              l.theme === currentLogo.theme)
        )
        const result =
          similar.length >= 6
            ? similar.slice(0, 6)
            : [
                ...similar,
                ...all
                  .filter(
                    (l: SimilarLogo) =>
                      l.slug !== currentSlug &&
                      l.category !== currentLogo.category &&
                      l.theme !== currentLogo.theme
                  )
                  .slice(0, 6 - similar.length),
              ]
        setLogos(result)
      })
      .finally(() => setLoading(false))
  }, [currentSlug])

  if (loading) {
    return <SimilarLogosSkeleton />
  }

  if (!logos.length) return null

  return (
    <section className="pt-16">
      <h2 className="mb-6 font-heading text-2xl font-light">Similar Logos</h2>
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-3">
        {logos.map((logo) => (
          <Link
            key={logo.id}
            href={`/logo/${logo.slug}`}
            className="group relative mb-4 block break-inside-avoid overflow-hidden transition-all duration-300 ease-in-out"
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

            <div
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300",
                "group-hover:opacity-100"
              )}
            >
              <BookmarkBtn
                isBookmarked={isBookmarked(logo.id)}
                onToggle={() =>
                  toggleBookmark({
                    id: logo.id,
                    name: logo.name,
                    slug: logo.slug,
                    designer: logo.designer,
                    category: logo.category,
                    logoUrl: logo.logo_url,
                  })
                }
              />
              <div
                className={cn(
                  "absolute bottom-0 w-full p-4 pt-12 text-white",
                  "bg-gradient-to-t from-black/70 to-transparent"
                )}
              >
                <h3 className="truncate">
                  {logo.name}
                </h3>
                <p className="truncate text-xs text-white/80">
                  by {logo.designer}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
