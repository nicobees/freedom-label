type ButtonProps = {
  ariaLabel?: string;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  size?: 'big' | 'small';
  variant?: 'filled' | 'outline' | 'text';
};

export const Button = ({
  ariaLabel,
  disabled,
  label,
  onClick,
  size,
  variant,
}: ButtonProps) => {
  const variantClassName = variant ? ` btn--${variant}` : '';
  const sizeClassName = size ? `btn-${size}` : '';

  return (
    <button
      aria-label={ariaLabel || label}
      className={`btn ${variantClassName} ${sizeClassName}`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {label}
    </button>
  );
};
