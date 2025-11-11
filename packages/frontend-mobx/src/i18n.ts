import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './assets/locales/en/common.json';
import itCommon from './assets/locales/it/common.json';

// Storage key
const STORAGE_KEY = 'freedom-label:lang';

export const DEFAULT_LANG = 'en';
export const SUPPORTED_LANGS = ['en', 'it'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export function changeLanguage(lng: SupportedLang) {
  void i18n.changeLanguage(lng);
  persistLanguage(lng);
}

export function detectInitialLanguage(): SupportedLang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored as SupportedLang)) {
    return stored as SupportedLang;
  }
  const nav = navigator.language.slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGS.includes(nav as SupportedLang))
    return nav as SupportedLang;
  return DEFAULT_LANG;
}

const resources = {
  en: { common: enCommon },
  it: { common: itCommon },
} as const;

export function initI18n() {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      defaultNS: 'common',
      fallbackLng: DEFAULT_LANG,
      interpolation: {
        escapeValue: false,
        format: function (value: string, format): string {
          if (format === 'uppercase') return value.toUpperCase();
          if (format === 'lowercase') return value.toLowerCase();

          return value;
        },
      },
      lng: detectInitialLanguage(),
      ns: ['common'],
      resources,
      returnEmptyString: false,
    });
  }
  return i18n;
}

export function persistLanguage(lng: SupportedLang) {
  localStorage.setItem(STORAGE_KEY, lng);
}

export { i18n };
