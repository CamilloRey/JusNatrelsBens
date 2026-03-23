import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current  = i18n.language?.startsWith('en') ? 'en' : 'fr';

  return (
    <div style={{
      display: 'flex', gap: 0, alignItems: 'center',
      borderRadius: 20, border: '1px solid rgba(3,36,22,0.18)',
      overflow: 'hidden', background: 'transparent',
    }}>
      {LANGS.map((lang, idx) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          title={lang.code === 'fr' ? 'Français' : 'English'}
          style={{
            padding:      '5px 11px',
            border:       'none',
            background:   current === lang.code ? '#032416' : 'transparent',
            color:        current === lang.code ? '#fef9ef' : '#424843',
            cursor:       'pointer',
            fontSize:     11,
            fontWeight:   current === lang.code ? 700 : 500,
            transition:   'all 0.18s',
            fontFamily:   "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '0.08em',
            lineHeight:   1,
            borderRight:  idx === 0 ? '1px solid rgba(3,36,22,0.12)' : 'none',
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
