import type { TFunction } from 'i18next';

import { formOptions } from '@tanstack/react-form';

import { withForm } from '../../../hooks/useCreateLabelForm';
import { LensSide } from '../../../validation/schema';
import { getDefaultValues } from './defaultValues';
import { LensSpecColumn } from './LensSpecColumn';

const formOptionsObject = formOptions({
  defaultValues: getDefaultValues(),
});

export const LensSpecSection = withForm({
  ...formOptionsObject,
  props: {
    t: ((key: string) => key) as TFunction,
  },
  render: ({ form, t }) => {
    return (
      <div aria-label={t('lensSpecs')} className="card" role="group">
        <div aria-level={2} className="card__title" role="heading">
          {t('lensSpecs')}
        </div>
        <div className="card__section lens-specs">
          <LensSpecColumn form={form} side={LensSide.Left} t={t} />
          <LensSpecColumn form={form} side={LensSide.Right} t={t} />
        </div>
      </div>
    );
  },
});
