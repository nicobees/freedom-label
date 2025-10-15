import { observer } from 'mobx-react-lite';

import './create-label.css';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import type { LabelData } from '../../../validation/schema';

import {
  useCreateLabelForm,
  type UseCreateLabelFormProps,
} from '../../../hooks/useCreateLabelForm';
import {
  CUSTOM_THRESHOLD_ARRAY,
  useIntersectionObserver,
} from '../../../hooks/useIntersectionObserver';
import { useRootStore } from '../../../stores';
import { LoadingOverlay } from '../../Loading/LoadingOverlay';
import { defaultValuesFilled } from './defaultValues';
import { FormDirtyChecker } from './FormDirtyChecker';
import { LensSpecSection } from './LensSpecSection';
import { ManufacturingSection } from './ManufacturingSection';
import { PatientInfoSection } from './PatientInfoSection';
import { UndoRedoHistory } from './UndoRedoHistory';

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

const CreateLabelViewComponent = ({
  debug = false,
  labelData,
  loading,
  onPrintCallback,
  onSaveCallback,
  title,
}: CreateLabelProps) => {
  const { t } = useTranslation();

  const { headerStore } = useRootStore();
  const undoRedoRef = useRef<HTMLDivElement | null>(null);
  const undoRedoInView = useIntersectionObserver({
    rootMargin: '-80px 0px 0px 0px',
    targetRef: undoRedoRef,
    threshold: CUSTOM_THRESHOLD_ARRAY,
  });

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

  const UndoRedoComponent = (
    <UndoRedoHistory
      onRedoCallback={redoHistory}
      onUndoCallback={undoHistory}
      redoDisabled={isRedoEmpty}
      ref={undoRedoRef}
      undoDisabled={isUndoEmpty}
      visible={undoRedoInView}
      wrapperClassName={`history-actions-slot ${undoRedoInView ? '' : 'is-hidden'}`}
    />
  );

  const UndoRedoComponentPortal = (
    <UndoRedoHistory
      buttonClassName="btn--filled"
      onRedoCallback={redoHistory}
      onUndoCallback={undoHistory}
      redoDisabled={isRedoEmpty}
      undoDisabled={isUndoEmpty}
      visible={!undoRedoInView}
      wrapperClassName={`history-actions history-actions--clone ${
        undoRedoInView ? '' : 'is-visible'
      }`}
    />
  );

  return (
    <section className="create-label">
      {UndoRedoComponent}
      {headerStore.undoRedoPortalElement
        ? createPortal(
            UndoRedoComponentPortal,
            headerStore.undoRedoPortalElement,
          )
        : null}

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

export const CreateLabelView = observer(CreateLabelViewComponent);
