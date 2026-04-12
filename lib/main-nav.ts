/** Primary app tabs (bottom bar + swipe order). */
export const MAIN_NAV_PATHS = ["/", "/history", "/analytics", "/devices"] as const

export type MainNavPath = (typeof MAIN_NAV_PATHS)[number]

export function isMainNavPath(pathname: string): pathname is MainNavPath {
  return (MAIN_NAV_PATHS as readonly string[]).includes(pathname)
}

export function hideBottomNav(pathname: string) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/auth/")
  )
}
