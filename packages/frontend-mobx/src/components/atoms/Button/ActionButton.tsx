import type { JSX } from 'react';

import './button.css';

type ActionButtonProps = {
  icon?: JSX.Element;
  label: string;
  onClickHandler: () => void;
};

export const ActionButton = ({
  icon,
  label,
  onClickHandler,
}: ActionButtonProps) => {
  return (
    <button
      aria-label={label}
      className="btn btn--outline btn--icon"
      onClick={onClickHandler}
      title={label}
      type="button"
    >
      {icon || label}
    </button>
  );
};
