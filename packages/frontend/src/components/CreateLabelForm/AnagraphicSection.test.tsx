import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import AnagraphicSection from './AnagraphicSection.tsx';

function setup(
  initial?: Partial<Parameters<typeof AnagraphicSection>[0]['value']>,
) {
  const onChange = vi.fn();
  const value = {
    due_date: '',
    name: '',
    production_date: '',
    surname: '',
    ...initial,
  };
  render(<AnagraphicSection onChange={onChange} value={value} />);
  return { onChange };
}

test('should debounce and validate name and surname', async () => {
  // Arrange
  setup();
  const name = screen.getByLabelText('Name');
  const surname = screen.getByLabelText('Surname');

  // Act
  await userEvent.type(name, 'A');
  await userEvent.type(surname, 'B');

  // Assert
  const nameStatus = await screen.findByRole('status', { name: /Name error/i });
  const surnameStatus = await screen.findByRole('status', {
    name: /Surname error/i,
  });
  expect(nameStatus).toBeInTheDocument();
  expect(surnameStatus).toBeInTheDocument();

  // Act

  await userEvent.type(name, 'b');
  await userEvent.type(surname, 'c');

  // Assert
  await waitFor(() => {
    expect(
      screen.queryByRole('status', { name: /Name error/i }),
    ).not.toBeInTheDocument();
  });
  await waitFor(() => {
    expect(
      screen.queryByRole('status', { name: /Surname error/i }),
    ).not.toBeInTheDocument();
  });
});

test('should prefill production date and restrict due date to future', async () => {
  // Arrange
  const { onChange } = setup();

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
  expect(onChange).toHaveBeenCalled();

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
