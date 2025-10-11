import { getRouteApi } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import './create-label.css';
import type { LabelDataSubmit } from '../../validation/schema';

import { defaultValuesFilled } from '../../components/CreateLabelForm/defaultValues';
import { FormDirtyChecker } from '../../components/CreateLabelForm/FormDirtyChecker';
import { LensSpecSection } from '../../components/CreateLabelForm/LensSpecSection';
import { ManufacturingSection } from '../../components/CreateLabelForm/ManufacturingSection';
import { PatientInfoSection } from '../../components/CreateLabelForm/PatientInfoSection';
import { LoadingOverlay } from '../../components/Loading/LoadingOverlay';
import { useFeedback } from '../../contexts/FeedbackContext';
import { useCreateLabelForm } from '../../hooks/useCreateLabelForm';
import { useRouter } from '../../hooks/useRouter';
import { useRootStore } from '../../stores';

const route = getRouteApi('/create');

const CreateLabelPage = () => {
  const { title } = useRouter();
  const { showError, showSuccess } = useFeedback();
  const { debug } = route.useSearch();
  const { t } = useTranslation();

  const { lensesStore } = useRootStore();

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

  const onSubmitHandler = (data: LabelDataSubmit) => {
    lensesStore.addLens(data);
  };

  const { form, resetFormWithSpecificData } =
    useCreateLabelForm(onSubmitHandler);

  return (
    <section className="create-label">
      <form aria-label={`${title} Form`} className="create-form" role="form">
        <form.AppForm>
          <PatientInfoSection form={form} />
          <ManufacturingSection form={form} t={t} />
          <LensSpecSection form={form} t={t} />
          <div className="actions">
            <form.PrintButton
              label={t('print')}
              onPrintHandler={onCreatePrintLabelResponse}
            />
            <form.SaveButton label={t('save')} />
            {debug ? (
              <button
                className="btn btn--text"
                onClick={() => {
                  resetFormWithSpecificData(defaultValuesFilled(), form);
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
      <LoadingOverlay loading={lensesStore.loadingPrintApi} />
    </section>
  );
};

export default observer(CreateLabelPage);
