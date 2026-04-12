import type { HistoryData, MonthlyData, WeeklyData } from "@/lib/water-types"

function dayKey(isoDate: string): string {
  return isoDate.slice(0, 10)
}

/** Group history into last 6 calendar months (label: "Jan 26"). */
export function aggregateMonthlyFromHistory(history: HistoryData[]): MonthlyData[] {
  if (history.length === 0) return []

  const byMonth = new Map<string, { usage: number; cost: number }>()
  for (const row of history) {
    const key = dayKey(row.date).slice(0, 7)
    const usage = row.cold
    const prev = byMonth.get(key) ?? { usage: 0, cost: 0 }
    byMonth.set(key, {
      usage: prev.usage + usage,
      cost: prev.cost + row.cost,
    })
  }

  const keys = Array.from(byMonth.keys()).sort()
  const last6 = keys.slice(-6)
  return last6.map((ym) => {
    const [yy, mm] = ym.split("-").map(Number)
    const d = new Date(yy, (mm ?? 1) - 1, 1)
    const month = d.toLocaleString("en", { month: "short" }) + " " + String(d.getFullYear()).slice(-2)
    const v = byMonth.get(ym)!
    return {
      month,
      usage: Math.round(v.usage),
      cost: Math.round(v.cost * 100) / 100,
    }
  })
}

/** Last 4 weeks buckets from history (rough calendar weeks by date). */
export function aggregateWeeklyFromHistory(history: HistoryData[]): WeeklyData[] {
  if (history.length === 0) return []

  const sorted = [...history].sort((a, b) => dayKey(a.date).localeCompare(dayKey(b.date)))
  const byWeek = new Map<number, { usage: number; cost: number }>()

  for (const row of sorted) {
    const t = new Date(dayKey(row.date)).getTime()
    const weekId = Math.floor(t / (7 * 24 * 60 * 60 * 1000))
    const usage = row.cold
    const prev = byWeek.get(weekId) ?? { usage: 0, cost: 0 }
    byWeek.set(weekId, {
      usage: prev.usage + usage,
      cost: prev.cost + row.cost,
    })
  }

  const weekIds = Array.from(byWeek.keys()).sort((a, b) => a - b)
  const last4 = weekIds.slice(-4)
  return last4.map((wid, i) => {
    const v = byWeek.get(wid)!
    const avgDaily = Math.round((v.usage / 7) * 10) / 10
    return {
      week: `Week ${i + 1}`,
      usage: Math.round(v.usage),
      cost: Math.round(v.cost * 100) / 100,
      avgDaily,
    }
  })
}

/** Merge session liters into today's history row (cold water only). */
export function appendLitersToHistory(
  prev: HistoryData[],
  liters: number,
  costPerLiter: number,
): HistoryData[] {
  const today = new Date().toISOString().slice(0, 10)
  const cold = Math.round(liters * 10) / 10
  const addCost = Math.round(liters * costPerLiter * 100) / 100

  const idx = prev.findIndex((h) => dayKey(h.date) === today)
  if (idx === -1) {
    return [
      ...prev,
      {
        date: today,
        cold,
        cost: addCost,
      },
    ]
  }

  return prev.map((h, i) =>
    i === idx
      ? {
          ...h,
          cold: Math.round((h.cold + cold) * 10) / 10,
          cost: Math.round((h.cost + addCost) * 100) / 100,
        }
      : h,
  )
}
