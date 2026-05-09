import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 })
    }

    // Fetch image through server to avoid CORS
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Failed to fetch")
    }

    const blob = await response.blob()

    // Convert blob to base64 for clipboard
    const arrayBuffer = await blob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const mimeType = blob.type || "image/png"

    return NextResponse.json({
      data: `data:${mimeType};base64,${base64}`,
      type: mimeType,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to copy image" }, { status: 500 })
  }
}
