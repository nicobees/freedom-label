import { getRouteApi, Link } from '@tanstack/react-router';

import './homepage.css';

const route = getRouteApi('/');

export default function HomePage() {
  const { debug } = route.useSearch();

  return (
    <section className="home-screen">
      <div aria-label="Main actions" className="home-actions" role="group">
        <Link
          aria-label="Create Label"
          className="btn btn--filled"
          to="/create"
        >
          Create Label
        </Link>
        {debug ? (
          <Link
            aria-disabled="true"
            className="btn btn--outline is-disabled"
            disabled
            role="button"
            title="Not available yet"
            to="/list"
          >
            Label List (Disabled)
          </Link>
        ) : null}
      </div>
    </section>
  );
}
