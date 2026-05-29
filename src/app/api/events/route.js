export const dynamic = "force-dynamic"

function isMockMode() {
  const override = globalThis.__twitchBeamMock ?? null
  const hasCredentials = !!(
    process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET
  )
  return override === true || (!hasCredentials && override !== false)
}

const mockNames = [
  "StreamCraft", "PixelPirate", "NeonNova", "VoidWalker", "ArcaneAce",
  "BlazeFury", "CyberKnight", "DragonSoul", "EliteRaven", "FrostByte",
]
const mockGames = ["VALORANT", "Minecraft", "Fortnite", "League of Legends", "GTA V"]
const mockMessages = [
  "Let's gooo!", "First time here, hi!", "GG!", "This is fire 🔥",
  "Love the vibe", "POGCHAMP", "Hello from chat!",
  "Insane gameplay", "Keep it up!", "Sick play!",
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateMockEvent(prevViewers) {
  const type = Math.random() < 0.7 ? "viewer_update" : "new_event"
  const delta = Math.floor(Math.random() * 9) - 4
  const viewerCount = Math.max(prevViewers + delta, 0)

  if (type === "viewer_update") {
    return { type: "viewer_update", viewerCount, timestamp: Date.now() }
  }

  const eventType = Math.random() < 0.5 ? "follow" : "chat"
  return {
    type: "new_event",
    event: {
      kind: eventType,
      user: pick(mockNames),
      message: eventType === "chat" ? pick(mockMessages) : undefined,
      timestamp: Date.now(),
    },
    viewerCount,
  }
}

export async function GET(req) {
  const encoder = new TextEncoder()
  const mock = isMockMode()
  let prevNotesVersion = -1

  const stream = new ReadableStream({
    start(controller) {
      let viewerCount = mock ? 42 + Math.floor(Math.random() * 80) : 0

      const send = (data) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch {
          // stream closed
        }
      }

      send({ type: "connected", mock, timestamp: Date.now() })

      const interval = setInterval(() => {
        const notesVersion = globalThis.__twitchBeamNotesVersion ?? 0
        if (notesVersion !== prevNotesVersion) {
          prevNotesVersion = notesVersion
          send({
            type: "notes_sync",
            notes: globalThis.__twitchBeamNotes ?? [],
            version: notesVersion,
          })
        }

        if (mock) {
          const event = generateMockEvent(viewerCount)
          viewerCount = event.viewerCount ?? viewerCount
          send(event)
        }
      }, 2500)

      req.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
