import { useFormContext } from '../../hooks/useCreateLabelForm';

export const PrintButton = ({ label }: { label: string }) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        isSubmitting: state.isSubmitting,
        isValid: state.isValid,
      })}
    >
      {({ isSubmitting, isValid }) => (
        <button
          disabled={isSubmitting || !isValid}
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
