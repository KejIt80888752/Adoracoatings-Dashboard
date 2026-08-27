import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TRANSLATIONS, type Lang, type TranslationKey } from '@/lib/translations'

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: (key: TranslationKey, params?: Record<string, string | number>) => string }
const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: k => k })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('adora_lang') as Lang) || 'en')

  useEffect(() => { localStorage.setItem('adora_lang', lang) }, [lang])

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    let str = TRANSLATIONS[key]?.[lang] ?? TRANSLATIONS[key]?.en ?? key
    if (params) for (const [k, v] of Object.entries(params)) str = str.replace(`{${k}}`, String(v))
    return str
  }

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export const useLanguage = () => useContext(Ctx)
