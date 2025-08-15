import PatientInfoSection from '../../components/CreateLabelForm/AnagraphicSection';
import { useCreateLabelForm } from '../../hooks/useCreateLabelForm';
import './create-label.css';

export default function CreateLabelPage() {
  const form = useCreateLabelForm();

  return (
    <section className="create-label">
      <h2 aria-hidden="true">Create Label</h2>

      <form
        aria-label="Create Label Form"
        className="create-form"
        onSubmit={(e) => {
          console.info('form data: ', form);
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        {/* anagraphic-section */}
        <PatientInfoSection />

        {/* <form.Field name="patient_info">
          {(field) => (
            <AnagraphicSection
              onChange={(next) => field.handleChange(next)}
              value={{
                due_date: field.state.value?.due_date ?? '',
                name: field.state.value?.name ?? '',
                production_date: field.state.value?.production_date ?? '',
                surname: field.state.value?.surname ?? '',
              }}
            />
          )}
        </form.Field> */}

        {/* lens-spec-section */}
        <fieldset className="section" role="group">
          <legend>Lens specs</legend>
          {/* TODO: Implement lens specifications fields per User Story #6 */}
        </fieldset>

        {/* Actions */}
        <div className="actions">
          <button aria-disabled="true" title="Not available yet" type="button">
            Save
          </button>
          <button type="submit">Print</button>
        </div>
      </form>
    </section>
  );
}
