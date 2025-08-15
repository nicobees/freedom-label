import type { ValidationError } from '@tanstack/react-form';

import { useCreateLabelForm } from '../../hooks/useCreateLabelForm.ts';
import { LabelDataSchema } from '../../validation/schema.ts';

export default function PatientInfoSection() {
  const form = useCreateLabelForm();

  const formatValidationError = (error: ValidationError): string => {
    if (typeof error === 'string') return error;

    const maybeMsg = (error as { message?: unknown })?.message;
    if (typeof maybeMsg === 'string') return maybeMsg;
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  };

  return (
    <fieldset className="section" role="group">
      <legend>Anagraphic</legend>

      <div className="field">
        <form.Field
          name="patient_info.name"
          validators={{
            onChange: LabelDataSchema.shape.patient_info.shape.name,
          }}
        >
          {(field) => {
            return (
              <>
                <label>
                  Name
                  <input
                    aria-invalid={Boolean(!field.state.meta.isValid)}
                    // defaultValue={value.name}
                    name={field.name}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                    placeholder="name"
                  />
                </label>
                {!field.state.meta.isValid &&
                  field.state.meta.errors?.length > 0 && (
                    <div
                      aria-label="Name error"
                      aria-live="polite"
                      className="error"
                      role="status"
                    >
                      {field.state.meta.errors.map((e, i) => (
                        <span key={i}>{formatValidationError(e)}</span>
                      ))}
                    </div>
                  )}
              </>
            );
          }}
        </form.Field>
      </div>

      <div className="field">
        <form.Field
          name="patient_info.surname"
          validators={{
            onChange: LabelDataSchema.shape.patient_info.shape.surname,
          }}
        >
          {(field) => (
            <>
              <label>
                Surname
                <input
                  aria-invalid={Boolean(!field.state.meta.isValid)}
                  // defaultValue={value.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="surname"
                />
              </label>
              {!field.state.meta.isValid &&
                field.state.meta.errors?.length > 0 && (
                  <div
                    aria-label="Surname error"
                    aria-live="polite"
                    className="error"
                    role="status"
                  >
                    {field.state.meta.errors.map((e, i) => (
                      <span key={i}>{formatValidationError(e)}</span>
                    ))}
                  </div>
                )}
            </>
          )}
        </form.Field>
      </div>

      {/* <div className="field">
        <form.Field name="anagraphic.production_date">
          {(field) => (
            <>
              <label>Production date</label>
              <DateDropdown
                endYear={endYear}
                futureOnly={false}
                label="Production date"
                onChange={(tr) => emit({ production_date: toDDMMYYYY(tr) })}
                startYear={startYear}
                value={
                  field.state.value
                    ? ((): DDTriple => {
                        const [d, m, y] = field.state.value
                          .split('/')
                          .map((n) => Number(n));
                        return { day: d, month: m, year: y };
                      })()
                    : todayTriple
                }
              />
            </>
          )}
        </form.Field>
      </div>

      <div className="field">
        <label>Due date</label>
        <DateDropdown
          endYear={endYear}
          futureOnly
          label="Due date"
          onChange={(tr) => emit({ due_date: toDDMMYYYY(tr) })}
          startYear={startYear}
          value={
            value.due_date &&
            isFutureOrToday(
              ((): DDTriple => {
                const [d, m, y] = value.due_date
                  .split('/')
                  .map((n) => Number(n));
                return { day: d, month: m, year: y };
              })(),
            )
              ? ((): DDTriple => {
                  const [d, m, y] = value.due_date
                    .split('/')
                    .map((n) => Number(n));
                  return { day: d, month: m, year: y };
                })()
              : todayTriple
          }
        />
      </div> */}
    </fieldset>
  );
}
