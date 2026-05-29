"use client"

import { UserPlus, MessageCircle } from "lucide-react"

export default function EventFeed({ events = [] }) {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-[var(--text-muted)]">
        Waiting for events…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto pr-1">
      {events.map((ev, i) => {
        const isFollow = ev.kind === "follow"
        const time = new Date(ev.timestamp).toLocaleTimeString([], {
          minute: "2-digit",
          second: "2-digit",
        })

        return (
          <div
            key={i}
            className="glass group/event flex items-start gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:border-[var(--border-light)]"
          >
            <span
              className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full ${
                isFollow
                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                  : "bg-[var(--success)]/20 text-[var(--success)]"
              }`}
            >
              {isFollow ? (
                <UserPlus size={14} />
              ) : (
                <MessageCircle size={14} />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {ev.user}
              </p>
              {ev.message && (
                <p className="truncate text-xs text-[var(--text-secondary)]">{ev.message}</p>
              )}
              {isFollow && (
                <p className="text-xs text-[var(--accent)]">New follower</p>
              )}
            </div>
            <span className="shrink-0 text-[11px] text-[var(--text-muted)]">{time}</span>
          </div>
        )
      })}
    </div>
  )
}
