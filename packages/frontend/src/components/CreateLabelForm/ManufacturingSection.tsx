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
      <div aria-label={label} className="card" role="group">
        <div aria-level={2} className="card__title" role="heading">
          {label}
        </div>
        <div className="card__section field-group manufacturing-fields">
          <form.AppField name="description">
            {(field) => (
              <field.TextField
                className="description-field"
                label="Description"
              />
            )}
          </form.AppField>
          <form.AppField name="batch">
            {(field) => (
              <field.TextField className="batch-field" label="Batch" />
            )}
          </form.AppField>
        </div>
        <div className="card__section field-group date-fields">
          <form.AppField
            name="production_date"
            // validators={{
            //   onChange: LabelDataSchema.shape.production_date,
            // }}
          >
            {(field) => <field.DateField label="Production Date" />}
          </form.AppField>
          <form.AppField
            name="due_date"
            // validators={{
            //   onChange: LabelDataSchema.shape.due_date,
            // }}
          >
            {(field) => <field.DateField label="Due Date" />}
          </form.AppField>
        </div>
      </div>
    );
  },
});
