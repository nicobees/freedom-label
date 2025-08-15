import { useState } from 'react';
import { z } from 'zod';

import { fromDate, isFutureOrToday, toDDMMYYYY } from '../../utils/date.ts';
import DateDropdown, { type DateTriple as DDTriple } from './DateDropdown.tsx';

const nameSchema = z.string().min(2, 'Min 2').max(30, 'Max 30');

export type AnagraphicSectionProps = {
  onChange: (next: AnagraphicSectionProps['value']) => void;
  value: {
    due_date: string;
    name: string;
    production_date: string;
    surname: string;
  };
};

export default function AnagraphicSection({
  onChange,
  value,
}: AnagraphicSectionProps) {
  const todayTriple = fromDate(new Date());
  const [name, setName] = useState(value.name ?? '');
  const [surname, setSurname] = useState(value.surname ?? '');
  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');

  // Debounce 200ms for text fields
  function withDebounce<T extends string>(
    setter: (v: string) => void,
    validate: (v: string) => void,
  ) {
    let t: number | undefined;
    return (next: T) => {
      window.clearTimeout(t);
      // eslint-disable-next-line no-restricted-globals
      t = window.setTimeout(() => {
        setter(next);
        validate(next);
      }, 200);
    };
  }

  const emit = (patch: Partial<AnagraphicSectionProps['value']>) => {
    onChange({ ...value, name, surname, ...patch });
  };

  const handleName = withDebounce<string>(
    (v) => {
      setName(v);
      emit({ name: v });
    },
    (v) =>
      setNameError(
        nameSchema.safeParse(v).success ? '' : 'Name must be 2-30 chars',
      ),
  );

  const handleSurname = withDebounce<string>(
    (v) => {
      setSurname(v);
      emit({ surname: v });
    },
    (v) =>
      setSurnameError(
        nameSchema.safeParse(v).success ? '' : 'Surname must be 2-30 chars',
      ),
  );

  const startYear = todayTriple.year;
  const endYear = todayTriple.year + 5;

  return (
    <fieldset className="section" role="group">
      <legend>Anagraphic</legend>
      <div className="field">
        <label>
          Name
          <input
            aria-invalid={Boolean(nameError)}
            defaultValue={value.name}
            name="anagraphic.name"
            onChange={(e) => handleName(e.target.value)}
            placeholder="John"
          />
        </label>
        {nameError ? (
          <div
            aria-label="Name error"
            aria-live="polite"
            className="error"
            role="status"
          >
            {nameError}
          </div>
        ) : null}
      </div>

      <div className="field">
        <label>
          Surname
          <input
            aria-invalid={Boolean(surnameError)}
            defaultValue={value.surname}
            name="anagraphic.surname"
            onChange={(e) => handleSurname(e.target.value)}
            placeholder="Doe"
          />
        </label>
        {surnameError ? (
          <div
            aria-label="Surname error"
            aria-live="polite"
            className="error"
            role="status"
          >
            {surnameError}
          </div>
        ) : null}
      </div>

      <div className="field">
        <label>Production date</label>
        <DateDropdown
          endYear={endYear}
          futureOnly={false}
          label="Production date"
          onChange={(tr) => emit({ production_date: toDDMMYYYY(tr) })}
          startYear={startYear}
          value={
            value.production_date
              ? ((): DDTriple => {
                  const [d, m, y] = value.production_date
                    .split('/')
                    .map((n) => Number(n));
                  return { day: d, month: m, year: y };
                })()
              : todayTriple
          }
        />
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
      </div>
    </fieldset>
  );
}
