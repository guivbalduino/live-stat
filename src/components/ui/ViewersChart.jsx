"use client"

import { useMemo } from "react"

function smoothPath(points, xScale, yScale) {
  if (points.length < 2) return ""
  let d = `M${xScale(0).toFixed(1)},${yScale(points[0].v).toFixed(1)}`

  for (let i = 0; i < points.length - 1; i++) {
    const x0 = xScale(Math.max(0, i - 1))
    const y0 = yScale(points[Math.max(0, i - 1)].v)
    const x1 = xScale(i)
    const y1 = yScale(points[i].v)
    const x2 = xScale(i + 1)
    const y2 = yScale(points[i + 1].v)
    const x3 = xScale(Math.min(points.length - 1, i + 2))
    const y3 = yScale(points[Math.min(points.length - 1, i + 2)].v)

    const cpx1 = x1 + (x2 - x0) / 6
    const cpy1 = y1 + (y2 - y0) / 6
    const cpx2 = x2 - (x3 - x1) / 6
    const cpy2 = y2 - (y3 - y1) / 6

    d += `C${cpx1.toFixed(1)},${cpy1.toFixed(1)} ${cpx2.toFixed(1)},${cpy2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`
  }
  return d
}

export default function ViewersChart({ data = [], maxPoints = 60 }) {
  const points = data.slice(-maxPoints)
  const W = 640
  const H = 160
  const P = 10

  const { path, fillPath, lastPoint, ticks } = useMemo(() => {
    if (points.length < 2)
      return { path: "", fillPath: "", lastPoint: null, ticks: [] }

    const values = points.map((p) => p.v)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = Math.max(max - min, 10)

    const xScale = (i) => P + (i / (points.length - 1)) * (W - 2 * P)
    const yScale = (v) => H - P - ((v - min) / range) * (H - 2 * P)

    const line = smoothPath(points, xScale, yScale)
    const fill = `${line}L${xScale(points.length - 1)},${H - P}L${xScale(0)},${H - P}Z`

    const last = {
      x: xScale(points.length - 1),
      y: yScale(points[points.length - 1].v),
      value: points[points.length - 1].v,
    }

    const tickCount = 4
    const ticks = Array.from({ length: tickCount }, (_, i) => {
      const v = min + (range * i) / (tickCount - 1)
      const y = yScale(v)
      return { y, label: Math.round(v).toString() }
    })

    return { path: line, fillPath: fill, lastPoint: last, ticks }
  }, [points])

  if (points.length < 2) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl glass text-sm text-[var(--text-muted)]">
        Waiting for viewer data…
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-4 glass-hover transition-all duration-300">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
        Viewers Over Time
      </h3>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="viewerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={P}
              y1={t.y}
              x2={W - P}
              y2={t.y}
              stroke="var(--border)"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
            <text
              x={P - 5}
              y={t.y + 3}
              textAnchor="end"
              className="fill-[var(--text-muted)]"
              fontSize="9"
              fontFamily="Inter, sans-serif"
            >
              {t.label}
            </text>
          </g>
        ))}

        <path d={fillPath} fill="url(#viewerGrad)" />

        <path
          d={path}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {lastPoint && (
          <>
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="4"
              fill="var(--accent)"
              opacity="0.3"
            >
              <animate
                attributeName="r"
                values="4;7;4"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="2.5"
              fill="var(--accent)"
            />
            <text
              x={lastPoint.x - 6}
              y={lastPoint.y - 10}
              textAnchor="end"
              className="fill-[var(--text-primary)]"
              fontSize="11"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
            >
              {lastPoint.value}
            </text>
          </>
        )}
      </svg>
    </div>
  )
}
