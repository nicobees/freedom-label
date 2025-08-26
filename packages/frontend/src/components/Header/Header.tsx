import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../contexts/theme';
import { useRouter } from '../../hooks/useRouter';
import { changeLanguage, SUPPORTED_LANGS } from '../../i18n';
import './header.css';

// Pure CSS morphing icon is rendered with spans; see header.css (.morph-icon)

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { isHome, title } = useRouter();
  const { i18n, t } = useTranslation('common');

  const { themeIcon, toggle: toggleTheme } = useTheme();

  return (
    <header aria-label={t('applicationHeader')} className="toolbar fl-header">
      <div className="fl-header__left toolbar__actions">
        <div className="icon-shell">
          <input
            aria-hidden="true"
            checked={!isHome}
            className="icon-toggle"
            readOnly
            tabIndex={-1}
            type="checkbox"
          />
          <span aria-hidden="true" className="icon-visual">
            <span className="slice slice--top" />
            <span className="slice slice--mid" />
            <span className="slice slice--bot" />
          </span>
          {isHome ? (
            <button
              aria-label={t('menu')}
              className="icon-btn"
              disabled
              title={t('notAvailableYet')}
              type="button"
            />
          ) : (
            <Link
              aria-label={t('backToHome')}
              className="icon-btn back"
              title={t('backToHome')}
              to="/"
            />
          )}
        </div>
      </div>

      <h1 aria-live="polite" className="fl-header__title toolbar__title">
        {title}
      </h1>

      <div
        className="fl-header__right toolbar__actions"
        onBlur={(e) => {
          const next = (e.relatedTarget as Node | null) ?? null;
          if (next && groupRef.current?.contains(next)) return;
          setLangOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setLangOpen(false);
            buttonRef.current?.focus();
          }
        }}
        ref={groupRef}
      >
        <button
          aria-expanded={langOpen}
          aria-haspopup="listbox"
          aria-label={t('changeLanguage')}
          className="icon-btn"
          onClick={() => setLangOpen((v) => !v)}
          ref={buttonRef}
          type="button"
        >
          🌐
        </button>
        <button
          aria-label={t('toggleTheme')}
          className="icon-btn"
          onClick={() => toggleTheme()}
          type="button"
        >
          {/* Simple icon swap via currentColor, could be improved */}
          <span aria-hidden="true">{themeIcon}</span>
        </button>
        {langOpen ? (
          <div
            aria-label={t('languageSelector')}
            className="lang-dropdown"
            role="dialog"
          >
            <ul aria-label="Languages" className="lang-list" role="listbox">
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
                      setLangOpen(false);
                      buttonRef.current?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        changeLanguage(lng);
                        setLangOpen(false);
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
        ) : null}
      </div>
    </header>
  );
}
