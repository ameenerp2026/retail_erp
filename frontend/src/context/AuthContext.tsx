import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react" 
import { useNavigate } from "react-router-dom"

type AuthContextType = {
  token: string | null
  login: (token: string, user: any) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
 
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const navigate = useNavigate()

  const login = (newToken: string, user: any) => {
     console.log("Login called");
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(user))
    console.log("Before navigate:", window.location.pathname);
    setToken(newToken)
    navigate('/dashboard', { replace: true })
    console.log("Before navigate:", window.location.pathname);
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}