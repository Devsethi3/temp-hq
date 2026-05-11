import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import LogoDetailContent from "./content"
import SimilarLogos from "./similar-logos"
import { FullWidthDivider } from "@/components/ui/full-width-divider"
import { Footer } from "@/components/footer"

interface Logo {
  id: number
  name: string
  slug: string
  designer: string
  description: string
  website_url: string
  category: string
  logo_url: string
  theme: string
  mockups?: string[]
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "db", "logos.json")
  const data = fs.readFileSync(filePath, "utf-8")
  const logos: Logo[] = JSON.parse(data)
  return logos.map((logo) => ({ slug: logo.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const filePath = path.join(process.cwd(), "db", "logos.json")
  const data = fs.readFileSync(filePath, "utf-8")
  const logos: Logo[] = JSON.parse(data)
  const logo = logos.find((l) => l.slug === slug)

  if (!logo) {
    return {
      title: "Logo Not Found",
    }
  }

  return {
    title: `${logo.name} Logo by ${logo.designer}`,
    description: `Explore the ${logo.name} logo by ${logo.designer}. ${logo.description} Browse more logo inspiration in The Logo Vault.`,
    openGraph: {
      title: `${logo.name} Logo - The Logo Vault`,
      description: `Check out this ${logo.name} logo designed by ${logo.designer}. ${logo.description}`,
      images: [logo.logo_url],
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${logo.name} Logo - The Logo Vault`,
      description: `Check out this ${logo.name} logo designed by ${logo.designer}.`,
    },
  }
}

export default async function LogoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), "db", "logos.json")
  const data = fs.readFileSync(filePath, "utf-8")
  const logos: Logo[] = JSON.parse(data)
  const logo = logos.find((l) => l.slug === slug)

  if (!logo) {
    notFound()
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl overflow-hidden border-x px-4 lg:overflow-visible">
      <Header />
      <LogoDetailContent logo={logo} />
      <FullWidthDivider />
      <SimilarLogos currentSlug={slug} />
      <FullWidthDivider />
      <Footer />
    </div>
  )
}
