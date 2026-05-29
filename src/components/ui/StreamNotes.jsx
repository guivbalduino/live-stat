"use client"

import { useState, useEffect, useCallback } from "react"
import { Target, Lightbulb, Plus, X, Check, FileText, Star, Zap, MessageSquare } from "lucide-react"

const icons = [Target, Lightbulb, Star, Zap, MessageSquare, FileText]
const colors = ["text-violet-400", "text-emerald-400", "text-amber-400", "text-sky-400", "text-rose-400", "text-cyan-400"]

export default function StreamNotes() {
  const [notes, setNotes] = useState([])
  const [editing, setEditing] = useState(-1)
  const [editVal, setEditVal] = useState("")
  const [adding, setAdding] = useState(false)
  const [newVal, setNewVal] = useState("")

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => setNotes(data.notes ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const es = new EventSource("/api/events")
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === "notes_sync" && data.notes) {
          setNotes(data.notes)
        }
      } catch {}
    }
    return () => es.close()
  }, [])

  const api = useCallback(async (method, body) => {
    try {
      await fetch("/api/notes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    } catch {}
  }, [])

  function add() {
    if (!newVal.trim()) return
    api("POST", {
      text: newVal.trim(),
      iconIdx: notes.length % icons.length,
      colorIdx: notes.length % colors.length,
    })
    setNewVal("")
    setAdding(false)
  }

  function remove(id) {
    api("DELETE", { id })
  }

  function saveEdit(id) {
    if (!editVal.trim()) return
    api("PUT", { id, text: editVal.trim() })
    setEditing(-1)
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Stream Notes
        </h3>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 rounded-md border border-[var(--border-light)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] transition hover:bg-[var(--border)] hover:text-[var(--text-primary)]"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {notes.length === 0 && !adding && (
          <p className="text-xs text-[var(--text-muted)]">Click "Add" to create a note.</p>
        )}

        {notes.map((item, i) => {
          const Icon = icons[item.iconIdx % icons.length]
          const color = colors[item.colorIdx % colors.length]
          const isEditing = editing === i

          return (
            <div key={item.id} className="group flex items-start gap-2 text-sm">
              <Icon size={16} className={`mt-0.5 shrink-0 ${color}`} />
              {isEditing ? (
                <div className="flex flex-1 gap-1 items-center">
                  <input
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(item.id)}
                    className="flex-1 border-b border-[var(--border-light)] bg-transparent text-sm text-[var(--text-primary)] outline-none py-0.5"
                    autoFocus
                  />
                  <button onClick={() => saveEdit(item.id)} className="text-[var(--success)]"><Check size={14} /></button>
                </div>
              ) : (
                <>
                  <span
                    className="flex-1 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
                    onClick={() => { setEditing(i); setEditVal(item.text) }}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => remove(item.id)}
                    className="shrink-0 text-[var(--text-muted)] opacity-0 transition hover:text-[var(--danger)] group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </>
              )}
            </div>
          )
        })}

        {adding && (
          <div className="flex items-start gap-2 text-sm">
            <FileText size={16} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
            <div className="flex flex-1 gap-1 items-center">
              <input
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
                placeholder="Write a note..."
                className="flex-1 border-b border-[var(--border-light)] bg-transparent text-sm text-[var(--text-primary)] outline-none py-0.5 placeholder:text-[var(--text-muted)]"
                autoFocus
              />
              <button onClick={add} className="text-[var(--accent)]"><Check size={14} /></button>
              <button onClick={() => { setAdding(false); setNewVal("") }} className="text-[var(--text-muted)] hover:text-[var(--danger)]"><X size={14} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
