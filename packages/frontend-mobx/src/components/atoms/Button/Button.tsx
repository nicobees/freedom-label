import type { JSX } from 'react';

export type ButtonProps = {
  ariaLabel?: string;
  disabled?: boolean;
  icon?: JSX.Element;
  label: string;
  onClick: () => void;
  size?: 'big' | 'small';
  variant?: 'filled' | 'outline' | 'text';
  visible?: boolean;
};

export const Button = ({
  ariaLabel,
  disabled,
  icon,
  label,
  onClick,
  size,
  variant = 'filled',
  visible = true,
}: ButtonProps) => {
  const variantClassName = ` btn--${variant}`;
  const sizeClassName = size ? `btn-${size}` : '';

  if (!visible) return null;

  return (
    <button
      aria-label={ariaLabel || label}
      className={`btn ${variantClassName} ${sizeClassName}`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {icon || label}
    </button>
  );
};
