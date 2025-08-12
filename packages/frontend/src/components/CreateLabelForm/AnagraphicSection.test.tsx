import { render, screen, waitFor } from '@testing-library/react';
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
  await waitFor(() => {
    expect(screen.getByText('Name must be 2-30 chars')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByText('Surname must be 2-30 chars')).toBeInTheDocument();
  });

  // Act
  await userEvent.type(name, 'b');
  await userEvent.type(surname, 'c');

  // Assert
  await waitFor(() => {
    expect(
      screen.queryByText('Name must be 2-30 chars'),
    ).not.toBeInTheDocument();
  });
  await waitFor(() => {
    expect(
      screen.queryByText('Surname must be 2-30 chars'),
    ).not.toBeInTheDocument();
  });
});

test('should prefill production date and restrict due date to future', async () => {
  // Arrange
  const { onChange } = setup();

  // Act
  const prodDay = screen.getByLabelText(
    'Production date day',
  ) as HTMLSelectElement;
  const prodMonth = screen.getByLabelText(
    'Production date month',
  ) as HTMLSelectElement;
  const prodYear = screen.getByLabelText(
    'Production date year',
  ) as HTMLSelectElement;
  await userEvent.selectOptions(prodMonth, '12');
  await userEvent.selectOptions(prodDay, '25');

  // Assert
  expect(onChange).toHaveBeenCalled();

  // Act
  const dueDay = screen.getByLabelText('Due date day') as HTMLSelectElement;
  const dueMonth = screen.getByLabelText('Due date month') as HTMLSelectElement;
  const dueYear = screen.getByLabelText('Due date year') as HTMLSelectElement;
  await userEvent.selectOptions(dueYear, prodYear.value);
  await userEvent.selectOptions(dueMonth, prodMonth.value);

  // Assert
  const today = new Date();
  const minDay = String(today.getDate());
  const dueDayOptions = Array.from(dueDay.options).map((o) => o.value);
  expect(dueDayOptions).toContain(minDay);
});
