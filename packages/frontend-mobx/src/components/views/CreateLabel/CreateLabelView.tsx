import { useTranslation } from 'react-i18next';

import './create-label.css';
import type { LabelData } from '../../../validation/schema';

import RedoIcon from '../../../assets/icons/redo.svg?react';
import UndoIcon from '../../../assets/icons/undo.svg?react';
import {
  useCreateLabelForm,
  type UseCreateLabelFormProps,
} from '../../../hooks/useCreateLabelForm';
import { LoadingOverlay } from '../../Loading/LoadingOverlay';
import { defaultValuesFilled } from './defaultValues';
import { FormDirtyChecker } from './FormDirtyChecker';
import { LensSpecSection } from './LensSpecSection';
import { ManufacturingSection } from './ManufacturingSection';
import { PatientInfoSection } from './PatientInfoSection';

export type OnPrintCallbackType = (
  errorMessage?: string,
  filename?: string,
) => void;

type CreateLabelProps = {
  debug?: boolean;
  labelData?: LabelData;
  loading: boolean;
  onPrintCallback: OnPrintCallbackType;
  onSaveCallback: UseCreateLabelFormProps['onSave'];
  title: string;
};

export const CreateLabelView = ({
  debug = false,
  labelData,
  loading,
  onPrintCallback,
  onSaveCallback,
  title,
}: CreateLabelProps) => {
  const { t } = useTranslation();

  const {
    form,
    isRedoEmpty,
    isUndoEmpty,
    redoHistory,
    resetFormWithSpecificData,
    undoHistory,
  } = useCreateLabelForm({
    defaultValues: labelData,
    onSave: onSaveCallback,
  });

  return (
    <section className="create-label">
      <button disabled={isUndoEmpty} onClick={undoHistory}>
        <UndoIcon aria-hidden="true" />
      </button>
      <button disabled={isRedoEmpty} onClick={redoHistory}>
        <RedoIcon aria-hidden="true" />
      </button>
      <form aria-label={`${title} Form`} className="create-form" role="form">
        <form.AppForm>
          <PatientInfoSection form={form} />
          <ManufacturingSection form={form} t={t} />
          <LensSpecSection form={form} t={t} />
          <div className="actions">
            <form.PrintButton
              label={t('print')}
              onPrintHandler={onPrintCallback}
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
      <LoadingOverlay loading={loading} />
    </section>
  );
};
