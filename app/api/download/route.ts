import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const url = searchParams.get("url")
  const name = searchParams.get("name")

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Failed to fetch")
    }

    const blob = await response.blob()
    const filename = name
      ? `${name.toLowerCase().replace(/\s+/g, "-")}.png`
      : "logo.png"

    return new NextResponse(blob, {
      headers: {
        "Content-Type": blob.type || "image/png",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to download" }, { status: 500 })
  }
}
