import { NextResponse } from "next/server"
import { readdirSync, existsSync, mkdirSync } from "fs"
import { join } from "path"

export const dynamic = "force-dynamic"

const SOUNDS_DIR = join(process.cwd(), "public", "sounds")
const DEFAULT_TYPES = ["follow", "sub"]
const AUDIO_EXTS = [".mp3", ".wav", ".ogg", ".m4a"]

export async function GET() {
  const sounds = {}

  if (!existsSync(SOUNDS_DIR)) {
    mkdirSync(SOUNDS_DIR, { recursive: true })
  }

  for (const t of DEFAULT_TYPES) {
    const dir = join(SOUNDS_DIR, t)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  }

  const types = readdirSync(SOUNDS_DIR, { withFileTypes: true }).filter(
    (d) => d.isDirectory(),
  )

  for (const type of types) {
    const dir = join(SOUNDS_DIR, type.name)
    const files = readdirSync(dir).filter((f) =>
      AUDIO_EXTS.some((ext) => f.toLowerCase().endsWith(ext)),
    )
    sounds[type.name] = files
  }

  return NextResponse.json({ sounds })
}
