import { useFormContext } from '../../hooks/useCreateLabelForm';

export const PrintButton = ({ label }: { label: string }) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
      })}
    >
      {({ canSubmit }) => (
        <button
          disabled={!canSubmit}
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
