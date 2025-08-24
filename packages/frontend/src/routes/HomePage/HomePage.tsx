import { Link } from '@tanstack/react-router';

import './homepage.css';

export default function HomePage() {
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
        <span
          aria-disabled="true"
          className="btn btn--outline is-disabled"
          role="button"
          title="Not available yet"
        >
          Label List (Disabled)
        </span>
      </div>
    </section>
  );
}
