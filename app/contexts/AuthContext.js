'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null) // ✅ using custom hook
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData) // ✅ automatically syncs with localStorage
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clients')
      localStorage.removeItem('communications')
      localStorage.removeItem('projects')
      localStorage.removeItem('invoices')
    }
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
