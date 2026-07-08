"use client"

import { Calendar, Clock, Eye, Gamepad2 } from "lucide-react"

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function parseDuration(dur) {
  if (!dur) return "—"
  const h = dur.match(/(\d+)h/)
  const m = dur.match(/(\d+)m/)
  const s = dur.match(/(\d+)s/)
  let out = ""
  if (h) out += `${h[1]}h `
  if (m) out += `${m[1]}m `
  if (s) out += `${s[1]}s`
  return out.trim() || dur
}

export default function StreamSummary({ lastVod, lastSession }) {
  const data = lastVod || lastSession
  if (!data) return null

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all duration-300">
      {lastVod?.thumbnailUrl && (
        <img
          src={lastVod.thumbnailUrl}
          alt={lastVod.title}
          className="w-full aspect-video object-cover border-b border-[var(--border)]"
        />
      )}
      <div className="p-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
          Last Stream
        </h3>
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate mb-3">
          {data.title}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
          {data.gameName && (
            <span className="flex items-center gap-1.5">
              <Gamepad2 size={13} className="text-[var(--accent)]" />
              {data.gameName}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-[var(--accent)]" />
            {parseDuration(data.duration)}
          </span>
          {lastVod?.viewCount != null && (
            <span className="flex items-center gap-1.5">
              <Eye size={13} className="text-[var(--accent)]" />
              {lastVod.viewCount.toLocaleString()} views
            </span>
          )}
          {(lastVod?.createdAt || lastSession?.endedAt) && (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[var(--accent)]" />
              {formatDate(lastVod?.createdAt || lastSession.endedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
