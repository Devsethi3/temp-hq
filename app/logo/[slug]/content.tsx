"use client"

import { useState, useEffect } from "react"
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
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { ViewCounter } from "@/components/view-counter"
import { useBookmarks } from "@/hooks/useBookmarks"
import type { Logo } from "./types"

function DownloadButton({
  logoUrl,
  logoName,
}: {
  logoUrl: string
  logoName: string
}) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(logoUrl)}`
      const response = await fetch(proxyUrl)
      if (!response.ok) throw new Error("Failed to fetch")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${logoName.toLowerCase().replace(/\s+/g, "-")}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      const link = document.createElement("a")
      link.href = logoUrl
      link.download = `${logoName.toLowerCase().replace(/\s+/g, "-")}.png`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    setLoading(false)
  }

  return (
    <TextureButton asChild>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={cn(
          "flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
        )}
      >
        <HugeiconsIcon icon={DownloadSquare01Icon} className="size-4" />
        {loading ? "Downloading..." : "Download"}
      </button>
    </TextureButton>
  )
}

function CopyButton({ logoUrl }: { logoUrl: string }) {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCopy = async () => {
    setLoading(true)
    try {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(logoUrl)}`
      const response = await fetch(proxyUrl)
      if (!response.ok) throw new Error("Failed to fetch")
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        await navigator.clipboard.writeText(logoUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        console.error("Copy failed:", e)
      }
    }
    setLoading(false)
  }

  return (
    <TextureButton
      variant={copied ? "accent" : "minimal"}
      className="whitespace-nowrap"
      asChild
    >
      <button
        onClick={handleCopy}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <HugeiconsIcon
          icon={copied ? CheckmarkCircleIcon : Copy01Icon}
          className="size-4"
        />
        {copied ? "Copied!" : loading ? "Copying..." : "Copy Image"}
      </button>
    </TextureButton>
  )
}

function BookmarkButton({ logo }: { logo: Logo }) {
  const [loading, setLoading] = useState(false)
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const isActive = isBookmarked(logo.id)
  const router = useRouter()

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
      router.replace(`/logo/${logo.slug}`)
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
}

function LogoDetailSkeleton() {
  return (
    <main className="py-6">
      <Skeleton className="h-8 w-16" />
      <div className="mt-4 flex flex-wrap gap-8 lg:mt-2">
        <div className="flex w-full flex-col lg:items-center items-start justify-between sm:flex-row">
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
            <Skeleton className="h-10 lg:w-28 w-full rounded-md" />
            <Skeleton className="h-10 lg:w-28 w-full rounded-md" />
            <Skeleton className="h-10 lg:w-28 w-full rounded-md" />
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
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LogoDetailSkeleton />
  }

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
        <BookmarkButton logo={logo} />
      </div>
      <div className="flex flex-wrap gap-8 lg:mt-2">
        <div className="flex w-full flex-col items-center justify-between sm:flex-row">
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="mt-2 font-heading text-3xl font-light">
                  {logo.name}
                </h1>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                by {logo.designer}
              </p>
            </div>

            <p className="text-muted-foreground">{logo.description}</p>

            <div className="mt-1 flex items-center gap-2">
              <span className="to mb-5 w-fit overflow-hidden rounded-full border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-xs text-muted-foreground ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                {logo.theme}
              </span>
              <span className="to mb-5 w-fit overflow-hidden rounded-full border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-xs text-muted-foreground ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                {logo.category}
              </span>
              <span className="to mb-5 w-fit overflow-hidden rounded-full border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-xs text-muted-foreground ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                <ViewCounter slug={logo.slug} />
              </span>
            </div>
          </div>
          <div className="flex w-full lg:w-fit flex-col gap-1 sm:flex-row">
            <TextureButton variant="accent" asChild>
              <Link
                href={logo.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 whitespace-nowrap"
              >
                View Source
                <HugeiconsIcon
                  icon={SquareArrowUpRightIcon}
                  className="size-4"
                />
              </Link>
            </TextureButton>
            <DownloadButton logoUrl={logo.logo_url} logoName={logo.name} />
            <CopyButton logoUrl={logo.logo_url} />
          </div>
        </div>

        <div className="relative aspect-video w-screen overflow-hidden">
          <Image
            src={logo.logo_url}
            alt={logo.name}
            fill
            className={cn(
              "rounded-xl object-contain transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            unoptimized
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
          )}
        </div>
      </div>
    </main>
  )
}
