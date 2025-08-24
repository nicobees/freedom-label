/* eslint-disable react-compiler/react-compiler */
import { useMemo } from 'react';

import {
  useFieldContext,
  useFormContext,
} from '../../../hooks/useCreateLabelForm';
import { formatValidationError } from '../utils';

type Props = {
  disabled?: boolean;
  displayValue?: string;
  label: string;
  withSign?: boolean;
};

export function FloatNumberField({
  disabled = false,
  displayValue,
  label,
  withSign = false,
}: Props) {
  const field = useFieldContext<string>();
  const form = useFormContext();

  const isValid = field.state.meta.isValid;
  const isTouched = field.state.meta.isTouched;
  const isSubmitted = form.state.isSubmitted;
  const errors = field.state.meta.errors;

  // Split value into number and sign parts (no local state; field is the source of truth)
  const { number, sign } = useMemo(() => {
    const v = displayValue ?? field.state.value ?? '';
    if (!withSign) return { number: v, sign: '' };
    if (v.startsWith('+') || v.startsWith('-')) {
      return { number: v.slice(1), sign: v[0] };
    }
    return { number: v, sign: '' };
  }, [displayValue, field.state.value, withSign]);

  const emit = (next: { number: string; sign: string }) => {
    const value = withSign ? `${next.sign}${next.number}` : next.number;
    field.handleChange(value);
  };

  const showError = !isValid && (isTouched || isSubmitted);

  const role = withSign ? 'group' : undefined;

  return (
    <div className={`field ${showError ? 'is-error' : ''}`}>
      <label className="field__label">
        {label}
        <div aria-label={label} className="float-field" role={role}>
          {withSign ? (
            <select
              aria-label={`${label} sign`}
              disabled={disabled}
              // eslint-disable-next-line react/jsx-no-leaked-render
              onChange={(e) => {
                const target = e.currentTarget as HTMLSelectElement;
                const s = target.value;
                const input = target.parentElement?.querySelector(
                  'input',
                ) as HTMLInputElement | null;
                const n = input?.value ?? '';
                emit({ number: n, sign: s });
              }}
              value={sign}
            >
              <option value=""> </option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
          ) : null}
          <input
            aria-invalid={!isValid}
            aria-label={label}
            disabled={disabled}
            name={field.name}
            onChange={(e) => {
              const n = (e.target as HTMLInputElement).value;
              const currentSign = sign;
              emit({ number: n, sign: currentSign });
            }}
            placeholder={label}
            value={number}
          />
        </div>
      </label>
      {showError && errors?.length > 0 ? (
        <div
          aria-label={`${label} error`}
          aria-live="polite"
          className="field__assist"
          role="status"
        >
          {errors.map((e, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={i}>{formatValidationError(e)}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
