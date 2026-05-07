"use client"

import * as Popover from "@radix-ui/react-popover"
import { useState } from "react"
import { cn } from "@/lib/utils"

const themes = [
  { value: "dark", label: "Dark", color: "#1a1a1a" },
  { value: "light", label: "Light", color: "#ffffff", border: "border" },
  { value: "colorful", label: "Colorful", color: "#ff6b6b" },
  { value: "minimal", label: "Minimal", color: "#f0f0f0" },
  { value: "monochrome", label: "Monochrome", color: "#666666" },
  {
    value: "gradient",
    label: "Gradient",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
]

interface ThemeFilterProps {
  activeTheme: string | undefined
  onThemeChange: (theme: string | undefined) => void
}

export function ThemeFilter({ activeTheme, onThemeChange }: ThemeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
            activeTheme && "border-primary"
          )}
        >
          <span
            className={cn(
              "h-4 w-4 rounded-full border border-border",
              activeTheme
                ? themes.find((t) => t.value === activeTheme)?.color
                : "bg-muted"
            )}
            style={{
              background: activeTheme
                ? themes.find((t) => t.value === activeTheme)?.color
                : undefined,
            }}
          />
          <span>
            {activeTheme
              ? themes.find((t) => t.value === activeTheme)?.label
              : "Theme"}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-48 rounded-lg border border-border bg-background p-2 shadow-lg"
          sideOffset={5}
        >
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                onThemeChange(undefined)
                setIsOpen(false)
              }}
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm transition-colors",
                !activeTheme
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              All
            </button>
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => {
                  onThemeChange(theme.value)
                  setIsOpen(false)
                }}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                  activeTheme === theme.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 rounded-full border border-border",
                    theme.border && "border"
                  )}
                  style={{ background: theme.color }}
                />
                {theme.label}
              </button>
            ))}
          </div>
          <Popover.Arrow className="fill-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
