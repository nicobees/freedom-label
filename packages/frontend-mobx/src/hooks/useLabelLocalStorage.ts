import type { LabelDataSubmit } from '../validation/schema';

import { djb2Hash } from '../utils/hash';
import {
  getItemFromLocalStorage,
  isItemInLocalStorage,
  setItemToLocalStorage,
} from '../utils/localStorage';

type StoredItem = { hash: string; payload: LabelDataSubmit; timestamp: number };

const LABEL_LOCAL_STORAGE_KEY = 'freedom-label:printed-labels:v1';

if (!isItemInLocalStorage(LABEL_LOCAL_STORAGE_KEY)) {
  const LabelDataMap = new Map<string, StoredItem>();

  setItemToLocalStorage(LABEL_LOCAL_STORAGE_KEY, LabelDataMap);
}

const hashLabelData = <T = unknown>(labelData: T): string => {
  const stringified = JSON.stringify(labelData);

  return djb2Hash(stringified);
};

export const useLabelLocalStorage = () => {
  const saveLabel = (labelData: LabelDataSubmit) => {
    const hash = hashLabelData(labelData);

    const mapObject =
      getItemFromLocalStorage<Map<string, StoredItem>>(
        LABEL_LOCAL_STORAGE_KEY,
      ) ?? new Map();

    if (mapObject.has(hash)) {
      return;
    }

    const labelDataToStore: StoredItem = {
      hash,
      payload: labelData,
      timestamp: Date.now(),
    };

    mapObject.set(hash, labelDataToStore);
    setItemToLocalStorage(LABEL_LOCAL_STORAGE_KEY, mapObject);
  };

  const getLabels = () => {
    const storedItemObject = getItemFromLocalStorage<Map<string, StoredItem>>(
      LABEL_LOCAL_STORAGE_KEY,
    );

    return Array.from(storedItemObject?.values() ?? []);
  };

  return {
    getLabels,
    saveLabel,
  };
};
