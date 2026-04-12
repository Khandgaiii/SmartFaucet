"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { subscribeWaterTelemetry } from "@/lib/water-telemetry"
import { buildDemoWaterPackage, isDemoWaterAccount } from "@/lib/mock-demo-water"
import {
  aggregateMonthlyFromHistory,
  aggregateWeeklyFromHistory,
  appendLitersToHistory,
} from "@/lib/water-aggregates"
import type {
  WaterData,
  HistoryData,
  MonthlyData,
  WeeklyData,
  PredictiveSuggestion,
  Preset,
} from "@/lib/water-types"

export type {
  WaterData,
  HistoryData,
  MonthlyData,
  WeeklyData,
  PredictiveSuggestion,
  Preset,
} from "@/lib/water-types"

const defaultPresets: Preset[] = [
  { id: "shower", name: "Shower", nameKey: "shower", liters: 90, duration: 10 },
  { id: "bath", name: "Bath Fill", nameKey: "bath", liters: 180, duration: 15 },
  { id: "kitchen", name: "Kitchen", nameKey: "kitchen", liters: 20, duration: 5 },
]

const emptyWaterData: WaterData = {
  currentFlow: null,
  totalToday: null,
  totalMonth: null,
  costPerLiter: null,
  isFlowing: false,
}

