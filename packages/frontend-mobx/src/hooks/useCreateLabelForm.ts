import {
  type AnyFieldMeta,
  createFormHook,
  createFormHookContexts,
} from '@tanstack/react-form';

import { getDefaultValues } from '../components/views/CreateLabel/defaultValues';
import { CheckboxField } from '../components/views/CreateLabel/fields/CheckboxField';
import { DateField } from '../components/views/CreateLabel/fields/DateField';
import { FloatNumberField } from '../components/views/CreateLabel/fields/FloatNumberField';
import { TextField } from '../components/views/CreateLabel/fields/TextField';
import { PrintButton } from '../components/views/CreateLabel/PrintButton';
import { SaveButton } from '../components/views/CreateLabel/SaveButton';
import {
  type LabelData,
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
    SaveButton,
  },
  formContext,
});

const FORM_DEBOUNCE_MS = 200;

export type FormType = ReturnType<typeof useCreateLabelForm>['form'];

export type UseCreateLabelFormProps = {
  defaultValues?: LabelData;
  onSave?: (data: LabelDataSubmit) => void;
};

export function useCreateLabelForm({
  defaultValues = getDefaultValues(),
  onSave,
}: UseCreateLabelFormProps) {
  const form = useAppForm({
    defaultValues,
    onSubmit: ({ formApi, value }) => {
      // validate form data
      const results = LabelDataSchema.safeParse(value);

      if (!results.success) {
        const errorMessage = results.error.errors
          .map((err) => err.message)
          .join(', ');
        console.error('Form validation failed:', errorMessage);

        return;
      }

      // validate data before save: this will also generate id if not present
      const dataToSend = LabelDataSubmitSchema.safeParse(results.data);

      if (!dataToSend.success) {
        console.error('Error in parsing data to submit:', dataToSend.error);

        return;
      }

      // fill back form with parsed data, so that will include also the id (if it was missing before): this
      // will allow to update the same form data consistently
      const fillFormData = { ...results.data, id: dataToSend.data.id };
      formApi.reset(fillFormData, {
        keepDefaultValues: true,
      });
      // const meta = formApi.getFieldMeta('patient_info.name') as AnyFieldMeta;
      // form.setFieldMeta('patient_info.name', {
      //   ...meta,
      //   isDirty: false,
      // });
      // void form.validate('change');

      // save data
      onSave?.(dataToSend.data);
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

  const resetFormWithSpecificData = (
    data: LabelData,
    formApi: typeof form = form,
  ) => {
    formApi.reset(data, {
      keepDefaultValues: true,
    });
    const meta = formApi.getFieldMeta('patient_info.name') as AnyFieldMeta;
    form.setFieldMeta('patient_info.name', {
      ...meta,
      isDirty: true,
    });
    void form.validate('change');
  };

  return { form, resetFormWithSpecificData };
}
