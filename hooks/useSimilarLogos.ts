"use client"

import { useQuery } from "@tanstack/react-query"

export interface SimilarLogo {
  id: number
  name: string
  slug: string
  logo_url: string
  designer: string
  category: string
  theme: string
}

export function useSimilarLogos(currentSlug: string) {
  return useQuery<SimilarLogo[]>({
    queryKey: ["similar-logos", currentSlug],
    queryFn: async () => {
      const res = await fetch("/api/logos?limit=30")
      if (!res.ok) throw new Error("Failed to fetch similar logos")
      const data = await res.json()
      const all = data.logos as SimilarLogo[]
      const currentLogo = all.find((l: SimilarLogo) => l.slug === currentSlug)
      
      if (!currentLogo) {
        return all.filter((l: SimilarLogo) => l.slug !== currentSlug).slice(0, 6)
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
      return result
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
