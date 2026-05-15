"use client"

import { useState, useEffect, memo } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { TextureButton } from "@/components/ui/texture-button"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  DownloadSquare01Icon,
  SquareArrowUpRightIcon,
  CheckmarkCircleIcon,
  ArrowLeft01Icon,
  Bookmark01Icon,
  Share08Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { ViewCounter } from "@/components/view-counter"
import { useBookmarks } from "@/hooks/useBookmarks"
import type { Logo } from "./types"
import { FullWidthDivider } from "@/components/ui/full-width-divider"

const DownloadButton = memo(
  ({ logoUrl, logoName }: { logoUrl: string; logoName: string }) => {
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
      setLoading(true)
      try {
        const downloadUrl = `/api/download?url=${encodeURIComponent(logoUrl)}&name=${encodeURIComponent(logoName)}`
        const response = await fetch(downloadUrl)
        if (!response.ok) throw new Error("Failed to fetch")

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const filename = `${logoName.toLowerCase().replace(/\s+/g, "-")}.png`

        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Download failed:", error)
        window.open(logoUrl, "_blank")
      }
      setLoading(false)
    }

    return (
      <TextureButton
        asChild
        onClick={handleDownload}
        disabled={loading}
        className={cn(
          "flex cursor-pointer items-center gap-2 whitespace-nowrap disabled:opacity-50"
        )}
      >
        <HugeiconsIcon icon={DownloadSquare01Icon} className="size-4" />
        {loading ? "Downloading..." : "Download"}
      </TextureButton>
    )
  }
)

const CopyButton = memo(({ logoUrl }: { logoUrl: string }) => {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCopy = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/logos/copy-image", {
        method: "POST",
        body: JSON.stringify({ url: logoUrl }),
        headers: { "Content-Type": "application/json" },
      })
      const { data: dataUrl } = await res.json()

      const img = new window.Image()
      img.src = dataUrl
      await new Promise((r) => (img.onload = r))

      const c = document.createElement("canvas")
      c.width = img.width
      c.height = img.height
      c.getContext("2d")!.drawImage(img, 0, 0)

      c.toBlob(async (b) => {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": b! }),
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }, "image/png")
    } catch (e) {
      console.error("Copy failed:", e)
    }
    setLoading(false)
  }

  return (
    <TextureButton
      variant="minimal"
      onClick={handleCopy}
      disabled={loading}
      className="flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
    >
      <HugeiconsIcon
        icon={copied ? CheckmarkCircleIcon : Copy01Icon}
        className="mr-2 size-4"
      />
      {copied ? "Copied!" : loading ? "Copying..." : "Copy Image"}
    </TextureButton>
  )
})

const BookmarkButton = memo(({ logo }: { logo: Logo }) => {
  const [loading, setLoading] = useState(false)
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const isActive = isBookmarked(logo.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    toggleBookmark({
      id: logo.id,
      name: logo.name,
      slug: logo.slug,
      designer: logo.designer,
      category: logo.category,
      logoUrl: logo.logo_url,
    })
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }

  return (
    <Button
      size="icon"
      onClick={handleClick}
      disabled={loading}
      variant={isActive ? "default" : "outline"}
      className="flex items-center gap-2"
    >
      <HugeiconsIcon
        icon={Bookmark01Icon}
        // icon={isActive ? CheckmarkCircleIcon : Bookmark01Icon}
        className={cn("size-4", isActive && "fill-current")}
      />
    </Button>
  )
})

const ShareButton = memo(({ logo }: { logo: Logo }) => {
  const [loading, setLoading] = useState(false)

  const handleShare = async () => {
    try {
      setLoading(true)

      const shareData = {
        title: `${logo.name} Logo`,
        text: `Check out this ${logo.name} logo inspiration`,
        url: window.location.href,
      }

      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Share failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleShare}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <HugeiconsIcon icon={Share08Icon} className="size-4" />
    </Button>
  )
})

function LogoDetailSkeleton() {
  return (
    <main className="py-6">
      <Skeleton className="h-8 w-16" />
      <div className="mt-4 flex flex-wrap gap-8 lg:mt-2">
        <div className="flex w-full flex-col items-start justify-between sm:flex-row lg:items-center">
          <div className="flex flex-col gap-2">
            <Skeleton className="mt-2 h-9 w-48" />
            {/* <Skeleton className="h-4 w-full max-w-md" /> */}
            <Skeleton className="h-4 w-32" />
            <div className="mt-1 flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col gap-1 sm:mt-0 sm:flex-row lg:w-fit">
            <Skeleton className="h-10 w-full rounded-md lg:w-28" />
            <Skeleton className="h-10 w-full rounded-md lg:w-28" />
            <Skeleton className="h-10 w-full rounded-md lg:w-28" />
          </div>
        </div>
        <div className="relative aspect-video w-screen overflow-hidden">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
    </main>
  )
}

export default function LogoDetailContent({ logo }: { logo: Logo }) {
  const router = useRouter()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <main className="py-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => router.back()}
          className="w-fit"
          variant="outline"
          size="sm"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <BookmarkButton logo={logo} />
          <ShareButton logo={logo} />
        </div>
      </div>
      <div className="flex flex-wrap lg:mt-2">
        <div className="flex w-full flex-col items-center justify-between sm:flex-row">
          <div className="flex flex-col gap-2">
            <h1 className="mt-2 font-heading text-3xl font-light">
              {logo.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              by {logo.designer}
            </p>
            <p className="text-muted-foreground">{logo.description}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="to mb-5 w-fit overflow-hidden rounded-md border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-sm text-muted-foreground capitalize ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background sm:text-base dark:inset-shadow-white/20">
                {logo.theme}
              </span>
              <span className="to mb-5 w-fit overflow-hidden rounded-md border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-sm text-muted-foreground capitalize ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background sm:text-base dark:inset-shadow-white/20">
                {logo.category}
              </span>
              <span className="to mb-5 w-fit overflow-hidden rounded-md border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-sm text-muted-foreground capitalize ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background sm:text-base dark:inset-shadow-white/20">
                <ViewCounter slug={logo.slug} />
              </span>
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col gap-1 sm:mt-0 sm:flex-row lg:w-fit">
            <Link
              href={logo.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <TextureButton variant="accent" asChild>
                View Source
                <HugeiconsIcon
                  icon={SquareArrowUpRightIcon}
                  className="size-4"
                />
              </TextureButton>
            </Link>
            <DownloadButton logoUrl={logo.logo_url} logoName={logo.name} />
            <CopyButton logoUrl={logo.logo_url} />
          </div>
        </div>

        <div className="relative mt-8 aspect-video w-screen overflow-hidden sm:mt-4">
          <Image
            src={logo.logo_url}
            alt={logo.name}
            fill
            className={cn(
              "rounded-xl object-contain transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
          )}
        </div>

        {logo.mockups && logo.mockups.length > 0 && (
          <>
            <div className="mt-10">
              <FullWidthDivider />
              <h2 className="mt-8 font-heading text-xl sm:text-2xl">
                Logo in Context
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Designs in different variations
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative aspect-video h-[50vh] w-full overflow-hidden rounded-xl border bg-background ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                <Image
                  src={logo.logo_url}
                  alt={logo.name}
                  fill
                  className="rounded-xl object-cover"
                  unoptimized
                />
              </div>
              {logo.mockups.map((mockup, index) => (
                <div
                  key={index}
                  className="relative aspect-video h-[50vh] w-full overflow-hidden rounded-xl border bg-background ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20"
                >
                  <Image
                    src={mockup}
                    alt={`${logo.name} mockup ${index + 1}`}
                    fill
                    className="rounded-xl object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
