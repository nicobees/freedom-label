import '@testing-library/jest-dom/vitest';

// Initialize i18n so tests render translated text (default English)
import { initI18n } from './src/i18n';

initI18n();

// Mock window.matchMedia for theme detection tests
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    addEventListener: () => {},
    addListener: () => {}, // Deprecated but may be used by some libraries
    dispatchEvent: () => true,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: () => {},
    removeListener: () => {}, // Deprecated but may be used by some libraries
  }),
  writable: true,
});

class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  configurable: true,
  value: IntersectionObserver,
  writable: true,
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
  configurable: true,
  value: IntersectionObserver,
  writable: true,
});
