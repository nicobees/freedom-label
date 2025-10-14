import { useCallback, useEffect, useRef } from 'react';

const LOAD_MORE_OFFSET = 10;

type UseInfiniteScrollOptions = {
  enabled?: boolean;
  onCallback: () => void;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export function useInfiniteScroll({
  enabled = true,
  onCallback,
  root = null,
  rootMargin = `${LOAD_MORE_OFFSET}px`,
  threshold = 0,
}: UseInfiniteScrollOptions) {
  const intersectionRef = useRef<HTMLDivElement | null>(null);

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      if (!enabled) return;
      onCallback();
    },
    [enabled, onCallback],
  );

  useEffect(() => {
    const el = intersectionRef.current;
    if (!el) return;
    // eslint-disable-next-line compat/compat
    const observer = new IntersectionObserver(onIntersect, {
      root,
      rootMargin,
      threshold,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, onIntersect]);

  return { intersectionRef };
}
