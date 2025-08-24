import { RouterProvider } from '@tanstack/react-router';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { withReactQuery } from '../../../test-utils/react-query';
import { createMemoryAppRouter } from '../../index';

const setup = (initialEntries: string[] = ['/create']) => {
  const router = createMemoryAppRouter(initialEntries);
  const utils = withReactQuery(<RouterProvider router={router} />);
  return { router, ...utils };
};

// Ensure the main form structure renders with both sections and actions
// Behavior/validation will be covered in dedicated stories

test('should render Create Label form with anagraphic and lens sections', async () => {
  // Arrange
  setup(['/create']);

  // Assert
  expect(
    await screen.findByRole('form', { name: /create label form/i }),
  ).toBeInTheDocument();

  expect(
    await screen.findByRole('group', { name: /patient info/i }),
  ).toBeInTheDocument();

  expect(screen.getByRole('group', { name: 'Lens specs' })).toBeInTheDocument();
});

test('should render Save (disabled) and Print buttons', async () => {
  // Arrange
  setup(['/create']);

  // Assert
  const save = await screen.findByRole('button', { name: /save/i });
  expect(save).toBeDisabled();
  expect(save).toHaveAttribute('title', 'Not available yet');

  expect(
    await screen.findByRole('button', { name: /print/i }),
  ).toBeInTheDocument();
});

test('should update Print button disable state based on the form validity', async () => {
  // Arrange
  const user = userEvent.setup();
  setup(['/create']);

  const print = await screen.findByRole('button', { name: /print/i });
  expect(print).toBeDisabled();

  const fillFormTempButton = screen.getByRole('button', {
    name: 'Fill form (temp)',
  });
  await user.click(fillFormTempButton);

  expect(print).toBeEnabled();
});

test('should store printed label data into localStorage when Print clicked after filling form', async () => {
  // Arrange
  localStorage.clear();
  const user = userEvent.setup();
  setup(['/create']);

  const print = await screen.findByRole('button', { name: /print/i });
  const fillFormTempButton = screen.getByRole('button', {
    name: 'Fill form (temp)',
  });

  // Act
  await user.click(fillFormTempButton); // fills form & enables print
  expect(print).toBeEnabled();
  await user.click(print);

  // Assert
  // The hook uses key 'freedom-label:printed-labels:v1' storing a Map serialized
  const raw = localStorage.getItem('freedom-label:printed-labels:v1');
  expect(raw).toBeTruthy();
  // Basic structural checks without depending on full data shape
  expect(raw).toContain('"dataType":"Map"');
  // Parse and ensure at least one entry exists
  const parsed = JSON.parse(raw!);
  expect(parsed.value?.length).toBeGreaterThan(0);
});
