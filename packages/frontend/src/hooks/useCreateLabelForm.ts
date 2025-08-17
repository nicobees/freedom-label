import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import type { LabelData } from '../validation/schema';

import { DateField } from '../components/CreateLabelForm/fields/DateField';
import { FloatNumberField } from '../components/CreateLabelForm/fields/FloatNumberField';
import { TextField } from '../components/CreateLabelForm/fields/TextField';
import { PrintButton } from '../components/CreateLabelForm/SubmitButton';

export const defaultValues: LabelData = {
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

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    DateField,
    FloatNumberField,
    TextField,
  },
  fieldContext,
  formComponents: {
    PrintButton,
  },
  formContext,
});

export function useCreateLabelForm() {
  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      // Validate against Zod schema at submit time (integration for MVP scope)
      // await LabelDataSchema.parseAsync(value);

      console.info('on submit: ', value);
    },
    // Debounce applies to field-level validators we attach in components
    validators: {
      onChangeAsyncDebounceMs: 200,
    },
  });

  return form;
}
