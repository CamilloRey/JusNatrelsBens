'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

export function LanguageSwitcher() {
  const { language, changeLanguage, languages } = useLanguage()

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          style={{
            padding: '8px 12px',
            border: language === lang.code ? '2px solid #e91e63' : '1px solid #ddd',
            background: language === lang.code ? '#fff' : '#f5f5f5',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: language === lang.code ? 600 : 400,
            color: language === lang.code ? '#e91e63' : '#666',
            transition: 'all 0.2s',
          }}
          title={lang.name}
        >
          {lang.flag} {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
