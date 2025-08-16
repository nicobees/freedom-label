import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import './header.css';
import { useRouter } from '../../hooks/useRouter';

// Pure CSS morphing icon is rendered with spans; see header.css (.morph-icon)

const LanguageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24" {...props}>
    <path
      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10S22 17.52 22 12 17.51 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.34-1.35-3.22A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 0 2.06 1.5 2.71 3.96H9.29C9.94 5.54 11.17 4.04 12 4.04zM4.26 14c-.17-.64-.26-1.31-.26-2s.09-1.36.26-2h3.38a17.1 17.1 0 0 0 0 4H4.26zm1.82 4h2.95c.32 1.25.78 2.34 1.35 3.22A8.03 8.03 0 0 1 6.08 18zM8.74 8h6.52a15.2 15.2 0 0 1 0 8H8.74a15.2 15.2 0 0 1 0-8zM12 19.96c-.83 0-2.06-1.5-2.71-3.96h5.42c-.65 2.46-1.88 3.96-2.71 3.96zM17.92 18a13.7 13.7 0 0 0 1.35-3.22h2.95a8.03 8.03 0 0 1-4.3 3.22zM19.74 10c.17.64.26 1.31.26 2s-.09 1.36-.26 2h-3.38a17.1 17.1 0 0 0 0-4h3.38zM6.08 6a8.03 8.03 0 0 1 4.3-3.22C9.63 3.66 9.17 4.75 8.85 6H5.9z"
      fill="currentColor"
    />
  </svg>
);

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { isHome, title } = useRouter();

  return (
    <header aria-label="Application header" className="fl-header">
      <div className="fl-header__left">
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

      <h1 aria-live="polite" className="fl-header__title">
        {title}
      </h1>

      <div
        className="fl-header__right"
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
          <LanguageIcon />
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
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
