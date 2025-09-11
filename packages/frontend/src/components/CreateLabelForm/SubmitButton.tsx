import { useFormContext } from '../../hooks/useCreateLabelForm';

interface PrintButtonProps {
  label: string;
  variant?: 'filled' | 'outline' | 'text';
}

export const PrintButton = ({
  label,
  variant = 'filled',
}: PrintButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isPristine: state.isPristine,
        isTouched: state.isTouched,
        isValid: state.isValid,
      })}
    >
      {({ canSubmit, isPristine, isTouched, isValid }) => {
        console.info({ canSubmit, isPristine, isTouched, isValid });

        return (
          <button
            className={`btn btn--${variant}`}
            disabled={!canSubmit || !isValid || isPristine}
            onClick={() => {
              void form.handleSubmit();
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
