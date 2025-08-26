import { RouterProvider } from '@tanstack/react-router';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { applyTheme, initTheme } from '../../contexts/theme';
import { createMemoryAppRouter } from '../../routes';
import { withProviders } from '../../test-utils/test-providers';

const setup = (initialEntries: string[] = ['/']) => {
  const user = userEvent.setup();
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();

  const router = createMemoryAppRouter(initialEntries);
  const utils = withProviders(<RouterProvider router={router} />);
  return { router, user, ...utils };
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

test('toggleTheme should flip between light and dark', async () => {
  const { user } = setup();
  const themeButton = await screen.findByRole('button', {
    name: /toggle theme/i,
  });
  await user.click(themeButton);

  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem('app-theme')).toBe('dark');

  await user.click(themeButton);

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
