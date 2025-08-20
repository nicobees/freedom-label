import { formOptions } from '@tanstack/react-form';

import { withForm } from '../../hooks/useCreateLabelForm';
import { defaultValues } from './defaultValues';

const formOptionsObject = formOptions({
  defaultValues,
});

export const ManufacturingSection = withForm({
  ...formOptionsObject,
  render: ({ form }) => {
    const label = 'Manufacturing Info';

    return (
      <fieldset aria-label={label} className="section" role="group">
        <legend>{label}</legend>

        <div className="field">
          <form.AppField name="description">
            {(field) => <field.TextField label="Description" />}
          </form.AppField>
        </div>
        <div className="field">
          <form.AppField name="batch">
            {(field) => <field.TextField label="Batch" />}
          </form.AppField>
        </div>
        <div className="field">
          <form.AppField
            name="production_date"
            // validators={{
            //   onChange: LabelDataSchema.shape.production_date,
            // }}
          >
            {(field) => <field.DateField label="Production Date" />}
          </form.AppField>
        </div>
        <div className="field">
          <form.AppField
            name="due_date"
            // validators={{
            //   onChange: LabelDataSchema.shape.due_date,
            // }}
          >
            {(field) => <field.DateField label="Due Date" />}
          </form.AppField>
        </div>
      </fieldset>
    );
  },
});
