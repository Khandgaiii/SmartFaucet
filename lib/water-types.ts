export interface WaterData {
  currentFlow: number | null
  totalToday: number | null
  totalMonth: number | null
  costPerLiter: number | null
  isFlowing: boolean
}

export interface HistoryData {
  date: string
  cold: number
  cost: number
}

export interface MonthlyData {
  month: string
  usage: number
  cost: number
}

export interface WeeklyData {
  week: string
  usage: number
  cost: number
  avgDaily: number
}

export interface PredictiveSuggestion {
  id: string
  type: "savings" | "efficiency" | "usage"
  titleJa: string
  titleEn: string
  titleMn: string
  descJa: string
  descEn: string
  descMn: string
  savingsPercent?: number
}

export interface Preset {
  id: string
  name: string
  nameKey: string
  liters: number
  duration: number
}
