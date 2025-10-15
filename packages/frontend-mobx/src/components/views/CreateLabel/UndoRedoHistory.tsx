import type { RefObject } from 'react';

import { useTranslation } from 'react-i18next';

import RedoIcon from '../../../assets/icons/redo.svg?react';
import UndoIcon from '../../../assets/icons/undo.svg?react';

type UndoRedoHistoryProps = {
  onRedoCallback: () => void;
  onUndoCallback: () => void;
  redoDisabled: boolean;
  ref?: RefObject<HTMLDivElement | null>;
  undoDisabled: boolean;
  visible: boolean;
  wrapperClassName?: string;
};

export const UndoRedoHistory = ({
  onRedoCallback,
  onUndoCallback,
  redoDisabled,
  ref,
  undoDisabled,
  visible,
  wrapperClassName = '',
}: UndoRedoHistoryProps) => {
  const { t } = useTranslation();

  return (
    <div
      aria-hidden={visible ? 'false' : 'true'}
      className={wrapperClassName}
      ref={ref}
    >
      <div className="history-actions">
        <button
          aria-label={t('undo')}
          className="btn btn--outline history-actions__btn"
          disabled={undoDisabled}
          onClick={onUndoCallback}
          title={t('undo')}
          type="button"
        >
          <UndoIcon aria-hidden="true" />
        </button>
        <button
          aria-label={t('redo')}
          className="btn btn--outline history-actions__btn"
          disabled={redoDisabled}
          onClick={onRedoCallback}
          title={t('redo')}
          type="button"
        >
          <RedoIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
