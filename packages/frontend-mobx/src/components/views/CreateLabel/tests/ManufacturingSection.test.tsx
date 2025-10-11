import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { renderWithForm } from '../../../../test-utils/form';
import { ManufacturingSection } from '../ManufacturingSection';

function setup() {
  renderWithForm(ManufacturingSection);
}

test('should render manufacturing section with description and date fields', async () => {
  // Arrange
  setup();

  // Assert
  expect(
    screen.getByRole('group', { name: /manufacturing info/i }),
  ).toBeInTheDocument();

  // Description input
  expect(screen.getByRole('textbox', { name: /description/i })).toBeVisible();

  // Production date selects
  expect(
    screen.getByRole('combobox', { name: /production date day/i }),
  ).toBeVisible();
  expect(
    screen.getByRole('combobox', { name: /production date month/i }),
  ).toBeVisible();
  expect(
    screen.getByRole('combobox', { name: /production date year/i }),
  ).toBeVisible();

  // Due date selects
  expect(screen.getByRole('combobox', { name: /due date day/i })).toBeVisible();
  expect(
    screen.getByRole('combobox', { name: /due date month/i }),
  ).toBeVisible();
  expect(
    screen.getByRole('combobox', { name: /due date year/i }),
  ).toBeVisible();
});

test('should validate description on change and clear error when valid', async () => {
  // Arrange
  setup();
  const description = screen.getByRole('textbox', { name: /description/i });

  // Act - type too short
  await userEvent.type(description, 'A');

  // Assert - error shows
  const descError = await screen.findByRole('status', {
    name: /description error/i,
  });
  expect(descError).toBeInTheDocument();

  // Act - make it valid (min length 2)
  await userEvent.type(description, 'B');

  // Assert - error disappears
  await waitFor(() => {
    expect(
      screen.queryByRole('status', { name: /description error/i }),
    ).not.toBeInTheDocument();
  });
});
