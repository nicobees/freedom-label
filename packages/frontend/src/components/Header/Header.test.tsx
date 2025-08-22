import { RouterProvider } from '@tanstack/react-router';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { createMemoryAppRouter } from '../../routes/index.tsx';
import { withReactQuery } from '../../test-utils/react-query';

const setup = (path: string = '/') => {
  const router = createMemoryAppRouter([path]);
  withReactQuery(<RouterProvider router={router} />);
  return { router };
};

test('should show Home title and disabled menu on home route', async () => {
  // Arrange
  setup('/');

  // Assert
  expect(await screen.findByRole('heading', { name: /home/i })).toBeVisible();
  const menuBtn = screen.getByRole('button', { name: /menu/i });
  expect(menuBtn).toBeDisabled();
  expect(menuBtn).toHaveAttribute('title', 'Not available yet');
});

test('should show back arrow and Create Label title on /create and navigate back', async () => {
  // Arrange
  const user = userEvent.setup();
  setup('/create');

  // Assert (initial)
  expect(
    await screen.findByRole('heading', { name: /create label/i }),
  ).toBeVisible();

  // Act
  const backLink = screen.getByRole('link', { name: /back to home/i });
  await user.click(backLink);

  // Assert (navigated)
  expect(await screen.findByRole('heading', { name: /home/i })).toBeVisible();
});
