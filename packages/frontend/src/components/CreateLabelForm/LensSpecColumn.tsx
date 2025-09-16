import type { TFunction } from 'i18next';

import { formOptions, useStore } from '@tanstack/react-form';

import {
  type FormType,
  useFormContext,
  withForm,
} from '../../hooks/useCreateLabelForm';
import { LensSide, type LensSpecsData } from '../../validation/schema';
import { defaultValues } from './defaultValues';

const formOptionsObject = formOptions({
  defaultValues: defaultValues(),
});

const arrowButtonMapping: Record<LensSide, string> = {
  [LensSide.Left]: '→',
  [LensSide.Right]: '←',
};

const getOppositeSide = (side: LensSide): LensSide => {
  return side === 'left' ? 'right' : 'left';
};

const LensSpecCopyData = withForm({
  ...formOptionsObject,
  props: {
    side: 'left',
    t: ((key: string) => key) as TFunction,
  },
  render: ({ form, side, t }) => {
    const typedSide = side as LensSide;
    const lensSpecSideName = `lens_specs.${typedSide}` as const;
    const lensSpecSideDataName = `${lensSpecSideName}.data` as const;
    const oppositeSide = getOppositeSide(typedSide);

    const onClickHandler = async () => {
      const currentSideData = form.getFieldValue(
        lensSpecSideDataName,
      ) as LensSpecsData;
      const lensSpecOppositeSideName = `lens_specs.${oppositeSide}` as const;
      const oppositeSideData = {
        data: currentSideData,
        enabled: true,
      };

      form.setFieldValue(lensSpecOppositeSideName, oppositeSideData);

      await Promise.resolve();

      await form.validateField(`lens_specs.${oppositeSide}` as const, 'change');
      await form.validateField(
        `lens_specs.${oppositeSide}.data` as const,
        'change',
      );

      await form.validate('change');
    };

    const copyLabel = t('copy');
    const fromLabel = t('from');
    const toLabel = t('to');
    const sideLabel = t(typedSide);
    const oppositeSideLabel = t(oppositeSide);
    const label = `${copyLabel} ${sideLabel} ${arrowButtonMapping[typedSide]} ${oppositeSideLabel}`;
    const lensSpecsLabel = t('lensSpecs');
    const ariaLabel = `${copyLabel} ${lensSpecsLabel} ${fromLabel} ${sideLabel} ${toLabel} ${oppositeSideLabel}`;

    return (
      <div className="copy-actions">
        <button
          aria-label={ariaLabel}
          className="btn btn--filled"
          onClick={() => void onClickHandler()}
          type="button"
        >
          {label}
        </button>
      </div>
    );
  },
});

const LensSpecColumnGridDataWrapper = ({
  form,
  side,
  t,
}: {
  form: FormType;
  side: LensSide;
  t: TFunction;
}) => {
  const typedSide = side;
  const formObject = useFormContext() as unknown as FormType;

  const isEnabled = useStore(
    formObject.store,
    (state): boolean => state.values.lens_specs[typedSide].enabled,
  );

  return (
    <LensSpecColumnGridData
      form={form}
      isEnabled={isEnabled}
      side={typedSide}
      t={t}
    />
  );
};

const LensSpecColumnGridData = withForm({
  ...formOptionsObject,
  props: {
    isEnabled: false,
    side: 'left',
    t: ((key: string) => key) as TFunction,
  },
  render: ({ form, isEnabled, side, t }) => {
    const typedSide = side as LensSide;
    const lensSpecSideName = `lens_specs.${typedSide}` as const;
    const lensSpecSideDataName = `${lensSpecSideName}.data` as const;

    const activeCheckboxFieldName = `${lensSpecSideName}.enabled` as const;

    const groupLabelKey = `${typedSide}LensSpecsData` as const;
    const groupLabel = t(groupLabelKey);

    return (
      <fieldset aria-label={groupLabel} className="lens-grid" role="group">
        <div className="toric-wrapper-container">
          <form.AppField name={`${lensSpecSideDataName}.bc` as const}>
            {(field) => (
              <field.FloatNumberField disabled={!isEnabled} label="BC" />
            )}
          </form.AppField>
          {' / '}
          <form.AppField name={`${lensSpecSideDataName}.bc_toric` as const}>
            {(field) => (
              <field.FloatNumberField
                disabled={!isEnabled}
                label="BC Toric"
                overwriteToNull={true}
                showLabel={false}
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name={`${lensSpecSideDataName}.dia` as const}>
          {(field) => (
            <field.FloatNumberField disabled={!isEnabled} label="DIA" />
          )}
        </form.AppField>
        <form.AppField name={`${lensSpecSideDataName}.pwr`}>
          {(field) => (
            <field.FloatNumberField
              disabled={!field.form.getFieldValue(activeCheckboxFieldName)}
              label="PWR"
              withSign
            />
          )}
        </form.AppField>
        <form.AppField name={`${lensSpecSideDataName}.cyl`}>
          {(field) => (
            <field.FloatNumberField
              disabled={!isEnabled}
              label="CYL"
              withSign
            />
          )}
        </form.AppField>
        <form.AppField name={`${lensSpecSideDataName}.ax` as const}>
          {(field) => (
            <field.FloatNumberField disabled={!isEnabled} label="AX" />
          )}
        </form.AppField>
        <form.AppField name={`${lensSpecSideDataName}.add`}>
          {(field) => (
            <field.FloatNumberField
              disabled={!isEnabled}
              label="ADD"
              withSign
            />
          )}
        </form.AppField>
        <div className="toric-wrapper-container">
          <form.AppField name={`${lensSpecSideDataName}.sag` as const}>
            {(field) => (
              <field.FloatNumberField disabled={!isEnabled} label="SAG" />
            )}
          </form.AppField>
          {' / '}
          <form.AppField name={`${lensSpecSideDataName}.sag_toric` as const}>
            {(field) => (
              <field.FloatNumberField
                disabled={!isEnabled}
                label="SAG Toric"
                overwriteToNull={true}
                showLabel={false}
              />
            )}
          </form.AppField>
        </div>
      </fieldset>
    );
  },
});

const LensSpecColumnCopyData = withForm({
  ...formOptionsObject,
  props: {
    side: 'left',
    t: ((key: string) => key) as TFunction,
  },
  render: ({ form, side, t }) => {
    const typedSide = side as LensSide;

    return <LensSpecCopyData form={form} side={typedSide} t={t} />;
  },
});

export const LensSpecColumn = withForm({
  ...formOptionsObject,
  props: {
    side: 'left',
    t: ((key: string) => key) as TFunction,
  },
  render: ({ form, side, t }) => {
    const typedSide = side as LensSide;
    const base = `lens_specs.${typedSide}` as const;

    const groupLabelKey = `${typedSide}LensSpecs` as const;
    const groupLabel = t(groupLabelKey);

    const checkboxLabelKey = `${typedSide}Lens` as const;
    const checkboxLabel = t(checkboxLabelKey);

    return (
      <fieldset aria-label={groupLabel} className="lens-col" role="group">
        <form.AppField name={`${base}.enabled` as const}>
          {(field) => <field.CheckboxField label={checkboxLabel} />}
        </form.AppField>

        <LensSpecColumnGridDataWrapper
          form={form as unknown as FormType}
          side={typedSide}
          t={t}
        />
        <LensSpecColumnCopyData
          form={form as unknown as FormType}
          side={typedSide}
          t={t}
        />
      </fieldset>
    );
  },
});
