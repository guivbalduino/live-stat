"use client"

export default function MetricCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="glass group relative flex flex-col gap-1 rounded-2xl p-5 transition-all duration-300 glass-hover hover:shadow-[0_0_30px_-8px_var(--accent-glow)]">
      {trend !== undefined && trend >= 0 && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent-glow)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <div className="relative flex items-center gap-2 text-[12px] font-medium text-[var(--text-muted)]">
        {Icon && (
          <Icon
            size={16}
            className="text-[var(--accent)] transition-transform duration-300 group-hover:scale-110"
          />
        )}
        <span>{label}</span>
      </div>
      <div className="relative flex items-baseline gap-3">
        <span className="text-[2rem] font-extrabold tracking-tighter text-[var(--text-primary)] tabular-nums leading-none">
          {value}
        </span>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold ${
              trend >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"
            }`}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}
          </span>
        )}
      </div>
    </div>
  )
}
