"use client"

import { UserPlus, MessageCircle } from "lucide-react"

export default function EventFeed({ events = [] }) {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-zinc-600">
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
            className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 backdrop-blur"
          >
            <span
              className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full ${
                isFollow
                  ? "bg-violet-500/20 text-violet-400"
                  : "bg-emerald-500/20 text-emerald-400"
              }`}
            >
              {isFollow ? (
                <UserPlus size={14} />
              ) : (
                <MessageCircle size={14} />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {ev.user}
              </p>
              {ev.message && (
                <p className="truncate text-xs text-zinc-400">{ev.message}</p>
              )}
              {isFollow && (
                <p className="text-xs text-violet-400">New follower</p>
              )}
            </div>
            <span className="shrink-0 text-[11px] text-zinc-600">{time}</span>
          </div>
        )
      })}
    </div>
  )
}
