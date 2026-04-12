"use client"

import { useSettings } from "@/lib/settings-context"
import { useWater } from "@/lib/water-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Zap,
  BarChart2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const savingTips = [
  {
    titleJa: "シャワー時間を短縮",
    titleEn: "Reduce shower time",
    titleMn: "Шүршүүрт орох хугацааг багасга",
    descJa: "5分以上シャワーを浴びると、50リットル以上の水を使用します",
    descEn: "Showering for more than 5 minutes uses over 50 liters of water",
    descMn: "5 минутаас дээш шүршүүрт орох нь 50 литрээс дээш ус зарцуулна",
    impact: "high",
  },
  {
    titleJa: "蛇口をこまめに閉める",
    titleEn: "Turn off taps when not in use",
    titleMn: "Ус хэрэглээгүй үед хаагаарай",
    descJa: "歯磨き中に蛇口を閉めると、1日約12リットル節約",
    descEn: "Turning off the tap while brushing saves about 12 liters daily",
    descMn: "Шүд угаах үед ус хаавал өдөрт 12 литр хэмнэнэ",
    impact: "medium",
  },
  {
    titleJa: "冷水を優先する",
    titleEn: "Prefer cold water when safe",
    titleMn: "Боломжтой үед хүйтэн ус ашиглах",
    descJa: "洗い物や洗濯では冷水を使うとエネルギーと水のコストを抑えられます",
    descEn: "Using cold water for rinsing and laundry cuts energy and water heating cost",
    descMn: "Зайлах, угаах зэрэгт хүйтэн ус ашиглавал эрчим хүчийн зардлыг бууруулна",
    impact: "medium",
  },
  {
    titleJa: "漏れをチェック",
    titleEn: "Check for leaks regularly",
    titleMn: "Гоожилт байгаа эсэхийг шалгах",
    descJa: "小さな漏れでも月に数百リットルの水を無駄にします",
    descEn: "Even small leaks can waste hundreds of liters monthly",
    descMn: "Жижиг гоожилт ч сард хэдэн зуун литр ус алдана",
    impact: "high",
  },
]

