import { action, makeObservable, observable, reaction } from 'mobx';

import type { LabelDataSubmit } from '../validation/schema';

import {
  apiFetch,
  getFullUrl,
  type SuccessResponse,
} from '../services/api/helpers';
import { queryClient } from '../services/api/queryClient';
import {
  GET as getLabelsFromLocalStorage,
  PUT as updateLabelsToLocalStorage,
} from '../services/localStorage/labels';
import { isApiError } from '../utils/exceptions';

export type LabelStoreData = Map<string, LabelStoreDataItem>;
export type LabelStoreEntry = [string, LabelStoreDataItem];
type LabelStoreDataItem = LabelDataSubmit & { timestamp: number };

export class LabelStore {
  disposeUpdateLabels: () => void;
  labels: LabelStoreData;
  loadingPrintApi = false;

  constructor() {
    makeObservable(this, {
      addLabel: action,
      labels: observable,
      loadingPrintApi: observable,
      print: false,
      setLoadingPrintApi: action,
    });

    this.labels = this.getStoredLabels();

    this.disposeUpdateLabels = reaction(
      () => Array.from(this.labels.entries()).map((item) => item),
      (lenses) => {
        updateLabelsToLocalStorage(lenses);
      },
    );
  }

  addLabel(lens: LabelDataSubmit) {
    const augmentedLens = {
      ...lens,
      timestamp: Date.now(),
    } satisfies LabelStoreDataItem;

    this.labels.set(lens.id, augmentedLens);
  }

  async print({
    labelId,
    onMutationHandler,
  }: {
    labelId: LabelStoreDataItem['id'] | null;
    onMutationHandler: (errorMessage?: string, filename?: string) => void;
  }) {
    if (!labelId || !this.labels.has(labelId)) {
      onMutationHandler('Label ID not found');
      return;
    }

    this.setLoadingPrintApi(true);

    const data = this.labels.get(labelId) || ({} as LabelStoreDataItem);

    try {
      const url = getFullUrl('label/create-print');

      const responseData = await apiFetch<SuccessResponse>(url, {
        body: JSON.stringify(data),
        method: 'POST',
      });

      // Update cache immediately
      queryClient.setQueryData(['label/create-print', labelId], responseData);

      // Invalidate user list to reflect changes
      await queryClient.invalidateQueries({ queryKey: ['label/create-print'] });

      onMutationHandler(undefined, responseData.pdf_filename);
      this.setLoadingPrintApi(false);
    } catch (error) {
      console.error(error);

      if (isApiError(error)) {
        onMutationHandler(error.getMessageDetail());
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      onMutationHandler(errorMessage);
      this.setLoadingPrintApi(false);
    }
  }

  setLoadingPrintApi(loading: boolean) {
    this.loadingPrintApi = loading;
  }

  // dispose() {
  //   this.disposeApplyTheme();
  // }

  // toggle() {
  //   this.theme = this.theme === 'light' ? 'dark' : 'light';
  // }

  private getStoredLabels(): LabelStoreData {
    return new Map(getLabelsFromLocalStorage());
  }
}
