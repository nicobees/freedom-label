import { expect, test } from 'vitest';

import {
  daysInMonth,
  formatDateToFullDateString,
  fromDate,
  isFutureOrToday,
  parseDDMMYYYY,
  tripleToDate,
} from './date';

test('daysInMonth should return correct number of days including leap years', () => {
  expect(daysInMonth(2, 2024)).toBe(29);
  expect(daysInMonth(2, 2023)).toBe(28);
  expect(daysInMonth(1, 2023)).toBe(31);
  expect(daysInMonth(4, 2023)).toBe(30);
});

test('formatDateToFullDateString should format with leading zeros', () => {
  expect(formatDateToFullDateString({ day: 3, month: 7, year: 2025 })).toBe(
    '03/07/2025',
  );
});

test('fromDate and tripleToDate should be inverses for valid dates', () => {
  const d = new Date(2025, 6, 3);
  const triple = fromDate(d);
  expect(triple).toEqual({ day: 3, month: 7, year: 2025 });
  const back = tripleToDate(triple);
  expect(back.getFullYear()).toBe(2025);
  expect(back.getMonth()).toBe(6);
  expect(back.getDate()).toBe(3);
});

test('parseDDMMYYYY should parse valid format and return null for invalid', () => {
  expect(parseDDMMYYYY('03/07/2025')).toEqual({ day: 3, month: 7, year: 2025 });
  expect(parseDDMMYYYY('3/7/2025')).toBeNull();
  expect(parseDDMMYYYY('2025-07-03')).toBeNull();
});

test('isFutureOrToday should compare against provided today date', () => {
  const today = new Date(2025, 6, 3); // 03/07/2025
  expect(isFutureOrToday({ day: 3, month: 7, year: 2025 }, today)).toBe(true);
  expect(isFutureOrToday({ day: 4, month: 7, year: 2025 }, today)).toBe(true);
  expect(isFutureOrToday({ day: 2, month: 7, year: 2025 }, today)).toBe(false);
});
