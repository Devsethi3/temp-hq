"use client"

import { useQuery } from "@tanstack/react-query"

export interface HeroLogo {
  id: number
  name: string
  logo_url: string
}

export function useHeroLogos() {
  return useQuery<HeroLogo[]>({
    queryKey: ["hero-logos"],
    queryFn: async () => {
      const response = await fetch("/api/logos?limit=20")
      if (!response.ok) {
        throw new Error("Failed to fetch hero logos")
      }
      const data = await response.json()
      const logos = data.logos as HeroLogo[]
      const skipUrl = "hermanmiller.webp"
      const filtered = logos.filter(
        (logo: HeroLogo) => !logo.logo_url.includes(skipUrl)
      )
      return filtered.slice(0, 10)
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}
