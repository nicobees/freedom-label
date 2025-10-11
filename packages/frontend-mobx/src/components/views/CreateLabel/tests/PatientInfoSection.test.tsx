import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { renderWithForm } from '../../../../test-utils/form';
import { PatientInfoSection } from '../PatientInfoSection';

function setup() {
  renderWithForm(PatientInfoSection);
}

test('should validate name and surname', async () => {
  // Arrange
  setup();
  const name = screen.getByLabelText('Name');
  const surname = screen.getByLabelText('Surname');

  // Act
  await userEvent.type(name, 'A');
  await userEvent.type(surname, 'B');

  // Assert
  const nameStatus = await screen.findByRole('status', { name: 'Name error' });
  const surnameStatus = await screen.findByRole('status', {
    name: 'Surname error',
  });
  expect(nameStatus).toBeInTheDocument();
  expect(surnameStatus).toBeInTheDocument();

  // Act

  await userEvent.type(name, 'b');
  await userEvent.type(surname, 'c');

  // Assert
  await waitFor(() => {
    expect(
      screen.queryByRole('status', { name: 'Name error' }),
    ).not.toBeInTheDocument();
  });
  await waitFor(() => {
    expect(
      screen.queryByRole('status', { name: 'Surname error' }),
    ).not.toBeInTheDocument();
  });
});
