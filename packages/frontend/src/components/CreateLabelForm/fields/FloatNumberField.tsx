/* eslint-disable react-compiler/react-compiler */
import { useMemo } from 'react';

import { useFieldContext } from '../../../hooks/useCreateLabelForm';
import { formatValidationError } from '../utils';

type Props = {
  disabled?: boolean;
  label: string;
  withSign?: boolean;
};

export function FloatNumberField({
  disabled = false,
  label,
  withSign = false,
}: Props) {
  const field = useFieldContext<string>();

  const isValid = field.state.meta.isValid;
  const errors = field.state.meta.errors;

  // Split value into number and sign parts (no local state; field is the source of truth)
  const { number, sign } = useMemo(() => {
    const v = field.state.value ?? '';
    if (!withSign) return { number: v, sign: '' };
    if (v.startsWith('+') || v.startsWith('-')) {
      return { number: v.slice(1), sign: v[0] };
    }
    return { number: v, sign: '' };
  }, [field.state.value, withSign]);

  const emit = (next: { number: string; sign: string }) => {
    const value = withSign ? `${next.sign}${next.number}` : next.number;
    field.handleChange(value);
  };

  return (
    <>
      <label>
        {label}
        <div aria-label={label} className="float-field" role="group">
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
      {!isValid && errors?.length > 0 && (
        <div
          aria-label={`${label} error`}
          aria-live="polite"
          className="error"
          role="status"
        >
          {errors.map((e, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={i}>{formatValidationError(e)}</span>
          ))}
        </div>
      )}
    </>
  );
}
