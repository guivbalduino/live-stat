"use client"

import { useEffect, useState } from "react"
import { Play, Gamepad2, Clock } from "lucide-react"

function elapsed(startedAt) {
  const diff = Date.now() - new Date(startedAt).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export default function StreamStatus({ title, gameName, startedAt, isLive }) {
  const [time, setTime] = useState("00:00:00")

  useEffect(() => {
    if (!startedAt) return
    setTime(elapsed(startedAt))
    const timer = setInterval(() => setTime(elapsed(startedAt)), 1000)
    return () => clearInterval(timer)
  }, [startedAt])

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-3 w-3 rounded-full ${isLive ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse" : "bg-zinc-600"}`}
        />
        <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          {isLive ? "LIVE" : "OFFLINE"}
        </span>
      </div>

      {isLive && (
        <>
          <div className="flex items-center gap-2 text-white">
            <Play size={16} className="text-violet-500" />
            <span className="truncate max-w-[320px] text-base font-bold">
              {title || "Untitled Stream"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Gamepad2 size={15} className="text-violet-500" />
            <span>{gameName || "Unknown"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Clock size={15} className="text-violet-500" />
            <span className="tabular-nums">{time}</span>
          </div>
        </>
      )}
    </div>
  )
}
