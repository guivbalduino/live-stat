"use client"

export default function MetricCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
        {Icon && <Icon size={18} className="text-violet-500" />}
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-extrabold tracking-tight text-white tabular-nums">
          {value}
        </span>
        {trend !== undefined && (
          <span
            className={`text-sm font-semibold ${
              trend >= 0 ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}
          </span>
        )}
      </div>
    </div>
  )
}
