import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

const headingFont = localFont({
  src: "./fonts/CooperLtBT-Light.woff2",
  variable: "--font-heading",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "The Logo Vault | Curated Logo Inspiration",
    template: "%s | The Logo Vault",
  },
  description:
    "The ultimate curated collection of logo designs. Discover hand-picked logos from top designers searchable by style, industry, and color for your next brand.",
  keywords: [
    "logo",
    "logo design",
    "logo inspiration",
    "branding",
    "brand identity",
    "design inspiration",
    "logo gallery",
    "logo collection",
  ],
  authors: [{ name: "The Logo Vault" }],
  creator: "The Logo Vault",
  metadataBase: new URL("https://logo-inspo.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://logo-inspo.vercel.app",
    siteName: "The Logo Vault",
    title: "The Logo Vault - Curated Logo Inspiration",
    description:
      "The ultimate curated collection of logo designs. Discover hand-picked logos from top designers searchable by style, industry, and color.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Logo Vault - Curated Logo Inspiration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Logo Vault - Curated Logo Inspiration",
    description:
      "The ultimate curated collection of logo designs. Discover hand-picked logos from top designers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        headingFont.variable
      )}
    >
      <body className={geist.className}>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
