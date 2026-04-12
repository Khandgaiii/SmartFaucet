import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Noto_Sans_JP } from "next/font/google"

import "./globals.css"
import { SettingsProvider } from "@/lib/settings-context"
import { WaterProvider } from "@/lib/water-context"
import { AuthProvider } from "@/lib/auth-context"
import { DeviceProvider } from "@/lib/device-context"
import { NotificationProvider } from "@/lib/notification-context"
import { AuthGate } from "@/components/auth-gate"
import { CapacitorConsolePatch } from "@/components/capacitor-console-patch"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-jp" })

export const metadata: Metadata = {
  title: "SmartFaucet Dashboard",
  description: "Intelligent water management system with real-time monitoring and control",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SmartFaucet",
  },
}

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}>
        <CapacitorConsolePatch />
        <SettingsProvider>
          <AuthProvider>
            <NotificationProvider>
              <DeviceProvider>
                <WaterProvider>
                  <AuthGate>{children}</AuthGate>
                </WaterProvider>
              </DeviceProvider>
            </NotificationProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
