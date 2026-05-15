"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

export interface Logo {
  id: number
  name: string
  slug: string
  designer: string
  description: string | null
  website_url: string | null
  category: string
  logo_url: string
  theme: string
}

interface LogosResponse {
  logos: Logo[]
  nextCursor: number | null
  hasNextPage: boolean
}

export function useLogos(
  category: string = "all",
  theme: string = "all",
  searchQuery: string = "",
  sortBy: string = "latest"
) {
  return useInfiniteQuery<LogosResponse, Error>({
    queryKey: ["logos", category, theme, searchQuery, sortBy] as const,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: "12",
        sort: sortBy,
      })

      if (pageParam) {
        params.set("cursor", String(pageParam))
      }
      if (category && category !== "all") {
        params.set("category", category)
      }
      if (theme && theme !== "all") {
        params.set("theme", theme)
      }
      if (searchQuery) {
        params.set("q", searchQuery)
      }

      const response = await fetch(`/api/logos?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch logos")
      }

      return response.json()
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    placeholderData: (previousData) => previousData,
  })
}
