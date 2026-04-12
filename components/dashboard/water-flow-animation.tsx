"use client"

import { cn } from "@/lib/utils"

interface WaterFlowAnimationProps {
  isFlowing: boolean
  flowRate: number | null
}

export function WaterFlowAnimation({ isFlowing, flowRate }: WaterFlowAnimationProps) {
  return (
    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-primary/5 to-primary/10">
      {/* Faucet icon */}
      <div className="absolute top-4 z-10">
        <svg
          width="60"
          height="40"
          viewBox="0 0 60 40"
          fill="none"
          className="text-muted-foreground"
        >
          <rect x="20" y="0" width="20" height="8" rx="2" fill="currentColor" />
          <rect x="26" y="8" width="8" height="20" fill="currentColor" />
          <rect x="22" y="28" width="16" height="6" rx="2" fill="currentColor" />
        </svg>
      </div>

      {/* Water drops */}
      {isFlowing && (
        <div className="absolute inset-x-0 top-16 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-water-flow"
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <div
                className={cn(
                  "h-16 w-1.5 rounded-full bg-gradient-to-b from-primary/60 to-primary/20",
                  "transform transition-all"
                )}
                style={{
                  height: `${Math.max(20, (flowRate ?? 0) * 5)}px`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Flow rate indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 transition-colors",
            isFlowing ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {isFlowing && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
          <span className="text-sm font-medium">
            {isFlowing && flowRate != null ? `${flowRate.toFixed(1)} L/min` : "Inactive"}
          </span>
        </div>
      </div>

      {/* Pulse rings when flowing */}
      {isFlowing && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="animate-pulse-ring h-8 w-8 rounded-full border-2 border-primary/40" />
        </div>
      )}
    </div>
  )
}
