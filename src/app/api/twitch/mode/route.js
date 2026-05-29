import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function getState() {
  const override = globalThis.__twitchBeamMock ?? null
  const hasCredentials = !!(
    process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET
  )
  const effectiveMock = override !== null ? override : !hasCredentials
  return { override, effectiveMock, hasCredentials }
}

export async function GET() {
  return NextResponse.json(getState())
}

export async function POST(req) {
  const { mode } = await req.json()
  if (mode === "mock") globalThis.__twitchBeamMock = true
  else if (mode === "real") globalThis.__twitchBeamMock = false
  else globalThis.__twitchBeamMock = null
  return NextResponse.json(getState())
}
