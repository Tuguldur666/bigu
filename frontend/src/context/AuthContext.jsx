import { createContext, useContext, useState, useEffect } from "react"
import api from "../api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('zangia_token')
      const savedUser = localStorage.getItem('zangia_user')
      
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      
      if (token) {
        try {
          const { user: userData } = await api.getMe()
          setUser(userData)
          localStorage.setItem('zangia_user', JSON.stringify(userData))
        } catch (error) {
          console.error('Auth check failed:', error.message)
          // If API fails but we have saved user, keep it
          if (!savedUser) {
            localStorage.removeItem('zangia_token')
          }
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (credentials) => {
    const data = await api.login(credentials)
    localStorage.setItem('zangia_token', data.token)
    localStorage.setItem('zangia_user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  const registerSeeker = async (data) => {
    const result = await api.registerSeeker(data)
    localStorage.setItem('zangia_token', result.token)
    localStorage.setItem('zangia_user', JSON.stringify(result.user))
    setUser(result.user)
    return result
  }

  const registerEmployer = async (data) => {
    const result = await api.registerEmployer(data)
    localStorage.setItem('zangia_token', result.token)
    localStorage.setItem('zangia_user', JSON.stringify(result.user))
    setUser(result.user)
    return result
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('zangia_token')
    localStorage.removeItem('zangia_user')
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('zangia_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, registerSeeker, registerEmployer }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}