import { getRoles, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { renderWithForm } from '../../../test-utils/form';
import { LensSpecSection } from '../LensSpecSection';

function setup() {
  renderWithForm(LensSpecSection);
}

test('renders Lens specs section with left and right columns', async () => {
  setup();

  expect(screen.getByRole('group', { name: 'Lens specs' })).toBeInTheDocument();

  // Two BC inputs (left/right)
  const bcInputs = screen.getAllByRole('textbox', { name: /bc/i });
  expect(bcInputs.length).toBe(2);

  // Two PWR number inputs (left/right)
  const pwrInputs = screen.getAllByRole('textbox', { name: /pwr/i });
  expect(pwrInputs.length).toBe(2);

  // Two sign selects for PWR
  const signSelects = screen.getAllByRole('button', { name: /pwr sign/i });
  expect(signSelects.length).toBe(2);
});

test('validates PWR format on change', async () => {
  setup();

  const [leftPwrInput] = screen.getAllByRole('textbox', { name: /pwr/i });

  // Type invalid value (requires two decimals)
  await userEvent.type(leftPwrInput, '1.2');

  const err = await screen.findByRole('status', { name: /pwr error/i });
  expect(err).toHaveTextContent(/invalid pwr format/i);

  // Fix it
  await userEvent.clear(leftPwrInput);
  await userEvent.type(leftPwrInput, '1.25');

  await waitFor(() => {
    expect(screen.queryByRole('status', { name: /pwr error/i })).toBeNull();
  });
});

test('copy left → right duplicates values', async () => {
  setup();

  const [leftBc, rightBc] = screen.getAllByRole('textbox', { name: /bc/i });
  const [leftPwr, rightPwr] = screen.getAllByRole('textbox', { name: /pwr/i });
  const [leftPwrSign, rightPwrSign] = screen.getAllByLabelText(/pwr sign/i);
  const [leftSag, rightSag] = screen.getAllByRole('textbox', { name: /sag/i });

  // Fill LEFT values
  await userEvent.type(leftBc, '8.60');
  // Click to ensure it's '+' (default should be '+', but let's be explicit)
  if (!leftPwrSign.textContent?.includes('+')) {
    await userEvent.click(leftPwrSign);
  }
  await userEvent.type(leftPwr, '1.25');
  await userEvent.type(leftSag, '10.00');

  // Click copy
  const copyBtn = screen.getByRole('button', {
    name: /copy lens specs left to right/i,
  });
  await userEvent.click(copyBtn);

  // Assert RIGHT mirrored
  expect(rightBc).toHaveValue('8.60');
  expect(rightPwrSign).toHaveTextContent('+');
  expect(rightPwr).toHaveValue('1.25');
  expect(rightSag).toHaveValue('10.00');
});

test('copy right to left duplicates values', async () => {
  setup();

  const [leftBc, rightBc] = screen.getAllByRole('textbox', { name: /bc/i });
  const [leftPwr, rightPwr] = screen.getAllByRole('textbox', { name: /pwr/i });
  const [leftPwrSign, rightPwrSign] = screen.getAllByLabelText(/pwr sign/i);
  const [leftSag, rightSag] = screen.getAllByRole('textbox', { name: /sag/i });

  // Fill RIGHT values
  await userEvent.type(rightBc, '8.70');
  // Click to toggle to '-'
  await userEvent.click(rightPwrSign); // Should toggle from '+' to '-'
  await userEvent.type(rightPwr, '2.00');
  await userEvent.type(rightSag, '11.50');

  // Click copy
  const copyBtn = screen.getByRole('button', {
    name: /copy lens specs right to left/i,
  });
  await userEvent.click(copyBtn);

  // Assert LEFT mirrored
  expect(leftBc).toHaveValue('8.70');
  expect(leftPwrSign).toHaveTextContent('-');
  expect(leftPwr).toHaveValue('2.00');
  expect(leftSag).toHaveValue('11.50');
});

test('a11y roles snapshot for lens specs', () => {
  const { container } = renderWithForm(LensSpecSection);
  const roles = getRoles(container);
  // Basic presence checks instead of giant snapshots
  expect(Object.keys(roles)).toEqual(
    expect.arrayContaining(['group', 'checkbox', 'textbox', 'button']),
  );
});

test('disable toggle keeps values visible and re-enable preserves them', async () => {
  setup();

  const leftToggle = screen.getByRole('checkbox', {
    name: /left lens/i,
  });

  const [leftBc] = screen.getAllByRole('textbox', { name: /bc/i });
  const [leftPwr] = screen.getAllByRole('textbox', { name: /pwr/i });
  const [leftPwrSign] = screen.getAllByLabelText(/pwr sign/i);
  const [leftSag] = screen.getAllByRole('textbox', { name: /sag/i });

  // Fill LEFT values
  await userEvent.type(leftBc, '8.88');
  // Click to ensure it's '+'
  if (!leftPwrSign.textContent?.includes('+')) {
    await userEvent.click(leftPwrSign);
  }
  await userEvent.type(leftPwr, '3.25');
  await userEvent.type(leftSag, '12.34');

  // Disable LEFT
  await userEvent.click(leftToggle);

  // Re-query to avoid stale element references
  const [leftBcAfter] = screen.getAllByRole('textbox', { name: /bc/i });
  const [leftPwrAfter] = screen.getAllByRole('textbox', { name: /pwr/i });
  const [leftPwrSignAfter] = screen.getAllByLabelText(/pwr sign/i);
  const [leftSagAfter] = screen.getAllByRole('textbox', { name: /sag/i });

  // Values should remain visible in the fields after disabling
  expect(leftBcAfter).toHaveValue('8.88');
  expect(leftPwrSignAfter).toHaveTextContent('+');
  expect(leftPwrAfter).toHaveValue('3.25');
  expect(leftSagAfter).toHaveValue('12.34');

  // Re-enable LEFT (re-query to avoid stale reference)
  const leftToggleAgain = screen.getByRole('checkbox', {
    name: /left lens/i,
  });
  await userEvent.click(leftToggleAgain);

  const [leftBcEnabled] = screen.getAllByRole('textbox', { name: /bc/i });
  const [leftPwrEnabled] = screen.getAllByRole('textbox', { name: /pwr/i });
  const [leftPwrSignEnabled] = screen.getAllByLabelText(/pwr sign/i);
  const [leftSagEnabled] = screen.getAllByRole('textbox', { name: /sag/i });

  // Values remain intact after re-enable
  expect(leftBcEnabled).toHaveValue('8.88');
  expect(leftPwrSignEnabled).toHaveTextContent('+');
  expect(leftPwrEnabled).toHaveValue('3.25');
  expect(leftSagEnabled).toHaveValue('12.34');
});
