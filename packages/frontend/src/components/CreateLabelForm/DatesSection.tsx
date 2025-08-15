import { z } from 'zod';

import { useCreateLabelForm } from '../../hooks/useCreateLabelForm.ts';
import { fromDate } from '../../utils/date.ts';
import DateDropdown from './DateDropdown.tsx';

const nameSchema = z.string().min(2, 'Min 2').max(30, 'Max 30');

export default function DatesSection() {
  const todayTriple = fromDate(new Date());

  const form = useCreateLabelForm();

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

  // const emit = (patch: Partial<AnagraphicSectionProps['value']>) => {
  //   onChange({ ...value, name, surname, ...patch });
  // };

  // const handleName = withDebounce<string>(
  //   (v) => {
  //     setName(v);
  //     emit({ name: v });
  //   },
  //   (v) =>
  //     setNameError(
  //       nameSchema.safeParse(v).success ? '' : 'Name must be 2-30 chars',
  //     ),
  // );

  // const handleSurname = withDebounce<string>(
  //   (v) => {
  //     setSurname(v);
  //     emit({ surname: v });
  //   },
  //   (v) =>
  //     setSurnameError(
  //       nameSchema.safeParse(v).success ? '' : 'Surname must be 2-30 chars',
  //     ),
  // );

  const startYear = todayTriple.year;
  const endYear = todayTriple.year + 5;

  return (
    <fieldset className="section" role="group">
      <legend>Anagraphic</legend>

      <div className="field">
        <form.Field name="anagraphic.production_date">
          {(field) => (
            <>
              <label>Production date</label>
              <DateDropdown
                endYear={endYear}
                futureOnly={false}
                label="Production date"
                onChange={(tr) => console.info('on change production date')}
                startYear={startYear}
                value={
                  field.state.value?.production_date
                  // ? ((): DDTriple => {
                  //     const [d, m, y] = field.state.value
                  //       .split('/')
                  //       .map((n) => Number(n));
                  //     return { day: d, month: m, year: y };
                  //   })()
                  // : todayTriple
                }
              />
            </>
          )}
        </form.Field>
      </div>

      <div className="field">
        <label>Due date</label>
        <DateDropdown
          endYear={endYear}
          futureOnly
          label="Due date"
          onChange={(tr) => console.info('on change due date')}
          startYear={startYear}
          value={
            field.state.value.due_date
            // &&
            // isFutureOrToday(
            //   ((): DDTriple => {
            //     const [d, m, y] = value.due_date
            //       .split('/')
            //       .map((n) => Number(n));
            //     return { day: d, month: m, year: y };
            //   })(),
            // )
            //   ? ((): DDTriple => {
            //       const [d, m, y] = value.due_date
            //         .split('/')
            //         .map((n) => Number(n));
            //       return { day: d, month: m, year: y };
            //     })()
            //   : todayTriple
          }
        />
      </div>
    </fieldset>
  );
}
