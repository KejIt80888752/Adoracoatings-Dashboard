import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TRANSLATIONS, type Lang, type TranslationKey } from '@/lib/translations'

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: (key: TranslationKey) => string }
const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: k => k })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('adora_lang') as Lang) || 'en')

  useEffect(() => { localStorage.setItem('adora_lang', lang) }, [lang])

  const t = (key: TranslationKey) => TRANSLATIONS[key]?.[lang] ?? TRANSLATIONS[key]?.en ?? key

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export const useLanguage = () => useContext(Ctx)
