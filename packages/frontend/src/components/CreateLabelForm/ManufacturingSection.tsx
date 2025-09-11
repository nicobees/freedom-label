import type { TFunction } from 'i18next';

import { formOptions } from '@tanstack/react-form';

import { withForm } from '../../hooks/useCreateLabelForm';
import { defaultValues } from './defaultValues';

const formOptionsObject = formOptions({
  defaultValues: defaultValues(),
});

export const ManufacturingSection = withForm({
  ...formOptionsObject,
  props: {
    t: ((key: string) => key) as TFunction,
  },
  render: ({ form, t }) => {
    const label = t('manufacturingInfo');

    return (
      <div aria-label={label} className="card" role="group">
        <div aria-level={2} className="card__title" role="heading">
          {label}
        </div>
        <div className="card__section field-group manufacturing-fields">
          <form.AppField name="description">
            {(field) => (
              <field.TextField
                className="description-field"
                label={t('description')}
              />
            )}
          </form.AppField>
          <form.AppField name="batch">
            {(field) => (
              <field.TextField className="batch-field" label={t('batch')} />
            )}
          </form.AppField>
        </div>
        <div className="card__section field-group date-fields">
          <form.AppField name="production_date">
            {(field) => <field.DateField label={t('productionDate')} />}
          </form.AppField>
          <form.AppField name="due_date">
            {(field) => <field.DateField label={t('dueDate')} />}
          </form.AppField>
        </div>
      </div>
    );
  },
});
