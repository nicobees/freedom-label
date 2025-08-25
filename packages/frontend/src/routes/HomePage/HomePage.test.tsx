import { RouterProvider } from '@tanstack/react-router';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { withProviders } from '../../test-utils/test-providers';
import { createMemoryAppRouter } from '../index';

// Shared Arrange helper following the testing guide
const setup = (initialEntries: string[] = ['/']) => {
  const user = userEvent.setup();
  const router = createMemoryAppRouter(initialEntries);
  const utils = withProviders(<RouterProvider router={router} />);
  return { router, user, ...utils };
};

test('should render actions and show Label List as disabled with tooltip', async () => {
  // Arrange
  setup(['/']);

  // Assert
  expect(
    await screen.findByRole('link', { name: /create label/i }),
  ).toBeInTheDocument();

  const disabled = screen.getByRole('link', { name: /label list/i });
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
    await screen.findByRole('heading', { level: 1, name: /create label/i }),
  ).toBeInTheDocument();
});
