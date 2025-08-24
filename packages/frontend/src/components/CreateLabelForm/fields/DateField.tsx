import { useMemo } from 'react';

import {
  useFieldContext,
  useFormContext,
} from '../../../hooks/useCreateLabelForm';
import {
  daysInMonth,
  formatDateToFullDateString,
  fromDate,
  parseDDMMYYYY,
} from '../../../utils/date';
import { formatValidationError } from '../utils';

function getYearRange() {
  const start = new Date().getFullYear();
  const years = 6; // current + next five
  return Array.from({ length: years }, (_, i) => start + i);
}

export const DateField = ({ label }: { label: string }) => {
  const field = useFieldContext<string>();
  const form = useFormContext();

  const isValid = field.state.meta.isValid;
  const isTouched = field.state.meta.isTouched;
  const isSubmitted = form.state.isSubmitted;
  const errors = field.state.meta.errors;

  const showError = !isValid && (isTouched || isSubmitted);

  const todayTriple = useMemo(() => fromDate(new Date()), []);
  const triple = useMemo(() => {
    const parsed = field.state.value ? parseDDMMYYYY(field.state.value) : null;
    return parsed ?? todayTriple;
  }, [field.state.value, todayTriple]);

  const daysList = useMemo(() => {
    const length = daysInMonth(triple.month, triple.year);

    return Array.from({ length }, (_, i) => i + 1);
  }, [triple]);

  const monthsList = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    [],
  );

  const handleChange = (next: { day: number; month: number; year: number }) => {
    field.handleChange(formatDateToFullDateString(next));
  };

  return (
    <div className={`field ${showError ? 'is-error' : ''}`}>
      <label className="field__label">
        {label}
        <div aria-label={label} className="date-dropdown" role="group">
          <select
            aria-label={`${label} day`}
            onChange={(e) => {
              const d = Number(e.target.value);
              handleChange({ day: d, month: triple.month, year: triple.year });
            }}
            value={triple.day}
          >
            {daysList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            aria-label={`${label} month`}
            onChange={(e) => {
              const m = Number(e.target.value);
              const max = daysInMonth(m, triple.year);
              const clampedDay = Math.min(triple.day, max);
              handleChange({ day: clampedDay, month: m, year: triple.year });
            }}
            value={triple.month}
          >
            {monthsList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            aria-label={`${label} year`}
            onChange={(e) => {
              const y = Number(e.target.value);
              const max = daysInMonth(triple.month, y);
              const clampedDay = Math.min(triple.day, max);
              handleChange({ day: clampedDay, month: triple.month, year: y });
            }}
            value={triple.year}
          >
            {getYearRange().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
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
            <span key={i}>{formatValidationError(e)}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
};
