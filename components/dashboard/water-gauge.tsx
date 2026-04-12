"use client"

import { cn } from "@/lib/utils"

interface WaterGaugeProps {
  value: number | null
  max: number
  label: string
  unit: string
  size?: "sm" | "md" | "lg"
  color?: "blue" | "green" | "red" | "yellow"
}

const sizeClasses = {
  sm: { container: "h-24 w-24", text: "text-lg", label: "text-xs" },
  md: { container: "h-32 w-32", text: "text-2xl", label: "text-sm" },
  lg: { container: "h-40 w-40", text: "text-3xl", label: "text-sm" },
}

const colorClasses = {
  blue: { stroke: "stroke-primary", bg: "text-primary/20" },
  green: { stroke: "stroke-success", bg: "text-success/20" },
  red: { stroke: "stroke-destructive", bg: "text-destructive/20" },
  yellow: { stroke: "stroke-warning", bg: "text-warning/20" },
}

export function WaterGauge({
  value,
  max,
  label,
  unit,
  size = "md",
  color = "blue",
}: WaterGaugeProps) {
  const percentage = value == null ? 0 : Math.min(100, (value / max) * 100)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative flex flex-col items-center", sizeClasses[size].container)}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          className={colorClasses[color].bg}
          stroke="currentColor"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn(colorClasses[color].stroke, "transition-all duration-500")}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-semibold text-foreground", sizeClasses[size].text)}>
          {value == null ? "—" : value.toFixed(1)}
        </span>
        <span className={cn("text-muted-foreground", sizeClasses[size].label)}>{unit}</span>
      </div>
      <span className={cn("mt-2 text-center text-muted-foreground", sizeClasses[size].label)}>
        {label}
      </span>
    </div>
  )
}
