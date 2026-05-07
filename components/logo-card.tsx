"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Logo } from "@/hooks/useLogos"

interface LogoCardProps {
  logo: Logo
  isBookmarked: boolean
  onToggleBookmark: () => void
}

export function LogoCard({
  logo,
  isBookmarked,
  onToggleBookmark,
}: LogoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={logo.logo_url}
          alt={logo.name}
          fill
          className={cn(
            "object-contain p-4 transition-all duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <button
          onClick={onToggleBookmark}
          className={cn(
            "absolute top-2 right-2 rounded-full p-2 opacity-0 transition-opacity",
            isBookmarked
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 text-muted-foreground hover:text-foreground",
            "group-hover:opacity-100"
          )}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        <h3 className="truncate font-heading text-sm font-medium">
          {logo.name}
        </h3>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {logo.designer}
        </p>
      </div>
    </div>
  )
}
