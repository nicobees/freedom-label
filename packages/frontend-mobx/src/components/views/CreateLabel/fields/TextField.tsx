import { useMemo } from 'react';

import {
  useFieldContext,
  useFormContext,
} from '../../../../hooks/useCreateLabelForm';
import { formatValidationError } from '../utils';

export function TextField({
  className,
  disabled = false,
  label,
}: {
  className?: string;
  disabled?: boolean;
  label: string;
}) {
  const field = useFieldContext<null | string | undefined>();
  const form = useFormContext();

  const isValid = field.state.meta.isValid;
  const isTouched = field.state.meta.isTouched;
  const isSubmitted = form.state.isSubmitted;
  const errors = field.state.meta.errors;

  const showError = !isValid && (isTouched || isSubmitted);

  const emit = (value: string) => {
    if (value === '') {
      field.handleChange(null);
      return;
    }

    field.handleChange(value);
  };

  const value = useMemo(() => {
    return field.state.value ?? '';
  }, [field.state.value]);

  const inputClassName = className ? ` ${className}` : '';
  const showErrorClassName = showError ? ' is-error' : '';
  const parsedClassName = `field${showErrorClassName}${inputClassName}`;

  return (
    <div className={parsedClassName}>
      <label className="field__label">
        {label}
        <input
          aria-invalid={!isValid}
          className="field__input"
          disabled={disabled}
          name={field.name}
          onChange={(e) => {
            emit(e.target.value);
          }}
          placeholder={label}
          value={value}
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
