"use client"

import { cn } from "@/lib/utils"

const categories = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "all", label: "All" },
  { value: "ai", label: "AI" },
  { value: "finance", label: "Finance" },
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "Ecommerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "gaming", label: "Gaming" },
  { value: "food", label: "Food" },
  { value: "travel", label: "Travel" },
  { value: "real-estate", label: "Real Estate" },
  { value: "technology", label: "Technology" },
  { value: "marketing", label: "Marketing" },
]

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="scrollbar-hide flex w-full items-center gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
            activeCategory === category.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
