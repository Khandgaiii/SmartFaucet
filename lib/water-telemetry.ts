import type { WaterData } from "@/lib/water-types"

type Listener = (partial: Partial<WaterData>) => void

const listeners = new Set<Listener>()

export function subscribeWaterTelemetry(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Called when ESP32 sends JSON telemetry over BLE */
export function ingestWaterTelemetry(partial: Partial<WaterData>): void {
  for (const l of listeners) {
    l(partial)
  }
}
