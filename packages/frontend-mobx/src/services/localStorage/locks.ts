import type { LockStoreData } from '../../stores/editLabel';

import {
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from '../../utils/localStorage';

export const EDIT_LOCKS_LOCAL_STORAGE_KEY = 'freedom-label:edit-locks:v1';

export const GET = (): LockStoreData[] => {
  const locks = getItemFromLocalStorage<LockStoreData[]>(
    EDIT_LOCKS_LOCAL_STORAGE_KEY,
  );

  return locks ?? [];
};

export const PUT = (locks: LockStoreData[]): void => {
  setItemToLocalStorage(EDIT_LOCKS_LOCAL_STORAGE_KEY, locks);
};
