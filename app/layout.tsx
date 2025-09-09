import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { RealtimeDataProvider } from "@/hooks/use-realtime-data"
import { AlertProvider } from "@/hooks/use-alerts"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "AMPDefend - Smart Honeypot Shield",
  description:
    "Advanced cybersecurity solution for smart grids, EV chargers, and industrial energy infrastructure protection",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AuthProvider>
              <RealtimeDataProvider>
                <AlertProvider>{children}</AlertProvider>
              </RealtimeDataProvider>
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