export function useWaterData() {
  const { user } = useAuth()
  const demo = isDemoWaterAccount(user?.email)

  const [data, setData] = useState<WaterData>(emptyWaterData)
  const [historyData, setHistoryData] = useState<HistoryData[]>([])
  const [monthlyDemo, setMonthlyDemo] = useState<MonthlyData[]>([])
  const [weeklyDemo, setWeeklyDemo] = useState<WeeklyData[]>([])
  const [suggestionsDemo, setSuggestionsDemo] = useState<PredictiveSuggestion[]>([])

  const [isControlActive, setIsControlActive] = useState(false)
  const [waterLimit, setWaterLimit] = useState(100)
  const [timeLimit, setTimeLimit] = useState(10)
  const [limitType, setLimitType] = useState<"liters" | "time">("liters")
  const [usedInSession, setUsedInSession] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [alerts, setAlerts] = useState<{ id: string; message: string; type: "warning" | "danger" }[]>([])
  const [presets, setPresets] = useState<Preset[]>(defaultPresets)

  const monthlyData = useMemo(() => {
    if (demo) return monthlyDemo
    return aggregateMonthlyFromHistory(historyData)
  }, [demo, monthlyDemo, historyData])

  const weeklyData = useMemo(() => {
    if (demo) return weeklyDemo
    return aggregateWeeklyFromHistory(historyData)
  }, [demo, weeklyDemo, historyData])

  const predictiveSuggestions = useMemo(() => {
    if (demo) return suggestionsDemo
    return []
  }, [demo, suggestionsDemo])

  useEffect(() => {
    const uid = user?.id
    if (!uid) {
      setData(emptyWaterData)
      setHistoryData([])
      setMonthlyDemo([])
      setWeeklyDemo([])
      setSuggestionsDemo([])
      return
    }

    if (isDemoWaterAccount(user.email)) {
      const pkg = buildDemoWaterPackage()
      setData(pkg.data)
      setHistoryData(pkg.historyData)
      setMonthlyDemo(pkg.monthlyData)
      setWeeklyDemo(pkg.weeklyData)
      setSuggestionsDemo(pkg.predictiveSuggestions)
      return
    }

    setData(emptyWaterData)
    setHistoryData([])
    setMonthlyDemo([])
    setWeeklyDemo([])
    setSuggestionsDemo([])
  }, [user?.id, user?.email])

  useEffect(() => {
    return subscribeWaterTelemetry((partial) => {
      if (demo) {
        setData((prev) => ({
          ...prev,
          ...(partial.currentFlow !== undefined
            ? { currentFlow: partial.currentFlow }
            : {}),
          ...(partial.isFlowing !== undefined ? { isFlowing: partial.isFlowing } : {}),
        }))
        return
      }
      setData((prev) => ({ ...prev, ...partial }))
    })
  }, [demo])

  const startWater = useCallback(() => {
    setIsControlActive(true)
    setUsedInSession(0)
    setSessionTime(0)
    setAlerts([])
  }, [])

  const stopWater = useCallback(() => {
    setIsControlActive(false)
    const sessionLiters = usedInSession
    const demoUser = isDemoWaterAccount(user?.email)
    if (demoUser) {
      setData((prev) => ({
        ...prev,
        currentFlow: 0,
        isFlowing: false,
      }))
      return
    }
    setData((prev) => ({
      ...prev,
      currentFlow: 0,
      isFlowing: false,
      totalToday: (prev.totalToday ?? 0) + sessionLiters,
      totalMonth: (prev.totalMonth ?? 0) + sessionLiters,
    }))
    if (user?.id) {
      setHistoryData((prev) =>
        appendLitersToHistory(prev, sessionLiters, data.costPerLiter ?? 0.018),
      )
    }
  }, [usedInSession, user?.id, user?.email, data.costPerLiter])

  useEffect(() => {
    if (!isControlActive) return

    const interval = setInterval(() => {
      setData((prev) => {
        const newFlow = 8 + Math.random() * 4
        return {
          ...prev,
          currentFlow: newFlow,
          isFlowing: true,
        }
      })

      setUsedInSession((prev) => {
        const flowPerSecond = (8 + Math.random() * 4) / 60
        return prev + flowPerSecond
      })

      setSessionTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isControlActive])

  useEffect(() => {
    if (!isControlActive) return

    if (limitType === "liters" && usedInSession >= waterLimit) {
      setAlerts((prev) => [
        ...prev.filter((a) => a.id !== "limit"),
        {
          id: "limit",
          message: `Water limit of ${waterLimit}L reached!`,
          type: "danger",
        },
      ])
      stopWater()
    } else if (limitType === "time" && sessionTime >= timeLimit * 60) {
      setAlerts((prev) => [
        ...prev.filter((a) => a.id !== "limit"),
        {
          id: "limit",
          message: `Time limit of ${timeLimit} minutes reached!`,
          type: "danger",
        },
      ])
      stopWater()
    } else if (usedInSession >= waterLimit * 0.8 && limitType === "liters") {
      setAlerts((prev) => {
        if (prev.find((a) => a.id === "warning")) return prev
        return [
          ...prev,
          {
            id: "warning",
            message: `Approaching water limit (${Math.round(usedInSession)}L / ${waterLimit}L)`,
            type: "warning",
          },
        ]
      })
    }
  }, [
    usedInSession,
    sessionTime,
    waterLimit,
    timeLimit,
    limitType,
    isControlActive,
    stopWater,
  ])

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const updatePreset = useCallback((updatedPreset: Preset) => {
    setPresets((prev) => prev.map((p) => (p.id === updatedPreset.id ? updatedPreset : p)))
  }, [])

  const applyPreset = useCallback((preset: Preset) => {
    setWaterLimit(preset.liters)
    setTimeLimit(preset.duration)
  }, [])

  const calculateEstimatedCost = useCallback(() => {
    const liters = limitType === "liters" ? waterLimit : timeLimit * 10
    const cpl = data.costPerLiter
    if (cpl == null) return null
    return liters * cpl
  }, [limitType, waterLimit, timeLimit, data.costPerLiter])

  return {
    data,
    isControlActive,
    waterLimit,
    setWaterLimit,
    timeLimit,
    setTimeLimit,
    limitType,
    setLimitType,
    usedInSession,
    sessionTime,
    alerts,
    dismissAlert,
    startWater,
    stopWater,
    historyData,
    monthlyData,
    weeklyData,
    predictiveSuggestions,
    presets,
    updatePreset,
    applyPreset,
    calculateEstimatedCost,
  }
}
