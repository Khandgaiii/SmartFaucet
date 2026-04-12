"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Capacitor } from "@capacitor/core"
import {
  onAuthStateChanged,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/config"
import { formatAuthError } from "@/lib/firebase/auth-errors"

export type AuthResult =
  | { ok: true }
  | { ok: false; error: string }

/** Android WebView often delays or stalls Firebase auth; never block UI past this. */
function authUiMaxWaitMs() {
  return Capacitor.isNativePlatform() ? 1200 : 2200
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  register: (email: string, password: string, name: string) => Promise<AuthResult>
  logout: () => void
  updateProfile: (name: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "smartfaucet_auth"

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function mapFirebaseUser(u: FirebaseUser): User {
  const name =
    u.displayName?.trim() ||
    u.email?.split("@")[0]?.trim() ||
    "User"
  return {
    id: u.uid,
    email: u.email ?? "",
    name,
    avatar: u.photoURL ?? undefined,
    createdAt: u.metadata.creationTime
      ? new Date(u.metadata.creationTime)
      : new Date(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let unsub: (() => void) | undefined

    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth()
        const maxMs = authUiMaxWaitMs()

        void getRedirectResult(auth).catch((e) => {
          console.warn("[auth] getRedirectResult:", e)
        })

        unsub = onAuthStateChanged(
          auth,
          (fbUser) => {
            if (cancelled) return
            setUser(fbUser ? mapFirebaseUser(fbUser) : null)
            setIsLoading(false)
          },
          (err) => {
            console.error("[auth] onAuthStateChanged:", err)
            if (!cancelled) setIsLoading(false)
          },
        )

        void (async () => {
          try {
            await Promise.race([
              auth.authStateReady(),
              new Promise<void>((resolve) => setTimeout(resolve, maxMs)),
            ])
          } catch (e) {
            console.warn("[auth] authStateReady:", e)
          }
          if (!cancelled) setIsLoading(false)
        })()
      } catch (e) {
        console.error("[auth] Firebase init failed:", e)
        setIsLoading(false)
      }

      return () => {
        cancelled = true
        unsub?.()
      }
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        })
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)

    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const emailNorm = normalizeEmail(email)
    if (!emailNorm) {
      return { ok: false, error: "Enter your email address." }
    }

    setIsLoading(true)

    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth()
        const cred = await signInWithEmailAndPassword(auth, emailNorm, password)
        setIsLoading(false)
        if (cred.user) {
          setUser(mapFirebaseUser(cred.user))
          return { ok: true }
        }
        return { ok: false, error: "Sign-in failed." }
      } catch (e) {
        setIsLoading(false)
        return { ok: false, error: formatAuthError(e) }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    const storedUsers = localStorage.getItem("smartfaucet_users")
    if (storedUsers) {
      const users = JSON.parse(storedUsers)
      const found = users[emailNorm]
      if (found && found.password === password) {
        setUser(found.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(found.user))
        setIsLoading(false)
        return { ok: true }
      }
    }

    setIsLoading(false)
    return {
      ok: false,
      error:
        "Invalid email or password. With Firebase disabled, only accounts created in this browser (offline register) can sign in.",
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResult> => {
    const emailNorm = normalizeEmail(email)
    if (!emailNorm) {
      return { ok: false, error: "Enter your email address." }
    }

    setIsLoading(true)

    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth()
        const cred = await createUserWithEmailAndPassword(auth, emailNorm, password)
        if (cred.user) {
          await updateProfile(cred.user, { displayName: name })
          await cred.user.reload()
          setUser(mapFirebaseUser(auth.currentUser!))
        }
        setIsLoading(false)
        return cred.user ? { ok: true } : { ok: false, error: "Registration failed." }
      } catch (e) {
        setIsLoading(false)
        return { ok: false, error: formatAuthError(e) }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    const storedUsers = localStorage.getItem("smartfaucet_users")
    const users = storedUsers ? JSON.parse(storedUsers) : {}

    if (users[emailNorm]) {
      setIsLoading(false)
      return { ok: false, error: "An account with this email already exists." }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: emailNorm,
      name,
      createdAt: new Date(),
    }

    users[emailNorm] = { password, user: newUser }
    localStorage.setItem("smartfaucet_users", JSON.stringify(users))

    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    setIsLoading(false)
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    if (isFirebaseConfigured()) {
      void signOut(getFirebaseAuth())
    }
  }

  const updateProfileName = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name }
      setUser(updatedUser)
      if (!isFirebaseConfigured()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
      } else {
        const auth = getFirebaseAuth()
        const cur = auth.currentUser
        if (cur) {
          void updateProfile(cur, { displayName: name })
        }
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile: updateProfileName,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
