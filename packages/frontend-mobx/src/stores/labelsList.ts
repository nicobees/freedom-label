import { action, computed, makeObservable, observable } from 'mobx';

import type { LabelStore, LabelStoreDataItem } from './labels';

const INITIAL_PAGE_SIZE = 8;

export type LabelListItem = {
  creationDate: string;
  description: LabelStoreDataItem['description'];
  id: LabelStoreDataItem['id'];
  lensSpecs: string;
  name: string;
  timestamp: LabelStoreDataItem['timestamp'];
};

export type SortOrder = 'asc' | 'desc';

type PaginatedLabelsParams = {
  pageNumber: number;
  pageSize: number;
};
export class LabelListStore {
  filter: string = '';
  labelsStore: LabelStore;
  lazyLoad: null | { pageAmount: number; pageSize: number } = {
    pageAmount: 1,
    pageSize: INITIAL_PAGE_SIZE,
  };
  sort: null | SortOrder = 'desc';

  get filteredList(): LabelListItem[] {
    return this.filter ? this.filterList(this.labels) : this.labels;
  }

  get hasMoreItems(): boolean {
    return this.labelsFiltered.length < this.filteredList.length;
  }

  get labels(): LabelListItem[] {
    return Array.from(this.labelsStore.labels.values()).map((label) => {
      const { description, id, lens_specs, patient_info, timestamp } = label;
      const { name, surname } = patient_info;

      const formattedName = `${surname} ${name}`;

      const leftLens = lens_specs.left ? 'OS' : '';
      const rightLens = lens_specs.right ? 'OD' : '';
      const separator = leftLens && rightLens ? ' - ' : '';

      const lensSpecsFormatted = `${leftLens}${separator}${rightLens}`;

      const fmtDate = new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: 'numeric',
        year: '2-digit',
      });
      const fmtTime = new Intl.DateTimeFormat('it-IT', {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
      });

      const dateObject = new Date(timestamp);

      const creationDate = `${fmtDate.format(dateObject)}-${fmtTime.format(dateObject)}`;

      return {
        creationDate,
        description: description ?? '',
        id,
        lensSpecs: lensSpecsFormatted,
        name: formattedName,
        timestamp,
      };
    });
  }

  get labelsFiltered(): LabelListItem[] {
    const sorted = this.sort
      ? this.sortList(this.filteredList)
      : this.filteredList;

    const lazyLoaded = this.lazyLoad ? this.lazyLoadList(sorted) : sorted;

    return lazyLoaded;
  }

  constructor(labelsStore: LabelStore) {
    makeObservable(this, {
      filter: observable,
      filteredList: computed,
      hasMoreItems: computed,
      labels: computed,
      labelsFiltered: computed,
      labelsStore: observable,
      lazyLoad: observable,
      loadNextPages: action,
      setFilter: action,
      setLazyLoad: action,
      setSort: action,
      sort: observable,
    });

    this.labelsStore = labelsStore;
  }

  public labelsPaginated({
    pageNumber,
    pageSize,
  }: PaginatedLabelsParams): LabelListItem[] {
    return this.labels.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize,
    );
  }

  loadNextPages(additionalPages: number) {
    if (!this.lazyLoad) return;

    this.lazyLoad.pageAmount += additionalPages;
  }

  setFilter(filter: typeof this.filter) {
    this.filter = filter;
  }

  setLazyLoad(lazyLoad: typeof this.lazyLoad) {
    this.lazyLoad = lazyLoad;
  }

  setSort(sort: typeof this.sort) {
    this.sort = sort;
  }

  private filterList(list: LabelListItem[]): LabelListItem[] {
    return list.filter(({ description, name }) => {
      return name.includes(this.filter) || description.includes(this.filter);
    });
  }

  private lazyLoadList(list: LabelListItem[]): LabelListItem[] {
    if (!this.lazyLoad || !this.lazyLoad.pageSize || !this.lazyLoad.pageAmount)
      return list;

    return list.slice(0, this.lazyLoad.pageAmount * this.lazyLoad.pageSize);
  }

  private sortList(list: LabelListItem[]): LabelListItem[] {
    return [...list].sort((a, b) => {
      if (this.sort === 'asc') {
        return a.timestamp - b.timestamp;
      }
      return b.timestamp - a.timestamp;
    });
  }
}
