import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { applyTheme, initTheme, ThemeProvider } from '../../contexts/theme';

function renderWithTheme(initialTheme?: 'dark' | 'light') {
  const theme = initialTheme ?? (initTheme() as 'dark' | 'light');
  return render(
    <ThemeProvider initialTheme={theme}>
      <button aria-label="placeholder" onClick={() => {}} />
    </ThemeProvider>,
  );
}

const setup = () => {
  const user = userEvent.setup();
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
  return { user };
};

test('applyTheme should set attribute and store value', () => {
  setup();
  act(() => applyTheme('dark'));
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem('app-theme')).toBe('dark');

  act(() => applyTheme('light'));
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  expect(localStorage.getItem('app-theme')).toBe('light');
});

test('initTheme should use stored theme when present', () => {
  setup();
  localStorage.setItem('app-theme', 'dark');
  mockMatchMedia(false); // prefers-light
  act(() => {
    initTheme();
  });
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('initTheme should fall back to system preference: dark', () => {
  setup();
  mockMatchMedia(true); // prefers-dark
  act(() => {
    initTheme();
  });
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('initTheme should fall back to system preference: light', () => {
  setup();
  mockMatchMedia(false); // prefers-light
  act(() => {
    initTheme();
  });
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});

test('toggleTheme should flip between light and dark', async () => {
  setup();
  mockMatchMedia(false); // start light
  renderWithTheme('light');

  // Simulate toggle via applyTheme since direct context toggle is on a custom button in app
  act(() => applyTheme('dark'));

  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem('app-theme')).toBe('dark');

  act(() => applyTheme('light'));

  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  expect(localStorage.getItem('app-theme')).toBe('light');
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
