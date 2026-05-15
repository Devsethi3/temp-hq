"use client"

import { useState, useEffect, useRef, memo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import NoiseBackground from "./ui/noise-background"
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import { TextureButton } from "./ui/texture-button"
import { FullWidthDivider } from "./ui/full-width-divider"
import { BorderCross } from "./ui/border-cross"
import { Skeleton } from "./ui/skeleton"
import Link from "next/link"
import { useHeroLogos } from "@/hooks/useHeroLogos"

const HeroSection = memo(() => {
  const { data: logos = [], isLoading: loading } = useHeroLogos()

  return (
    <div className="relative">
      <NoiseBackground />
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex flex-col items-center text-center">
          <span className="to mb-5 w-fit overflow-hidden rounded-md border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-sm text-muted-foreground ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
            50+ New Logos Added
          </span>

          <h1 className="font-heading text-3xl leading-[1.2] md:text-4xl lg:text-5xl">
            Discover Logos That <br /> Inspire{" "}
            <span className="bg-primary text-white dark:text-black">
              Better Branding
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-muted-foreground">
            A searchable collection of standout logo designs for designers,
            founders, and creatives building memorable brands.
          </p>

          <div className="mt-8 flex flex-row gap-4">
            <Link href="#gallery">
              <TextureButton className="whitespace-nowrap">
                Explore Logos
              </TextureButton>
            </Link>
            <Link href="/bookmarks">
              <TextureButton variant="minimal">View Saved</TextureButton>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <div className="flex -space-x-2.5">
              {[
                { src: "/retro.webp", alt: "Slack" },
                { src: "/shop.webp", alt: "Figma" },
                { src: "/dropbox.webp", alt: "Spotify" },
                { src: "/loom.webp", alt: "Stripe" },
                { src: "/airbnb.webp", alt: "Airbnb" },
              ].map((avatar: { src: string; alt: string }) => (
                <div
                  key={avatar.alt}
                  className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-[3px] border-background bg-muted shadow-sm transition-transform hover:z-10 hover:-translate-y-1"
                >
                  <Image
                    src={avatar.src}
                    alt={avatar.alt}
                    width={40}
                    height={40}
                  />
                </div>
              ))}
              <div className="flex size-10 cursor-pointer items-center justify-center rounded-xl border-[3px] border-background bg-muted/80 text-[11px] font-bold text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted">
                +more
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex w-full items-center justify-center">
          <Marquee className="h-40 max-w-screen-xl">
            <MarqueeFade side="left" />
            <MarqueeFade side="right" />
            <MarqueeContent>
              {loading
                ? [...Array(10)].map((_, i) => (
                    <MarqueeItem className="h-40 w-56 shrink-0" key={i}>
                      <div className="relative flex h-full w-full items-center justify-center rounded-xl border bg-background p-2 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                        <Skeleton className="h-full w-full rounded-xl" />
                      </div>
                    </MarqueeItem>
                  ))
                : logos.length > 0
                  ? logos.map((logo) => (
                      <MarqueeItem
                        className="h-40 w-56 shrink-0"
                        key={logo.id}
                      >
                        <div className="relative flex h-full w-full items-center justify-center rounded-xl border bg-background p-2 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                          <Image
                            src={logo.logo_url}
                            alt={logo.name}
                            fill
                            sizes="224px"
                            className="rounded-2xl object-cover p-2"
                          />
                        </div>
                      </MarqueeItem>
                    ))
                  : [...Array(5)].map((_, i) => (
                      <MarqueeItem
                        className="h-40 w-56 shrink-0"
                        key={`fallback-${i}`}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-xl border bg-muted text-muted-foreground">
                          No Logo
                        </div>
                      </MarqueeItem>
                    ))}
            </MarqueeContent>
          </Marquee>
        </div>
      </div>
      <FullWidthDivider position="bottom" className="w-full" />
      <BorderCross className="bottom-0 -left-4 -translate-x-1/2 translate-y-1/2" />
      <BorderCross className="-right-4 bottom-0 translate-x-1/2 translate-y-1/2" />
    </div>
  )
})

export default HeroSection
