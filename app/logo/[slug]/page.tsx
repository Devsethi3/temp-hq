import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
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
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "db", "logos.json")
  const data = fs.readFileSync(filePath, "utf-8")
  const logos: Logo[] = JSON.parse(data)
  return logos.map((logo) => ({ slug: logo.slug }))
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
    <div className="mx-auto min-h-screen max-w-7xl border-x px-4">
      <Header />
      <LogoDetailContent logo={logo} />
      <FullWidthDivider />
      <SimilarLogos currentSlug={slug} />
      <hr />
      <Footer />
    </div>
  )
}
