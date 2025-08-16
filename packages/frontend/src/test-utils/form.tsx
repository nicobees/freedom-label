import type { FC } from 'react';

import { render } from '@testing-library/react';

import { PrintButton } from '../components/CreateLabelForm/SubmitButton';
import { useCreateLabelForm } from '../hooks/useCreateLabelForm';

type FormType = ReturnType<typeof useCreateLabelForm>;

// Placeholder for future enhancement: if components require a form Provider,
// wire it here. For now, components under test create their own form instance.
export function FormTestProvider({ El }: { El: FC<{ form: FormType }> }) {
  const form = useCreateLabelForm();

  return <El form={form} />;
}

export function FormTestProviderWithButtons({
  El,
}: {
  El: FC<{ form: FormType }>;
}) {
  const form = useCreateLabelForm();

  return (
    <div>
      <El form={form} />
      <form.AppForm>
        <PrintButton label="Print" />
      </form.AppForm>
    </div>
  );
}

export function renderWithForm(ui: FC<{ form: FormType }>) {
  return render(<FormTestProvider El={ui} />);
}

export function renderWithFormAndButtons(ui: FC<{ form: FormType }>) {
  return render(<FormTestProviderWithButtons El={ui} />);
}
