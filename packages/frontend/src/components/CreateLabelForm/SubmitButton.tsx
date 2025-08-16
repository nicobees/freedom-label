import { useFormContext } from '../../hooks/useCreateLabelForm';

export const PrintButton = ({ label }: { label: string }) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        isPristine: state.isPristine,
        isSubmitting: state.isSubmitting,
        isTouched: state.isTouched,
      })}
    >
      {({ isPristine, isSubmitting, isTouched }) => (
        <button
          disabled={isSubmitting || isPristine || !isTouched}
          onClick={() => {
            void form.handleSubmit();
          }}
          type="button"
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  );
};
