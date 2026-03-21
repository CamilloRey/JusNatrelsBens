import { useTranslation } from 'react-i18next';
import { C }              from '@/shared/constants/colors';

const LANGS = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current  = i18n.language?.startsWith('en') ? 'en' : 'fr';

  return (
    <div style={{ display: 'flex', gap: 1, alignItems: 'center', borderRadius: 16, border: `1px solid rgba(101, 85, 72, 0.3)`, overflow: 'hidden', background: '#fff' }}>
      {LANGS.map(lang => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          title={lang.code === 'fr' ? 'Français' : 'English'}
          style={{
            padding:      '6px 12px',
            border:       'none',
            background:   current === lang.code ? C.hibiscus : 'transparent',
            color:        current === lang.code ? '#fff' : C.muted,
            cursor:       'pointer',
            fontSize:     12,
            fontWeight:   current === lang.code ? 700 : 400,
            transition:   'all 0.2s',
            fontFamily:   'inherit',
            lineHeight:   1,
            borderRadius: 14,
          }}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );
}
