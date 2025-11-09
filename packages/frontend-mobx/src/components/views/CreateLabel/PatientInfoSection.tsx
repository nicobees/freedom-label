import { formOptions } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
/* eslint-disable @typescript-eslint/no-explicit-any */

import './patientInfoSection.css';
import { type FormType, withForm } from '../../../hooks/useCreateLabelForm';
import { getDefaultValues } from './defaultValues';

const formOptionsObject = formOptions({
  defaultValues: getDefaultValues(),
});

// Using generic form type from hook; runtime shape is sufficient for field rendering.
function PatientInfoSectionRender({ form }: { form: FormType }) {
  const { t } = useTranslation();
  const label = t('patientInfo');

  return (
    <div
      aria-label={label}
      className="patient-info-container card"
      role="group"
    >
      <div
        aria-level={2}
        className="patient-info-title card__title"
        role="heading"
      >
        {label}
      </div>
      <div className="card__section field-group patient-info-fields">
        <form.AppField name="patient_info.name">
          {(field: any) => <field.TextField label={t('name')} />}
        </form.AppField>
        <form.AppField name="patient_info.surname">
          {(field: any) => <field.TextField label={t('surname')} />}
        </form.AppField>
      </div>
    </div>
  );
}

export const PatientInfoSection = withForm({
  ...formOptionsObject,
  render: PatientInfoSectionRender,
});
