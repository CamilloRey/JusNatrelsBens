// Hook for managing language and translations

import { useState, useEffect } from 'react'
import type { Language } from './translations'
import { getTranslations } from './translations'

export function useLanguage() {
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

  // Save language to localStorage when changed
  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = getTranslations(language)

  return {
    language,
    changeLanguage,
    t,
    mounted,
  }
}
