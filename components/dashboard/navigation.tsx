"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSettings } from "@/lib/settings-context"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/lib/notification-context"
import { useDevice } from "@/lib/device-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Droplets,
  Gauge,
  History,
  BarChart3,
  Globe,
  Coins,
  X,
  Bell,
  Bluetooth,
  User,
  LogOut,
  LogIn,
} from "lucide-react"
import { hideBottomNav } from "@/lib/main-nav"

const navItems = [
  { href: "/", labelKey: "dashboard", icon: Gauge },
  { href: "/history", labelKey: "history", icon: History },
  { href: "/analytics", labelKey: "analytics", icon: BarChart3 },
  { href: "/devices", labelKey: "devices", icon: Bluetooth },
] as const

const languages = [
  { code: "ja" as const, label: "日本語" },
  { code: "en" as const, label: "English" },
  { code: "mn" as const, label: "Монгол" },
]

const currencies = [
  { code: "JPY" as const, label: "¥ JPY" },
  { code: "USD" as const, label: "$ USD" },
  { code: "MNT" as const, label: "₮ MNT" },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, language, setLanguage, currency, setCurrency } = useSettings()
  const { user, isAuthenticated, logout } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications()
  const { devices } = useDevice()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const onlineDevices = devices.filter((d) => d.status === "online").length
  const showBottomNav = !hideBottomNav(pathname)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 pt-safe backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-4 lg:px-6">
          {/* Logo — same visual as app icon */}
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Droplets className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden font-semibold text-foreground sm:inline-block">SmartFaucet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Link>
              )
            })}
          </nav>

          {/* Top actions: devices (sm+), notifications, language, currency (sm+), login */}
          <div className="flex min-w-0 shrink items-center gap-0.5 sm:gap-1">
            <Link href="/devices" className="hidden sm:block">
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bluetooth className={cn("h-4 w-4", onlineDevices > 0 ? "text-success" : "text-muted-foreground")} />
                {onlineDevices > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] font-medium text-success-foreground">
                    {onlineDevices}
                  </span>
                )}
                <span className="sr-only">{t("devices")}</span>
              </Button>
            </Link>

            <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                  <span className="sr-only">{t("notifications")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    {t("notifications")}
                    {notifications.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        {t("markAllRead")}
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="mt-4 h-[calc(100vh-8rem)]">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-sm text-muted-foreground">{t("noNotifications")}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted",
                            !notification.read && "border-primary/50 bg-primary/5"
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={cn("text-sm font-medium", !notification.read && "text-primary")}>
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                              <p className="mt-2 text-xs text-muted-foreground">
                                {notification.timestamp.toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                clearNotification(notification.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">{t("language")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(language === lang.code && "bg-accent")}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden h-8 w-8 sm:flex sm:h-9 sm:w-9">
                  <Coins className="h-4 w-4" />
                  <span className="sr-only">{t("currencyLabel")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {currencies.map((curr) => (
                  <DropdownMenuItem
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className={cn(currency === curr.code && "bg-accent")}
                  >
                    {curr.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                      <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                        {user ? getInitials(user.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm">
                  <LogIn className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                  {t("login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar — above system gesture / home indicator */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur supports-[backdrop-filter]:bg-card/90 md:hidden">
          <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium transition-colors sm:text-xs",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                  <span className="truncate px-0.5">{t(item.labelKey)}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}
