import { PatientInfoSection } from '../../components/CreateLabelForm/PatientInfoSection';
import { useCreateLabelForm } from '../../hooks/useCreateLabelForm';
import './create-label.css';

export default function CreateLabelPage() {
  const form = useCreateLabelForm();

  return (
    <section className="create-label">
      <h2 aria-hidden="true">Create Label</h2>

      <div aria-label="Create Label Form" className="create-form">
        <PatientInfoSection form={form} />

        {/* Actions */}
        <form.AppForm>
          <div className="actions">
            <button
              aria-disabled="true"
              title="Not available yet"
              type="button"
            >
              Save
            </button>
            <form.PrintButton label="Print" />
          </div>
        </form.AppForm>

        {/* lens-spec-section */}
        <fieldset className="section" role="group">
          <legend>Lens specs</legend>
          {/* TODO: Implement lens specifications fields per User Story #6 */}
        </fieldset>
      </div>
    </section>
  );
}
