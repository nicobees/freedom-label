/**
 * Accessibility testing helpers.
 *
 * Use these utilities during local debugging to inspect and assert accessible roles
 * in rendered output. Keep calls to debug helpers out of committed test code unless
 * explicitly needed for diagnostics.
 */
import { getRoles, logRoles } from '@testing-library/dom';
import { expect } from 'vitest';

/** Assert that at least one element with the given role exists. */
export function assertHasRole(container: HTMLElement, role: string) {
  const roles = getRoles(container);
  expect(roles[role], `No elements found with role="${role}"`).toBeDefined();
  expect(roles[role]?.length ?? 0).toBeGreaterThan(0);
}

/** Assert that the count of elements with the given role matches exactly. */
export function assertRoleCount(
  container: HTMLElement,
  role: string,
  count: number,
) {
  const roles = getRoles(container);
  const actual = roles[role]?.length ?? 0;
  expect(
    actual,
    `Expected ${count} element(s) with role="${role}", got ${actual}`,
  ).toBe(count);
}

/**
 * Logs available roles to the console and returns the roles map.
 * Prefer using this only while debugging.
 */
export function debugRoles(container: HTMLElement) {
  logRoles(container);
  return getRoles(container);
}
