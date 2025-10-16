import { useMemo } from 'react';

import './float-number-field.css';
import { isMobile } from 'react-device-detect';

import {
  useFieldContext,
  useFormContext,
} from '../../../../hooks/useCreateLabelForm';
import { formatValidationError } from '../utils';

type Props = {
  disabled?: boolean;
  displayValue?: string;
  label: string;
  overwriteToNull?: boolean;
  showLabel?: boolean;
  withSign?: boolean;
};

export function FloatNumberField({
  disabled = false,
  displayValue,
  label,
  overwriteToNull = false,
  showLabel = true,
  withSign = false,
}: Props) {
  const field = useFieldContext<null | string | undefined>();
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
    if (overwriteToNull && next.number === '') {
      field.handleChange(null);
      return;
    }
    const value = withSign ? `${next.sign}${next.number}` : next.number;
    field.handleChange(value);
  };

  const showError = !isValid && (isTouched || isSubmitted);

  const role = withSign ? 'group' : undefined;

  return (
    <div className={`field ${showError ? 'is-error' : ''} field-group`}>
      <label className="field__label">
        {showLabel ? label : null}
        <div aria-label={label} className="float-field" role={role}>
          {/** IMPORTANT: input is placed BEFORE the sign toggle button in the DOM so that clicking the surrounding label activates/focuses the input, not the button (which previously caused unintended sign toggles). The button is visually moved before the input via CSS (order:-1). */}
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
            {...(isMobile
              ? { inputMode: 'decimal', step: '0.01', type: 'number' }
              : { type: 'text' })}
          />
          {withSign ? (
            <button
              aria-label={`${label} sign`}
              className="key__button"
              disabled={disabled}
              onClick={() => {
                const currentSign = sign || '-'; // treat empty as '-'
                const newSign = currentSign === '+' ? '-' : '+';
                emit({ number, sign: newSign });
              }}
              type="button"
            >
              {sign || '-'}
            </button>
          ) : null}
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
