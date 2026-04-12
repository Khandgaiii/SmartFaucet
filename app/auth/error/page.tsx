"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Droplets } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useSettings } from "@/lib/settings-context"

function AuthErrorLoading() {
  const { t } = useSettings()
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="animate-pulse">{t("loading")}</div>
    </div>
  )
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const { t } = useSettings()
  const error = searchParams.get("error")

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <Droplets className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="mt-4 text-2xl">{t("authErrorTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {error ? (
                <p className="text-sm text-muted-foreground">
                  {t("authErrorWithCode").replace("{error}", error)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">{t("authErrorSomethingWrong")}</p>
              )}
              <Button asChild className="mt-6 w-full">
                <Link href="/login">{t("backToLogin")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorLoading />}>
      <AuthErrorContent />
    </Suspense>
  )
}
