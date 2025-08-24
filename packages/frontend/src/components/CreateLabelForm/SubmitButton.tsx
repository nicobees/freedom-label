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
      })}
    >
      {({ canSubmit }) => (
        <button
          className={`btn btn--${variant}`}
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
