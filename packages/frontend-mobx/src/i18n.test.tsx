import { RouterProvider } from '@tanstack/react-router';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test } from 'vitest';

import { changeLanguage } from './i18n';
import { createMemoryAppRouter } from './routes/index';
import { withProviders } from './test-utils/test-providers';

const setup = (initialEntries: string[] = ['/']) => {
  const user = userEvent.setup();
  const router = createMemoryAppRouter(initialEntries);
  const utils = withProviders(<RouterProvider router={router} />);
  return { user, ...utils };
};

beforeEach(() => {
  // Ensure language persistence tests are isolated
  localStorage.clear();
});

// NOTE: Flat tests (no describe) as per guidelines unless grouping adds clarity

test('should render default English strings', async () => {
  // Arrange
  setup();

  // Assert (implicit Act: initial render)
  expect(
    await screen.findByRole('link', { name: /create label/i }),
  ).toBeInTheDocument();
});

test('should switch to Italian and update visible labels', async () => {
  // Arrange
  const { user } = setup();
  // Act
  // eslint-disable-next-line
  await user.click(
    await screen.findByRole('button', {
      name: /change language|cambia lingua/i,
    }),
  );
  // eslint-disable-next-line
  await user.click(
    // Match either "Italian" (English UI) or "Italiano" (Italian UI)
    await screen.findByRole('option', { name: /italian/i }),
  );

  // Assert
  expect(
    await screen.findByRole('link', { name: /crea etichetta/i }),
  ).toBeInTheDocument();
});

test('should persist selected language across re-mount', async () => {
  // Arrange
  const { unmount, user } = setup();

  // Act
  // eslint-disable-next-line
  await user.click(
    await screen.findByRole('button', {
      name: /change language|cambia lingua/i,
    }),
  );
  // eslint-disable-next-line
  await user.click(await screen.findByRole('option', { name: /italian/i }));
  await screen.findByRole('link', { name: /crea etichetta/i }); // confirm switch
  unmount();
  setup();

  // Assert (language persisted)
  expect(
    await screen.findByRole('link', { name: /crea etichetta/i }),
  ).toBeInTheDocument();
});

test('should update language programmatically (changeLanguage util)', async () => {
  // Arrange
  setup();

  // Act
  changeLanguage('it');

  // Assert
  expect(
    await screen.findByRole('link', { name: /crea etichetta/i }),
  ).toBeInTheDocument();
});

test('should allow switching back to English after Italian', async () => {
  // Arrange
  const { user } = setup();

  // Act - switch to Italian
  // eslint-disable-next-line
  await user.click(
    await screen.findByRole('button', {
      name: /change language|cambia lingua/i,
    }),
  );
  // eslint-disable-next-line
  await user.click(await screen.findByRole('option', { name: /italian/i }));
  await screen.findByRole('link', { name: /crea etichetta/i });

  // Act - open again and choose English
  // eslint-disable-next-line
  await user.click(
    await screen.findByRole('button', {
      name: /change language|cambia lingua/i,
    }),
  );
  // eslint-disable-next-line
  await user.click(
    // Match either "English" (English UI) or "Inglese" (Italian UI)
    await screen.findByRole('option', { name: /english|inglese/i }),
  );

  // Assert - English label back
  expect(
    await screen.findByRole('link', { name: /create label/i }),
  ).toBeInTheDocument();
});
