import { expect, test } from 'vitest';

import {
  getItemFromLocalStorage,
  isItemInLocalStorage,
  setItemToLocalStorage,
} from '../localStorage';

// Shared setup helper clearing storage & removing potential DOM artifacts
const setup = () => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
};

test('should return false when key not present and true after setting it', () => {
  setup();
  const KEY = 'k1';
  expect(isItemInLocalStorage(KEY)).toBe(false);
  setItemToLocalStorage(KEY, 'value');
  expect(isItemInLocalStorage(KEY)).toBe(true);
});

test('should store and retrieve primitive string value', () => {
  setup();
  const KEY = 'primitive';
  setItemToLocalStorage(KEY, 'hello');
  expect(getItemFromLocalStorage(KEY)).toBe('hello');
});

test('should return null for missing key', () => {
  setup();
  expect(getItemFromLocalStorage('missing')).toBeNull();
});

test('should store and revive Map structure', () => {
  setup();
  const KEY = 'map-key';
  const map = new Map<string, { n: number }>([
    ['a', { n: 1 }],
    ['b', { n: 2 }],
  ]);
  setItemToLocalStorage(KEY, map);
  const revived = getItemFromLocalStorage<Map<string, { n: number }>>(KEY);
  expect(revived).toBeInstanceOf(Map);
  expect(revived?.get('a')).toEqual({ n: 1 });
  expect(revived?.get('b')).toEqual({ n: 2 });
});

test('should fallback to raw string when stored JSON is invalid', () => {
  setup();
  const KEY = 'invalid-json';
  // Manually inject malformed JSON bypassing wrapper
  localStorage.setItem(KEY, '{"incomplete"');
  // Expect raw string returned
  expect(getItemFromLocalStorage(KEY)).toBe('{"incomplete"');
});
