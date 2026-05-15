import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const filePath = path.join(process.cwd(), "db", "logos.json")
    const data = fs.readFileSync(filePath, "utf-8")
    const logos = JSON.parse(data) as Logo[]
    const logo = logos.find((l: Logo) => l.slug === slug)

    if (!logo) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 })
    }

    return NextResponse.json(logo)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
