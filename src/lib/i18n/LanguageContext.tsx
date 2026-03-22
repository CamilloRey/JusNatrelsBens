import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Language, Translations } from './translations'
import { getTranslations, languages } from './translations'

interface LanguageContextType {
  language: Language
  changeLanguage: (lang: Language) => void
  t: Translations
  languages: typeof languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr')
  const [mounted, setMounted] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved) {
      setLanguage(saved)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'en' || browserLang === 'es') {
        setLanguage(browserLang as Language)
      }
    }
    setMounted(true)
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  if (!mounted) {
    return <>{children}</>
  }

  const value: LanguageContextType = {
    language,
    changeLanguage,
    t: getTranslations(language),
    languages,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
