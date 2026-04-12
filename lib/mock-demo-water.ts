import type {
  HistoryData,
  MonthlyData,
  WeeklyData,
  WaterData,
  PredictiveSuggestion,
} from "@/lib/water-types"

/** Demo dashboard + history only for this account (case-insensitive). */
export const DEMO_WATER_EMAIL = "khandgaiii@gmail.com"

export function isDemoWaterAccount(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === DEMO_WATER_EMAIL.toLowerCase()
}

function coldLitersForDay(seed: number): number {
  const base = 35 + (seed % 11) * 2
  return Math.round(base * 0.28 + (seed % 5) + (seed % 7) * 0.5)
}

const CPL = 0.018

function isoLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/**
 * History: every calendar day from March 1 (current or previous year if today is before Mar 1)
 * through **today** (local). Analytics multi-month charts stay empty — use History + Dashboard only.
 */
export function buildDemoWaterPackage(): {
  data: WaterData
  historyData: HistoryData[]
  monthlyData: MonthlyData[]
  weeklyData: WeeklyData[]
  predictiveSuggestions: PredictiveSuggestion[]
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let year = today.getFullYear()
  let march1 = new Date(year, 2, 1)
  if (today < march1) {
    year -= 1
    march1 = new Date(year, 2, 1)
  }

  const historyData: HistoryData[] = []
  const cursor = new Date(march1)
  while (cursor <= today) {
    const iso = isoLocal(cursor)
    const seed =
      cursor.getDate() + cursor.getMonth() * 31 + (cursor.getFullYear() % 50)
    const cold = coldLitersForDay(seed)
    const cost = Math.round(cold * CPL * 100) / 100
    historyData.push({ date: iso, cold, cost })
    cursor.setDate(cursor.getDate() + 1)
  }

  const todayIso = isoLocal(today)
  const ym = todayIso.slice(0, 7)
  const todayRow = historyData.find((h) => h.date === todayIso)
  const totalToday = todayRow ? todayRow.cold : 0
  const monthRows = historyData.filter((h) => h.date.startsWith(ym))
  const monthTotalL = monthRows.reduce((s, h) => s + h.cold, 0)

  const data: WaterData = {
    currentFlow: null,
    totalToday: Math.round(totalToday * 10) / 10,
    totalMonth: Math.round(monthTotalL * 10) / 10,
    costPerLiter: CPL,
    isFlowing: false,
  }

  return {
    data,
    historyData,
    monthlyData: [],
    weeklyData: [],
    predictiveSuggestions: [],
  }
}
