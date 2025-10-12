import type { LabelStoreEntry } from '../../stores/labels';

import {
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from '../../utils/localStorage';

export const LABEL_LOCAL_STORAGE_KEY = 'freedom-label:lenses:v1';

export const GET = (): LabelStoreEntry[] => {
  const labels = getItemFromLocalStorage<LabelStoreEntry[]>(
    LABEL_LOCAL_STORAGE_KEY,
  );

  return labels ?? [];
};

export const PUT = (labels: LabelStoreEntry[]): void => {
  setItemToLocalStorage(LABEL_LOCAL_STORAGE_KEY, labels);
};
