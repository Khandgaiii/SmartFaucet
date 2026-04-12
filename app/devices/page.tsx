"use client"

import React from "react"

import { useState } from "react"
import { useDevice, type Device } from "@/lib/device-context"
import { useSettings } from "@/lib/settings-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Bluetooth,
  RefreshCw,
  Trash2,
  Plus,
  Droplets,
  ShowerHead,
  Bath,
  Clock,
  MapPin,
  Cpu,
  Battery,
  Loader2,
  Radio,
} from "lucide-react"
import { cn } from "@/lib/utils"

const deviceIcons: Record<Device["type"], React.ReactNode> = {
  faucet: <Droplets className="h-6 w-6" />,
  shower: <ShowerHead className="h-6 w-6" />,
  bath: <Bath className="h-6 w-6" />,
}

export default function DevicesPage() {
  const { t } = useSettings()
  const {
    devices,
    activeDevice,
    isScanning,
    discoveredBle,
    bleError,
    setActiveDevice,
    scanForBleDevices,
    connectBleDevice,
    removeDevice,
    syncDevice,
  } = useDevice()

  const [syncingDevice, setSyncingDevice] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [showPairingDialog, setShowPairingDialog] = useState(false)
  const [connectingId, setConnectingId] = useState<string | null>(null)

  const handleSync = async (deviceId: string) => {
    setSyncingDevice(deviceId)
    await syncDevice(deviceId)
    setSyncingDevice(null)
  }

  const getStatusColor = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return "bg-success text-success-foreground"
      case "offline":
        return "bg-muted text-muted-foreground"
      case "error":
        return "bg-destructive text-destructive-foreground"
    }
  }

  const getSignalColor = (strength: number) => {
    if (strength >= 70) return "text-success"
    if (strength >= 40) return "text-warning"
    return "text-destructive"
  }

  const handleConnectDiscovered = async (deviceId: string, name: string) => {
    setConnectingId(deviceId)
    const ok = await connectBleDevice(deviceId, name)
    setConnectingId(null)
    if (ok) {
      setShowPairingDialog(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 lg:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            {t("devices")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("devicesLine").replace("{n}", String(devices.length))}
          </p>
        </div>
        <Button onClick={() => setShowPairingDialog(true)} disabled={isScanning}>
          <Plus className="mr-2 h-4 w-4" />
          {t("pairDevice")}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          {devices.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <Bluetooth className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">{t("noDevices")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("devicesEmptyHint")}</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {devices.map((device) => (
                <Card
                  key={device.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    activeDevice?.id === device.id && "ring-2 ring-primary",
                  )}
                  onClick={() => setSelectedDevice(device)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-lg",
                            device.status === "online"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {deviceIcons[device.type]}
                        </div>
                        <div>
                          <CardTitle className="text-base">{device.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            {device.location}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getStatusColor(device.status)}>
                          {device.status === "online" ? t("online") : t("offline")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Bluetooth className="mr-1 h-3 w-3" />
                          BLE
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Radio className={cn("h-4 w-4", getSignalColor(device.signalStrength))} />
                        <span className="text-muted-foreground">{t("signalStrength")}</span>
                      </div>
                      <span className="font-medium">{device.signalStrength}%</span>
                    </div>
                    <Progress value={device.signalStrength} className="h-1.5" />

                    {device.batteryLevel !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Battery
                            className={cn(
                              "h-4 w-4",
                              device.batteryLevel > 20 ? "text-success" : "text-destructive",
                            )}
                          />
                          <span className="text-muted-foreground">{t("battery")}</span>
                        </div>
                        <span className="font-medium">{device.batteryLevel}%</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{t("lastSeen")}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {device.lastSeen.toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSync(device.id)
                        }}
                        disabled={syncingDevice === device.id}
                      >
                        {syncingDevice === device.id ? (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-3 w-3" />
                        )}
                        {t("syncDevice")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          void removeDevice(device.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showPairingDialog} onOpenChange={setShowPairingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bluetooth className="h-5 w-5 text-primary" />
              {t("pairDevice")}
            </DialogTitle>
            <DialogDescription>{t("pairDialogDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {bleError && (
              <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {bleError}
              </p>
            )}
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                  <Bluetooth className="relative h-16 w-16 text-primary" />
                </div>
                <p className="mt-6 text-sm font-medium">{t("bleScanningTitle")}</p>
                <p className="mt-2 text-xs text-muted-foreground">{t("bleScanningHint")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button className="w-full" onClick={() => void scanForBleDevices()}>
                  <Radio className="mr-2 h-4 w-4" />
                  {t("scanDevices")}
                </Button>
                {discoveredBle.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{t("foundLabel")}</p>
                    {discoveredBle.map((d) => (
                      <div
                        key={d.deviceId}
                        className="flex items-center justify-between gap-2 rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium">{d.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {d.rssi} dBm · {d.deviceId.slice(0, 14)}…
                          </p>
                        </div>
                        <Button
                          size="sm"
                          disabled={connectingId === d.deviceId}
                          onClick={() => void handleConnectDiscovered(d.deviceId, d.name)}
                        >
                          {connectingId === d.deviceId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            t("connect")
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedDevice && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {deviceIcons[selectedDevice.type]}
                  </div>
                  {selectedDevice.name}
                </DialogTitle>
                <DialogDescription>
                  BLE: {selectedDevice.bleDeviceId}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t("deviceStatus")}</p>
                    <Badge className={getStatusColor(selectedDevice.status)}>
                      {selectedDevice.status === "online" ? t("online") : t("offline")}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t("location")}</p>
                    <p className="font-medium">{selectedDevice.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t("firmwareVersion")}</p>
                    <p className="flex items-center gap-1 font-medium">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      v{selectedDevice.firmwareVersion}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t("signalStrength")}</p>
                    <p className={cn("font-medium", getSignalColor(selectedDevice.signalStrength))}>
                      {selectedDevice.signalStrength}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setActiveDevice(selectedDevice)
                      setSelectedDevice(null)
                    }}
                  >
                    Set as Active
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      void removeDevice(selectedDevice.id)
                      setSelectedDevice(null)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
