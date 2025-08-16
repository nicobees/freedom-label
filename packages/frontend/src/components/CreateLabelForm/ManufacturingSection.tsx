import { formOptions } from '@tanstack/react-form';

import { defaultValues, withForm } from '../../hooks/useCreateLabelForm';
import { LabelDataSchema } from '../../validation/schema';

const formOptionsObject = formOptions({
  defaultValues,
});

export const ManufacturingSection = withForm({
  ...formOptionsObject,
  render: ({ form }) => {
    return (
      <fieldset className="section" role="group">
        <legend>Manufacturing Info</legend>

        <div className="field">
          <form.AppField
            name="description"
            validators={{
              onChange: LabelDataSchema.shape.description,
            }}
          >
            {(field) => <field.TextField label="Description" />}
          </form.AppField>
        </div>
        <div className="field">
          <form.AppField
            name="production_date"
            validators={{
              onChange: LabelDataSchema.shape.production_date,
            }}
          >
            {(field) => <field.DateField label="Production Date" />}
          </form.AppField>
        </div>
        <div className="field">
          <form.AppField
            name="due_date"
            validators={{
              onChange: LabelDataSchema.shape.due_date,
            }}
          >
            {(field) => <field.DateField label="Due Date" />}
          </form.AppField>
        </div>
      </fieldset>
    );
  },
});
