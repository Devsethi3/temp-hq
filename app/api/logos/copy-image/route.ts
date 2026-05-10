import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 })

    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch")

    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const mimeType = blob.type || "image/webp"

    return NextResponse.json({
      data: `data:${mimeType};base64,${base64}`,
      type: mimeType,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to copy image" }, { status: 500 })
  }
}
