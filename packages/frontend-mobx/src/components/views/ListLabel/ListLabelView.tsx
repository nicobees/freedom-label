import { type RefObject, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { LabelListItem } from '../../../stores/labelsList';

import './list-label.css';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { ListLabelFilters } from './ListLabelFilters';
import { ListLabelItem } from './ListLabelItem';

export type ListLabelViewProps = {
  hasMoreItems?: boolean;
  list: LabelListItem[];
  onEditCallback: (id: LabelListItem['id']) => void;
  onFilterCallback?: (filter: string) => void;
  onLazyLoadCallback?: (additionalPages: number) => void;
  onPrintCallback: (id: LabelListItem['id']) => void;
  onSortCallback?: (sort: 'asc' | 'desc') => void;
};

const NoResults = ({ noResultsMessage }: { noResultsMessage: string }) => {
  return <p className="label-list__empty">{noResultsMessage}</p>;
};

const LoadMoreIntersection = ({
  ref,
}: {
  ref: RefObject<HTMLDivElement | null>;
}) => {
  return <div aria-hidden="true" ref={ref}></div>;
};

export const ListLabelView = ({
  hasMoreItems = false,
  list,
  onEditCallback,
  onFilterCallback,
  onLazyLoadCallback,
  onPrintCallback,
  onSortCallback,
}: ListLabelViewProps) => {
  const { t } = useTranslation();

  const loadMore = useCallback(() => {
    onLazyLoadCallback?.(1);
  }, [onLazyLoadCallback]);

  const hasLabels = list?.length > 0;
  const hasMatches = hasLabels && list?.length > 0;

  const { intersectionRef } = useInfiniteScroll({
    enabled: hasMoreItems,
    onCallback: loadMore,
  });

  const hasResults = hasLabels && hasMatches;
  const noResultsMessage = !hasResults
    ? t('noLabelsAvailable')
    : t('noLabelsMatchSearch');

  return (
    <section aria-live="polite" className="label-list">
      <ListLabelFilters
        onFilterCallback={onFilterCallback}
        onSortCallback={onSortCallback}
      />

      {!hasResults ? (
        <NoResults noResultsMessage={noResultsMessage} />
      ) : (
        <ol className="label-list__items">
          {list.map((label) => (
            <ListLabelItem
              item={label}
              key={label.id}
              onEditCallback={onEditCallback}
              onPrintCallback={onPrintCallback}
            />
          ))}
        </ol>
      )}

      {hasMoreItems ? <LoadMoreIntersection ref={intersectionRef} /> : null}
    </section>
  );
};
