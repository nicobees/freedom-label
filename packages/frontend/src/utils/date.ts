export type DateTriple = { day: number; month: number; year: number };

export function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export function formatDateToFullDateString({
  day,
  month,
  year,
}: DateTriple): string {
  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  return `${dd}/${mm}/${year}`;
}

export function fromDate(d: Date): DateTriple {
  return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
}

export function isFutureOrToday(
  triple: DateTriple,
  today = new Date(),
): boolean {
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const b = tripleToDate(triple);
  return b.getTime() >= a.getTime();
}

export function parseDDMMYYYY(value: string): DateTriple | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  return { day, month, year };
}

export function tripleToDate({ day, month, year }: DateTriple): Date {
  return new Date(year, month - 1, day);
}
