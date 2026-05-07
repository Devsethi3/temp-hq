"use client"

import { useEffect, useState } from "react"
import { EyeIcon } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon } from "@hugeicons/core-free-icons"

interface ViewCounterProps {
  slug: string
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function trackView() {
      try {
        const res = await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        })
        const data = await res.json()
        setViews(data.views)
      } catch (error) {
        console.error("Failed to track view:", error)
      } finally {
        setLoading(false)
      }
    }

    const viewedKey = `viewed_${slug}`
    if (!localStorage.getItem(viewedKey)) {
      trackView()
      localStorage.setItem(viewedKey, "true")
    } else {
      fetch(`/api/views`)
        .then((res) => res.json())
        .then((data) => {
          setViews(data[slug] || 0)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [slug])

  if (loading || views === null) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <HugeiconsIcon icon={ViewIcon} className="size-3.5" />
        <span className="h-3 w-8 animate-pulse rounded bg-muted" />
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <HugeiconsIcon icon={ViewIcon} className="size-3.5" />
      <span>{views.toLocaleString()}</span>
    </span>
  )
}

export function useViewCount(slug: string) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    const viewedKey = `viewed_${slug}`
    if (!localStorage.getItem(viewedKey)) {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
        .then((res) => res.json())
        .then((data) => setViews(data.views))
        .catch(() => {})
    } else {
      fetch(`/api/views`)
        .then((res) => res.json())
        .then((data) => setViews(data[slug] || 0))
        .catch(() => {})
    }
  }, [slug])

  return views
}
