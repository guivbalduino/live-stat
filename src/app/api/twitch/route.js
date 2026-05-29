import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function isMockForced() {
  const override = globalThis.__twitchBeamMock ?? null
  const hasCredentials = !!(
    process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET
  )
  return override === true || (!hasCredentials && override !== false)
}

function mockResponse() {
  return {
    mock: true,
    isLive: true,
    title: "Chilling & Coding some open-source dashboards! 🛠️",
    gameName: "Science & Technology",
    startedAt: new Date(Date.now() - 5400000).toISOString(),
    viewerCount: 124,
    followerCount: 872,
    totalViews: 28450,
    language: "en",
    profileImageUrl: null,
    thumbnailUrl: null,
    broadcasterType: "partner",
    description: "Building cool stuff live • Open-source dev • Twitch dashboard maker",
    tags: ["Software Development", "Open Source", "English"],
    gameBoxArtUrl: null,
  }
}

export async function GET() {
  const hasCredentials =
    process.env.TWITCH_CLIENT_ID &&
    process.env.TWITCH_CLIENT_SECRET

  if (isMockForced()) {
    return NextResponse.json(mockResponse())
  }

  if (!hasCredentials) {
    return NextResponse.json(mockResponse())
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

    let streamData = { isLive: false, title: "", gameName: "", viewerCount: 0, followerCount: 0, totalViews: 0, language: "", profileImageUrl: null, thumbnailUrl: null, broadcasterName: broadcaster || null, broadcasterType: "", description: "", tags: [], gameBoxArtUrl: null }

    if (broadcaster) {
      const userRes = await fetch(
        `https://api.twitch.tv/helix/users?login=${broadcaster}`,
        { headers },
      )
      const userJson = await userRes.json()
      const user = userJson.data?.[0]

      streamData.profileImageUrl = user?.profile_image_url ?? null
      streamData.totalViews = user?.view_count ?? 0
      streamData.broadcasterType = user?.broadcaster_type ?? ""
      streamData.description = user?.description ?? ""

      if (user?.id) {
        const userId = user.id
        const [streamRes, followersRes] = await Promise.all([
          fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, { headers }),
          fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}&first=1`, { headers }),
        ])
        const streamJson = await streamRes.json()
        const followersJson = await followersRes.json()
        const stream = streamJson.data?.[0]

        streamData.followerCount = followersJson.total ?? 0

        if (stream) {
          streamData = {
            ...streamData,
            isLive: true,
            title: stream.title,
            gameName: stream.game_name,
            viewerCount: stream.viewer_count,
            startedAt: stream.started_at,
            language: stream.language ?? "",
            thumbnailUrl: stream.thumbnail_url?.replace("{width}", "640").replace("{height}", "360") ?? null,
            tags: stream.tags ?? [],
          }

          if (stream.game_id) {
            const gameRes = await fetch(
              `https://api.twitch.tv/helix/games?id=${stream.game_id}`,
              { headers },
            )
            const gameJson = await gameRes.json()
            const game = gameJson.data?.[0]
            if (game?.box_art_url) {
              streamData.gameBoxArtUrl = game.box_art_url.replace("{width}", "96").replace("{height}", "128")
            }
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
