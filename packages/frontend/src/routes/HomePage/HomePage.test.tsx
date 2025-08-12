import { RouterProvider } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { createMemoryAppRouter } from '../index.tsx';

// Shared Arrange helper following the testing guide
const setup = (initialEntries: string[] = ['/']) => {
  const user = userEvent.setup();
  const router = createMemoryAppRouter(initialEntries);
  const utils = render(<RouterProvider router={router} />);
  return { router, user, ...utils };
};

test('should render actions and show Label List as disabled with tooltip', async () => {
  // Arrange
  setup(['/']);

  // Assert
  expect(
    await screen.findByRole('link', { name: /create label/i }),
  ).toBeInTheDocument();

  const disabled = screen.getByRole('button', { name: /label list/i });
  expect(disabled).toHaveAttribute('aria-disabled', 'true');
  expect(disabled).toHaveAttribute('title', 'Not available yet');
});

test('should navigate to /create when clicking Create Label', async () => {
  // Arrange
  const { user } = setup(['/']);

  // Act
  const link = await screen.findByRole('link', { name: /create label/i });
  await user.click(link);

  // Assert
  expect(
    await screen.findByText(/Form will be implemented/i),
  ).toBeInTheDocument();
});
