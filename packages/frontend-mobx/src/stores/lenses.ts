import { action, makeObservable, observable, reaction } from 'mobx';

import type { LabelDataSubmit } from '../validation/schema';

import {
  apiFetch,
  getFullUrl,
  type SuccessResponse,
} from '../services/api/helpers';
import { queryClient } from '../services/api/queryClient';
import {
  GET as getLensesFromLocalStorage,
  PUT as updateLensesToLocalStorage,
} from '../services/localStorage/lenses';
import { isApiError } from '../utils/exceptions';

export type LensesStoreData = Map<string, LensesStoreDataItem>;
export type LensesStoreEntry = [string, LensesStoreDataItem];
type LensesStoreDataItem = LabelDataSubmit & { timestamp: number };

export class LensesStore {
  disposeUpdateLenses: () => void;
  lenses: LensesStoreData;
  loadingPrintApi = false;

  // get themeIcon() {
  //   return themeIconMapping[this.theme];
  // }

  constructor() {
    makeObservable(this, {
      addLens: action,
      lenses: observable,
      loadingPrintApi: observable,
      print: false,
      setLoadingPrintApi: action,
    });

    this.lenses = this.getStoredLenses();

    this.disposeUpdateLenses = reaction(
      () => Array.from(this.lenses.entries()).map((item) => item),
      (lenses) => {
        updateLensesToLocalStorage(lenses);
      },
    );
  }

  addLens(lens: LabelDataSubmit) {
    const augmentedLens = {
      ...lens,
      timestamp: Date.now(),
    } satisfies LensesStoreDataItem;

    this.lenses.set(lens.id, augmentedLens);
  }

  async print({
    lensId,
    onMutationHandler,
  }: {
    lensId: LensesStoreDataItem['id'] | null;
    onMutationHandler: (errorMessage?: string, filename?: string) => void;
  }) {
    if (!lensId || !this.lenses.has(lensId)) {
      onMutationHandler('Lens ID not found');
      return;
    }

    this.setLoadingPrintApi(true);

    const data = this.lenses.get(lensId) || ({} as LensesStoreDataItem);

    try {
      const url = getFullUrl('label/create-print');

      const responseData = await apiFetch<SuccessResponse>(url, {
        body: JSON.stringify(data),
        method: 'POST',
      });

      // Update cache immediately
      queryClient.setQueryData(['label/create-print', lensId], responseData);

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

  private getStoredLenses(): LensesStoreData {
    return new Map(getLensesFromLocalStorage());
  }
}
