import { useEffect } from 'react';

import './loading-overlay.css';

export const LoadingOverlay = ({ loading }: { loading: boolean }) => {
  useEffect(() => {
    if (!loading) return;

    const body = document.body;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const originalOverflow = body.style.overflow;
    const originalPaddingRight = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = originalOverflow;
      body.style.paddingRight = originalPaddingRight;
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div aria-label="Loading" className="loading-overlay" role="status">
      <div className="loading-overlay__backdrop" />
      <div aria-hidden="true" className="loading-overlay__spinner" />
    </div>
  );
};
