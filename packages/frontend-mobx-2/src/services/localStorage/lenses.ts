import type { LensesStoreEntry } from '../../stores/lenses';

import {
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from '../../utils/localStorage';

const LABEL_LOCAL_STORAGE_KEY = 'freedom-label:lenses:v1';

export const GET = (): Array<LensesStoreEntry> => {
  const lenses = getItemFromLocalStorage<Array<LensesStoreEntry>>(
    LABEL_LOCAL_STORAGE_KEY,
  );

  return lenses ?? [];
};

export const PUT = (lenses: Array<LensesStoreEntry>): void => {
  setItemToLocalStorage(LABEL_LOCAL_STORAGE_KEY, lenses);
};
