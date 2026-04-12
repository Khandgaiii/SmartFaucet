/**
 * SmartFaucet — ESP32-C6 + YF-B7 water flow sensor over BLE notify.
 * Matches app GATT UUIDs in lib/ble/smartfaucet-gatt.ts
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#ifndef LED_BUILTIN
#define LED_BUILTIN 8
#endif

static const char *SERVICE_UUID = "12340000-0000-1000-8000-00805f9b34fb";
static const char *TELEMETRY_CHAR_UUID = "12340001-0000-1000-8000-00805f9b34fb";

static const int PULSE_PIN = 4;
static const float PULSES_PER_LITER = 450.0f;

volatile uint32_t pulseCount = 0;

void IRAM_ATTR onPulse() {
  pulseCount++;
}

BLECharacteristic *pTelemetry = nullptr;

class ServerCB : public BLEServerCallbacks {
  void onConnect(BLEServer *s) {
    (void)s;
    digitalWrite(LED_BUILTIN, HIGH);
  }
  void onDisconnect(BLEServer *s) {
    (void)s;
    digitalWrite(LED_BUILTIN, LOW);
    BLEDevice::startAdvertising();
  }
};

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  pinMode(PULSE_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PULSE_PIN), onPulse, RISING);

  BLEDevice::init("SmartFaucet");
  BLEServer *server = BLEDevice::createServer();
  server->setCallbacks(new ServerCB());

  BLEService *svc = server->createService(SERVICE_UUID);
  pTelemetry = svc->createCharacteristic(
      TELEMETRY_CHAR_UUID,
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  pTelemetry->addDescriptor(new BLE2902());
  pTelemetry->setValue("{\"flow_lmin\":0,\"total_l\":0,\"pulse_hz\":0,\"temp_c\":null}");
  svc->start();

  BLEAdvertising *adv = BLEDevice::getAdvertising();
  adv->addServiceUUID(SERVICE_UUID);
  adv->setScanResponse(true);
  BLEDevice::startAdvertising();
}

void loop() {
  static uint32_t lastMs = 0;
  static uint32_t lastPulses = 0;

  uint32_t now = millis();
  if (now - lastMs < 500) {
    return;
  }
  float dt = (now - lastMs) / 1000.0f;
  lastMs = now;

  uint32_t pulses;
  noInterrupts();
  pulses = pulseCount;
  interrupts();

  uint32_t d = pulses - lastPulses;
  lastPulses = pulses;

  float total_l = pulses / PULSES_PER_LITER;
  float pulse_hz = (dt > 0.001f) ? (d / dt) : 0.0f;
  float flow_lmin = (d / PULSES_PER_LITER) / (dt / 60.0f);

  char buf[192];
  snprintf(buf, sizeof(buf),
           "{\"flow_lmin\":%.3f,\"total_l\":%.3f,\"pulse_hz\":%.2f,\"temp_c\":null}",
           flow_lmin, total_l, pulse_hz);

  if (pTelemetry) {
    pTelemetry->setValue((uint8_t *)buf, strlen(buf));
    pTelemetry->notify();
  }
}
