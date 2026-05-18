import { createContext, useContext, useState, ReactNode } from 'react'

interface User { email: string; name: string; role: string }
interface Ctx  { user: User | null; login: (e: string, p: string) => boolean; logout: () => void }

const AuthCtx = createContext<Ctx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('adora_user') ?? 'null') } catch { return null }
  })

  const login = (email: string, password: string) => {
    if (!email || password.length < 6) return false
    const u: User = { email, name: email.split('@')[0], role: 'Admin' }
    setUser(u)
    localStorage.setItem('adora_user', JSON.stringify(u))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adora_user')
  }

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
