"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useSettings } from "@/lib/settings-context"
import { useWater } from "@/lib/water-context"
import { useNotifications } from "@/lib/notification-context"
import { exportToCSV, exportToPDF, exportJSON } from "@/lib/export-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User,
  Mail,
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Bell,
  BellOff,
  LogOut,
  Save,
  Loader2,
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateProfile } = useAuth()
  const { t, formatCurrency } = useSettings()
  const { historyData, monthlyData } = useWater()
  const { permissionStatus, requestPermission } = useNotifications()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    updateProfile(name)
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  const handleExportDaily = (format: "csv" | "pdf" | "json") => {
    const filename = `smartfaucet-daily-report-${new Date().toISOString().split("T")[0]}`
    switch (format) {
      case "csv":
        exportToCSV(historyData, filename)
        break
      case "pdf":
        exportToPDF(historyData, filename, t("dailyReport"), formatCurrency)
        break
      case "json":
        exportJSON(historyData, filename)
        break
    }
  }

  const handleExportMonthly = (format: "csv" | "pdf" | "json") => {
    const filename = `smartfaucet-monthly-report-${new Date().toISOString().split("T")[0]}`
    switch (format) {
      case "csv":
        exportToCSV(monthlyData, filename)
        break
      case "pdf":
        exportToPDF(monthlyData, filename, t("monthlyReport"), formatCurrency)
        break
      case "json":
        exportJSON(monthlyData, filename)
        break
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 lg:py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">
        {t("profile")}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("account")}</CardTitle>
            <CardDescription>{t("profileAccountDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-xl text-primary-foreground">
                  {user ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {user?.email}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {t("memberSince")}: {user?.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            <Separator />

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    {t("save")}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <User className="mr-2 h-4 w-4" />
                {t("edit")} {t("profile")}
              </Button>
            )}

            <Separator />

            <Button variant="destructive" onClick={handleLogout} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </Button>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("notifications")}
              </CardTitle>
              <CardDescription>{t("notificationsSettingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{t("enableNotifications")}</p>
                  <p className="text-sm text-muted-foreground">
                    {permissionStatus === "granted"
                      ? t("notifEnabledStatus")
                      : permissionStatus === "denied"
                        ? t("notifBlockedStatus")
                        : t("notifPromptStatus")}
                  </p>
                </div>
                <Switch
                  checked={permissionStatus === "granted"}
                  onCheckedChange={async (checked) => {
                    if (checked) {
                      await requestPermission()
                    }
                  }}
                  disabled={permissionStatus === "denied" || permissionStatus === "unsupported"}
                />
              </div>
              {permissionStatus === "denied" && (
                <p className="mt-2 text-xs text-destructive">{t("notifEnableInBrowserSettings")}</p>
              )}
            </CardContent>
          </Card>

          {/* Export Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                {t("export")}
              </CardTitle>
              <CardDescription>{t("exportDataDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("dailyReport")}</p>
                  <p className="text-sm text-muted-foreground">{t("dailyReportDesc")}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      {t("export")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExportDaily("csv")}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      {t("exportCSV")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportDaily("pdf")}>
                      <FileText className="mr-2 h-4 w-4" />
                      {t("exportPDF")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportDaily("json")}>
                      <FileJson className="mr-2 h-4 w-4" />
                      {t("exportJSONLabel")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("monthlyReport")}</p>
                  <p className="text-sm text-muted-foreground">{t("monthlyReportDesc")}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      {t("export")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExportMonthly("csv")}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      {t("exportCSV")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportMonthly("pdf")}>
                      <FileText className="mr-2 h-4 w-4" />
                      {t("exportPDF")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportMonthly("json")}>
                      <FileJson className="mr-2 h-4 w-4" />
                      {t("exportJSONLabel")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
