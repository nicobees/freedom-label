import { formOptions } from '@tanstack/react-form';

import { withForm } from '../../hooks/useCreateLabelForm';
import { defaultValues } from './defaultValues';

const formOptionsObject = formOptions({
  defaultValues,
});

export const PatientInfoSection = withForm({
  ...formOptionsObject,
  render: ({ form }) => {
    return (
      <fieldset className="section" role="group">
        <legend>Patient Info</legend>

        <div className="field">
          <form.AppField name="patient_info.name">
            {(field) => <field.TextField label="Name" />}
          </form.AppField>
        </div>
        <div className="field">
          <form.AppField
            name="patient_info.surname"
            // validators={{
            //   onChange: LabelDataSchema.shape.patient_info.shape.surname,
            // }}
          >
            {(field) => <field.TextField label="Surname" />}
          </form.AppField>
        </div>
      </fieldset>
    );
  },
});
