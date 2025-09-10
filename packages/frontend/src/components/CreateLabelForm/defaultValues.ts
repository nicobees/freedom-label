import type { LabelData } from '../../validation/schema';

import { formatDateToFullDateString, fromDate } from '../../utils/date';

export const LensSpecsDataDefaultValue = {
  add: '',
  ax: '',
  bc: '',
  cyl: '',
  dia: '',
  pwr: '',
  sag: '',
};

export const defaultValues = (todayDate = new Date()): LabelData => {
  const formattedTodayDate = formatDateToFullDateString(fromDate(todayDate));

  return {
    batch: '',
    description: '',
    due_date: formattedTodayDate,
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
    production_date: formattedTodayDate,
  };
};

const addOneYearToDate = (date: Date): Date => {
  date.setFullYear(date.getFullYear() + 1);

  return date;
};

export const defaultValuesFilled = {
  batch: '25-0001',
  description: 'Lente sclerale F2mid',
  due_date: formatDateToFullDateString(fromDate(new Date())),
  lens_specs: {
    left: {
      data: {
        add: '+1.24',
        ax: '123',
        bc: '1.24',
        cyl: '+1.24',
        dia: '1.24',
        pwr: '+1.24',
        sag: '10.04',
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
} satisfies LabelData;
