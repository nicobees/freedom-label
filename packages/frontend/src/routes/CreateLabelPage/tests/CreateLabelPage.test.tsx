import { RouterProvider } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { createMemoryAppRouter } from '../../index';

const setup = (initialEntries: string[] = ['/create']) => {
  const router = createMemoryAppRouter(initialEntries);
  const utils = render(<RouterProvider router={router} />);
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
