import { RouterProvider } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { createMemoryAppRouter } from '../index.tsx';

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
    screen.getByRole('group', { name: /anagraphic/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('group', { name: /lens specs/i }),
  ).toBeInTheDocument();
});

test('should render Save (disabled) and Print buttons', async () => {
  // Arrange
  setup(['/create']);

  // Assert
  const save = await screen.findByRole('button', { name: /save/i });
  expect(save).toHaveAttribute('aria-disabled', 'true');
  expect(save).toHaveAttribute('title', 'Not available yet');
  expect(
    await screen.findByRole('button', { name: /print/i }),
  ).toBeInTheDocument();
});
