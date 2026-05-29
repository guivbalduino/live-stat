import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const hasCredentials =
    process.env.TWITCH_CLIENT_ID &&
    process.env.TWITCH_CLIENT_SECRET

  if (!hasCredentials) {
    return NextResponse.json({
      mock: true,
      isLive: true,
      title: "Chilling & Coding some open-source dashboards! 🛠️",
      gameName: "Science & Technology",
      startedAt: new Date(Date.now() - 5400000).toISOString(), // 1h 30m ago
      viewerCount: 124,
      message: "No Twitch credentials found — running in mock mode.",
    })
  }

  const clientId = process.env.TWITCH_CLIENT_ID
  const token = process.env.TWITCH_ACCESS_TOKEN
  const broadcaster = process.env.TWITCH_BROADCASTER_NAME

  try {
    let accessToken = token

    if (!accessToken) {
      const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      })

      const tokenData = await tokenRes.json()
      accessToken = tokenData.access_token
    }

    const headers = {
      "Client-Id": clientId,
      Authorization: `Bearer ${accessToken}`,
    }

    let streamData = { isLive: false, title: "", gameName: "", viewerCount: 0 }

    if (broadcaster) {
      const userRes = await fetch(
        `https://api.twitch.tv/helix/users?login=${broadcaster}`,
        { headers },
      )
      const userJson = await userRes.json()
      const userId = userJson.data?.[0]?.id

      if (userId) {
        const streamRes = await fetch(
          `https://api.twitch.tv/helix/streams?user_id=${userId}`,
          { headers },
        )
        const streamJson = await streamRes.json()
        const stream = streamJson.data?.[0]

        if (stream) {
          streamData = {
            isLive: true,
            title: stream.title,
            gameName: stream.game_name,
            viewerCount: stream.viewer_count,
            startedAt: stream.started_at,
          }
        }
      }
    }

    return NextResponse.json({ mock: false, ...streamData })
  } catch (error) {
    return NextResponse.json(
      { mock: false, error: error.message },
      { status: 500 },
    )
  }
}
