import type { Dispatch, RefObject } from 'react';

import { useTranslation } from 'react-i18next';

import { changeLanguage, SUPPORTED_LANGS } from '../../../i18n';

type LanguageDropdownProps = {
  buttonRef: RefObject<HTMLButtonElement | null>;
  opened: boolean;
  setDropdownOpen: Dispatch<React.SetStateAction<boolean>>;
};

export const LanguageDropdown = ({
  buttonRef,
  opened,
  setDropdownOpen,
}: LanguageDropdownProps) => {
  const { i18n, t } = useTranslation('common');

  if (!opened) return null;

  return (
    <div
      aria-label={t('languageSelector')}
      className="lang-dropdown"
      role="dialog"
    >
      <ul aria-label={t('languages')} className="lang-list" role="listbox">
        {SUPPORTED_LANGS.map((lng) => {
          const selected = i18n.language === lng;
          const labelKey = lng === 'en' ? 'english' : 'italian';
          return (
            <li
              aria-selected={selected}
              className="lang-item"
              key={lng}
              onClick={() => {
                changeLanguage(lng);
                setDropdownOpen(false);
                buttonRef.current?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  changeLanguage(lng);
                  setDropdownOpen(false);
                  buttonRef.current?.focus();
                }
              }}
              role="option"
              tabIndex={0}
            >
              {t(labelKey)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
