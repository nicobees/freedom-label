import { expect, test, vi } from 'vitest';

import { applyTheme, initTheme, toggleTheme } from '../theme';

// Simple setup helper (Arrange) clearing previous theme + storage
const setup = () => {
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
};

test('applyTheme should set attribute and store value', () => {
  setup();
  applyTheme('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem('app-theme')).toBe('dark');

  applyTheme('light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  expect(localStorage.getItem('app-theme')).toBe('light');
});

test('initTheme should use stored theme when present', () => {
  setup();
  localStorage.setItem('app-theme', 'dark');
  mockMatchMedia(false); // prefers-light
  initTheme();
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('initTheme should fall back to system preference: dark', () => {
  setup();
  mockMatchMedia(true); // prefers-dark
  initTheme();
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('initTheme should fall back to system preference: light', () => {
  setup();
  mockMatchMedia(false); // prefers-light
  initTheme();
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});

test('toggleTheme should flip between light and dark', () => {
  setup();
  applyTheme('light');
  toggleTheme();
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem('app-theme')).toBe('dark');

  toggleTheme();
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  expect(localStorage.getItem('app-theme')).toBe('light');
});

test('toggleTheme should set light when attribute absent, then dark on second toggle', () => {
  setup();
  toggleTheme();
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  toggleTheme();
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

// --- Utilities ---
function mockMatchMedia(prefersDark: boolean) {
  const mm = (query: string) => ({
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: prefersDark && query.includes('prefers-color-scheme: dark'),
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
  });
  Object.defineProperty(window, 'matchMedia', {
    value: mm,
    writable: true,
  });
}
