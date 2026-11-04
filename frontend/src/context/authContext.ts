// Auth context instance and its types, in a plain .ts module so that
// AuthContext.tsx and useAuth.ts only export what react-refresh allows.
export type Permission = string

export type AuthUser = {
  id: number
  email: string
  name: string
  role: string
  permissions: Permission[]
}

export type AuthContextType = {
  token: string | null
  user: AuthUser | null
  permissions: Permission[]
  login: (token: string, user: AuthUser) => void
  logout: () => void
  isLoggedIn: boolean
  hasPermission: (permission: Permission) => boolean
}

import { createContext } from "react"

export const AuthContext = createContext<AuthContextType | null>(null)