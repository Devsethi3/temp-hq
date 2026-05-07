"use client"

import { useState, useEffect, useRef } from "react"
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

interface Logo {
  id: number
  name: string
  logo_url: string
}

const HeroSection = () => {
  const [logos, setLogos] = useState<Logo[]>([])
  const [loading, setLoading] = useState(false)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    setLoading(true)
    const cached = localStorage.getItem("hero_logos")
    if (cached) {
      setLogos(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch("/api/logos")
      .then((res) => res.json())
      .then((data: { logos: Logo[] }) => {
        const skipUrl = "hermanmiller.webp"
        const filtered = data.logos.filter(
          (logo: Logo) => !logo.logo_url.includes(skipUrl)
        )
        const sliced = filtered.slice(0, 10)
        setLogos(sliced)
        localStorage.setItem("hero_logos", JSON.stringify(sliced))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative">
      <NoiseBackground />
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex flex-col items-center text-center">
          <span className="to mb-5 w-fit overflow-hidden rounded-full border bg-background/10 bg-linear-to-b from-primary/10 px-3 py-1 text-xs text-muted-foreground ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
            50+ New Logos Added
          </span>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl">
            1,150 The Ultimate Logo <br /> Design{" "}
            <span className="bg-primary text-white dark:text-black">
              Inspiration Library
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-muted-foreground">
            Explore 1,200+ hand-picked real and fictional logos searchable by
            style, industry, and color.
          </p>

          <div className="mt-8 flex flex-row gap-4">
            <TextureButton className="whitespace-nowrap">
              Explore Logos
            </TextureButton>
            <TextureButton variant="minimal">View Gallery</TextureButton>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <div className="flex -space-x-2.5">
              {[
                { src: "/retro.webp", alt: "Slack" },
                { src: "/shop.webp", alt: "Figma" },
                { src: "/dropbox.webp", alt: "Spotify" },
                { src: "/loom.webp", alt: "Stripe" },
                { src: "/airbnb.webp", alt: "Airbnb" },
              ].map((logo, idx) => (
                <div
                  key={logo.alt}
                  className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-[3px] border-background bg-muted shadow-sm transition-transform hover:z-10 hover:-translate-y-1"
                >
                  <Image src={logo.src} alt={logo.alt} width={40} height={40} />
                </div>
              ))}
              <div className="flex size-10 cursor-pointer items-center justify-center rounded-xl border-[3px] border-background bg-muted/80 text-[11px] font-bold text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted">
                +more
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex w-full items-center justify-center">
          <Marquee className="max-w-screen-xl">
            <MarqueeFade side="left" />
            <MarqueeFade side="right" />
            <MarqueeContent>
              {loading
                ? [...Array(10)].map((_, i) => (
                    <MarqueeItem className="h-40 w-40 shrink-0" key={i}>
                      <div className="relative flex h-full w-full items-center justify-center rounded-xl border bg-background p-2 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                        <Skeleton className="h-full w-full rounded-xl" />
                      </div>
                    </MarqueeItem>
                  ))
                : logos.map((logo) => (
                    <MarqueeItem className="h-40 w-40 shrink-0" key={logo.id}>
                      <div className="relative flex h-full w-full items-center justify-center rounded-xl border bg-background p-2 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                        <Image
                          src={logo.logo_url}
                          alt={logo.name}
                          fill
                          className="rounded-xl object-cover"
                          unoptimized
                        />
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
}

export default HeroSection
