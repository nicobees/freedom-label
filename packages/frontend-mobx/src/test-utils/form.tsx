import type { TFunction } from 'i18next';
import type { FunctionComponent } from 'react';

import { PrintButton } from '../components/views/CreateLabel/PrintButton';
import { type FormType, useCreateLabelForm } from '../hooks/useCreateLabelForm';
import { initI18n } from '../i18n';
import { withRootStoreWrapper } from './mobx-store';

type RenderWithFormProps = {
  form: FormType;
  t: TFunction;
};

export function renderWithForm(ui: FunctionComponent<RenderWithFormProps>) {
  return withRootStoreWrapper(<FormTestProvider El={ui} />);
}

export function renderWithFormAndButtons(
  ui: FunctionComponent<RenderWithFormProps>,
) {
  return withRootStoreWrapper(<FormTestProviderWithButtons El={ui} />);
}

// Placeholder for future enhancement: if components require a form Provider,
// wire it here. For now, components under test create their own form instance.
function FormTestProvider({
  El,
}: {
  El: FunctionComponent<RenderWithFormProps>;
}) {
  const { form } = useCreateLabelForm({ onSave: () => {} });
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
  const { form } = useCreateLabelForm({ onSave: () => {} });
  const i18n = initI18n();

  return (
    <form.AppForm>
      <El form={form} t={i18n.t} />
      <PrintButton label="Print" onPrintHandler={() => {}} />
    </form.AppForm>
  );
}
