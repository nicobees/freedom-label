import { useTranslation } from 'react-i18next';

import type { SortOrder } from '../../../stores/labelsList';
import type { ListLabelViewProps } from './ListLabelView';

import './list-label-item.css';

type ListLabelItemProps = {
  onFilterCallback?: ListLabelViewProps['onFilterCallback'];
  onSortCallback?: ListLabelViewProps['onSortCallback'];
};

export const ListLabelFilters = ({
  onFilterCallback,
  onSortCallback,
}: ListLabelItemProps) => {
  const { t } = useTranslation();

  return (
    <form
      className="label-list__filters"
      onSubmit={(event) => {
        event.preventDefault();
      }}
      role="search"
    >
      <div className="field label-list__field">
        <label className="field__label">
          {t('labelsSearch')}
          <input
            className="field__input"
            onChange={(event) => {
              onFilterCallback?.(
                (event.target.value || '').trim().toLowerCase(),
              );
            }}
            placeholder={t('labelsSearchPlaceholder')}
            type="search"
          />
        </label>
      </div>
      <div className="field label-list__field">
        <label className="field__label">
          {t('sortByCreationDate')}
          <select
            className="field__input field__input--select"
            onChange={(event) => {
              const value = event.target.value as SortOrder;
              onSortCallback?.(value);
            }}
          >
            <option value="desc">{t('newestFirst')}</option>
            <option value="asc">{t('oldestFirst')}</option>
          </select>
        </label>
      </div>
    </form>
  );
};
