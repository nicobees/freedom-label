import { computed, makeObservable, observable } from 'mobx';

import type { LabelStore } from './labels';

export type LabelListItem = {
  creationDate: string;
  id: string;
  lensSpecs: string;
  name: string;
};

export class LabelListStore {
  labelsStore: LabelStore;

  get labels(): LabelListItem[] {
    return Array.from(this.labelsStore.labels.values()).map((label) => {
      const { id, lens_specs, patient_info, timestamp } = label;
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

      const creationDate = `${fmtDate.format(dateObject)} - ${fmtTime.format(dateObject)}`;

      return {
        creationDate,
        id,
        lensSpecs: lensSpecsFormatted,
        name: formattedName,
      };
    });
  }

  constructor(labelsStore: LabelStore) {
    makeObservable(this, {
      labels: computed,
      labelsStore: observable,
    });

    this.labelsStore = labelsStore;

    // this.disposeUpdateLenses = reaction(
    //   () => Array.from(this.lenses.entries()).map((item) => item),
    //   (lenses) => {
    //     updateLensesToLocalStorage(lenses);
    //   },
    // );
  }
}
