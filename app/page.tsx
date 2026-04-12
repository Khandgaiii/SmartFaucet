"use client"

import { useSettings } from "@/lib/settings-context"
import { useWater } from "@/lib/water-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WaterGauge } from "@/components/dashboard/water-gauge"
import { WaterFlowAnimation } from "@/components/dashboard/water-flow-animation"
import { AlertBanner } from "@/components/dashboard/alert-banner"
import { StatCard } from "@/components/dashboard/stat-card"
import { Droplets, TrendingUp, Wallet, Activity } from "lucide-react"

export default function DashboardPage() {
  const { t, formatCurrency } = useSettings()
  const { data, alerts, dismissAlert } = useWater()

  const todayCost =
    data.totalToday != null && data.costPerLiter != null ? data.totalToday * data.costPerLiter : null
  const monthCost =
    data.totalMonth != null && data.costPerLiter != null ? data.totalMonth * data.costPerLiter : null

  const flowLabel =
    data.currentFlow != null ? `${data.currentFlow.toFixed(1)} L/min` : "—"
  const todayLabel = data.totalToday != null ? `${data.totalToday.toFixed(1)} L` : "—"
  const monthLabel = data.totalMonth != null ? `${data.totalMonth.toFixed(0)} L` : "—"

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-6">
        <AlertBanner alerts={alerts} onDismiss={dismissAlert} />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          {t("realTimeUsage")}
        </h1>
        <p className="mt-1 text-muted-foreground">{t("dashboardSubtitle")}</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title={t("currentUsage")}
          value={flowLabel}
          subtitle={data.isFlowing ? t("active") : t("inactive")}
          icon={Activity}
          color={data.isFlowing ? "blue" : "yellow"}
        />
        <StatCard
          title={t("todayUsage")}
          value={todayLabel}
          subtitle={todayCost != null ? formatCurrency(todayCost) : "—"}
          icon={Droplets}
          color="blue"
        />
        <StatCard
          title={t("monthlyUsage")}
          value={monthLabel}
          subtitle={monthCost != null ? formatCurrency(monthCost) : "—"}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title={t("cost")}
          value={monthCost != null ? formatCurrency(monthCost) : "—"}
          subtitle={
            data.costPerLiter != null ? `${formatCurrency(data.costPerLiter)} / L` : "—"
          }
          icon={Wallet}
          color="yellow"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              {t("waterFlow")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WaterFlowAnimation isFlowing={data.isFlowing} flowRate={data.currentFlow} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("currentUsage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-4 py-4 sm:gap-8">
              <WaterGauge
                value={data.totalToday}
                max={200}
                label={t("todayUsage")}
                unit="L"
                size="lg"
                color="blue"
              />
              <div className="flex gap-4 sm:gap-8">
                <WaterGauge
                  value={data.currentFlow}
                  max={15}
                  label={t("flowRate")}
                  unit="L/min"
                  size="md"
                  color={data.isFlowing ? "green" : "yellow"}
                />
                <WaterGauge
                  value={todayCost}
                  max={100}
                  label={t("cost")}
                  unit={todayCost != null ? formatCurrency(todayCost).charAt(0) : "—"}
                  size="md"
                  color={todayCost != null && todayCost > 50 ? "red" : "green"}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
