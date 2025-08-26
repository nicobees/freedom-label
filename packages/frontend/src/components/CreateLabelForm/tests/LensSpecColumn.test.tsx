import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { renderWithForm } from '../../../test-utils/form';
import { LensSide } from '../../../validation/schema';
import { LensSpecColumn } from '../LensSpecColumn';

function setupBothSides() {
  return renderWithForm(({ form, t }) => (
    <div>
      <LensSpecColumn form={form} side={LensSide.Left} t={t} />
      <LensSpecColumn form={form} side={LensSide.Right} t={t} />
    </div>
  ));
}

test('copy left → right duplicates bc and dia values', async () => {
  setupBothSides();

  const [leftBc, rightBc] = screen.getAllByRole('textbox', { name: /bc/i });
  const [leftDia, rightDia] = screen.getAllByRole('textbox', { name: /dia/i });

  await userEvent.clear(leftBc);
  await userEvent.type(leftBc, '8.60');
  await userEvent.clear(leftDia);
  await userEvent.type(leftDia, '16.20');

  const copyBtn = screen.getByRole('button', {
    name: /copy lens specs from left to right/i,
  });
  await userEvent.click(copyBtn);

  await waitFor(() => expect(rightBc).toHaveValue('8.60'));
  await waitFor(() => expect(rightDia).toHaveValue('16.20'));
});
