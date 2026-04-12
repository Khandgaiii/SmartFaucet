"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "green" | "red" | "yellow"
}

const colorClasses = {
  blue: "bg-primary/10 text-primary",
  green: "bg-success/10 text-success",
  red: "bg-destructive/10 text-destructive",
  yellow: "bg-warning/10 text-warning-foreground",
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, color = "blue" }: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground sm:text-sm">{title}</p>
            <p className="mt-1 text-lg font-bold text-foreground sm:text-2xl">{value}</p>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="hidden text-xs text-muted-foreground xs:inline">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn("shrink-0 rounded-lg p-2 sm:p-2.5", colorClasses[color])}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
