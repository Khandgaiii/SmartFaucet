/** Namespace localStorage by Firebase uid so each account has its own data. */
export function devicesKey(userId: string) {
  return `smartfaucet_devices_${userId}`
}

export const LEGACY_DEVICES_KEY = "smartfaucet_devices"
