import { useCallback, useState } from 'react';

import type { LabelData } from '../validation/schema';

type UseCreateLabelFormHistoryProps = {
  initialSnapshot: LabelData;
  resetFormHandler?: (data: LabelData) => void;
};

export const useCreateLabelFormHistory = ({
  initialSnapshot,
  resetFormHandler,
}: UseCreateLabelFormHistoryProps) => {
  const [currentSnapshot, setCurrentSnapshot] =
    useState<LabelData>(initialSnapshot);
  const [pastSnapshots, setPastSnapshots] = useState<LabelData[]>([]);
  const [futureSnapshots, setFutureSnapshots] = useState<LabelData[]>([]);

  const isUndoEmpty = pastSnapshots.length === 0;
  const isRedoEmpty = futureSnapshots.length === 0;

  const onFormChange = useCallback(
    (newSnapshot: LabelData) => {
      if (JSON.stringify(newSnapshot) === JSON.stringify(currentSnapshot))
        return;

      setPastSnapshots((prev) => [...prev, currentSnapshot]);
      setCurrentSnapshot(newSnapshot);
      setFutureSnapshots([]);
    },
    [currentSnapshot, setPastSnapshots, setCurrentSnapshot, setFutureSnapshots],
  );

  const undo = useCallback(() => {
    if (pastSnapshots.length === 0) return;

    const newCurrent = pastSnapshots[pastSnapshots.length - 1];

    if (!newCurrent) return;

    setPastSnapshots((prev) => prev.slice(0, -1));

    setFutureSnapshots((prev) => [...prev, currentSnapshot]);

    setCurrentSnapshot(newCurrent);

    if (resetFormHandler) resetFormHandler(newCurrent);

    return newCurrent;
  }, [
    pastSnapshots,
    currentSnapshot,
    setPastSnapshots,
    setFutureSnapshots,
    resetFormHandler,
  ]);

  const redo = useCallback(() => {
    if (futureSnapshots.length === 0) return;
    const newCurrent = futureSnapshots[futureSnapshots.length - 1];

    if (!newCurrent) return;

    setFutureSnapshots((prev) => prev.slice(0, -1));

    setPastSnapshots((prev) => [...prev, currentSnapshot]);
    setCurrentSnapshot(newCurrent);

    if (resetFormHandler) resetFormHandler(newCurrent);

    return newCurrent;
  }, [
    futureSnapshots,
    currentSnapshot,
    setPastSnapshots,
    setFutureSnapshots,
    resetFormHandler,
  ]);

  return { isRedoEmpty, isUndoEmpty, onFormChange, redo, undo };
};
