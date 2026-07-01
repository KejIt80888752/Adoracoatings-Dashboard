import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface DarkCtx { dark: boolean; toggle: () => void }
const Ctx = createContext<DarkCtx>({ dark: false, toggle: () => {} })

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => localStorage.getItem('adora_dark') === '1')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('adora_dark', dark ? '1' : '0')
  }, [dark])

  return <Ctx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</Ctx.Provider>
}

export const useDarkMode = () => useContext(Ctx)
