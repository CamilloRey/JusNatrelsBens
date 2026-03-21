import i18n                  from 'i18next';
import { initReactI18next }  from 'react-i18next';
import LanguageDetector      from 'i18next-browser-languagedetector';
import fr                    from './locales/fr';
import en                    from './locales/en';
import { normalizeTextDeep } from '@/shared/utils/text-normalize';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: normalizeTextDeep(fr) },
      en: { translation: normalizeTextDeep(en) },
    },
    fallbackLng:   'fr',
    supportedLngs: ['fr', 'en'],
    detection: {
      order:  ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'bens-lang',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
