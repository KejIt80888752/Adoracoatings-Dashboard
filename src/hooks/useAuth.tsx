import { createContext, useContext, useState, ReactNode } from 'react'

interface User { email: string; name: string; role: string }
interface Ctx  { user: User | null; login: (e: string, p: string) => boolean; logout: () => void }

const AuthCtx = createContext<Ctx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('adora_user') ?? 'null') } catch { return null }
  })

  const USERS: Record<string, { pw: string; name: string; role: string }> = {
    'ashutosh@adoracoatings.com': { pw: 'admin123',   name: 'Ashutosh Mehraa', role: 'Admin'           },
    'manager@adoracoatings.com':  { pw: 'manager123', name: 'Manager',         role: 'Manager'         },
    'sales@adoracoatings.com':    { pw: 'sales123',   name: 'Sales Executive', role: 'Sales Executive' },
  }

  const login = (email: string, password: string) => {
    const found = USERS[email.toLowerCase().trim()]
    if (!found || found.pw !== password) return false
    const u: User = { email, name: found.name, role: found.role }
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
