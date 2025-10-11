import {
  createContext,
  type FunctionComponent,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export type FeedbackMessage = {
  id: number;
  kind: FeedbackKind;
  persistent: boolean;
  text: string;
};

type FeedbackContextValue = {
  dismiss: (id: number) => void;
  messages: FeedbackMessage[];
  showError: (text: string) => void;
  showSuccess: (text: string, opts?: { durationMs?: number }) => void;
};

type FeedbackKind = 'error' | 'success';

const FeedbackContext = createContext<FeedbackContextValue | undefined>(
  undefined,
);

const SUCCESS_MESSAGE_DURATION_MS = 4000;
const ERROR_MESSAGE_GROUP_DURATION_MS = 8000;

let idCounter = 0;

export const FeedbackProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);

  const timers = useRef<Map<number, number>>(new Map());
  const collapseTimer = useRef<null | number>(null);

  const dismiss = useCallback((id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const showSuccess = useCallback(
    (text: string, opts?: { durationMs?: number }) => {
      const id = ++idCounter;
      const msg: FeedbackMessage = {
        id,
        kind: 'success',
        persistent: false,
        text,
      };
      setMessages((prev) => [...prev, msg]);

      const duration = opts?.durationMs ?? SUCCESS_MESSAGE_DURATION_MS;
      const removeTimeoutHandler = window.setTimeout(() => {
        dismiss(id);
      }, duration);
      timers.current.set(id, removeTimeoutHandler);
    },
    [dismiss],
  );

  const showError = useCallback((text: string) => {
    const id = ++idCounter;
    const msg: FeedbackMessage = {
      id,
      kind: 'error',
      persistent: true,
      text,
    };
    setMessages((prev) => [...prev, msg]);

    window.clearTimeout(collapseTimer.current ?? undefined);
    collapseTimer.current = window.setTimeout(() => {
      setMessages((prev) => {
        const latestError = [...prev]
          .filter((message) => message.kind === 'error')
          .sort((a, b) => b.id - a.id)[0];

        if (!latestError) return prev;

        return prev.filter(
          (message) =>
            message.kind !== 'error' || message.id === latestError.id,
        );
      });
      collapseTimer.current = null;
    }, ERROR_MESSAGE_GROUP_DURATION_MS);
  }, []);

  const value: FeedbackContextValue = {
    dismiss,
    messages,
    showError,
    showSuccess,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
};
