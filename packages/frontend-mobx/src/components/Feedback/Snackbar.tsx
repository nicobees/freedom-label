import type { FeedbackMessage } from '../../contexts/FeedbackContext';

import './snackbar.css';

type SnackbarHostProps = {
  dismiss: (id: number) => void;
  messages: FeedbackMessage[];
};

export const SnackbarHost = ({ dismiss, messages = [] }: SnackbarHostProps) => {
  return (
    <div aria-atomic="true" aria-live="polite" className="snackbar-host">
      {messages.map((m) => (
        <div
          className={`snackbar snackbar--${m.kind}`}
          key={m.id}
          role={m.kind === 'error' ? 'alert' : 'status'}
        >
          <span className="snackbar__text">{m.text}</span>
          {m.persistent ? (
            <button
              aria-label="Close notification"
              className="snackbar__close"
              onClick={() => dismiss(m.id)}
              type="button"
            >
              ×
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
};
