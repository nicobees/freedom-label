import { Link, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

import './header.css';

// Minimal icon set as inline SVGs for now; later can be moved to assets
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24" {...props}>
    <path
      d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
      fill="currentColor"
    />
  </svg>
);

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24" {...props}>
    <path
      d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z"
      fill="currentColor"
    />
  </svg>
);

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const matches = useRouterState({ select: (s) => s.matches });
  const titleProvider = [...matches].reverse().find((m) => m.context.getTitle);
  const title = titleProvider?.context?.getTitle?.() ?? 'Freedom Label';

  const isHomeProvider = [...matches]
    .reverse()
    .find((m) => m.context.getIsHome);
  const isHome = !!isHomeProvider?.context?.getIsHome?.();

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      const inside = dropdownRef.current?.contains(target ?? document.body);
      if (!inside && langOpen) setLangOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [langOpen]);

  return (
    <header aria-label="Application header" className="fl-header">
      <div className="fl-header__left">
        {isHome ? (
          <button
            aria-label="Menu"
            className="icon-btn"
            disabled
            title="Not available yet"
            type="button"
          >
            <MenuIcon />
          </button>
        ) : (
          <Link aria-label="Back to Home" className="icon-btn back" to="/">
            <BackIcon />
          </Link>
        )}
      </div>

      <h1 aria-live="polite" className="fl-header__title">
        {title}
      </h1>

      <div className="fl-header__right" ref={dropdownRef}>
        <button
          aria-expanded={langOpen}
          aria-haspopup="listbox"
          aria-label="Change language"
          className="icon-btn"
          onClick={() => setLangOpen((v) => !v)}
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
