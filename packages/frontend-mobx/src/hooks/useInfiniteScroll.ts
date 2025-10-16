import { useEffect, useRef } from 'react';

import { useIntersectionObserver } from './useIntersectionObserver';

const LOAD_MORE_OFFSET = 10;

type UseInfiniteScrollOptions = {
  enabled?: boolean;
  onCallback: () => void;
};

export const useInfiniteScroll = ({
  enabled = true,
  onCallback,
}: UseInfiniteScrollOptions) => {
  const intersectionRef = useRef<HTMLDivElement | null>(null);

  const isIntersecting = useIntersectionObserver({
    defaultIntersectingValue: false,
    enabled,
    rootMargin: `${LOAD_MORE_OFFSET}px`,
    targetRef: intersectionRef,
  });

  useEffect(() => {
    if (enabled && isIntersecting) {
      onCallback();
    }
  }, [enabled, isIntersecting, onCallback]);

  return { intersectionRef };
};
