import type { FC } from 'react';

import { render } from '@testing-library/react';

import { PrintButton } from '../components/CreateLabelForm/SubmitButton';
import { type FormType, useCreateLabelForm } from '../hooks/useCreateLabelForm';

export function renderWithForm(ui: FC<{ form: FormType }>) {
  return render(<FormTestProvider El={ui} />);
}

export function renderWithFormAndButtons(ui: FC<{ form: FormType }>) {
  return render(<FormTestProviderWithButtons El={ui} />);
}

// Placeholder for future enhancement: if components require a form Provider,
// wire it here. For now, components under test create their own form instance.
function FormTestProvider({ El }: { El: FC<{ form: FormType }> }) {
  const form = useCreateLabelForm();

  return (
    <form.AppForm>
      <El form={form} />
    </form.AppForm>
  );
}

function FormTestProviderWithButtons({ El }: { El: FC<{ form: FormType }> }) {
  const form = useCreateLabelForm();

  return (
    <form.AppForm>
      <El form={form} />
      <PrintButton label="Print" />
    </form.AppForm>
  );
}
