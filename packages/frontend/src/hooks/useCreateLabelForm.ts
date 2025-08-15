import { useForm } from '@tanstack/react-form';

import { type LabelData, LabelDataSchema } from '../validation/schema';

const defaultValues: LabelData = {
  description: '',
  due_date: '',
  lens_specs: {
    left: {
      add: '',
      ax: '',
      bc: '',
      cyl: '',
      dia: '',
      pwr: '',
      sag: '',
    },
    right: { add: '', ax: '', bc: '', cyl: '', dia: '', pwr: '', sag: '' },
  },
  patient_info: {
    name: '',
    surname: '',
  },
  production_date: '',
};

export function useCreateLabelForm() {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Validate against Zod schema at submit time (integration for MVP scope)
      await LabelDataSchema.parseAsync(value);

      console.info('on submit: ', value);
    },
    // Debounce applies to field-level validators we attach in components
    validators: {
      onChangeAsyncDebounceMs: 200,
    },
  });

  return form;
}
