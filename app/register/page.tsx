"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useSettings } from "@/lib/settings-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { Droplets, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register, logout, user, isLoading } = useAuth()
  const { t } = useSettings()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"))
      return
    }

    if (password.length < 6) {
      setError(t("passwordMinLength"))
      return
    }

    const result = await register(email, password, name)
    if (result.ok) {
      router.replace("/")
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Droplets className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">{t("createAccount")}</CardTitle>
            <CardDescription className="mt-2">{t("registerSubtitle")}</CardDescription>
          </div>
          {user && (
            <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-left text-sm">
              <p className="text-muted-foreground">
                {t("signedInAs")}{" "}
                <span className="font-medium text-foreground">{user.email}</span>.{" "}
                {t("registerSignedInNote")}
              </p>
              <button
                type="button"
                className="mt-2 text-primary underline-offset-4 hover:underline"
                onClick={() => {
                  logout()
                  setError("")
                }}
              >
                {t("logout")}
              </button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="田中 太郎"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("register")}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t("orContinueWith")}</span>
            </div>
          </div>

          <GoogleSignInButton disabled={isLoading} onError={setError} />
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            {t("authHaveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
