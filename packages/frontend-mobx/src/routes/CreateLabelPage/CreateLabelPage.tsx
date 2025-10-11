import type { AnyFieldMeta } from '@tanstack/react-form';

import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import type { LabelDataSubmit } from '../../validation/schema';

import { defaultValuesFilled } from '../../components/CreateLabelForm/defaultValues';
import './create-label.css';
import { FormDirtyChecker } from '../../components/CreateLabelForm/FormDirtyChecker';
import { LensSpecSection } from '../../components/CreateLabelForm/LensSpecSection';
import { ManufacturingSection } from '../../components/CreateLabelForm/ManufacturingSection';
import { PatientInfoSection } from '../../components/CreateLabelForm/PatientInfoSection';
import { LoadingOverlay } from '../../components/Loading/LoadingOverlay';
import { useFeedback } from '../../contexts/FeedbackContext';
import { useCreateLabelForm } from '../../hooks/useCreateLabelForm';
import { useLabelLocalStorage } from '../../hooks/useLabelLocalStorage';
import { useRouter } from '../../hooks/useRouter';
import { useCreatePrintMutation } from '../../services/api';

const route = getRouteApi('/create');

export default function CreateLabelPage() {
  const { title } = useRouter();
  const { saveLabel } = useLabelLocalStorage();
  const { showError, showSuccess } = useFeedback();
  const { debug } = route.useSearch();
  const { t } = useTranslation();

  const onCreatePrintLabelResponse = (
    errorMessage?: string,
    filename?: string,
  ) => {
    if (errorMessage) {
      const errorMessageBase = t('errorInPrintingLabel');
      const error = errorMessage
        ? `${errorMessageBase}: ${errorMessage}`
        : errorMessageBase;
      showError(error);
    } else {
      const messageBase = t('labelPrintedSuccessfully');
      const message = filename ? `${messageBase}: ${filename}` : messageBase;
      showSuccess(message);
    }
  };

  const { loading, mutate: createPrintLabel } = useCreatePrintMutation({
    onMutationHandler: onCreatePrintLabelResponse,
  });

  const onSubmitHandler = (data: LabelDataSubmit) => {
    createPrintLabel(data);
    saveLabel(data);
  };

  const form = useCreateLabelForm(onSubmitHandler);

  return (
    <section className="create-label">
      <form aria-label={`${title} Form`} className="create-form" role="form">
        <form.AppForm>
          <PatientInfoSection form={form} />
          <ManufacturingSection form={form} t={t} />
          <LensSpecSection form={form} t={t} />
          <div className="actions">
            {debug ? (
              <button
                aria-disabled="true"
                className="btn btn--outline"
                disabled
                title={t('notAvailableYet')}
                type="button"
              >
                {t('save')}
              </button>
            ) : null}
            <form.PrintButton label={t('print')} />
            {debug ? (
              <button
                className="btn btn--text"
                onClick={() => {
                  form.reset(defaultValuesFilled(), {
                    keepDefaultValues: true,
                  });
                  const meta = form.getFieldMeta(
                    'patient_info.name',
                  ) as AnyFieldMeta;
                  form.setFieldMeta('patient_info.name', {
                    ...meta,
                    isDirty: true,
                  });
                  void form.validate('change');
                }}
                type="button"
              >
                {t('fillFormTemp')}
              </button>
            ) : null}
          </div>
          <FormDirtyChecker form={form} />
        </form.AppForm>
      </form>
      <LoadingOverlay loading={loading} />
    </section>
  );
}
