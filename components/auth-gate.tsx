"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useSettings } from "@/lib/settings-context"
import { isPublicAuthPath } from "@/lib/auth-routes"
import { Navigation } from "@/components/dashboard/navigation"
import { AppShell } from "@/components/app-shell"
import { Loader2 } from "lucide-react"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { t } = useSettings()
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isPublic = isPublicAuthPath(pathname)

  useEffect(() => {
    if (isLoading) return

    if (!user && !isPublic) {
      router.replace("/login")
      return
    }

    // Do not redirect signed-in users away from /login or /register — they need to
    // switch accounts or sign in as another user without a silent bounce to home.
  }, [isLoading, user, isPublic, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    )
  }

  if (!user) {
    if (isPublic) {
      return (
        <div className="flex min-h-[100dvh] flex-col bg-background">{children}</div>
      )
    }
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">{t("redirectingToSignIn")}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] min-h-screen flex-col">
      <Navigation />
      <AppShell>{children}</AppShell>
    </div>
  )
}
