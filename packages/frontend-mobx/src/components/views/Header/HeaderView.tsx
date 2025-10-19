import { Link, useCanGoBack, useRouter } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './header.css';
import { useRootStore } from '../../../stores';
import { LanguageDropdown } from './LanguageDropdown';

// Pure CSS morphing icon is rendered with spans; see header.css (.morph-icon)

type HeaderViewProps = {
  isHome?: boolean;
  title: string;
};

const MessageBadge = ({
  viewMessage,
}: {
  viewMessage: null | {
    detail: string;
    header: string;
    type: 'info' | 'warning';
  };
}) => {
  if (!viewMessage) return null;

  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className="fl-header__message-badge medium-screen-size"
      role="alert"
    >
      <div
        className={`fl-header__message-badge--content fl-header__message-badge--${viewMessage.type}`}
      >
        <div className="fl-header__message-header">{viewMessage.header}</div>
        <div className="fl-header__message-detail">{viewMessage.detail}</div>
      </div>
    </div>
  );
};

const HeaderView = ({ isHome = false, title }: HeaderViewProps) => {
  const [langOpen, setLangOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const router = useRouter();
  const canGoBackHistory = useCanGoBack();

  const { headerStore, themeStore } = useRootStore();
  const { i18n, t } = useTranslation('common');

  const currentLanguage = i18n.language;

  useEffect(() => {
    const undoRedoPortalElement = document.getElementById(
      headerStore.portalElementId,
    );

    headerStore.setUndoRedoPortalElement(undoRedoPortalElement);
  }, [headerStore, t]);

  return (
    <header aria-label={t('applicationHeader')} className="toolbar fl-header">
      <div
        className="fl-header__left toolbar__actions"
        style={{ '--fl-header-column-count': '1' } as React.CSSProperties}
      >
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
              onClick={(e) => {
                if (canGoBackHistory) {
                  e.preventDefault();
                  router.history.back();
                  return false;
                }
              }}
              title={t('backToHome')}
              to="/"
            />
          )}
        </div>
      </div>
      <div
        className="fl-header__spacer"
        style={{ '--fl-header-column-count': '2' } as React.CSSProperties}
      ></div>
      <div
        className="fl-header__center"
        style={{ '--fl-header-column-count': '2' } as React.CSSProperties}
      >
        <div className="fl-header__portal" id={headerStore.portalElementId} />
        <div
          className="fl-header__spacer"
          style={{ '--fl-header-column-count': '2' } as React.CSSProperties}
        ></div>

        <h1 aria-live="polite" className="fl-header__title toolbar__title">
          {title}
        </h1>
        <div
          className="fl-header__spacer"
          style={{ '--fl-header-column-count': '4' } as React.CSSProperties}
        ></div>

        {/* Spacer to act as the 4th grid item and keep title centered when no buttons on left or right */}
        <MessageBadge viewMessage={headerStore.viewMessage} />
      </div>
      <div
        className="fl-header__spacer"
        style={{ '--fl-header-column-count': '4' } as React.CSSProperties}
      ></div>
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
