"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, AlertCircle } from "lucide-react"

interface AlertBannerProps {
  alerts: { id: string; message: string; type: "warning" | "danger" }[]
  onDismiss: (id: string) => void
}

export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  if (alerts.length === 0) return null

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "flex items-center justify-between gap-4 rounded-lg px-4 py-3 transition-all",
            alert.type === "danger"
              ? "bg-destructive/10 text-destructive"
              : "bg-warning/10 text-warning-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            {alert.type === "danger" ? (
              <AlertCircle className="h-5 w-5 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onDismiss(alert.id)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      ))}
    </div>
  )
}
