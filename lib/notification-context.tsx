"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  timestamp: Date
  read: boolean
  deviceId?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  permissionStatus: NotificationPermission | "unsupported"
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
  requestPermission: () => Promise<boolean>
  sendPushNotification: (title: string, body: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const NOTIFICATIONS_STORAGE_KEY = "smartfaucet_notifications"

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | "unsupported">("default")

  // Load saved notifications and check permission status
  useEffect(() => {
    // Check browser notification support
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission)
    } else {
      setPermissionStatus("unsupported")
    }

    // Load stored notifications
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setNotifications(parsed.map((n: Notification) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })))
      } catch {
        localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY)
      }
    }
  }, [])

  // Save notifications
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
    }
  }, [notifications])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev].slice(0, 100))

    // Send push notification if permitted
    if (permissionStatus === "granted") {
      sendPushNotification(notification.title, notification.message)
    }
  }, [permissionStatus])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY)
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      setPermissionStatus(permission)
      return permission === "granted"
    } catch {
      return false
    }
  }

  const sendPushNotification = useCallback((title: string, body: string) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      })
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        permissionStatus,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
        requestPermission,
        sendPushNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
