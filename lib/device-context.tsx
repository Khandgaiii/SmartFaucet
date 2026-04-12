"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react"
import { Capacitor } from "@capacitor/core"
import { BleClient } from "@capacitor-community/bluetooth-le"
import {
  SMARTFAUCET_SERVICE_UUID,
  TELEMETRY_CHAR_UUID,
  parseTelemetryPayload,
  type EspTelemetryPayload,
} from "@/lib/ble/smartfaucet-gatt"
import { ingestWaterTelemetry } from "@/lib/water-telemetry"
import { useAuth } from "@/lib/auth-context"
import { devicesKey, LEGACY_DEVICES_KEY } from "@/lib/user-storage-keys"

export type ConnectionType = "ble"

export interface Device {
  id: string
  bleDeviceId: string
  name: string
  type: "faucet" | "shower" | "bath"
  location: string
  status: "online" | "offline" | "error"
  connectionType: ConnectionType
  lastSeen: Date
  firmwareVersion: string
  signalStrength: number
  batteryLevel?: number
}

export interface DiscoveredBleDevice {
  deviceId: string
  name: string
  rssi: number
}

interface DeviceContextType {
  devices: Device[]
  activeDevice: Device | null
  isScanning: boolean
  discoveredBle: DiscoveredBleDevice[]
  bleError: string | null
  setActiveDevice: (device: Device | null) => void
  scanForBleDevices: () => Promise<void>
  connectBleDevice: (deviceId: string, nameHint?: string) => Promise<boolean>
  disconnectBleDevice: (bleDeviceId: string) => Promise<void>
  removeDevice: (deviceId: string) => void
  syncDevice: (deviceId: string) => Promise<void>
  getDeviceStatus: (deviceId: string) => Device["status"]
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

const SCAN_MS = 12000

function rssiToPercent(rssi: number): number {
  const min = -100
  const max = -40
  const p = ((rssi - min) / (max - min)) * 100
  return Math.max(0, Math.min(100, Math.round(p)))
}

export function DeviceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [devices, setDevices] = useState<Device[]>([])
  const [activeDevice, setActiveDevice] = useState<Device | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [discoveredBle, setDiscoveredBle] = useState<DiscoveredBleDevice[]>([])
  const [bleError, setBleError] = useState<string | null>(null)

  const bleInitRef = useRef(false)
  const connectedIdRef = useRef<string | null>(null)
  const discoveredMapRef = useRef<Map<string, DiscoveredBleDevice>>(new Map())

