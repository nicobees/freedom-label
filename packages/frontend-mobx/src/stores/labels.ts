import { action, makeObservable, observable, reaction, toJS } from 'mobx';

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
import {
  type LabelData,
  LabelDataFromSubmitToOriginalSchema,
  type LabelDataSubmit,
} from '../validation/schema';

export type LabelStoreData = Map<string, LabelStoreDataItem>;
export type LabelStoreDataItem = LabelDataSubmit & {
  creationDate: number;
  updateDate: number;
};
export type LabelStoreEntry = [string, LabelStoreDataItem];

export class LabelStore {
  disposeUpdateLabels: () => void;
  labels: LabelStoreDataItem[];
  loadingPrintApi = false;

  constructor() {
    makeObservable(this, {
      addLabel: action,
      getById: false,
      hasById: false,
      labels: observable,
      loadingPrintApi: observable,
      print: false,
      setLoadingPrintApi: action,
    });

    this.labels = this.getStoredLabels();

    this.disposeUpdateLabels = reaction(
      () => this.labels.map((item) => item),
      (lenses) => {
        updateLabelsToLocalStorage(lenses);
      },
    );
  }

  addLabel(lens: LabelDataSubmit) {
    const id = lens.id;

    const labelIndex = this.labels.findIndex((item) => item.id === id);

    const currentTimestamp = Date.now();

    if (labelIndex === -1) {
      // not existing, then add new
      this.labels.push({
        ...lens,
        creationDate: currentTimestamp,
        updateDate: currentTimestamp,
      });
      return;
    }

    // existing, then update
    this.labels[labelIndex] = {
      ...this.labels[labelIndex],
      ...lens,
      updateDate: currentTimestamp,
    };
  }

  getById(id: LabelStoreDataItem['id']) {
    if (!id) return undefined;

    const labelIndex = this.labels.findIndex((item) => item.id === id);

    if (labelIndex === -1) return undefined;

    const storeData = toJS(this.labels[labelIndex]);

    const parsedResult =
      LabelDataFromSubmitToOriginalSchema.safeParse(storeData);

    const parsedData = parsedResult.success ? parsedResult.data : undefined;

    return parsedData as LabelData | undefined;
  }

  hasById(id: LabelStoreDataItem['id']) {
    if (!id) return false;

    return this.labels.some((item) => item.id === id);
  }

  async print({
    labelId,
    onMutationHandler,
  }: {
    labelId: LabelStoreDataItem['id'] | null;
    onMutationHandler: (errorMessage?: string, filename?: string) => void;
  }) {
    const data = labelId ? this.getById(labelId) : undefined;

    if (!data) {
      onMutationHandler('Label ID not found');
      return;
    }

    this.setLoadingPrintApi(true);

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

  private getStoredLabels(): LabelStoreDataItem[] {
    return getLabelsFromLocalStorage();
  }

  // dispose() {
  //   this.disposeApplyTheme();
  // }

  // toggle() {
  //   this.theme = this.theme === 'light' ? 'dark' : 'light';
  // }
}
