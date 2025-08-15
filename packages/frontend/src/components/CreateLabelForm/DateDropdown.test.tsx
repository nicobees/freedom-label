/**
 * @vitest-environment jsdom
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import DateDropdown from './DateDropdown.tsx';

function setup(initialValue: { day: number; month: number; year: number }) {
  const onChange = vi.fn();
  render(
    <DateDropdown
      endYear={2030}
      label="Test date"
      onChange={onChange}
      startYear={2020}
      value={initialValue}
    />,
  );
  const daySelect = screen.getByLabelText('Test date day') as HTMLSelectElement;
  const monthSelect = screen.getByLabelText(
    'Test date month',
  ) as HTMLSelectElement;
  const yearSelect = screen.getByLabelText(
    'Test date year',
  ) as HTMLSelectElement;
  return { daySelect, monthSelect, onChange, yearSelect };
}

test('should include Feb 29 for a leap year (2024)', async () => {
  // Arrange
  const { daySelect } = setup({ day: 1, month: 2, year: 2024 });

  // Act: none

  // Assert
  expect(
    await within(daySelect).findByRole('option', { name: '29' }),
  ).toBeInTheDocument();
});

test('should clamp Feb 29 to 28 when switching to non-leap year (2025)', async () => {
  // Arrange
  const user = userEvent.setup();
  const { daySelect, onChange, yearSelect } = setup({
    day: 29,
    month: 2,
    year: 2024,
  });

  // Act: change year to a non-leap year
  await user.selectOptions(yearSelect, '2025');

  // Assert: onChange called with clamped day 28 and UI reflects it
  expect(onChange).toHaveBeenCalled();
  const lastCallArg = onChange.mock.calls[onChange.mock.calls.length - 1][0];
  expect(lastCallArg).toEqual({ day: 28, month: 2, year: 2025 });

  // And the select value is updated to 28
  await screen.findByLabelText('Test date day'); // ensure rerender settled
  expect(daySelect.value).toBe('28');

  // And Feb 29 option is no longer present for 2025
  await waitFor(() => {
    expect(
      within(daySelect).queryByRole('option', { name: '29' }),
    ).not.toBeInTheDocument();
  });
});
