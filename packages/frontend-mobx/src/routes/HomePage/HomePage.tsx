import { getRouteApi, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import './homepage.css';

const route = getRouteApi('/');

export default function HomePage() {
  const { debug } = route.useSearch();
  const { t } = useTranslation();

  return (
    <section className="home-screen">
      <div aria-label={t('mainActions')} className="home-actions" role="group">
        <Link
          aria-label={t('createLabel')}
          className="btn btn--filled"
          to="/create"
        >
          {t('createLabel')}
        </Link>
        {debug ? (
          <Link
            aria-disabled="true"
            className="btn btn--outline is-disabled"
            disabled
            role="button"
            title={t('notAvailableYet')}
            to="/list"
          >
            {t('labelsList')} (Disabled)
          </Link>
        ) : null}
      </div>
    </section>
  );
}
