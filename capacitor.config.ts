import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.smartfaucet.app',
  appName: 'Smart Faucet',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    SocialLogin: {
      providers: {
        google: true,
        facebook: false,
        apple: false,
        twitter: false,
      },
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0ea5e9',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0ea5e9',
    },
    BluetoothLe: {
      displayStrings: {
        scanning: 'Scanning for SmartFaucet ESP32…',
        cancel: 'Cancel',
        availableDevices: 'Available devices',
        noDeviceFound: 'No device found',
      },
    },
  },
  android: {
    allowMixedContent: true,
  },
}

export default config
