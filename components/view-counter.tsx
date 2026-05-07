"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon } from "@hugeicons/core-free-icons"

interface ViewCounterProps {
  slug: string
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionKey = `viewed_${slug}`
    const storageKey = `views_${slug}`

    if (!sessionStorage.getItem(sessionKey)) {
      const currentViews = Number(localStorage.getItem(storageKey)) || 0
      const newViews = currentViews + 1
      localStorage.setItem(storageKey, String(newViews))
      setViews(newViews)
      sessionStorage.setItem(sessionKey, "true")
    } else {
      const currentViews = Number(localStorage.getItem(storageKey)) || 0
      setViews(currentViews)
    }

    setLoading(false)
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
