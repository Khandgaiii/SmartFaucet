function authErrorCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "code" in error) {
    const c = (error as { code: unknown }).code
    return typeof c === "string" ? c : undefined
  }
  return undefined
}

/** User-facing copy for common Firebase Auth errors. */
export function formatAuthError(error: unknown): string {
  const code = authErrorCode(error)
  if (code) {
    switch (code) {
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return "Sign-in was cancelled."
      case "auth/email-already-in-use":
        return "That email is already registered."
      case "auth/invalid-email":
        return "Enter a valid email address."
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password."
      case "auth/weak-password":
        return "Password should be at least 6 characters."
      case "auth/too-many-requests":
        return "Too many attempts. Try again later."
      case "auth/network-request-failed":
        return "Network error. Check your connection."
      case "auth/operation-not-allowed":
        return "Email/password sign-in is disabled in Firebase. Enable it in Authentication → Sign-in method."
      case "auth/admin-restricted-operation":
        return "This sign-in method is not allowed for this project."
      case "auth/unauthorized-domain":
        return "This domain is not allowed for OAuth. Add it under Firebase Authentication → Settings → Authorized domains."
      default:
        return error instanceof Error ? error.message : "Something went wrong."
    }
  }
  if (error instanceof Error) return error.message
  return "Something went wrong."
}
