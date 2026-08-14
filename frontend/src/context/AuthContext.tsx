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



const AuthContext = createContext<AuthContextType | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
 
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
   const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const navigate = useNavigate()

  const login = (newToken: string, user: any) => {
     console.log("Login called");
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(user))
    console.log("Before navigate:", window.location.pathname);
    setToken(newToken)
    setUser(user)
    navigate('/dashboard', { replace: true })
    console.log("Before navigate:", window.location.pathname);
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, user, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}