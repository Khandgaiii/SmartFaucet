/**
 * GATT layout shared with firmware (ESP32-C6 + YF-B7).
 */
export const SMARTFAUCET_SERVICE_UUID =
  "12340000-0000-1000-8000-00805f9b34fb"
export const TELEMETRY_CHAR_UUID =
  "12340001-0000-1000-8000-00805f9b34fb"

export interface EspTelemetryPayload {
  flow_lmin?: number
  total_l?: number
  pulse_hz?: number
}

export function parseTelemetryPayload(raw: DataView): EspTelemetryPayload | null {
  try {
    const text = new TextDecoder().decode(raw)
    const j = JSON.parse(text) as EspTelemetryPayload
    return j && typeof j === "object" ? j : null
  } catch {
    return null
  }
}
