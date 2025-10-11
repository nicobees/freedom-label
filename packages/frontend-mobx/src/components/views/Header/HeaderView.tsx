import { Link } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './header.css';
import { useRootStore } from '../../../stores';
import { LanguageDropdown } from './LanguageDropdown';

// Pure CSS morphing icon is rendered with spans; see header.css (.morph-icon)

type HeaderViewProps = {
  isHome?: boolean;
  title: string;
};

const HeaderView = ({ isHome = false, title }: HeaderViewProps) => {
  const [langOpen, setLangOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { themeStore } = useRootStore();
  const { i18n, t } = useTranslation('common');

  const currentLanguage = i18n.language;

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
          {currentLanguage.toUpperCase()}
        </button>
        <button
          aria-label={t('toggleTheme')}
          className="icon-btn"
          onClick={() => themeStore.toggle()}
          type="button"
        >
          {/* Simple icon swap via currentColor, could be improved */}
          <span aria-hidden="true">{themeStore.themeIcon}</span>
        </button>
        <LanguageDropdown
          buttonRef={buttonRef}
          opened={langOpen}
          setDropdownOpen={setLangOpen}
        />
      </div>
    </header>
  );
};

export default observer(HeaderView);
