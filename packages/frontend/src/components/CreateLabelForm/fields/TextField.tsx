import { useFieldContext } from '../../../hooks/useCreateLabelForm';
import { formatValidationError } from '../utils';

export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  const isValid = field.state.meta.isValid;
  const errors = field.state.meta.errors;

  return (
    <>
      <label>
        {label}
        <input
          aria-invalid={!isValid}
          name={field.name}
          onChange={(e) => {
            field.handleChange(e.target.value);
          }}
          placeholder={label}
        />
      </label>
      {!isValid && errors?.length > 0 && (
        <div
          aria-label={`${label} error`}
          aria-live="polite"
          className="error"
          role="status"
        >
          {errors.map((e, i) => (
            <span key={i}>{formatValidationError(e)}</span>
          ))}
        </div>
      )}
    </>
  );
}
