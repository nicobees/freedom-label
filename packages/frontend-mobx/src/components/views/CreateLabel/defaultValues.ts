import type { LabelData, LensSpecsData } from '../../../validation/schema';

import { formatDateToFullDateString, fromDate } from '../../../utils/date';

export const LensSpecsDataDefaultValue = {
  add: '+0.00',
  ax: '0',
  batch: '',
  bc: '',
  cyl: '-0.00',
  dia: '',
  pwr: '-0.00',
  sag: '0',
} satisfies LensSpecsData;

const addOneYearToDate = (date: Date): Date => {
  date.setFullYear(date.getFullYear() + 1);

  return date;
};

export const getDefaultValues = (todayDate = new Date()): LabelData => {
  const formattedProductionDate = formatDateToFullDateString(
    fromDate(todayDate),
  );
  const formattedDueDate = formatDateToFullDateString(
    fromDate(addOneYearToDate(todayDate)),
  );

  return {
    description: '',
    due_date: formattedDueDate,
    id: null,
    lens_specs: {
      left: {
        data: LensSpecsDataDefaultValue,
        enabled: true,
      },
      right: {
        data: LensSpecsDataDefaultValue,
        enabled: true,
      },
    },
    patient_info: {
      name: '',
      surname: '',
    },
    production_date: formattedProductionDate,
  };
};

export const defaultValuesFilled = () =>
  ({
    description: 'Lente sclerale F2mid',
    due_date: formatDateToFullDateString(fromDate(new Date())),
    id: null,
    lens_specs: {
      left: {
        data: {
          add: '+0.00',
          ax: '90',
          batch: '',
          bc: '1.24',
          cyl: '-1.24',
          dia: '1.24',
          pwr: '-1.24',
          sag: '1248',
        },
        enabled: true,
      },
      right: {
        data: null,
        enabled: false,
      },
    },
    patient_info: {
      name: 'gabriele',
      surname: 'cara',
    },
    production_date: formatDateToFullDateString(
      fromDate(addOneYearToDate(new Date())),
    ),
  }) satisfies LabelData;
