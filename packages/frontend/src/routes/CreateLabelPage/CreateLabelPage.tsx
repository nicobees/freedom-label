import AnagraphicSection from '../../components/CreateLabelForm/AnagraphicSection.tsx';
import { useCreateLabelForm } from '../../hooks/useCreateLabelForm.ts';
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
        <form.Field name="anagraphic">
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
        </form.Field>

        {/* lens-spec-section */}
        <fieldset
          aria-labelledby="lens-spec-heading"
          className="section"
          role="group"
        >
          <legend id="lens-spec-heading">Lens specs</legend>
          <div className="lens-grid">
            {/* Left lens */}
            <div className="lens-col">
              <div className="field-row">
                <form.Field name="lenses.left.enabled">
                  {() => (
                    <label className="checkbox">
                      <input defaultChecked type="checkbox" />
                      <span>Left lens enabled</span>
                    </label>
                  )}
                </form.Field>
              </div>

              <form.Field name="lenses.left.bc">
                {() => (
                  <div className="field">
                    <label>
                      BC
                      <input
                        defaultValue=""
                        name="lenses.left.bc"
                        placeholder="00.00"
                      />
                    </label>
                  </div>
                )}
              </form.Field>

              <div className="field-row">
                <form.Field name="lenses.left.pwrSign">
                  {() => (
                    <div className="field compact">
                      <label>Power</label>
                      <select
                        aria-label="Left power sign"
                        defaultValue="+"
                        name="lenses.left.pwrSign"
                      >
                        <option value="+">+</option>
                        <option value="-">-</option>
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="lenses.left.pwr">
                  {() => (
                    <div className="field grow">
                      <input
                        aria-label="Left power value"
                        defaultValue=""
                        name="lenses.left.pwr"
                        placeholder="00.00"
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="lenses.left.sag">
                {() => (
                  <div className="field">
                    <label>
                      Sag
                      <input
                        defaultValue=""
                        name="lenses.left.sag"
                        placeholder="00.00"
                      />
                    </label>
                  </div>
                )}
              </form.Field>
            </div>

            {/* Right lens */}
            <div className="lens-col">
              <div className="field-row">
                <form.Field name="lenses.right.enabled">
                  {() => (
                    <label className="checkbox">
                      <input type="checkbox" />
                      <span>Right lens enabled</span>
                    </label>
                  )}
                </form.Field>
              </div>

              <form.Field name="lenses.right.bc">
                {() => (
                  <div className="field">
                    <label>
                      BC
                      <input
                        defaultValue=""
                        name="lenses.right.bc"
                        placeholder="00.00"
                      />
                    </label>
                  </div>
                )}
              </form.Field>

              <div className="field-row">
                <form.Field name="lenses.right.pwrSign">
                  {() => (
                    <div className="field compact">
                      <label>Power</label>
                      <select
                        aria-label="Right power sign"
                        defaultValue="+"
                        name="lenses.right.pwrSign"
                      >
                        <option value="+">+</option>
                        <option value="-">-</option>
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="lenses.right.pwr">
                  {() => (
                    <div className="field grow">
                      <input
                        aria-label="Right power value"
                        defaultValue=""
                        name="lenses.right.pwr"
                        placeholder="00.00"
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="lenses.right.sag">
                {() => (
                  <div className="field">
                    <label>
                      Sag
                      <input
                        defaultValue=""
                        name="lenses.right.sag"
                        placeholder="00.00"
                      />
                    </label>
                  </div>
                )}
              </form.Field>
            </div>
          </div>
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
