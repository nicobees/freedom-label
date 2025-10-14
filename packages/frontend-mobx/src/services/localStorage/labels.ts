import type { LabelStoreDataItem } from '../../stores/labels';

import {
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from '../../utils/localStorage';

export const LABEL_LOCAL_STORAGE_KEY = 'freedom-label:labels:v1';

export const GET = (): LabelStoreDataItem[] => {
  const labels = getItemFromLocalStorage<LabelStoreDataItem[]>(
    LABEL_LOCAL_STORAGE_KEY,
  );

  return labels ?? [];
};

export const PUT = (labels: LabelStoreDataItem[]): void => {
  setItemToLocalStorage(LABEL_LOCAL_STORAGE_KEY, labels);
};
