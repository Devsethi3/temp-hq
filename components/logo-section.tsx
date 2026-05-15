"use client"

import { useState, useEffect, memo } from "react"
import { Input } from "./ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FilterHorizontalIcon,
  PaintBoardIcon,
  SearchIcon,
  Sorting02Icon,
} from "@hugeicons/core-free-icons"
import { TextureButton } from "./ui/texture-button"
import { FullWidthDivider } from "./ui/full-width-divider"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Logo {
  id: number
  name: string
  slug: string
  designer: string
  category: string
  logo_url: string
  theme: string
}

interface LogoSectionProps {
  onFilterChange?: (filters: {
    category: string
    sort: string
    theme: string
    search: string
  }) => void
}

const categories = [
  { value: "all", label: "All" },
  { value: "design", label: "Design" },
  { value: "tech", label: "Tech" },
  { value: "saas", label: "SaaS" },
  { value: "ai", label: "AI" },
  { value: "food", label: "Food" },
  { value: "fashion", label: "Fashion" },
  { value: "finance", label: "Finance" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  // { value: "realestate", label: "Real Estate" },
  // { value: "entertainment", label: "Entertainment" },
  // { value: "sports", label: "Sports" },
  // { value: "travel", label: "Travel" },
  // { value: "music", label: "Music" },
]

const sortOptions = [
  { value: "latest", label: "Latest", description: "Recently added" },
  {
    value: "updated",
    label: "Recently Updated",
    description: "Recently modified",
  },
  { value: "popular", label: "Popular", description: "Most viewed" },
]

const themeColors = [
  { value: "all", label: "All", color: "transparent" },
  { value: "black", label: "Black", color: "#171717" },
  { value: "white", label: "White", color: "#F5F5F5" },
  { value: "grey", label: "Grey", color: "#6B7280" },
  { value: "red", label: "Red", color: "#EF4444" },
  { value: "orange", label: "Orange", color: "#F97316" },
  { value: "yellow", label: "Yellow", color: "#EAB308" },
  { value: "green", label: "Green", color: "#22C55E" },
  { value: "teal", label: "Teal", color: "#14B8A6" },
  { value: "blue", label: "Blue", color: "#3B82F6" },
  { value: "purple", label: "Purple", color: "#8B5CF6" },
  { value: "pink", label: "Pink", color: "#EC4899" },
  { value: "beige", label: "Beige", color: "#D4B896" },
  { value: "brown", label: "Brown", color: "#8B4513" },
  { value: "navy", label: "Navy", color: "#1E3A5F" },
  { value: "maroon", label: "Maroon", color: "#800000" },
]

const LogoSection = memo(({ onFilterChange }: LogoSectionProps) => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [activeTheme, setActiveTheme] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)

  useEffect(() => {
    onFilterChange?.({
      category: activeCategory,
      sort: sortBy,
      theme: activeTheme,
      search: searchQuery,
    })
  }, [activeCategory, sortBy, activeTheme, searchQuery, onFilterChange])

  const activeCategoryData = categories.find((c) => c.value === activeCategory)
  const activeSortData = sortOptions.find((s) => s.value === sortBy)
  const activeThemeData = themeColors.find((t) => t.value === activeTheme)
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <div className="w-full">
      <FullWidthDivider />
      <div className="flex flex-col items-center gap-2 pt-6 lg:flex-row">
        <InputGroup className="h-10 w-full">
          <InputGroupAddon>
            <HugeiconsIcon icon={SearchIcon} aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search"
            placeholder="Search Logos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
          />
        </InputGroup>
        <div className="flex w-full items-center gap-2 lg:w-1/3">
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <TextureButton
                size={isMobile ? "sm" : "default"}
                variant="minimal"
                // variant={activeCategory !== "all" ? "accent" : "minimal"}
                className="h-9 rounded-lg sm:h-10"
              >
                <HugeiconsIcon
                  icon={FilterHorizontalIcon}
                  className="mr-2 size-4"
                />
                {activeCategory !== "all"
                  ? activeCategoryData?.label
                  : "Categories"}
                {/* {activeCategory !== "all" && activeCategoryData?.count && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({activeCategoryData.count})
                  </span>
                )} */}
              </TextureButton>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2" align="end">
              <div className="grid gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setActiveCategory(cat.value)
                      setCategoryOpen(false)
                    }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      activeCategory === cat.value ? "bg-muted font-medium" : ""
                    }`}
                  >
                    <span>{cat.label}</span>
                    {/* {cat.count !== undefined && cat.count > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {cat.count}
                      </span>
                    )} */}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter Popover */}
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <TextureButton
                variant="minimal"
                size={isMobile ? "sm" : "default"}
                className="h-9 w-full rounded-lg whitespace-nowrap sm:h-10"
              >
                <HugeiconsIcon icon={Sorting02Icon} className="mr-2 size-4" />
                {activeSortData?.label}
              </TextureButton>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="grid gap-1">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value)
                      setSortOpen(false)
                    }}
                    className={`flex flex-col items-start rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      sortBy === opt.value ? "bg-muted font-medium" : ""
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {opt.description}
                    </span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme Popover */}
          <Popover open={themeOpen} onOpenChange={setThemeOpen}>
            <PopoverTrigger asChild>
              <TextureButton
                variant="minimal"
                size={isMobile ? "sm" : "default"}
                // variant={activeTheme !== "all" ? "accent" : "minimal"}
                className="h-9 w-full rounded-lg sm:h-10"
              >
                <HugeiconsIcon icon={PaintBoardIcon} className="mr-2 size-4" />
                {activeTheme !== "all" ? activeThemeData?.label : "Theme"}
                {activeTheme !== "all" && (
                  <span
                    className="ml-2 inline-flex h-4 w-4 rounded-full border border-border"
                    style={{ backgroundColor: activeThemeData?.color }}
                  />
                )}
              </TextureButton>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end">
              <div className="grid grid-cols-4 gap-2">
                {themeColors.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => {
                      setActiveTheme(theme.value)
                      setThemeOpen(false)
                    }}
                    className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-colors hover:bg-muted ${
                      activeTheme === theme.value ? "bg-muted" : ""
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-border"
                      style={{
                        backgroundColor: theme.color,
                        border:
                          theme.value === "all"
                            ? "1px dashed currentColor"
                            : undefined,
                      }}
                    />
                    <span className="text-xs">{theme.label}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
})

export default LogoSection
export { type Logo }
