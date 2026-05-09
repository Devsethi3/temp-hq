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
      const ext = logoUrl.split(".").pop() || "png"
      const filename = `${logoName.toLowerCase().replace(/\s+/g, "-")}.${ext}`
      const response = await fetch(logoUrl)
      if (!response.ok) throw new Error("Failed to fetch")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      window.open(logoUrl, "_blank")
    }
    setLoading(false)
  }

  return (
    <TextureButton asChild onClick={handleDownload} disabled={loading}>
      <button className="flex items-center gap-2 whitespace-nowrap disabled:opacity-50">
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
      const response = await fetch(logoUrl)
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
      } catch {}
    }
    setLoading(false)
  }

  return (
    <TextureButton
      variant={copied ? "accent" : "minimal"}
      onClick={handleCopy}
      disabled={loading}
    >
      <button className="flex items-center gap-2 whitespace-nowrap disabled:opacity-50">
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
    <TextureButton
      variant={loading ? "accent" : isActive ? "accent" : "minimal"}
      onClick={handleClick}
      disabled={loading}
    >
      <button className="flex items-center gap-2">
        <HugeiconsIcon
          icon={isActive ? CheckmarkCircleIcon : Copy01Icon}
          className={cn("size-4", isActive && "fill-current")}
        />
        {loading ? "Saving..." : isActive ? "Saved" : "Save"}
      </button>
    </TextureButton>
  )
}

function LogoDetailSkeleton() {
  return (
    <main className="py-6">
      <Skeleton className="h-9 w-16" />
      <div className="mt-4 flex flex-wrap gap-8 lg:mt-2">
        <div className="flex w-full flex-col items-center justify-between sm:flex-row">
          <div className="flex flex-col gap-2">
            <Skeleton className="mt-2 h-9 w-48" />
            <Skeleton className="mt-2 h-4 w-24" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-32" />
            <div className="mt-1 flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col gap-1 sm:mt-0 sm:flex-row lg:w-fit">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LogoDetailSkeleton />

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
            <h1 className="mt-2 font-heading text-3xl font-light">
              {logo.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              by {logo.designer}
            </p>
            <p className="text-muted-foreground">{logo.description}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="to mb-5 w-fit overflow-hidden rounded-full border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-xs text-muted-foreground ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                {logo.theme}
              </span>
              <span className="to mb-5 w-fit overflow-hidden rounded-full border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-xs text-muted-foreground ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                {logo.category}
              </span>
              <ViewCounter slug={logo.slug} />
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col gap-1 sm:mt-0 sm:flex-row lg:w-fit">
            <Link
              href={logo.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <TextureButton variant="accent">
                <span className="flex items-center gap-1">
                  View Source{" "}
                  <HugeiconsIcon
                    icon={SquareArrowUpRightIcon}
                    className="size-4"
                  />
                </span>
              </TextureButton>
            </Link>
            <DownloadButton logoUrl={logo.logo_url} logoName={logo.name} />
            <CopyButton logoUrl={logo.logo_url} />
          </div>
        </div>
        <div className="relative aspect-video w-screen overflow-hidden">
          <Image
            src={logo.logo_url}
            alt={logo.name}
            fill
            className="rounded-xl object-contain"
            unoptimized
            priority
          />
        </div>
        {logo.mockups && logo.mockups.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-background shadow-lg">
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
                className="relative aspect-video w-full overflow-hidden rounded-xl border bg-background shadow-lg"
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
        )}
      </div>
    </main>
  )
}
