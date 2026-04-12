"use client"

import React, { useState } from "react"
import Link from "next/link"
import { sendPasswordResetEmail } from "firebase/auth"
import { useSettings } from "@/lib/settings-context"
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/config"
import { formatAuthError } from "@/lib/firebase/auth-errors"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Droplets, Loader2, CheckCircle, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const { t } = useSettings()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth()
        await sendPasswordResetEmail(auth, email)
        setIsSuccess(true)
      } catch (err: unknown) {
        setError(formatAuthError(err))
      } finally {
        setIsLoading(false)
      }
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSuccess(true)
    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success">
              <CheckCircle className="h-8 w-8 text-success-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">{t("resetPasswordEmailSent")}</CardTitle>
              <CardDescription className="mt-2">
                {t("resetPasswordEmailSentBody").replace("{email}", email)}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-muted">
              <AlertDescription>{t("resetPasswordCheckEmailInstructions")}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Link href="/login" className="w-full">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToLogin")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Droplets className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">{t("resetPassword")}</CardTitle>
            <CardDescription className="mt-2">{t("resetPasswordEnterEmail")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("sendResetLink")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link
            href="/login"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToLogin")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
