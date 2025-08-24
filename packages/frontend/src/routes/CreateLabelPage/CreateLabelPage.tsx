import type { LabelDataSubmit } from '../../validation/schema';

import { defaultValuesFilled } from '../../components/CreateLabelForm/defaultValues';
import { LensSpecSection } from '../../components/CreateLabelForm/LensSpecSection';
import { ManufacturingSection } from '../../components/CreateLabelForm/ManufacturingSection';
import { PatientInfoSection } from '../../components/CreateLabelForm/PatientInfoSection';
import { useCreateLabelForm } from '../../hooks/useCreateLabelForm';
import { useLabelLocalStorage } from '../../hooks/useLabelLocalStorage';
import './create-label.css';
import { useRouter } from '../../hooks/useRouter';
import { useCreatePrintMutation } from '../../services/api';

export default function CreateLabelPage() {
  const { title } = useRouter();
  const { saveLabel } = useLabelLocalStorage();

  const onCreatePrintLabelResponse = (
    error?: string,
    data?: LabelDataSubmit,
  ) => {
    if (error) {
      console.error('Mutation failed:', error);
    } else {
      console.log('Mutation successful:', data);
    }
  };

  const { mutate: createPrintLabel } = useCreatePrintMutation({
    onMutationHandler: onCreatePrintLabelResponse,
  });

  const onSubmitHandler = (data: LabelDataSubmit) => {
    createPrintLabel(data);

    saveLabel(data);
  };

  const form = useCreateLabelForm(onSubmitHandler);

  return (
    <section className="create-label">
      <form aria-label={`${title} Form`} className="create-form" role="form">
        <form.AppForm>
          <PatientInfoSection form={form} />
          <ManufacturingSection form={form} />
          <LensSpecSection form={form} />
          <div className="actions">
            <button
              aria-disabled="true"
              className="btn btn--outline"
              disabled
              title="Not available yet"
              type="button"
            >
              Save
            </button>
            <form.PrintButton label="Print" />
            <button
              className="btn btn--text"
              onClick={() => form.reset(defaultValuesFilled)}
              type="button"
            >
              Fill form (temp)
            </button>
          </div>
        </form.AppForm>
      </form>
    </section>
  );
}
