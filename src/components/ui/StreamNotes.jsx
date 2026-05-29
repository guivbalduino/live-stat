"use client"

import { Target, Lightbulb } from "lucide-react"

export default function StreamNotes({ notes = [] }) {
  const defaultNotes = [
    { icon: Target, text: "Goal: 50 followers this stream", color: "text-violet-400" },
    { icon: Lightbulb, text: "Reminder: check chat every 5 min", color: "text-emerald-400" },
  ]

  const items = notes.length > 0 ? notes : defaultNotes

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 backdrop-blur">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Stream Notes
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="flex items-start gap-2 text-sm">
              {Icon && <Icon size={16} className={`mt-0.5 shrink-0 ${item.color}`} />}
              <span className="text-zinc-300">{item.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
