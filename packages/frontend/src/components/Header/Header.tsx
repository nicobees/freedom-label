import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import './header.css';
import { useRouter } from '../../hooks/useRouter';
import { useTheme } from '../../utils/theme';

// Pure CSS morphing icon is rendered with spans; see header.css (.morph-icon)

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { isHome, title } = useRouter();

  const { themeIcon, toggle: toggleTheme } = useTheme();

  return (
    <header aria-label="Application header" className="toolbar fl-header">
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
              aria-label="Menu"
              className="icon-btn"
              disabled
              title="Not available yet"
              type="button"
            />
          ) : (
            <Link aria-label="Back to Home" className="icon-btn back" to="/" />
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
          aria-label="Change language"
          className="icon-btn"
          onClick={() => setLangOpen((v) => !v)}
          ref={buttonRef}
          type="button"
        >
          🌐
        </button>
        <button
          aria-label="Toggle theme"
          className="icon-btn"
          onClick={() => toggleTheme()}
          type="button"
        >
          {/* Simple icon swap via currentColor, could be improved */}
          <span aria-hidden="true">{themeIcon}</span>
        </button>
        {langOpen ? (
          <div
            aria-label="Language selector"
            className="lang-dropdown"
            role="dialog"
          >
            <ul aria-label="Languages" className="lang-list" role="listbox">
              <li
                aria-selected="true"
                className="lang-item"
                onClick={() => setLangOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setLangOpen(false);
                }}
                role="option"
                tabIndex={0}
              >
                English
              </li>
              {/* <li
                aria-selected="true"
                className="lang-item"
                onClick={() => setLangOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setLangOpen(false);
                }}
                role="option"
                tabIndex={0}
              >
                Italian
              </li> */}
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
