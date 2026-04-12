"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useWaterData } from "@/hooks/use-water-data"

type WaterContextType = ReturnType<typeof useWaterData>

const WaterContext = createContext<WaterContextType | undefined>(undefined)

export function WaterProvider({ children }: { children: ReactNode }) {
  const waterData = useWaterData()

  return (
    <WaterContext.Provider value={waterData}>
      {children}
    </WaterContext.Provider>
  )
}

export function useWater() {
  const context = useContext(WaterContext)
  if (!context) {
    throw new Error("useWater must be used within a WaterProvider")
  }
  return context
}
