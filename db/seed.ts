import { Database } from "bun:sqlite"

const sqlite = new Database("./logo-inspo.db")

// Create table if not exists
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS logos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    designer TEXT NOT NULL,
    description TEXT,
    website_url TEXT,
    category TEXT DEFAULT 'all',
    logo_url TEXT NOT NULL,
    theme TEXT DEFAULT 'dark',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)

const logos = [
  {
    name: "Portflow",
    slug: "portflow",
    designer: "devxnuj",
    description:
      "A curated logo reference from the inspiration library. Symbol & Text. Beige",
    website_url: "https://x.com/devxnuj/status/2046561429344641243",
    category: "design",
    logo_url:
      "https://pub-9e87358252234923985c8cd9daf30e20.r2.dev/portflow.webp",
    theme: "light",
  },
  {
    name: "Verse Studio",
    slug: "verse-studio",
    designer: "shadowedarts",
    description:
      "A curated logo reference from the inspiration library. Symbol & Text. Purple",
    website_url: "https://www.instagram.com/p/DWmFu2Qj5Dm/",
    category: "design",
    logo_url: "https://pub-9e87358252234923985c8cd9daf30e20.r2.dev/verse.webp",
    theme: "colorful",
  },
  {
    name: "Gojiberry",
    slug: "gojiberry",
    designer: "poulisn",
    description:
      "A curated logo reference from the inspiration library. Symbol & Text. Orange",
    website_url: "https://x.com/poulisn/status/2042776628502081956",
    category: "food",
    logo_url:
      "https://pub-9e87358252234923985c8cd9daf30e20.r2.dev/gojiberry.webp",
    theme: "colorful",
  },
  {
    name: "Herman Miller",
    slug: "herman-miller",
    designer: "order",
    description:
      "A curated logo reference from the inspiration library. Symbol & Text. Black",
    website_url: "https://www.cosmos.so/e/1675354418",
    category: "design",
    logo_url:
      "https://pub-9e87358252234923985c8cd9daf30e20.r2.dev/hermanmiller.webp",
    theme: "dark",
  },
]

const insert = sqlite.prepare(`
  INSERT INTO logos (name, slug, designer, description, website_url, category, logo_url, theme)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  ON CONFLICT(slug) DO NOTHING
`)

console.log("Seeding logos...")

for (const logo of logos) {
  insert.run(
    logo.name,
    logo.slug,
    logo.designer,
    logo.description,
    logo.website_url,
    logo.category,
    logo.logo_url,
    logo.theme
  )
  console.log(`Seeded: ${logo.name}`)
}

console.log("Seed completed!")
console.log(
  `Total logos in database: ${sqlite.prepare("SELECT COUNT(*) FROM logos").get() as any}`
)
