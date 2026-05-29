import "./globals.css"
import { ThemeProvider } from "@/lib/ThemeContext"

export const metadata = {
  title: "Twitch Beam — Live Dashboard",
  description: "Real-time stream monitoring dashboard for Twitch streamers.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
