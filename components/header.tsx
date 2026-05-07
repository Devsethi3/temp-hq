"use client"
import { cn } from "@/lib/utils"
import { useScroll } from "@/hooks/use-scroll"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import { Logo } from "./logo"
import { FullWidthDivider } from "./ui/full-width-divider"
import { BorderCross } from "./ui/border-cross"

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
          <Button asChild variant="link">
            <Link href="/bookmarks">Bookmarks</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
