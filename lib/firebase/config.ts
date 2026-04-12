import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

function readConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim(),
  }
}

export function isFirebaseConfigured(): boolean {
  const c = readConfig()
  return Boolean(c.apiKey && c.authDomain && c.projectId && c.appId)
}

/** Browser-only Firebase app singleton. */
export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase client is only available in the browser.")
  }
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Missing Firebase config. Set NEXT_PUBLIC_FIREBASE_* in .env.local — see .env.example.",
    )
  }
  const c = readConfig()
  if (!getApps().length) {
    initializeApp({
      apiKey: c.apiKey!,
      authDomain: c.authDomain!,
      projectId: c.projectId!,
      storageBucket: c.storageBucket,
      messagingSenderId: c.messagingSenderId,
      appId: c.appId!,
      ...(c.measurementId ? { measurementId: c.measurementId } : {}),
    })
  }
  return getApps()[0]!
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp())
}
