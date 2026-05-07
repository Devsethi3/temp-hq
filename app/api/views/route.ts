import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"

interface ViewsData {
  [key: string]: number
}

function getViewsFilePath() {
  return path.join(process.cwd(), "db", "views.json")
}

function readViews(): ViewsData {
  try {
    const filePath = getViewsFilePath()
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data)
  } catch {
    return {}
  }
}

function writeViews(views: ViewsData) {
  const filePath = getViewsFilePath()
  fs.writeFileSync(filePath, JSON.stringify(views, null, 2))
}

export async function GET() {
  const views = readViews()
  return NextResponse.json(views)
}

export async function POST(request: Request) {
  try {
    const { slug } = await request.json()
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 })
    }

    const views = readViews()
    views[slug] = (views[slug] || 0) + 1
    writeViews(views)

    return NextResponse.json({ views: views[slug] })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update views" },
      { status: 500 }
    )
  }
}
