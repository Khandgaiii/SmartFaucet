"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Capacitor } from "@capacitor/core"
import { hideBottomNav, isMainNavPath, MAIN_NAV_PATHS } from "@/lib/main-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (Capacitor.getPlatform() === "web") return
    document.body.classList.add("capacitor-app")
    return () => document.body.classList.remove("capacitor-app")
  }, [])

  const bottomInsetClass = hideBottomNav(pathname)
    ? "pb-[env(safe-area-inset-bottom)]"
    : "pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-[env(safe-area-inset-bottom)]"

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMainNavPath(pathname)) return
    const t = e.changedTouches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || !isMainNavPath(pathname)) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null

    if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.35) return

    const i = MAIN_NAV_PATHS.indexOf(pathname)
    if (dx < 0 && i < MAIN_NAV_PATHS.length - 1) {
      router.push(MAIN_NAV_PATHS[i + 1])
    } else if (dx > 0 && i > 0) {
      router.push(MAIN_NAV_PATHS[i - 1])
    }
  }

  return (
    <main
      className={`relative min-h-0 flex-1 touch-pan-y ${bottomInsetClass}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </main>
  )
}
