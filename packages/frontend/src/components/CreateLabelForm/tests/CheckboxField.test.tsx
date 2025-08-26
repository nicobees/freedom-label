import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { renderWithForm } from '../../../test-utils/form';
import { LensSide } from '../../../validation/schema';
import { LensSpecColumn } from '../LensSpecColumn';

function setupLeftColumn() {
  return renderWithForm(({ form, t }) => (
    <LensSpecColumn form={form} side={LensSide.Left} t={t} />
  ));
}

test('checkbox toggles only when clicking the checkbox, not the text label', async () => {
  setupLeftColumn();

  const checkbox = screen.getByRole('checkbox', {
    name: /left lens/i,
  });
  const labelText = screen.getByText(/left lens/i);

  // Initially checked (from default values)
  expect(checkbox).toBeChecked();

  // Click the checkbox to uncheck
  await userEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();

  // Clicking the text currently should NOT toggle (label not bound via htmlFor)
  await userEvent.click(labelText);
  expect(checkbox).not.toBeChecked();

  // Clicking the checkbox toggles back on
  await userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});
