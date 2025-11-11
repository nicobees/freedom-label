import { useFormContext } from '../../../hooks/useCreateLabelForm';
import { Button } from '../../atoms/Button/Button';

interface PrintButtonProps {
  disabled?: boolean;
  label: string;
  variant?: 'filled' | 'outline' | 'text';
}

export const SaveButton = ({
  disabled = false,
  label,
  variant = 'filled',
}: PrintButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isPristine: state.isPristine,
        isValid: state.isValid,
      })}
    >
      {({ canSubmit, isPristine, isValid }) => {
        return (
          <Button
            disabled={disabled || !canSubmit || !isValid || isPristine}
            label={label}
            onClick={() => {
              if (disabled) return;
              void form.handleSubmit();
            }}
            variant={variant}
          />
        );
      }}
    </form.Subscribe>
  );
};
