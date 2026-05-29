# Twitch Beam ◆

**Open-source, real-time streaming dashboard for Twitch streamers.**

Lightweight, responsive, and designed to run locally on your streaming PC — accessible from any device on your home network (tablets, phones, second screens).

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind](https://img.shields.io/badge/Tailwind-3-9147ff)

---

## Features

- **Real-time metrics** — Viewers, peak viewers, average viewers, session followers, follower rate via SSE
- **Viewers chart** — Smooth SVG line chart with cubic Bezier curves and animated pulsing dot
- **Event feed** — Live follows and chat messages in a scrollable list
- **Stream status** — Live/offline badge, stream title, game name, tags, box art, elapsed timer, language, broadcaster badge (partner/affiliate)
- **Twitch chat embed** — Native Twitch chat iframe with darkpopout support, themed to match
- **Session tracking** — Followers gained per session, session duration, follower rate (follows/h)
- **Stream notes** — Editable notes synced in real-time across all connected devices via SSE
- **Sound alerts** — Custom sound on follow (place `.mp3`/`.wav` in `public/sounds/follow/`); falls back to Web Audio API beep
- **Mock mode** — Works out of the box without Twitch keys; generates realistic fake data to showcase the UI
- **Live/mock toggle** — Switch between real and mock data without restarting the server
- **Dark/light theme** — Toggleable, with persistent state
- **LAN-ready** — Access from any device on the same Wi-Fi network
- **Zero hardcoded secrets** — All credentials go into `.env.local`, never exposed to the client
- **Twitch-aligned design** — Color palette matches Twitch's dark theme (`#0e0e10`, `#9147ff`) for a coherent experience with the embedded chat

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repo-url> twitch-beam
cd twitch-beam
npm install
```

### 1. Configure environment (optional for real Twitch data)

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Twitch app credentials:

| Variable | Description |
|---|---|
| `TWITCH_CLIENT_ID` | From https://dev.twitch.tv/console |
| `TWITCH_CLIENT_SECRET` | From the same Twitch app page |
| `TWITCH_ACCESS_TOKEN` | Optional — if omitted, the app fetches one automatically |
| `TWITCH_BROADCASTER_NAME` | Your Twitch username |

> **No credentials? No problem.** The app auto-detects missing keys and runs in **Mock Mode** — no config needed.

### 2. Run the development server

```bash
npm run dev
```

The server starts on `http://0.0.0.0:3000`, so it's accessible from all network interfaces.

### Production build

```bash
npm run build
npm start
```

---

## Finding your PC's local IP

Open a terminal and run:

- **Windows:** `ipconfig` — look for `IPv4 Address` under your active adapter
- **macOS / Linux:** `ip addr` or `ifconfig`

Common local IPs look like: `192.168.1.10`, `10.0.0.5`, `172.16.0.3`

---

## Accessing from other devices

1. Make sure your devices are on the **same Wi-Fi network** as the streaming PC.
2. Open a browser and go to:
   ```
   http://<PC-IP>:3000
   ```
   Example: `http://192.168.1.10:3000`

That's it. Tablets, phones, laptops, or secondary monitors can all view the dashboard simultaneously.

---

## Adding Custom Sounds

Place `.mp3` or `.wav` files in:

```
public/sounds/follow/   ← played on new follower
public/sounds/sub/      ← reserved for future use
```

The folders (`follow/` and `sub/`) are **created automatically** on the first request. Drop your audio files in and they'll be picked up randomly. If the folder is empty, it falls back to a Web Audio API beep.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── twitch/route.js       # Fetch stream status, user info, followers
│   │   ├── twitch/mode/route.js  # GET/POST to toggle mock/real mode
│   │   ├── events/route.js       # SSE endpoint for real-time events
│   │   ├── notes/route.js        # CRUD for stream notes (globalThis)
│   │   └── sounds/route.js       # List available sound files
│   ├── page.js                   # Main dashboard with all state management
│   ├── layout.js                 # Root layout with dark theme, ThemeProvider
│   └── globals.css               # Tailwind directives, CSS variables, keyframes
├── components/
│   └── ui/
│       ├── MetricCard.jsx        # Glass card with hover glow and trend indicator
│       ├── EventFeed.jsx         # Vertical event list with follow/chat entries
│       ├── StreamStatus.jsx      # Live/offline bar with full stream metadata
│       ├── StreamNotes.jsx       # Editable notes, synced across devices via SSE
│       ├── ViewersChart.jsx      # SVG line chart with cubic Bezier curves
│       ├── TwitchChat.jsx        # Twitch embed iframe with darkpopout
│       └── ThemeToggle.jsx       # Dark/light theme toggle button
└── lib/
    ├── ThemeContext.js           # React context for dark/light theme
    └── sounds.js                 # Sound system: custom files + Web Audio fallback
```

---

## Security

This project takes public-repo safety seriously:

- **No credentials in source code** — all secrets via `.env.local`
- **Server-side only** — Twitch credentials are handled exclusively in Next.js Route Handlers (`/api/*`)
- **Clean payloads** — the frontend receives only sanitized display data
- **`.env.local` is gitignored** by default

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Real-time | Server-Sent Events (SSE) |
| Runtime | Node.js 18+ |

---

## License

MIT
