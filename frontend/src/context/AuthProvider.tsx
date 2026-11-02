import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./authContext"
import type { AuthUser, Permission } from "./authContext"

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null
  })
  const navigate = useNavigate()
  const permissions = user?.permissions ?? []

  const login = (newToken: string, user: AuthUser) => {
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(newToken)
    setUser(user)
    navigate("/dashboard", { replace: true })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setToken(null)
    setUser(null)

    navigate("/login", { replace: true })
  }

  const hasPermission = (permission: Permission) =>
    permissions.includes(permission)

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        permissions,
        login,
        logout,
        isLoggedIn: !!token,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
