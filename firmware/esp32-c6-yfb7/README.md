# SmartFaucet — ESP32-C6 + YF-B7 (BLE)

## Wiring (YF-B7)

| Sensor wire | ESP32-C6 |
|-------------|----------|
| Red (V+)    | 5V (or 3.3V per module) |
| Black (GND) | GND |
| Yellow (signal) | GPIO **4** (change `PULSE_PIN` in sketch) |

Calibrate `PULSES_PER_LITER` for your batch (often ~450 — check datasheet).

## Build

1. Arduino IDE → Board: **ESP32C6 Dev Module** (esp32 by Espressif, v3.x).
2. Open `smartfaucet_ble_yfb7.ino`, compile, upload.

## BLE

- Name: `SmartFaucet`
- Service / notify UUIDs match `lib/ble/smartfaucet-gatt.ts`
- JSON notify: `{"flow_lmin":...,"total_l":...,"pulse_hz":...,"temp_c":null}`
