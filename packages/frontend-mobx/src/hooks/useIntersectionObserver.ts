import { type RefObject, useEffect, useState } from 'react';

export const CUSTOM_THRESHOLD_ARRAY = [0, 0.05, 0.35, 1];

type UseIntersectionObserversOptions = {
  defaultIntersectingValue?: boolean;
  enabled?: boolean;
  root?: Element | null;
  rootMargin?: string;
  targetRef: RefObject<Element | null>;
  threshold?: number | number[];
};

export const useIntersectionObserver = ({
  defaultIntersectingValue = true,
  enabled = true,
  root = null,
  rootMargin = '0px',
  targetRef,
  threshold = 0,
}: UseIntersectionObserversOptions) => {
  const [isIntersecting, setIntersecting] = useState(defaultIntersectingValue);

  useEffect(() => {
    const element = targetRef.current;

    if (!element || !enabled) return;

    // eslint-disable-next-line compat/compat
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled, targetRef, root, rootMargin, threshold]);

  return isIntersecting;
};
