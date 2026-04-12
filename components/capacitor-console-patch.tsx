"use client"

import { useEffect } from "react"
import { Capacitor } from "@capacitor/core"

/**
 * Capacitor forwards WebView console to the native bridge; empty objects `{}` from
 * plugins show as useless "consoleError {}". Normalize those args on native only.
 */
export function CapacitorConsolePatch() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const normalize = (args: unknown[]) =>
      args.map((a) => {
        if (a !== null && typeof a === "object" && !Array.isArray(a) && !(a instanceof Error)) {
          const plain =
            Object.getPrototypeOf(a) === Object.prototype || Object.getPrototypeOf(a) === null
          const keys = Object.keys(a as object)
          if (plain && keys.length === 0) {
            return "[Native bridge: empty object — plugin may have rejected without detail]"
          }
          if (plain && keys.length > 0) {
            try {
              const s = JSON.stringify(a)
              if (s === "{}") {
                return "[Native bridge: non-enumerable or empty payload — see native logs]"
              }
            } catch {
              /* ignore */
            }
          }
        }
        return a
      })

    const origError = console.error.bind(console)
    const origWarn = console.warn.bind(console)

    console.error = (...args: unknown[]) => {
      origError(...normalize(args))
    }
    console.warn = (...args: unknown[]) => {
      origWarn(...normalize(args))
    }

    return () => {
      console.error = origError
      console.warn = origWarn
    }
  }, [])

  return null
}
