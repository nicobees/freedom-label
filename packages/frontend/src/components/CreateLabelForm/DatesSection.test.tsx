import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import DatesSection from './DatesSection.tsx';

function setup() {
  render(<DatesSection />);
}

test.skip('should prefill production date and restrict due date to future', async () => {
  // Arrange
  setup();

  // Act

  const prodDay = screen.getByRole<HTMLSelectElement>('combobox', {
    name: 'Production date day',
  });
  const prodMonth = screen.getByRole<HTMLSelectElement>('combobox', {
    name: 'Production date month',
  });
  const prodYear = screen.getByRole<HTMLSelectElement>('combobox', {
    name: 'Production date year',
  });

  await userEvent.selectOptions(prodMonth, '12');
  await userEvent.selectOptions(prodDay, '25');

  // Assert

  // Act
  const dueDay = screen.getByRole<HTMLSelectElement>('combobox', {
    name: 'Due date day',
  });
  const dueMonth = screen.getByRole<HTMLSelectElement>('combobox', {
    name: 'Due date month',
  });
  const dueYear = screen.getByRole<HTMLSelectElement>('combobox', {
    name: 'Due date year',
  });
  await userEvent.selectOptions(dueYear, prodYear.value);
  await userEvent.selectOptions(dueMonth, prodMonth.value);

  // Assert
  const today = new Date();
  const minDay = String(today.getDate());
  expect(
    await within(dueDay).findByRole('option', { name: minDay }),
  ).toBeInTheDocument();
});
