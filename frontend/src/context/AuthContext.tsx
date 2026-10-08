import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react" 
import { useNavigate } from "react-router-dom"


type User = {
  id: number
  email: string
  name: string
  role: string
}

type AuthContextType = {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoggedIn: boolean
}



const DEFAULT_USER: User = {
  id: 1,
  email: "admin@streamys.in",
  name: "Admin User",
  role: "ADMIN",
}

const DEFAULT_TOKEN = "bypass-dev-token"

const AuthContext = createContext<AuthContextType | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    const existing = localStorage.getItem('token')
    if (!existing) {
      localStorage.setItem('token', DEFAULT_TOKEN)
      return DEFAULT_TOKEN
    }
    return existing
  })

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch {
        // ignore
      }
    }
    localStorage.setItem('user', JSON.stringify(DEFAULT_USER))
    return DEFAULT_USER
  })

  const navigate = useNavigate()

  const login = (newToken: string, newUser: any) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    navigate('/dashboard', { replace: true })
  }

  const logout = () => {
    localStorage.setItem('token', DEFAULT_TOKEN)
    localStorage.setItem('user', JSON.stringify(DEFAULT_USER))
    setToken(DEFAULT_TOKEN)
    setUser(DEFAULT_USER)
    navigate('/dashboard', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ token: token || DEFAULT_TOKEN, login, logout, user: user || DEFAULT_USER, isLoggedIn: true }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}