import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase/config"

/** Web client ID for native Google Sign-In (Capacitor). OAuth 2.0 Web client from Google Cloud / Firebase. */
export function getGoogleWebClientId(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim()
}

let nativeGoogleInit: Promise<void> | null = null

function ensureNativeGoogleInitialized(webClientId: string): Promise<void> {
  if (!nativeGoogleInit) {
    nativeGoogleInit = (async () => {
      const { SocialLogin } = await import("@capgo/capacitor-social-login")
      await SocialLogin.initialize({
        google: { webClientId, mode: "online" },
      })
    })()
  }
  return nativeGoogleInit
}

function shouldUseRedirectInsteadOfPopup(code: string | undefined): boolean {
  return (
    code === "auth/popup-blocked" ||
    code === "auth/operation-not-supported-in-this-environment" ||
    code === "auth/internal-error"
  )
}

export type GoogleSignInOutcome =
  | { ok: true; usedRedirect: boolean }
  | { ok: false; error: Error }
  | { ok: false; cancelled: true }

/**
 * Web: Firebase popup, then redirect fallback when popups are blocked (common in embedded WebViews).
 * Native (Capacitor): @capgo/capacitor-social-login → ID token or access token → Firebase credential.
 */
export async function signInWithGoogle(): Promise<GoogleSignInOutcome> {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  provider.addScope("profile")
  provider.addScope("email")

  const { Capacitor } = await import("@capacitor/core")

  if (Capacitor.isNativePlatform()) {
    const webClientId = getGoogleWebClientId()
    if (!webClientId) {
      return {
        ok: false,
        error: new Error(
          "Set NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env.local (OAuth Web client ID from Google Cloud Console, same project as Firebase).",
        ),
      }
    }

    try {
      await ensureNativeGoogleInitialized(webClientId)
      const { SocialLogin } = await import("@capgo/capacitor-social-login")
      // Do not pass `scopes` here unless MainActivity implements ModifiedMainActivityForSocialLoginPlugin.
      // The native plugin already requests userinfo email/profile + openid by default.
      const { result } = await SocialLogin.login({
        provider: "google",
        options: {},
      })

      if (result.responseType === "offline") {
        return {
          ok: false,
          error: new Error(
            "Google returned server auth only. Keep SocialLogin Google mode as \"online\" and ensure the Web client ID is correct.",
          ),
        }
      }

      const idToken = result.idToken
      const accessToken = result.accessToken?.token ?? null

      if (idToken) {
        await signInWithCredential(auth, GoogleAuthProvider.credential(idToken))
        return { ok: true, usedRedirect: false }
      }
      if (accessToken) {
        await signInWithCredential(auth, GoogleAuthProvider.credential(null, accessToken))
        return { ok: true, usedRedirect: false }
      }
      return {
        ok: false,
        error: new Error(
          "Google did not return an ID token or access token. Check SHA-1/SHA-256 in Firebase for Android and OAuth client setup.",
        ),
      }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
    }
  }

  try {
    await signInWithPopup(auth, provider)
    return { ok: true, usedRedirect: false }
  } catch (e) {
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: string }).code)
        : undefined

    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      return { ok: false, cancelled: true }
    }

    if (shouldUseRedirectInsteadOfPopup(code)) {
      try {
        await signInWithRedirect(auth, provider)
        return { ok: true, usedRedirect: true }
      } catch (redirectErr) {
        return {
          ok: false,
          error:
            redirectErr instanceof Error ? redirectErr : new Error(String(redirectErr)),
        }
      }
    }

    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
  }
}
