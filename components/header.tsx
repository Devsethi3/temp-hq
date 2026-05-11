"use client"
import { cn } from "@/lib/utils"
import { useScroll } from "@/hooks/use-scroll"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import { Logo } from "./logo"
import { FullWidthDivider } from "./ui/full-width-divider"
import { BorderCross } from "./ui/border-cross"
import { TextureButton } from "./ui/texture-button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bookmark01Icon } from "@hugeicons/core-free-icons"
import ThemeToggle from "./ui/theme-toggle"

export function Header() {
  const scrolled = useScroll(10)

  return (
    <header
      className={cn("relative top-0 z-50 w-full", {
        "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
          scrolled,
      })}
    >
      <FullWidthDivider position="bottom" className="w-full" />
      <BorderCross className="bottom-0 -left-4 -translate-x-1/2 translate-y-1/2" />
      <BorderCross className="-right-4 bottom-0 translate-x-1/2 translate-y-1/2" />
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/bookmarks">
            <TextureButton asChild className="text-sm! h-9! rounded-lg flex items-center" size="sm" variant="minimal">
              <HugeiconsIcon icon={Bookmark01Icon} className="size-3.5 mr-2" />
              <span className='pt-0.5'>Saved</span>
            </TextureButton>
          </Link>
        </div>
      </nav>
    </header>
  )
}
