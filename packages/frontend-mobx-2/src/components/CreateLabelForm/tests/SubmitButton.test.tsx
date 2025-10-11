import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { renderWithFormAndButtons } from '../../../test-utils/form';
import { PatientInfoSection } from '../PatientInfoSection';

test('should be disabled initially (pristine and untouched)', async () => {
  // Arrange
  renderWithFormAndButtons(PatientInfoSection);

  // Assert
  const btn = await screen.findByRole('button', { name: /print/i });
  expect(btn).toBeDisabled();
});

test.skip('should enable after user touches fields and call handleSubmit on click', async () => {
  // Arrange
  const user = userEvent.setup();

  renderWithFormAndButtons(PatientInfoSection);

  const name = await screen.findByRole('textbox', { name: 'Name' });
  const surname = await screen.findByRole('textbox', { name: 'Surname' });
  const btn = await screen.findByRole('button', { name: /print/i });

  // Initially disabled
  expect(btn).toBeDisabled();

  // Act - fill both fields to become valid
  await user.type(name, 'Jo');
  await user.type(surname, 'Do');

  // Assert - becomes enabled (not pristine and touched)
  expect(await screen.findByRole('button', { name: /print/i })).toBeEnabled();

  // Act - click
  await user.click(btn);

  // TODO: Implement proper assertion for submission when submit handler is available
});
