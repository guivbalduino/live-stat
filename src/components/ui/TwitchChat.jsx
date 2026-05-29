"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/lib/ThemeContext"

export default function TwitchChat({ channel }) {
  const [host, setHost] = useState("localhost")
  const { theme } = useTheme()

  useEffect(() => {
    setHost(window.location.hostname)
  }, [])

  const darkParam = theme === "dark" ? "&darkpopout" : ""

  if (!channel) {
    return (
      <div className="glass flex h-full items-center justify-center rounded-2xl text-sm text-[var(--text-muted)]">
        No channel configured for chat
      </div>
    )
  }

  return (
    <div className="glass flex h-full flex-col rounded-2xl overflow-hidden transition-all duration-300">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[var(--danger)]" />
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
          Twitch Chat
        </span>
      </div>
      <iframe
        key={theme}
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=${host}${darkParam}`}
        className="h-full w-full"
        title="Twitch Chat"
      />
    </div>
  )
}
