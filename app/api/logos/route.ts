import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"

interface Logo {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const cursor = searchParams.get("cursor")
    const limit = Math.min(Number(searchParams.get("limit")) || 9, 30)
    const category = searchParams.get("category")
    const theme = searchParams.get("theme")
    const q = searchParams.get("q")
    const sort = searchParams.get("sort") || "latest"

    // await new Promise((resolve) => setTimeout(resolve, 2000))

    const filePath = path.join(process.cwd(), "db", "logos.json")
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Logo[]

    let filtered = [...data]

    if (category && category !== "all") {
      filtered = filtered.filter((l: Logo) => l.category === category)
    }
    if (theme && theme !== "all") {
      filtered = filtered.filter((l: Logo) => l.theme === theme)
    }
    if (q) {
      const lower = q.toLowerCase()
      filtered = filtered.filter(
        (l: Logo) =>
          l.name.toLowerCase().includes(lower) ||
          l.designer.toLowerCase().includes(lower)
      )
    }

    if (sort === "oldest") {
      filtered.sort((a: Logo, b: Logo) => a.id - b.id)
    } else {
      filtered.sort((a: Logo, b: Logo) => b.id - a.id)
    }

    if (cursor) {
      const cursorId = Number(cursor)
      if (sort === "oldest") {
        filtered = filtered.filter((l: Logo) => l.id > cursorId)
      } else {
        filtered = filtered.filter((l: Logo) => l.id < cursorId)
      }
    }

    const hasNextPage = filtered.length > limit
    const logos = hasNextPage ? filtered.slice(0, limit) : filtered
    const nextCursor = hasNextPage ? logos[logos.length - 1]?.id : null

    return NextResponse.json({ logos, nextCursor, hasNextPage })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
