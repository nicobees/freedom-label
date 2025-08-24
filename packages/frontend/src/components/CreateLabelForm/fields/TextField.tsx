import {
  useFieldContext,
  useFormContext,
} from '../../../hooks/useCreateLabelForm';
import { formatValidationError } from '../utils';

export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const form = useFormContext();

  const isValid = field.state.meta.isValid;
  const isTouched = field.state.meta.isTouched;
  const isSubmitted = form.state.isSubmitted;
  const errors = field.state.meta.errors;

  const showError = !isValid && (isTouched || isSubmitted);

  return (
    <div className={`field ${showError ? 'is-error' : ''}`}>
      <label className="field__label">
        {label}
        <input
          aria-invalid={!isValid}
          className="field__input"
          onChange={(e) => {
            field.handleChange(e.target.value);
          }}
          placeholder={label}
          value={field.state.value}
        />
      </label>
      {showError && errors?.length > 0 ? (
        <div
          aria-label={`${label} error`}
          aria-live="polite"
          className="field__assist"
          role="status"
        >
          {errors.map((e, i) => (
            <span key={i}>{formatValidationError(e)}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
