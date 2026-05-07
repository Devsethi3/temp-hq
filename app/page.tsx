"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import HeroSection from "@/components/hero-section"
import { LogoGallery } from "@/components/logo-gallery"
import LogoSection, { type Logo } from "@/components/logo-section"
import { Footer } from "@/components/footer"
import { FullWidthDivider } from "@/components/ui/full-width-divider"

export default function HomePage() {
  const [filters, setFilters] = useState({
    category: "all",
    sort: "latest",
    theme: "all",
    search: "",
  })

  return (
    <div className="mx-auto min-h-screen max-w-7xl border-x px-4">
      <Header />
      <HeroSection />
      <main className="py-12">
        <LogoSection onFilterChange={setFilters} />
        <LogoGallery
          category={filters.category}
          theme={filters.theme}
          searchQuery={filters.search}
          sortBy={filters.sort}
        />
      </main>
      <hr className="w-full" />
      <Footer />
    </div>
  )
}
