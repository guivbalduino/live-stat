"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { Eye, Heart, Activity, EyeOff, Shuffle, Volume2, VolumeX, TrendingUp } from "lucide-react"
import MetricCard from "@/components/ui/MetricCard"
import EventFeed from "@/components/ui/EventFeed"
import StreamStatus from "@/components/ui/StreamStatus"
import StreamNotes from "@/components/ui/StreamNotes"
import TwitchChat from "@/components/ui/TwitchChat"
import ThemeToggle from "@/components/ui/ThemeToggle"
import ViewersChart from "@/components/ui/ViewersChart"
import { playFollowSound } from "@/lib/sounds"

export default function DashboardPage() {
  const [status, setStatus] = useState({ mock: false, isLive: false, title: "", gameName: "", startedAt: null, viewerCount: 0, followerCount: 0, totalViews: 0, language: "", profileImageUrl: null, thumbnailUrl: null })
  const [viewers, setViewers] = useState(0)
  const [peak, setPeak] = useState(0)
  const [totalFollowers, setTotalFollowers] = useState(0)
  const [sessionFollowers, setSessionFollowers] = useState(0)
  const [events, setEvents] = useState([])
  const [mockBadge, setMockBadge] = useState(false)
  const [modeInfo, setModeInfo] = useState({ override: null, effectiveMock: true, hasCredentials: false })
  const [sseKey, setSseKey] = useState(0)
  const [chartData, setChartData] = useState([])
  const [soundOn, setSoundOn] = useState(false)
  const chartRef = useRef([])
  const sessionStartRef = useRef(Date.now())
  const liveStreamIdRef = useRef(null)
  const followerBaselineRef = useRef(null)

  const avgViewers = useMemo(() => {
    if (chartData.length < 2) return 0
    const sum = chartData.reduce((a, p) => a + p.v, 0)
    return Math.round(sum / chartData.length)
  }, [chartData])

  const sessionHours = useMemo(() => {
    return (Date.now() - sessionStartRef.current) / 3600000
  }, [chartData]) // re-calc on chartData to keep updating

  const followerRate = sessionHours > 0 ? (sessionFollowers / sessionHours).toFixed(1) : "—"

  useEffect(() => {
    fetch("/api/twitch/mode")
      .then((r) => r.json())
      .then(setModeInfo)
      .catch(() => {})
  }, [])

  useEffect(() => {
    function check() {
      fetch("/api/twitch")
        .then((r) => r.json())
        .then((data) => {
          setStatus(data)
          setMockBadge(data.mock)
          setTotalFollowers(data.followerCount ?? 0)
          if (data.isLive) setViewers(data.viewerCount)

          if (!data.mock) {
            const streamId = data.startedAt
            const isNewStream = streamId && streamId !== liveStreamIdRef.current

            if (isNewStream) {
              liveStreamIdRef.current = streamId
              sessionStartRef.current = Date.now()
              followerBaselineRef.current = data.followerCount ?? 0
              setSessionFollowers(0)
            }

            const currentFC = data.followerCount ?? 0
            const baseline = followerBaselineRef.current
            if (baseline !== null && currentFC > baseline) {
              followerBaselineRef.current = currentFC
              setSessionFollowers(currentFC - baseline)
              setEvents((prev) => [
                { kind: "follow", user: "New Follower", timestamp: Date.now() },
                ...prev,
              ].slice(0, 50))
              if (soundOn) playFollowSound()
            }
          }
        })
        .catch(() => {})
    }

    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [sseKey, soundOn])

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
          chartRef.current = [...chartRef.current.slice(-59), { t: Date.now(), v: data.viewerCount }]
          setChartData(chartRef.current)
        }

        if (data.type === "new_event" && data.event) {
          const ev = data.event
          setEvents((prev) => [ev, ...prev].slice(0, 50))
          if (ev.kind === "follow") {
            setSessionFollowers((c) => c + 1)
            if (soundOn) playFollowSound()
          }
        }
      } catch {}
    }

    return () => es.close()
  }, [sseKey])

  const toggleMode = useCallback(async () => {
    const next = modeInfo.effectiveMock ? "real" : "mock"
    const res = await fetch("/api/twitch/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: next }),
    })
    const data = await res.json()
    setModeInfo(data)
    setSseKey((k) => k + 1)
    setEvents([])
    setViewers(0)
    setPeak(0)
    setSessionFollowers(0)
    chartRef.current = []
    setChartData([])
    sessionStartRef.current = Date.now()
  }, [modeInfo.effectiveMock])

  const showToggle = modeInfo.hasCredentials

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[var(--bg-primary)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-60 blur-[120px]"
          style={{ background: "var(--glow-violet)", animation: "float 20s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-50 blur-[100px]"
          style={{ background: "var(--glow-emerald)", animation: "float 25s ease-in-out infinite reverse" }}
        />
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-[var(--border)] px-6 py-3 glass">
        <h1 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
          <span className="text-[var(--accent)]">◆</span> Twitch Beam
        </h1>
        <div className="flex items-center gap-3">
          {mockBadge && (
            <span className="rounded-full border border-yellow-600/30 bg-yellow-500/10 px-3 py-0.5 text-[11px] font-semibold text-yellow-400">
              MOCK MODE
            </span>
          )}
          {!mockBadge && modeInfo.hasCredentials && (
            <span className="rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 px-3 py-0.5 text-[11px] font-semibold text-[var(--success)]">
              LIVE DATA
            </span>
          )}
          {showToggle && (
            <button
              onClick={toggleMode}
              className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)] hover:shadow-[0_0_12px_-4px_var(--accent-glow)]"
            >
              <Shuffle size={13} />
              {modeInfo.effectiveMock ? "Use Live" : "Use Mock"}
            </button>
          )}
          <button
            onClick={() => setSoundOn((s) => !s)}
            className={`glass flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 hover:shadow-[0_0_12px_-4px_var(--accent-glow)] ${
              soundOn
                ? "border-[var(--success)]/30 text-[var(--success)] shadow-[0_0_16px_-4px_var(--success)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            title={soundOn ? "Mute alerts" : "Enable sound alerts"}
          >
            {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
            Sound
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 lg:p-6">
        <StreamStatus
          title={status.title}
          gameName={status.gameName}
          startedAt={status.startedAt}
          isLive={status.isLive}
          profileImageUrl={status.profileImageUrl}
          language={status.language}
          broadcasterType={status.broadcasterType}
          description={status.description}
          tags={status.tags}
          gameBoxArtUrl={status.gameBoxArtUrl}
        />

        {status.isLive && status.thumbnailUrl && (
          <img
            src={status.thumbnailUrl}
            alt="Stream preview"
            className="w-full rounded-2xl border border-[var(--border)] object-cover lg:hidden"
          />
        )}

        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MetricCard label="Viewers" value={viewers} icon={Eye} />
              <MetricCard label="Peak" value={peak} icon={Activity} />
              <MetricCard label="Avg Viewers" value={avgViewers} icon={EyeOff} />
              <MetricCard label="New Followers" value={sessionFollowers} icon={Heart} trend={sessionFollowers > 0 ? 1 : 0} />
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)] px-1 -mt-2">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} className="text-[var(--accent)]" />
                {followerRate} follows/h
              </span>
              <span>·</span>
              <span>{totalFollowers.toLocaleString()} total followers</span>
              {status.totalViews > 0 && (
                <>
                  <span>·</span>
                  <span>{status.totalViews.toLocaleString()} total views</span>
                </>
              )}
            </div>

            <div className="h-44">
              <ViewersChart data={chartData} />
            </div>

            <div className="glass flex-1 rounded-2xl p-5 flex flex-col overflow-hidden transition-all duration-300">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] shrink-0">
                Recent Events
              </h3>
              <div className="flex-1 overflow-hidden">
                <EventFeed events={events} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <TwitchChat channel={status.broadcasterName} />
            </div>
            <StreamNotes />
          </div>
        </div>
      </div>
    </div>
  )
}
