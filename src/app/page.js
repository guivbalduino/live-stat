"use client"

import { useEffect, useState, useRef } from "react"
import { Eye, Users, Heart, Activity } from "lucide-react"
import MetricCard from "@/components/ui/MetricCard"
import EventFeed from "@/components/ui/EventFeed"
import StreamStatus from "@/components/ui/StreamStatus"
import StreamNotes from "@/components/ui/StreamNotes"

export default function DashboardPage() {
  const [status, setStatus] = useState({ mock: false, isLive: false, title: "", gameName: "", startedAt: null, viewerCount: 0 })
  const [viewers, setViewers] = useState(0)
  const [peak, setPeak] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)
  const [events, setEvents] = useState([])
  const [mockBadge, setMockBadge] = useState(false)

  useEffect(() => {
    fetch("/api/twitch")
      .then((r) => r.json())
      .then((data) => {
        setStatus(data)
        setMockBadge(data.mock)
        if (data.isLive) setViewers(data.viewerCount)
        if (data.mock) setViewers(42 + Math.floor(Math.random() * 80))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const es = new EventSource("/api/events")

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)

        if (data.type === "connected") {
          setMockBadge(data.mock)
          return
        }

        if (data.viewerCount !== undefined) {
          setViewers((prev) => {
            const next = data.viewerCount
            setPeak((p) => Math.max(p, next))
            return next
          })
        }

        if (data.type === "new_event" && data.event) {
          const ev = data.event
          setEvents((prev) => [ev, ...prev].slice(0, 50))
          if (ev.kind === "follow") {
            setFollowerCount((c) => c + 1)
          }
        }
      } catch {}
    }

    return () => es.close()
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black">
      <header className="flex items-center justify-between border-b border-zinc-900 px-6 py-3">
        <h1 className="text-lg font-black tracking-tight text-white">
          <span className="text-violet-500">◆</span> Twitch Beam
        </h1>
        {mockBadge && (
          <span className="rounded-full border border-yellow-700 bg-yellow-950/40 px-3 py-0.5 text-xs font-semibold text-yellow-400">
            MOCK MODE
          </span>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 lg:p-6">
        <StreamStatus
          title={status.title}
          gameName={status.gameName}
          startedAt={status.startedAt}
          isLive={status.isLive}
        />

        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MetricCard label="Viewers" value={viewers} icon={Eye} />
              <MetricCard label="Peak Viewers" value={peak} icon={Activity} trend={peak > 0 ? 1 : 0} />
              <MetricCard label="Followers" value={followerCount} icon={Heart} />
              <MetricCard label="Uptime" value={status.startedAt ? "Live" : "—"} icon={Users} />
            </div>

            <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 backdrop-blur">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Recent Events
              </h3>
              <EventFeed events={events} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <StreamNotes />
          </div>
        </div>
      </div>
    </div>
  )
}
