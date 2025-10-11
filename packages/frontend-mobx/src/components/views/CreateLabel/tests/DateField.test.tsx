import type { FC } from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import type { useCreateLabelForm } from '../../../../hooks/useCreateLabelForm';

import { renderWithForm } from '../../../../test-utils/form';

const ProductionDateSetup: FC<{
  form: ReturnType<typeof useCreateLabelForm>['form'];
}> = ({ form }) => (
  <form.AppForm>
    <form.AppField name="production_date">
      {(field) => <field.DateField label="Production Date" />}
    </form.AppField>
  </form.AppForm>
);

test('should clamp day when changing month to one with fewer days (31 -> 30)', async () => {
  // Arrange
  renderWithForm(ProductionDateSetup);
  const daySelect = screen.getByRole<HTMLSelectElement>('combobox', {
    name: /production date day/i,
  });
  const monthSelect = screen.getByRole('combobox', {
    name: /production date month/i,
  });

  // Act: ensure month is January and pick day 31
  await userEvent.selectOptions(monthSelect, '1');
  await userEvent.selectOptions(daySelect, '31');

  // Sanity check the selected value is 31
  expect(daySelect.value).toBe('31');

  // Act: change month to April (30 days)
  await userEvent.selectOptions(monthSelect, '4');

  // Assert: day should clamp to 30
  await waitFor(() => {
    expect(daySelect.value).toBe('30');
  });
});

test('should clamp 29 Feb to 28 when switching from leap year to non-leap year', async () => {
  // Arrange
  renderWithForm(ProductionDateSetup);
  const daySelect = screen.getByRole<HTMLSelectElement>('combobox', {
    name: /production date day/i,
  });
  const monthSelect = screen.getByRole<HTMLSelectElement>('combobox', {
    name: /production date month/i,
  });
  const yearSelect = screen.getByRole<HTMLSelectElement>('combobox', {
    name: /production date year/i,
  });

  // Act: select February in a leap year and set day to 29
  await userEvent.selectOptions(yearSelect, '2028');
  await userEvent.selectOptions(monthSelect, '2');
  await userEvent.selectOptions(daySelect, '29');
  expect(daySelect.value).toBe('29');

  // Act: switch year to a non-leap year (2029)
  await userEvent.selectOptions(yearSelect, '2029');

  // Assert: day should clamp to 28
  await waitFor(() => {
    expect(daySelect.value).toBe('28');
  });
});
