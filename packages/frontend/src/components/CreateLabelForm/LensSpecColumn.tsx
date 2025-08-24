import { formOptions } from '@tanstack/react-form';

import { type FormType, withForm } from '../../hooks/useCreateLabelForm';
import { LensSide } from '../../validation/schema';
import { defaultValues } from './defaultValues';

const formOptionsObject = formOptions({
  defaultValues,
});

const arrowButtonMapping = {
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
  },
  render: ({ form, side }) => {
    const typedSide = side as LensSide;
    const lensSpecSideName = `lens_specs.${typedSide}` as const;
    const lensSpecSideDataName = `${lensSpecSideName}.data` as const;
    const oppositeSide = getOppositeSide(typedSide);

    const onClickHandler = async () => {
      const currentSideData = form.getFieldValue(lensSpecSideDataName);
      const lensSpecOppositeSideName = `lens_specs.${oppositeSide}` as const;
      const oppositeSideData = { data: currentSideData, enabled: true };

      form.setFieldValue(lensSpecOppositeSideName, oppositeSideData);

      await Promise.resolve();

      await form.validateField(`lens_specs.${oppositeSide}` as const, 'change');
      await form.validateField(
        `lens_specs.${oppositeSide}.data` as const,
        'change',
      );

      await form.validate('change');
    };

    const label = `Copy ${typedSide} ${arrowButtonMapping[typedSide]} ${oppositeSide}`;
    const ariaLabel = `Copy lens specs ${typedSide} to ${oppositeSide} `;

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

const LensSpecColumnGridData = withForm({
  ...formOptionsObject,
  props: {
    side: 'left',
  },
  render: ({ form, side }) => {
    const typedSide = side as LensSide;
    const lensSpecSideName = `lens_specs.${typedSide}` as const;
    const lensSpecSideDataName = `${lensSpecSideName}.data` as const;

    const activeCheckboxFieldName = `${lensSpecSideName}.enabled` as const;

    const groupLabel = `${typedSide} Lens Specs Data`;

    return (
      <fieldset aria-label={groupLabel} className="lens-grid" role="group">
        <form.AppField name={`${lensSpecSideDataName}.bc` as const}>
          {(field) => (
            <field.FloatNumberField
              disabled={!field.form.getFieldValue(activeCheckboxFieldName)}
              label="BC"
            />
          )}
        </form.AppField>
        <form.AppField name={`${lensSpecSideDataName}.dia` as const}>
          {(field) => (
            <field.FloatNumberField
              disabled={!field.form.getFieldValue(activeCheckboxFieldName)}
              label="DIA"
            />
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
              disabled={!field.form.getFieldValue(activeCheckboxFieldName)}
              label="CYL"
              withSign
            />
          )}
        </form.AppField>
        <form.AppField name={`${lensSpecSideDataName}.ax` as const}>
          {(field) => (
            <field.FloatNumberField
              disabled={!field.form.getFieldValue(activeCheckboxFieldName)}
              label="AX"
            />
          )}
        </form.AppField>
        <form.AppField name={`${lensSpecSideDataName}.add`}>
          {(field) => (
            <field.FloatNumberField
              disabled={!field.form.getFieldValue(activeCheckboxFieldName)}
              label="ADD"
              withSign
            />
          )}
        </form.AppField>
        <form.AppField name={`${lensSpecSideDataName}.sag` as const}>
          {(field) => (
            <field.FloatNumberField
              disabled={!field.form.getFieldValue(activeCheckboxFieldName)}
              label="SAG"
            />
          )}
        </form.AppField>
      </fieldset>
    );
  },
});

const LensSpecColumnCopyData = withForm({
  ...formOptionsObject,
  props: {
    side: 'left',
  },
  render: ({ form, side }) => {
    const typedSide = side as LensSide;

    return <LensSpecCopyData form={form} side={typedSide} />;
  },
});

export const LensSpecColumn = withForm({
  ...formOptionsObject,
  props: {
    side: 'left',
  },
  render: ({ form, side }) => {
    const typedSide = side as LensSide;
    const base = `lens_specs.${typedSide}` as const;

    const groupLabel = `${typedSide} Lens Specs`;

    return (
      <fieldset aria-label={groupLabel} className="lens-col" role="group">
        <form.AppField name={`${base}.enabled` as const}>
          {(field) => <field.CheckboxField label={`${typedSide} lens`} />}
        </form.AppField>

        <LensSpecColumnGridData
          form={form as unknown as FormType}
          side={typedSide}
        />
        <LensSpecColumnCopyData
          form={form as unknown as FormType}
          side={typedSide}
        />
      </fieldset>
    );
  },
});
