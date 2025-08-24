import { formOptions } from '@tanstack/react-form';

import { withForm } from '../../hooks/useCreateLabelForm';
import { defaultValues } from './defaultValues';

const formOptionsObject = formOptions({
  defaultValues,
});

export const PatientInfoSection = withForm({
  ...formOptionsObject,
  render: ({ form }) => {
    const label = 'Patient Info';

    return (
      <div aria-label={label} className="card" role="group">
        <div aria-level={2} className="card__title" role="heading">
          {label}
        </div>
        <div className="card__section field-group">
          <form.AppField name="patient_info.name">
            {(field) => <field.TextField label="Name" />}
          </form.AppField>
          <form.AppField
            name="patient_info.surname"
            // validators={{
            //   onChange: LabelDataSchema.shape.patient_info.shape.surname,
            // }}
          >
            {(field) => <field.TextField label="Surname" />}
          </form.AppField>
        </div>
      </div>
    );
  },
});
