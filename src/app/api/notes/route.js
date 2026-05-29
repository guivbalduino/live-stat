import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function init() {
  if (!globalThis.__twitchBeamNotes) {
    globalThis.__twitchBeamNotes = []
    globalThis.__twitchBeamNotesVersion = 0
    globalThis.__twitchBeamNotesIdCounter = 0
  }
}

export async function GET() {
  init()
  return NextResponse.json({
    notes: globalThis.__twitchBeamNotes,
    version: globalThis.__twitchBeamNotesVersion,
  })
}

export async function POST(req) {
  init()
  const { text, iconIdx, colorIdx } = await req.json()
  globalThis.__twitchBeamNotesIdCounter++
  const note = {
    id: globalThis.__twitchBeamNotesIdCounter,
    text,
    iconIdx: iconIdx ?? 0,
    colorIdx: colorIdx ?? 0,
  }
  globalThis.__twitchBeamNotes.push(note)
  globalThis.__twitchBeamNotesVersion++
  return NextResponse.json({ note, version: globalThis.__twitchBeamNotesVersion })
}

export async function PUT(req) {
  init()
  const { id, text } = await req.json()
  const note = globalThis.__twitchBeamNotes.find((n) => n.id === id)
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 })
  note.text = text
  globalThis.__twitchBeamNotesVersion++
  return NextResponse.json({ note, version: globalThis.__twitchBeamNotesVersion })
}

export async function DELETE(req) {
  init()
  const { id } = await req.json()
  globalThis.__twitchBeamNotes = globalThis.__twitchBeamNotes.filter((n) => n.id !== id)
  globalThis.__twitchBeamNotesVersion++
  return NextResponse.json({ version: globalThis.__twitchBeamNotesVersion })
}
