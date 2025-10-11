import type { TFunction } from 'i18next';
import type { FunctionComponent } from 'react';

import { render } from '@testing-library/react';

import { PrintButton } from '../components/CreateLabelForm/SubmitButton';
import { type FormType, useCreateLabelForm } from '../hooks/useCreateLabelForm';
import { initI18n } from '../i18n';

type RenderWithFormProps = {
  form: FormType;
  t: TFunction;
};

export function renderWithForm(ui: FunctionComponent<RenderWithFormProps>) {
  return render(<FormTestProvider El={ui} />);
}

export function renderWithFormAndButtons(
  ui: FunctionComponent<RenderWithFormProps>,
) {
  return render(<FormTestProviderWithButtons El={ui} />);
}

// Placeholder for future enhancement: if components require a form Provider,
// wire it here. For now, components under test create their own form instance.
function FormTestProvider({
  El,
}: {
  El: FunctionComponent<RenderWithFormProps>;
}) {
  const form = useCreateLabelForm();
  const i18n = initI18n();

  return (
    <form.AppForm>
      <El form={form} t={i18n.t} />
    </form.AppForm>
  );
}

function FormTestProviderWithButtons({
  El,
}: {
  El: FunctionComponent<RenderWithFormProps>;
}) {
  const form = useCreateLabelForm();
  const i18n = initI18n();

  return (
    <form.AppForm>
      <El form={form} t={i18n.t} />
      <PrintButton label="Print" />
    </form.AppForm>
  );
}