  useEffect(() => {
    if (!userId) {
      setDevices([])
      setActiveDevice(null)
      return
    }

    const dk = devicesKey(userId)

    if (!localStorage.getItem(dk) && localStorage.getItem(LEGACY_DEVICES_KEY)) {
      localStorage.setItem(dk, localStorage.getItem(LEGACY_DEVICES_KEY)!)
    }

    const storedDevices = localStorage.getItem(dk)

    if (storedDevices) {
      try {
        const parsed = JSON.parse(storedDevices) as Device[]
        const cleaned = parsed
          .filter((d) => d && d.connectionType === "ble" && d.bleDeviceId)
          .map((d) => ({
            ...d,
            lastSeen: new Date(d.lastSeen),
          }))
        setDevices(cleaned)
      } catch {
        localStorage.removeItem(dk)
        setDevices([])
      }
    } else {
      setDevices([])
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return
    localStorage.setItem(devicesKey(userId), JSON.stringify(devices))
  }, [devices, userId])

  const ensureBle = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      throw new Error("Bluetooth LE is available in the Smart Faucet Android/iOS app.")
    }
    if (!bleInitRef.current) {
      await BleClient.initialize({ androidNeverForLocation: true })
      bleInitRef.current = true
    }
  }, [])

  const scanForBleDevices = useCallback(async () => {
    setBleError(null)
    discoveredMapRef.current = new Map()
    setDiscoveredBle([])

    try {
      await ensureBle()
      const enabled = await BleClient.isEnabled()
      if (!enabled) {
        await BleClient.requestEnable()
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setBleError(msg)
      return
    }

    setIsScanning(true)

    try {
      await BleClient.requestLEScan(
        { services: [SMARTFAUCET_SERVICE_UUID], allowDuplicates: true },
        (result) => {
          const id = result.device.deviceId
          const name =
            result.localName ?? result.device.name ?? "SmartFaucet"
          const rssi = result.rssi ?? -80
          discoveredMapRef.current.set(id, {
            deviceId: id,
            name,
            rssi,
          })
          setDiscoveredBle(Array.from(discoveredMapRef.current.values()))
        },
      )

      await new Promise((r) => setTimeout(r, SCAN_MS))
      await BleClient.stopLEScan()
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setBleError(msg)
      try {
        await BleClient.stopLEScan()
      } catch {
        /* ignore */
      }
    } finally {
      setIsScanning(false)
    }
  }, [ensureBle])

  const applyTelemetry = useCallback(
    (deviceKey: string, payload: EspTelemetryPayload | null) => {
      if (!payload) return

      const flow = payload.flow_lmin
      const total = payload.total_l

      ingestWaterTelemetry({
        currentFlow: flow ?? null,
        totalToday: total ?? null,
        totalMonth: total ?? null,
        isFlowing: (flow ?? 0) > 0.05,
      })

      setDevices((prev) =>
        prev.map((d) =>
          d.bleDeviceId === deviceKey
            ? {
                ...d,
                lastSeen: new Date(),
                status: "online",
                signalStrength: rssiToPercent(
                  discoveredMapRef.current.get(deviceKey)?.rssi ?? -70,
                ),
              }
            : d,
        ),
      )

      setActiveDevice((prev) =>
        prev && prev.bleDeviceId === deviceKey
          ? {
              ...prev,
              lastSeen: new Date(),
              status: "online",
              signalStrength: rssiToPercent(
                discoveredMapRef.current.get(deviceKey)?.rssi ?? -70,
              ),
            }
          : prev,
      )
    },
    [],
  )

  const disconnectBleDevice = useCallback(
    async (bleDeviceId: string) => {
      try {
        await BleClient.stopNotifications(
          bleDeviceId,
          SMARTFAUCET_SERVICE_UUID,
          TELEMETRY_CHAR_UUID,
        )
      } catch {
        /* ignore */
      }
      try {
        await BleClient.disconnect(bleDeviceId)
      } catch {
        /* ignore */
      }
      if (connectedIdRef.current === bleDeviceId) {
        connectedIdRef.current = null
      }
    },
    [],
  )

  const connectBleDevice = useCallback(
    async (bleDeviceId: string, nameHint?: string): Promise<boolean> => {
      setBleError(null)
      try {
        await ensureBle()
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setBleError(msg)
        return false
      }

      if (connectedIdRef.current && connectedIdRef.current !== bleDeviceId) {
        await disconnectBleDevice(connectedIdRef.current)
      }

      const displayName =
        nameHint ??
        discoveredMapRef.current.get(bleDeviceId)?.name ??
        "SmartFaucet ESP32"

      try {
        await BleClient.connect(bleDeviceId, async (id) => {
          connectedIdRef.current = null
          setDevices((prev) =>
            prev.map((d) =>
              d.bleDeviceId === id ? { ...d, status: "offline" as const } : d,
            ),
          )
        })

        connectedIdRef.current = bleDeviceId

        await BleClient.startNotifications(
          bleDeviceId,
          SMARTFAUCET_SERVICE_UUID,
          TELEMETRY_CHAR_UUID,
          (value) => {
            const payload = parseTelemetryPayload(value)
            applyTelemetry(bleDeviceId, payload)
          },
        )

        const dev: Device = {
          id: bleDeviceId,
          bleDeviceId,
          name: displayName,
          type: "faucet",
          location: "BLE",
          status: "online",
          connectionType: "ble",
          lastSeen: new Date(),
          firmwareVersion: "1.0.0",
          signalStrength: rssiToPercent(
            discoveredMapRef.current.get(bleDeviceId)?.rssi ?? -65,
          ),
        }

        setDevices((prev) => {
          const others = prev.filter((d) => d.bleDeviceId !== bleDeviceId)
          return [...others, dev]
        })
        setActiveDevice(dev)
        return true
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setBleError(msg)
        return false
      }
    },
    [applyTelemetry, disconnectBleDevice, ensureBle],
  )

  const removeDevice = useCallback(
    async (deviceId: string) => {
      const device = devices.find((d) => d.id === deviceId)
      if (device) {
        await disconnectBleDevice(device.bleDeviceId)
      }
      setDevices((prev) => prev.filter((d) => d.id !== deviceId))
      if (activeDevice?.id === deviceId) {
        setActiveDevice(null)
      }
    },
    [devices, activeDevice, disconnectBleDevice],
  )

  const syncDevice = useCallback(
    async (deviceId: string) => {
      const device = devices.find((d) => d.id === deviceId)
      if (!device) return
      await new Promise((r) => setTimeout(r, 400))
    },
    [devices],
  )

  const getDeviceStatus = useCallback(
    (deviceId: string): Device["status"] => {
      return devices.find((d) => d.id === deviceId)?.status ?? "offline"
    },
    [devices],
  )

  return (
    <DeviceContext.Provider
      value={{
        devices,
        activeDevice,
        isScanning,
        discoveredBle,
        bleError,
        setActiveDevice,
        scanForBleDevices,
        connectBleDevice,
        disconnectBleDevice,
        removeDevice,
        syncDevice,
        getDeviceStatus,
      }}
    >
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevice() {
  const context = useContext(DeviceContext)
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider")
  }
  return context
}
