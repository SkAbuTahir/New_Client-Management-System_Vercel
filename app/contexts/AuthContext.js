'use client'
import { createContext, useContext } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()

  const login = async ({ username, password }) => {
    const result = await signIn('credentials', { username, password, redirect: false })
    return result
  }

  const logout = () => signOut({ callbackUrl: '/' })

  // Map NextAuth session to the same shape the rest of the app expects
  const user = session?.user
    ? { name: session.user.name, email: session.user.email, username: session.user.username, role: session.user.role }
    : null

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: status === 'loading' }}>
      {children}
    </AuthContext.Provider>
  )
}
