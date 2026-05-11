"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "./button"

import { HugeiconsIcon } from "@hugeicons/react"
import { LayerMask01Icon } from "@hugeicons/core-free-icons"

interface ThemeToggleProps {
  onMouseEnter?: () => void
}

const ThemeToggle = ({ onMouseEnter }: ThemeToggleProps) => {
  const { setTheme, resolvedTheme } = useTheme()

  // Avoid hydration mismatch
  if (!resolvedTheme) return null

  return (
    <Button
      variant="outline"
      size="icon"
      onMouseEnter={onMouseEnter}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <HugeiconsIcon
          icon={LayerMask01Icon}
          className="-rotate-45 size-4 text-foreground/80"
        />
      </AnimatePresence>
    </Button>
  )
}

export default ThemeToggle
