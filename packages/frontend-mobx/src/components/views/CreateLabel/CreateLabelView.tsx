import merge from 'lodash/merge';
import { observer } from 'mobx-react-lite';

import './create-label.css';
import { useRef, useTransition } from 'react';
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
import { AiModal } from '../../AiModal/AiModal';
import { Button } from '../../atoms/Button/Button';
import { LoadingOverlay } from '../../Loading/LoadingOverlay';
import { defaultValuesFilled, getDefaultValues } from './defaultValues';
import { FormDirtyChecker } from './FormDirtyChecker';
import { LensSpecSection } from './LensSpecSection';
import { ManufacturingSection } from './ManufacturingSection';
import { PatientInfoSection } from './PatientInfoSection';
import { UndoRedoHistory } from './UndoRedoHistory';

const IS_DEMO_MODE = import.meta.env?.VITE_DEMO_MODE === 'true';

export type OnPrintCallbackType = (
  errorMessage?: string,
  filename?: string,
) => void;

type CreateLabelProps = {
  debug?: boolean;
  labelData?: LabelData;
  loading: boolean;
  onlyViewMode?: boolean;
  onPrintCallback: OnPrintCallbackType;
  onSaveCallback: UseCreateLabelFormProps['onSave'];
  title: string;
};

const OverLayer = () => {
  return <div aria-hidden="true" className="create-label__view-only-overlay" />;
};

const CreateLabelViewComponent = ({
  debug = false,
  labelData,
  loading,
  onlyViewMode = false,
  onPrintCallback,
  onSaveCallback,
  title,
}: CreateLabelProps) => {
  const { t } = useTranslation();
  const [, startTransition] = useTransition();

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

  const printButtonTooltip = IS_DEMO_MODE
    ? `${t('print')} ${String(t('disabledInDemoMode'))}`
    : t('print');

  return (
    <section className="create-label-container">
      <aside className="left-sidebar-create-label"></aside>
      <section className="central-create-label">
        {onlyViewMode ? <OverLayer /> : null}
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
                disabled={onlyViewMode || IS_DEMO_MODE}
                label={t('print')}
                onPrintHandler={onPrintCallback}
                tooltip={printButtonTooltip}
              />
              <form.SaveButton disabled={onlyViewMode} label={t('save')} />
              {debug ? (
                <Button
                  label={t('fillFormTemp')}
                  onClick={() => {
                    startTransition(async () => {
                      await resetFormWithSpecificData(
                        defaultValuesFilled(),
                        form,
                      );
                    });
                  }}
                  variant="text"
                />
              ) : null}
            </div>
            <FormDirtyChecker form={form} />
          </form.AppForm>
        </form>
        <LoadingOverlay loading={loading} />
      </section>
      <aside className="right-sidebar-create-label">
        <AiModal
          autoFillFormCallback={(data) => {
            startTransition(async () => {
              const result = merge(getDefaultValues(), data);
              await resetFormWithSpecificData(result, form);
            });
          }}
        />
      </aside>
    </section>
  );
};

export const CreateLabelView = observer(CreateLabelViewComponent);
