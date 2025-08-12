import { RouterProvider } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { createMemoryAppRouter } from '../../routes/index.tsx';

describe('Header', () => {
  test('shows Home title and disabled menu on home route', async () => {
    const router = createMemoryAppRouter(['/']);
    render(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: /home/i })).toBeVisible();
    const menuBtn = screen.getByRole('button', { name: /menu/i });
    expect(menuBtn).toBeDisabled();
  expect(menuBtn).toHaveAttribute('title', 'Not available yet');
  });

  test('shows back arrow and Create Label title on /create and navigates back', async () => {
    const user = userEvent.setup();
    const router = createMemoryAppRouter(['/create']);
    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole('heading', { name: /create label/i }),
    ).toBeVisible();

    const backLink = screen.getByRole('link', { name: /back to home/i });
    await user.click(backLink);

    expect(await screen.findByRole('heading', { name: /home/i })).toBeVisible();
  });
});
