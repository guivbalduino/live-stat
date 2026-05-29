# Twitch Beam ◆

**Open-source, real-time streaming dashboard for Twitch streamers.**

Lightweight, responsive, and designed to run locally on your streaming PC — accessible from any device on your home network (tablets, phones, second screens).

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind](https://img.shields.io/badge/Tailwind-3-blueviolet)

---

## Features

- **Real-time metrics** — Viewers, peak viewers, followers, uptime via SSE (Server-Sent Events)
- **Event feed** — Live follows and chat messages in a scrollable list
- **Stream status** — Live/offline badge, stream title, game name, elapsed time
- **Mock mode** — Works out of the box without Twitch keys; generates realistic fake data to showcase the UI
- **LAN-ready** — Access from any device on the same Wi-Fi network
- **Zero hardcoded secrets** — All credentials go into `.env.local`, never exposed to the client
- **Glow / Dark design** — High-contrast, ultra-dark aesthetic optimized for quick glances

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

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── twitch/route.js   # Fetch stream status & validate keys
│   │   └── events/route.js   # SSE endpoint for real-time events
│   ├── page.js               # Main dashboard
│   ├── layout.js             # Root layout with dark theme
│   └── globals.css           # Tailwind directives & fonts
└── components/
    └── ui/
        ├── MetricCard.jsx    # Large re-usable stat card
        ├── EventFeed.jsx     # Vertical event list
        ├── StreamStatus.jsx  # Live/offline header
        └── StreamNotes.jsx   # Quick notes & goals
```

---

## Security

This project takes public-repo safety seriously:

- **No credentials in source code** — all secrets via `.env.local`
- **Server-side only** — Twitch credentials are handled exclusively in Next.js Route Handlers (`/api/*`)
- **Clean payloads** — the frontend receives only sanitized display data

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
