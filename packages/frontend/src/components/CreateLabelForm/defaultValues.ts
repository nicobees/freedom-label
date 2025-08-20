import type { LabelData } from '../../validation/schema';

export const defaultValues: LabelData = {
  batch: '',
  description: '',
  due_date: '',
  lens_specs: {
    left: {
      data: {
        add: '',
        ax: '',
        bc: '',
        cyl: '',
        dia: '',
        pwr: '',
        sag: '',
      },
      enabled: true,
    },
    right: {
      data: { add: '', ax: '', bc: '', cyl: '', dia: '', pwr: '', sag: '' },
      enabled: true,
    },
  },
  patient_info: {
    name: '',
    surname: '',
  },
  production_date: '',
};

export const defaultValuesFilled: LabelData = {
  batch: '25-0001',
  description: 'Lente sclerale F2mid',
  due_date: '20/04/2026',
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
  production_date: '20/04/2025',
};
