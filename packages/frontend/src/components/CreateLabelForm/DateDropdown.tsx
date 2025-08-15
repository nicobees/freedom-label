import { useEffect, useMemo, useState } from 'react';

export type DateDropdownProps = {
  endYear: number;
  futureOnly?: boolean;
  label: string;
  onChange: (next: DateTriple) => void;
  startYear: number;
  value?: DateTriple;
};

export type DateTriple = { day: number; month: number; year: number };

export function DateDropdown({
  endYear,
  futureOnly,
  label,
  onChange,
  startYear,
  value,
}: DateDropdownProps) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(value?.year ?? today.getFullYear());
  const [month, setMonth] = useState(value?.month ?? today.getMonth() + 1);
  const [day, setDay] = useState(value?.day ?? today.getDate());

  // Compute allowed months and days based on constraints
  const allowedMonths = useMemo(() => {
    if (!futureOnly) return Array.from({ length: 12 }, (_, i) => i + 1);
    if (year > today.getFullYear())
      return Array.from({ length: 12 }, (_, i) => i + 1);
    const start = today.getMonth() + 1; // current month
    return Array.from({ length: 12 - (start - 1) }, (_, i) => start + i);
  }, [futureOnly, year, today]);

  const allowedDays = useMemo(() => {
    const maxDay = daysInMonth(month, year);
    let start = 1;
    if (
      futureOnly &&
      year === today.getFullYear() &&
      month === today.getMonth() + 1
    ) {
      start = today.getDate();
    }
    return Array.from({ length: maxDay - (start - 1) }, (_, i) => start + i);
  }, [futureOnly, month, year, today]);

  // Clamp day when month/year changes
  useEffect(() => {
    const max = daysInMonth(month, year);
    if (day > max) setDay(max);
  }, [month, year, day]);

  return (
    <div aria-label={label} className="date-dropdown" role="group">
      <select
        aria-label={`${label} day`}
        onChange={(e) => {
          const next = Number(e.target.value);
          setDay(next);
          onChange({ day: next, month, year });
        }}
        value={day}
      >
        {allowedDays.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        aria-label={`${label} month`}
        onChange={(e) => {
          const next = Number(e.target.value);
          setMonth(next);
          // Clamp day for new month before emitting
          const max = daysInMonth(next, year);
          const clampedDay = Math.min(day, max);
          if (clampedDay !== day) setDay(clampedDay);
          onChange({ day: clampedDay, month: next, year });
        }}
        value={month}
      >
        {allowedMonths.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        aria-label={`${label} year`}
        onChange={(e) => {
          const next = Number(e.target.value);
          setYear(next);
          const max = daysInMonth(month, next);
          const clampedDay = Math.min(day, max);
          if (clampedDay !== day) setDay(clampedDay);
          onChange({ day: clampedDay, month, year: next });
        }}
        value={year}
      >
        {Array.from(
          { length: endYear - startYear + 1 },
          (_, i) => startYear + i,
        ).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export default DateDropdown;
