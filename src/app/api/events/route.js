export const dynamic = "force-dynamic"

const isMock =
  !process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET

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

  const stream = new ReadableStream({
    start(controller) {
      let viewerCount = 42 + Math.floor(Math.random() * 80)

      const send = (data) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch {
          // stream closed
        }
      }

      send({ type: "connected", mock: isMock, timestamp: Date.now() })

      const interval = setInterval(() => {
        const event = generateMockEvent(viewerCount)
        viewerCount = event.viewerCount ?? viewerCount
        send(event)
      }, isMock ? 2500 : 5000)

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
