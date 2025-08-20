import {
  useFieldContext,
  useFormContext,
} from '../../../hooks/useCreateLabelForm';
import { formatValidationError } from '../utils';

export function CheckboxField({ label }: { label: string }) {
  const field = useFieldContext<boolean>();
  const form = useFormContext();

  const isValid = field.state.meta.isValid;
  const isTouched = field.state.meta.isTouched;
  const isSubmitted = form.state.isSubmitted;
  const errors = field.state.meta.errors;

  const showError = !isValid && (isTouched || isSubmitted);

  return (
    <div className="checkbox-field">
      <span>{label}</span>
      <input
        aria-label={`${label} enabled`}
        checked={!!field.state.value}
        onChange={(e) => {
          field.handleChange(e.target.checked);
        }}
        type="checkbox"
      />
      {showError && errors?.length > 0 ? (
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
      ) : null}
    </div>
  );
}
