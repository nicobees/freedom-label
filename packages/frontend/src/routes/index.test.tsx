import { RouterProvider } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { createMemoryAppRouter } from './index';

// Setup helper to avoid repetition in Arrange phase
const setup = (initialPath: string) => {
  const router = createMemoryAppRouter([initialPath]);
  const utils = render(<RouterProvider router={router} />);
  return { router, ...utils };
};

test('should render Home at root path', async () => {
  // Arrange
  setup('/');

  // Assert
  expect(
    await screen.findByRole('heading', { name: /home/i }),
  ).toBeInTheDocument();
});

test('should render Create Label at /create', async () => {
  // Arrange
  setup('/create');

  // Assert
  expect(
    await screen.findByRole('heading', { name: /create label/i }),
  ).toBeInTheDocument();
});

test('should render Not Found for unknown route', async () => {
  // Arrange
  setup('/does-not-exist');

  // Assert
  expect(
    await screen.findByRole('heading', { name: /not found/i }),
  ).toBeInTheDocument();
});

test('should render List Label disabled page at /list', async () => {
  // Arrange
  setup('/list');

  // Assert
  expect(
    await screen.findByRole('heading', { name: /list label/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/not available yet/i)).toBeInTheDocument();
});
