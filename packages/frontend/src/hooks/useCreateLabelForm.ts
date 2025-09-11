import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import { defaultValues } from '../components/CreateLabelForm/defaultValues';
import { CheckboxField } from '../components/CreateLabelForm/fields/CheckboxField';
import { DateField } from '../components/CreateLabelForm/fields/DateField';
import { FloatNumberField } from '../components/CreateLabelForm/fields/FloatNumberField';
import { TextField } from '../components/CreateLabelForm/fields/TextField';
import { PrintButton } from '../components/CreateLabelForm/SubmitButton';
import {
  LabelDataSchema,
  type LabelDataSubmit,
  LabelDataSubmitSchema,
} from '../validation/schema';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    CheckboxField,
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

const FORM_DEBOUNCE_MS = 200;

export type FormType = ReturnType<typeof useCreateLabelForm>;

export function useCreateLabelForm(onSubmit?: (data: LabelDataSubmit) => void) {
  const form = useAppForm({
    defaultValues: defaultValues(),
    onSubmit: ({ value }) => {
      const results = LabelDataSchema.safeParse(value);

      if (!results.success) {
        const errorMessage = results.error.errors
          .map((err) => err.message)
          .join(', ');
        console.error('Form validation failed:', errorMessage);

        return;
      }

      const dataToSend = LabelDataSubmitSchema.safeParse(results.data);

      if (!dataToSend.success) {
        const errorMessage = dataToSend.error.errors
          .map((err) => err.message)
          .join(', ');
        console.error('Error in parsing data to submit:', errorMessage);

        return;
      }

      onSubmit?.(dataToSend.data);
    },
    onSubmitInvalid: ({ formApi, value }) => {
      console.info('on submit (invalid): ', value);

      console.error(formApi.getAllErrors());
    },
    validators: {
      onChange: LabelDataSchema,
      onChangeAsyncDebounceMs: FORM_DEBOUNCE_MS,
    },
  });

  return form;
}
