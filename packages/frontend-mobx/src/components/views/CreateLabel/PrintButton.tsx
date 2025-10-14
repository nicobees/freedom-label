import type { OnPrintCallbackType } from './CreateLabelView';

import { useFormContext } from '../../../hooks/useCreateLabelForm';
import { useRootStore } from '../../../stores';

interface PrintButtonProps {
  label: string;
  onPrintHandler: OnPrintCallbackType;
  variant?: 'filled' | 'outline' | 'text';
}

export const PrintButton = ({
  label,
  onPrintHandler,
  variant = 'filled',
}: PrintButtonProps) => {
  const form = useFormContext();
  const { labelsStore } = useRootStore();

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        data: state.values,
        isPristine: state.isPristine,
        isValid: state.isValid,
      })}
    >
      {({ data }) => {
        return (
          <button
            className={`btn btn--${variant}`}
            disabled={
              !data.id ||
              !labelsStore.hasById(data.id) ||
              labelsStore.loadingPrintApi
            }
            onClick={() => {
              void labelsStore.print({
                labelId: data.id,
                onMutationHandler: onPrintHandler,
              });
            }}
            type="button"
          >
            {label}
          </button>
        );
      }}
    </form.Subscribe>
  );
};
