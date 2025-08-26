import { getRouteApi } from '@tanstack/react-router';

import type { LabelDataSubmit } from '../../validation/schema';

import { defaultValuesFilled } from '../../components/CreateLabelForm/defaultValues';
import { FormDirtyChecker } from '../../components/CreateLabelForm/FormDirtyChecker';
import './create-label.css';
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

  const onCreatePrintLabelResponse = (
    errorMessage?: string,
    filename?: string,
  ) => {
    if (errorMessage) {
      const errorMessageBase = 'Error in printing label';
      const error = errorMessage
        ? `${errorMessageBase}: ${errorMessage}`
        : errorMessageBase;
      showError(error);
    } else {
      const messageBase = 'Label printed successfully';
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
          <ManufacturingSection form={form} />
          <LensSpecSection form={form} />
          <div className="actions">
            {debug ? (
              <button
                aria-disabled="true"
                className="btn btn--outline"
                disabled
                title="Not available yet"
                type="button"
              >
                Save
              </button>
            ) : null}
            <form.PrintButton label="Print" />
            {debug ? (
              <button
                className="btn btn--text"
                onClick={() => form.reset(defaultValuesFilled)}
                type="button"
              >
                Fill form (temp)
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
