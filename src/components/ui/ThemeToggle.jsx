"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/ThemeContext"

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggle}
      className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)] hover:shadow-[0_0_12px_-4px_var(--accent-glow)]"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={13} /> : <Moon size={13} />}
      {isDark ? "Light" : "Dark"}
    </button>
  )
}
