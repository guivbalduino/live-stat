"use client"

import { useEffect, useState } from "react"
import { Play, Gamepad2, Clock, Globe, BadgeCheck, Sparkles } from "lucide-react"

function elapsed(startedAt) {
  const diff = Date.now() - new Date(startedAt).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export default function StreamStatus({ title, gameName, startedAt, isLive, profileImageUrl, language, broadcasterType, description, tags, gameBoxArtUrl }) {
  const [time, setTime] = useState("00:00:00")

  useEffect(() => {
    if (!startedAt) return
    setTime(elapsed(startedAt))
    const timer = setInterval(() => setTime(elapsed(startedAt)), 1000)
    return () => clearInterval(timer)
  }, [startedAt])

  return (
    <div className="glass flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl px-6 py-4 transition-all duration-300">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt="Avatar"
            className="h-10 w-10 rounded-full border border-[var(--border-light)] shrink-0"
          />
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`flex h-3 w-3 rounded-full ${isLive ? "bg-[var(--danger)] shadow-[0_0_10px_var(--danger)] animate-pulse" : "bg-zinc-600"}`}
          />
          <span className="text-sm font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            {isLive ? "LIVE" : "OFFLINE"}
          </span>
          {broadcasterType === "partner" && (
            <span className="flex items-center gap-1 rounded-md bg-[var(--accent)]/15 px-2 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
              <BadgeCheck size={12} /> PARTNER
            </span>
          )}
          {broadcasterType === "affiliate" && (
            <span className="flex items-center gap-1 rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
              <Sparkles size={12} /> AFFILIATE
            </span>
          )}
        </div>
      </div>

      {isLive && (
        <>
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <Play size={16} className="text-[var(--accent)] shrink-0" />
            <span className="truncate max-w-[260px] text-base font-bold">
              {title || "Untitled Stream"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Gamepad2 size={15} className="text-[var(--accent)] shrink-0" />
            <span>{gameName || "Unknown"}</span>
            {gameBoxArtUrl && (
              <img src={gameBoxArtUrl} alt={gameName} className="h-8 w-6 rounded object-cover" />
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Clock size={15} className="text-[var(--accent)] shrink-0" />
            <span className="tabular-nums">{time}</span>
          </div>

          {language && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Globe size={15} className="text-[var(--accent)] shrink-0" />
              <span className="uppercase">{language}</span>
            </div>
          )}

          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {description && (
        <p className="w-full text-xs text-[var(--text-muted)] truncate leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
