import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import './homepage.css';

export default function HomePage() {
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

        <Link
          aria-label={t('labelsList')}
          className="btn btn--outline"
          to="/list"
        >
          {t('labelsList')}
        </Link>
      </div>
    </section>
  );
}
