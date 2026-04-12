"use client"

import { useSettings } from "@/lib/settings-context"
import { useWater } from "@/lib/water-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { Droplets, Calendar, TrendingUp } from "lucide-react"

const COLD_COLOR = "hsl(205, 85%, 55%)"

export default function HistoryPage() {
  const { t, formatCurrency } = useSettings()
  const { historyData } = useWater()

  const totals = historyData.reduce(
    (acc, day) => ({
      cold: acc.cold + day.cold,
      cost: acc.cost + day.cost,
    }),
    { cold: 0, cost: 0 },
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          {t("usageHistory")}
        </h1>
        <p className="mt-1 text-muted-foreground">{t("historySubtitle")}</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{t("coldWater")}</p>
                <p className="text-lg font-bold text-foreground sm:text-2xl">{totals.cold} L</p>
              </div>
              <div className="shrink-0 rounded-lg bg-blue-100 p-2 sm:p-2.5">
                <Droplets className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{t("cost")}</p>
                <p className="text-lg font-bold text-foreground sm:text-2xl">
                  {formatCurrency(totals.cost)}
                </p>
              </div>
              <div className="shrink-0 rounded-lg bg-success/10 p-2 sm:p-2.5">
                <TrendingUp className="h-4 w-4 text-success sm:h-5 sm:w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t("last7Days")}
            </CardTitle>
            <CardDescription>{t("historyDailyColdDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-80 items-center justify-center">
              {historyData.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noHistoryData")}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="cold"
                      name={t("coldWater")}
                      fill={COLD_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("chartCostTrend")}</CardTitle>
            <CardDescription>{t("historyDailySpendDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center">
              {historyData.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noCostTrendData")}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [formatCurrency(value), t("cost")]}
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
