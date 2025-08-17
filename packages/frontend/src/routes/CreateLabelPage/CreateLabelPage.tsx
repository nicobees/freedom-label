import { LensSpecSection } from '../../components/CreateLabelForm/LensSpecSection';
import { ManufacturingSection } from '../../components/CreateLabelForm/ManufacturingSection';
import { PatientInfoSection } from '../../components/CreateLabelForm/PatientInfoSection';
import { useCreateLabelForm } from '../../hooks/useCreateLabelForm';
import { useRouter } from '../../hooks/useRouter';
import './create-label.css';

export default function CreateLabelPage() {
  const form = useCreateLabelForm();

  const { title } = useRouter();

  return (
    <section className="create-label">
      <form aria-label={`${title} Form`} className="create-form">
        <PatientInfoSection form={form} />

        <ManufacturingSection form={form} />

        {/* Actions */}
        <form.AppForm>
          <div className="actions">
            <button
              aria-disabled="true"
              disabled
              title="Not available yet"
              type="button"
            >
              Save
            </button>
            <form.PrintButton label="Print" />
          </div>
        </form.AppForm>

        <LensSpecSection form={form} />
      </form>
    </section>
  );
}
