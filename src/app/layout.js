import "./globals.css"

export const metadata = {
  title: "Twitch Beam — Live Dashboard",
  description: "Real-time stream monitoring dashboard for Twitch streamers.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black text-white">
      <body className="min-h-screen bg-black antialiased">{children}</body>
    </html>
  )
}
