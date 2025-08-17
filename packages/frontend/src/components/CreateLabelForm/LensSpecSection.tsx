import { formOptions } from '@tanstack/react-form';

import { defaultValues, withForm } from '../../hooks/useCreateLabelForm';
import { LensSpecsSchema } from '../../validation/schema';

const formOptionsObject = formOptions({
  defaultValues,
});

export const LensSpecSection = withForm({
  ...formOptionsObject,
  render: ({ form }) => {
    const leftEnabled = Boolean(form.getFieldValue('lens_specs.left'));
    const rightEnabled = Boolean(form.getFieldValue('lens_specs.right'));

    const enableEmptyLens = () => ({
      add: '',
      ax: '',
      bc: '',
      cyl: '',
      dia: '',
      pwr: '',
      sag: '',
    });

    const copyLeftToRight = () => {
      const left = form.getFieldValue('lens_specs.left');
      form.setFieldValue('lens_specs.right', left);
    };
    const copyRightToLeft = () => {
      const right = form.getFieldValue('lens_specs.right');
      form.setFieldValue('lens_specs.left', right);
    };

    return (
      <fieldset className="section" role="group">
        <legend>Lens specs</legend>
        <div className="lens-specs">
          <div className="lens-col">
            <label>
              <input
                aria-label="Left lens enabled"
                checked={leftEnabled}
                onChange={(e) => {
                  const checked = e.target.checked;
                  form.setFieldValue(
                    'lens_specs.left',
                    checked ? enableEmptyLens() : undefined,
                  );
                }}
                type="checkbox"
              />
              Left lens
            </label>

            <div className="grid">
              <form.AppField
                name="lens_specs.left.bc"
                validators={{ onChange: LensSpecsSchema.shape.bc }}
              >
                {(field) => (
                  <field.FloatNumberField disabled={!leftEnabled} label="BC" />
                )}
              </form.AppField>
              <form.AppField
                name="lens_specs.left.pwr"
                validators={{ onChange: LensSpecsSchema.shape.pwr }}
              >
                {(field) => (
                  <field.FloatNumberField
                    disabled={!leftEnabled}
                    label="PWR"
                    withSign
                  />
                )}
              </form.AppField>
              <form.AppField
                name="lens_specs.left.sag"
                validators={{ onChange: LensSpecsSchema.shape.sag }}
              >
                {(field) => (
                  <field.FloatNumberField disabled={!leftEnabled} label="SAG" />
                )}
              </form.AppField>
            </div>
          </div>

          <div className="lens-col">
            <label>
              <input
                aria-label="Right lens enabled"
                checked={rightEnabled}
                onChange={(e) => {
                  const checked = e.target.checked;
                  form.setFieldValue(
                    'lens_specs.right',
                    checked ? enableEmptyLens() : undefined,
                  );
                }}
                type="checkbox"
              />
              Right lens
            </label>

            <div className="grid">
              <form.AppField
                name="lens_specs.right.bc"
                validators={{ onChange: LensSpecsSchema.shape.bc }}
              >
                {(field) => (
                  <field.FloatNumberField disabled={!rightEnabled} label="BC" />
                )}
              </form.AppField>
              <form.AppField
                name="lens_specs.right.pwr"
                validators={{ onChange: LensSpecsSchema.shape.pwr }}
              >
                {(field) => (
                  <field.FloatNumberField
                    disabled={!rightEnabled}
                    label="PWR"
                    withSign
                  />
                )}
              </form.AppField>
              <form.AppField
                name="lens_specs.right.sag"
                validators={{ onChange: LensSpecsSchema.shape.sag }}
              >
                {(field) => (
                  <field.FloatNumberField
                    disabled={!rightEnabled}
                    label="SAG"
                  />
                )}
              </form.AppField>
            </div>
          </div>
        </div>
        <div className="copy-actions">
          <button onClick={copyLeftToRight} type="button">
            Copy left → right
          </button>
          <button onClick={copyRightToLeft} type="button">
            Copy right → left
          </button>
        </div>
      </fieldset>
    );
  },
});