export default function AnalyticsPage() {
  const { t, formatCurrency, language } = useSettings()
  const { monthlyData, weeklyData, predictiveSuggestions } = useWater()

  const hasMonthly = monthlyData.length > 0
  const canCompare = monthlyData.length >= 2
  const currentMonth = hasMonthly ? monthlyData[monthlyData.length - 1] : null
  const lastMonth = canCompare ? monthlyData[monthlyData.length - 2] : null

  const usageDiff =
    currentMonth && lastMonth ? currentMonth.usage - lastMonth.usage : 0
  const usagePercent =
    lastMonth && lastMonth.usage > 0
      ? ((usageDiff / lastMonth.usage) * 100).toFixed(1)
      : "0"
  const costDiff = currentMonth && lastMonth ? currentMonth.cost - lastMonth.cost : 0
  const costPercent =
    lastMonth && lastMonth.cost > 0
      ? ((costDiff / lastMonth.cost) * 100).toFixed(1)
      : "0"

  const avgUsage =
    monthlyData.length > 0
      ? monthlyData.reduce((acc, m) => acc + m.usage, 0) / monthlyData.length
      : 0
  const efficiency: "good" | "average" | "high" =
    !currentMonth
      ? "average"
      : currentMonth.usage < avgUsage * 0.9
        ? "good"
        : currentMonth.usage < avgUsage * 1.1
          ? "average"
          : "high"

  const efficiencyConfig = {
    good: {
      color: "text-success",
      bg: "bg-success/10",
      label: t("good"),
      icon: Leaf,
    },
    average: {
      color: "text-warning-foreground",
      bg: "bg-warning/10",
      label: t("average"),
      icon: Minus,
    },
    high: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      label: t("high"),
      icon: TrendingUp,
    },
  }

  const config = efficiencyConfig[efficiency]
  const EfficiencyIcon = config.icon

  const getTipTitle = (tip: (typeof savingTips)[0]) => {
    if (language === "ja") return tip.titleJa
    if (language === "mn") return tip.titleMn
    return tip.titleEn
  }

  const getTipDesc = (tip: (typeof savingTips)[0]) => {
    if (language === "ja") return tip.descJa
    if (language === "mn") return tip.descMn
    return tip.descEn
  }

  const getSuggestionTitle = (suggestion: NonNullable<(typeof predictiveSuggestions)[0]>) => {
    if (language === "ja") return suggestion.titleJa
    if (language === "mn") return suggestion.titleMn
    return suggestion.titleEn
  }

  const getSuggestionDesc = (suggestion: NonNullable<(typeof predictiveSuggestions)[0]>) => {
    if (language === "ja") return suggestion.descJa
    if (language === "mn") return suggestion.descMn
    return suggestion.descEn
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "savings":
        return Leaf
      case "efficiency":
        return Zap
      case "usage":
        return BarChart2
      default:
        return Lightbulb
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          {t("monthlyComparison")}
        </h1>
        <p className="mt-1 text-muted-foreground">{t("analyticsPageSubtitle")}</p>
      </div>

      {/* Comparison Cards */}
      <div className="mb-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Usage Comparison */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground sm:text-sm">{t("monthlyUsage")}</p>
                <p className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                  {currentMonth != null ? `${currentMonth.usage} L` : "—"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {usageDiff > 0 ? (
                    <ArrowUp className="h-3.5 w-3.5 text-destructive sm:h-4 sm:w-4" />
                  ) : usageDiff < 0 ? (
                    <ArrowDown className="h-3.5 w-3.5 text-success sm:h-4 sm:w-4" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium sm:text-sm",
                      usageDiff > 0 ? "text-destructive" : usageDiff < 0 ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    {usagePercent}%
                  </span>
                  <span className="text-xs text-muted-foreground sm:text-sm">vs {t("lastMonth")}</span>
                </div>
              </div>
              <div
                className={cn(
                  "shrink-0 rounded-lg p-2 sm:p-3",
                  usageDiff > 0 ? "bg-destructive/10" : "bg-success/10"
                )}
              >
                {usageDiff > 0 ? (
                  <TrendingUp className="h-5 w-5 text-destructive sm:h-6 sm:w-6" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-success sm:h-6 sm:w-6" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Comparison */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground sm:text-sm">{t("cost")}</p>
                <p className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                  {currentMonth != null ? formatCurrency(currentMonth.cost) : "—"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {costDiff > 0 ? (
                    <ArrowUp className="h-3.5 w-3.5 text-destructive sm:h-4 sm:w-4" />
                  ) : costDiff < 0 ? (
                    <ArrowDown className="h-3.5 w-3.5 text-success sm:h-4 sm:w-4" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium sm:text-sm",
                      costDiff > 0 ? "text-destructive" : costDiff < 0 ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    {costPercent}%
                  </span>
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    ({formatCurrency(Math.abs(costDiff))})
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  "shrink-0 rounded-lg p-2 sm:p-3",
                  costDiff > 0 ? "bg-destructive/10" : "bg-success/10"
                )}
              >
                {costDiff > 0 ? (
                  <TrendingUp className="h-5 w-5 text-destructive sm:h-6 sm:w-6" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-success sm:h-6 sm:w-6" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eco Efficiency */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground sm:text-sm">{t("ecoEfficiency")}</p>
                <p className={cn("mt-1 text-2xl font-bold sm:text-3xl", config.color)}>
                  {config.label}
                </p>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                  {efficiency === "good"
                    ? t("ecoGreat")
                    : efficiency === "average"
                      ? t("ecoNormal")
                      : t("ecoHigh")}
                </p>
              </div>
              <div className={cn("shrink-0 rounded-lg p-2 sm:p-3", config.bg)}>
                <EfficiencyIcon className={cn("h-5 w-5 sm:h-6 sm:w-6", config.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Monthly Usage Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t("chartUsageTrend")}</CardTitle>
            <CardDescription>{t("chartLast6MonthsWater")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center">
              {monthlyData.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noUsageData")}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value} L`, t("tooltipUsage")]}
                    />
                    <Area
                      type="monotone"
                      dataKey="usage"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#usageGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Cost Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t("chartCostTrend")}</CardTitle>
            <CardDescription>{t("chartLast6MonthsSpend")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center">
              {monthlyData.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noCostData")}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [formatCurrency(value), t("cost")]}
                    />
                    <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("weeklyComparison")}</CardTitle>
          <CardDescription>{t("weeklyComparisonDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            {weeklyData.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noWeeklyData")}</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" className="text-muted-foreground" fontSize={12} />
                  <YAxis className="text-muted-foreground" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "usage" ? `${value} L` : `${value} ${t("chartLitersPerDay")}`,
                      name === "usage" ? t("chartTotalUsage") : t("chartDailyAvg"),
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="usage" name={t("chartTotalUsage")} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgDaily" name={t("chartDailyAvg")} fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Suggestions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t("smartSuggestions")}
          </CardTitle>
          <CardDescription>{t("smartSuggestionsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {predictiveSuggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noAiSuggestions")}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {predictiveSuggestions.map((suggestion) => {
                const Icon = getSuggestionIcon(suggestion.type)
                return (
                  <div
                    key={suggestion.id}
                    className="relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          suggestion.type === "savings" && "bg-success/10",
                          suggestion.type === "efficiency" && "bg-warning/10",
                          suggestion.type === "usage" && "bg-primary/10"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            suggestion.type === "savings" && "text-success",
                            suggestion.type === "efficiency" && "text-warning",
                            suggestion.type === "usage" && "text-primary"
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">{getSuggestionTitle(suggestion)}</h4>
                          {suggestion.savingsPercent != null && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                suggestion.type === "savings" && "bg-success/10 text-success",
                                suggestion.type === "efficiency" && "bg-warning/10 text-warning-foreground",
                                suggestion.type === "usage" && "bg-primary/10 text-primary"
                              )}
                            >
                              {suggestion.savingsPercent}%
                            </Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{getSuggestionDesc(suggestion)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Water Saving Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            {t("savingTips")}
          </CardTitle>
          <CardDescription>{t("savingTipsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {savingTips.map((tip, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    tip.impact === "high" ? "bg-success/10" : "bg-primary/10"
                  )}
                >
                  <Leaf
                    className={cn(
                      "h-5 w-5",
                      tip.impact === "high" ? "text-success" : "text-primary"
                    )}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{getTipTitle(tip)}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{getTipDesc(tip)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
